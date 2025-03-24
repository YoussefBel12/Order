import { useState } from "react";
import api from "../api/axios";

const Products = () => {
    const [data, setData] = useState({ v1: null, v2: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (version) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/v${version}/products`);
            setData((prev) => ({ ...prev, [`v${version}`]: response.data.message }));
        } catch (err) {
            setError(`Error fetching v${version}: ${err.message}`);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Test API Versioning</h2>
            <button onClick={() => fetchData("1.0")}>Fetch v1</button>
            <button onClick={() => fetchData("2.0")}>Fetch v2</button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {data.v1 && <p><strong>V1 Response:</strong> {data.v1}</p>}
            {data.v2 && <p><strong>V2 Response:</strong> {data.v2}</p>}
        </div>
    );
};

export default Products;
