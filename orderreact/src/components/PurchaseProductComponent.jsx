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
      // If you use JWT, add the Authorization header here
      const token = localStorage.getItem("token"); // Or wherever you store your JWT
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
          <strong>Description:</strong> {selectedProduct.description}<br />
          <strong>Price:</strong> ${selectedProduct.price}
        </div>
      )}
    </div>
  );
}