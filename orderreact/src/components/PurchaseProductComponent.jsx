/*
import React, { useEffect, useState } from "react";

const API_BASE = "https://localhost:7094/api"; // Change port if needed

export default function PurchaseProductComponent() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/stock/product`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId));

  const handlePurchase = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setResult(null);

    // Build AddPurchaseCommand payload (no userId)
    const payload = {
      name: selectedProduct.name,
      sku: selectedProduct.sku,
      description: selectedProduct.description,
      price: selectedProduct.price,
      isActive: selectedProduct.isActive
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/purchase/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setResult("Purchase created!");
      } else {
        setResult("Error: " + (await res.text()));
      }
    } catch (err) {
      setResult("Network error");
    }
    setLoading(false);
  };

  // Helper to get the full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    // Assume relative path from backend
    return `${API_BASE.replace("/api", "")}${imageUrl}`;
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc" }}>
      <h3>Purchase a Product</h3>
      <select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="">Select a product...</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (SKU: {p.sku})
          </option>
        ))}
      </select>
      <button
        onClick={handlePurchase}
        disabled={!selectedProductId || loading}
        style={{ width: "100%", padding: 8 }}
      >
        {loading ? "Purchasing..." : "Purchase"}
      </button>
      {result && <div style={{ marginTop: 10 }}>{result}</div>}
      {selectedProduct && (
        <div style={{ marginTop: 20, fontSize: 14 }}>
          {selectedProduct.imageUrl && (
            <img
              src={getImageUrl(selectedProduct.imageUrl)}
              alt={selectedProduct.name}
              style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 10, display: "block" }}
            />
          )}
          <strong>Description:</strong> {selectedProduct.description}<br />
          <strong>Price:</strong> ${selectedProduct.price}
        </div>
      )}
    </div>
  );
}

*/


import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Stack
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const API_BASE = "https://localhost:7094/api"; // Change port if needed

export default function PurchaseProductComponent() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/stock/product`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFetching(false);
      })
      .catch(() => {
        setProducts([]);
        setFetching(false);
      });
  }, []);

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId));

  const handlePurchase = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setResult(null);

    const payload = {
      name: selectedProduct.name,
      sku: selectedProduct.sku,
      description: selectedProduct.description,
      price: selectedProduct.price,
      isActive: selectedProduct.isActive
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/purchase/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setResult({ type: "success", message: "Purchase created!" });
      } else {
        setResult({ type: "error", message: await res.text() });
      }
    } catch (err) {
      setResult({ type: "error", message: "Network error" });
    }
    setLoading(false);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE.replace("/api", "")}${imageUrl}`;
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Purchase a Product
      </Typography>
      {fetching ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 6 }} color="success" />
      ) : products.length === 0 ? (
        <Alert severity="info" sx={{ my: 4 }}>No products available.</Alert>
      ) : (
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="product-select-label">Select Product</InputLabel>
            <Select
              labelId="product-select-label"
              value={selectedProductId}
              label="Select Product"
              onChange={(e) => setSelectedProductId(e.target.value)}
              sx={{ mb: 1 }}
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedProduct && (
            <Card elevation={4} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
              {selectedProduct.imageUrl && (
                <CardMedia
                  component="img"
                  image={getImageUrl(selectedProduct.imageUrl)}
                  alt={selectedProduct.name}
                  sx={{
                    width: { xs: "100%", sm: 180 },
                    height: 180,
                    objectFit: "contain",
                    bgcolor: "#f5f5f5"
                  }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  SKU: {selectedProduct.sku}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {selectedProduct.description}
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  ${selectedProduct.price}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handlePurchase}
                  disabled={loading}
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                >
                  {loading ? "Purchasing..." : "Purchase"}
                </Button>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
      <Snackbar
        open={!!result}
        autoHideDuration={3000}
        onClose={() => setResult(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {result && (
          <Alert severity={result.type} sx={{ width: "100%" }}>
            {result.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}