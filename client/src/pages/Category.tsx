import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CategoryProps {
    title: string;
}

const Category = ({ title }: CategoryProps) => {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const scrapeData = async () => {
        await axios.post("http://localhost:3000/api/products/scrape")
            .then((res) => {
                console.log(res.data);
                setData(res.data)
            })
            .catch((err) => console.log(err));
    }

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

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            <div className="flex gap-4 mt-4 mb-10">
                <button
                    onClick={scrapeData}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition-all"
                >
                    Scrape All
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4">{title}</h2>

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
