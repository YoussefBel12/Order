

/*
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
    //added support for quantity dont forget change in elsa
    const [quantity, setQuantity] = useState(1);


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
        //added quantity to the payload
      , quantity 
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


*/ //old code pre quantity support



















/* code with quantity support 

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
    const [quantity, setQuantity] = useState(1);

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
            isActive: selectedProduct.isActive,
            quantity
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
        // eslint-disable-next-line no-unused-vars
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
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel shrink htmlFor="quantity-input">Quantity</InputLabel>
                                    <input
                                        id="quantity-input"
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            fontSize: "16px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </FormControl>
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


*/




//youtube clone thing to choose products 



import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Stack
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

const API_BASE = "https://localhost:7094/api"; // Change port if needed

export default function PurchaseProductComponent() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [quantity, setQuantity] = useState(1);

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

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    const handleClosePurchase = () => {
        setSelectedProduct(null);
        setQuantity(1);
    };

    const handlePurchase = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        setResult(null);

        const payload = {
            name: selectedProduct.name,
            sku: selectedProduct.sku,
            description: selectedProduct.description,
            price: selectedProduct.price,
            isActive: selectedProduct.isActive,
            quantity
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
        // eslint-disable-next-line no-unused-vars
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
        <Box sx={{ maxWidth: 1200, mx: "auto", mt: 5 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Purchase a Product
            </Typography>
            {fetching ? (
                <CircularProgress sx={{ display: "block", mx: "auto", my: 6 }} color="success" />
            ) : products.length === 0 ? (
                <Alert severity="info" sx={{ my: 4 }}>No products available.</Alert>
            ) : selectedProduct ? (
                <Box sx={{ maxWidth: 500, mx: "auto" }}>
                    <Card elevation={4} sx={{ position: "relative", display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
                        <IconButton
                            onClick={handleClosePurchase}
                            sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                        >
                            <CloseIcon />
                        </IconButton>
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
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel shrink htmlFor="quantity-input">Quantity</InputLabel>
                                <input
                                    id="quantity-input"
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        fontSize: "16px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc"
                                    }}
                                />
                            </FormControl>
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
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <Card
                                sx={{
                                    cursor: "pointer",
                                    transition: "box-shadow 0.2s",
                                    "&:hover": { boxShadow: 6 }
                                }}
                                onClick={() => handleProductClick(product)}
                            >
                                {product.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        image={getImageUrl(product.imageUrl)}
                                        alt={product.name}
                                        sx={{
                                            width: "100%",
                                            height: 180,
                                            objectFit: "contain",
                                            bgcolor: "#f5f5f5"
                                        }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                                        SKU: {product.sku}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" color="success.main" fontWeight="bold">
                                        ${product.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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