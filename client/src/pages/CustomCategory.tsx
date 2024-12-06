import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CustomCategory() {
    const [category, setCategory] = useState("");
    const [number, setNumber] = useState(1);
    const [categoryIsLoading, setCategoryIsLoading] = useState(false);
    const [data, setData] = useState<Product[]>([]);
    const [error, setError] = useState("");

    const scrapeByCategory = async () => {
        if (category === "") {
            setError("Please type a category");
            return;
        }

        setError("");
        setCategoryIsLoading(true);
        await axios.post(`http://localhost:3000/api/products/scrape/${category}/${number}`)
            .then((res) => {
                console.log(res.data);
                setError("");
                setData(res.data);
                setCategoryIsLoading(false);
            })
            .catch((err) => console.log(err));
    }

    const saveToDB = async () => {
        await axios.post("http://localhost:3000/api/products/save", data)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        axios.get("http://localhost:3000/api/products/categories")
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    }, []);
    
    return (
        <div>
            <div className="flex justify-between h-10">
                <div>
                    <div className="flex gap-3 rounded-lg">
                        <input value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-lg px-1 text-gray-700" type="text" placeholder="Type a category" required/>
                        <input value={number} onChange={(e) => setNumber(Number(e.target.value))} min={1} type="number" className="w-20 rounded-lg px-1 text-gray-700" placeholder="Number of Items" />
                    </div>
                    {error != "" && <span className="text-red-500">{error}</span>}
                </div>
                
                <button
                    onClick={scrapeByCategory}
                    className={`${categoryIsLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600"} px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition-all`}
                >
                    { categoryIsLoading ? "Scraping..." : "Scrape n items of a category"}
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-6">{category != "" ? category.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1) + " ") : "Custom Category"}</h2>

            {data.length > 0 && (
                <div className="flex gap-4">
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
                    <button
                        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 transition-all"
                        onClick={saveToDB}
                    >
                        Save to Database
                    </button>
                </div>
            ) }

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {data.map((product, index) => (
                    <li key={index} className="bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                    <Link 
                        to={`${product.url}`} 
                        className="hover:opacity-90"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
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
                        {product.offers.map((offer, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <div className={`${product.rating.sold == "N/A" ? "hidden" : ""}`}>
                                <span>{product.rating.sold}</span>
                                <span>{product.rating.reviews}</span>
                                <span>{product.rating.rate}</span>
                            </div>
                            <span className="text-sm text-gray-500">{offer.availability != "" ? offer.availability : "In Stock"}</span>
                        </div>
                        ))}
                    </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
