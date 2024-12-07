import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CategoryProps {
    title: string;
}

const Category = ({ title }: CategoryProps) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/products/category/${title}`);
                setLoading(false);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };

        fetchProductsByCategory();
    }, [title]);

    return (
        <div>
            {loading && <p>Loading...</p>}

            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            {/* Export JSON */}
            {data.length > 0 && (
                <button
                    onClick={() => {
                        const json = JSON.stringify(data, null, 2);
                        const blob = new Blob([json], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `products.json`;
                        link.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 transition-all"
                >
                    Export JSON
                </button>
            ) }


            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {data.map((product, index) => (
                    <li key={index} className="bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                    <Link to={`/product/${product._id}`} className="hover:opacity-90">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full object-cover rounded-md mb-4"
                        />
                    </Link>
                    <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {product.offers.map((offer, idx) => (
                        <span
                            key={idx}
                            className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded"
                        >
                            {offer.storeName ? `${offer.storeName}: ` : ""}
                            <span className="font-bold">{offer.price}</span>
                        </span>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        <p className="font-bold">Shipping:</p>
                        {product.shipping.map((ship, idx) => (
                            <div key={idx} className="flex flex-col gap-4 justify-between bg-gray-700 p-1 rounded-lg my-2">
                                <span>{ship.type}</span>
                                <span>
                                    ({ship.duration})
                                </span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex flex-col">
                            <span className={`${product.rating[0].sold === "N/A" ? "hidden": ""}`}>{product.rating[0].sold}</span>
                            <span className={`${product.rating[0].reviews === "N/A" ? "hidden": ""}`}>{product.rating[0].reviews}</span>
                            <span className={`${product.rating[0].rate === "N/A" ? "hidden": ""}`}>{product.rating[0].rate}</span>
                        </div>
                        {product.offers.map((offer, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <span className="text-sm text-gray-500">{offer.availability != "" ? offer.availability : "In Stock"}</span>
                        </div>
                        ))}
                    </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
