import axios from "axios";
import { useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const scrapeData = async () => {
        setLoading(true);
        await axios.post("http://localhost:3000/api/products/scrape")
            .then((res) => {
                console.log(res.data);
                setLoading(false);
                setSuccess(true);
            })
            .catch((err) => console.log(err));
    }
    
    return (
        <div>
            <div className="flex flex-col gap-4 mt-4 mb-10">
                <button
                    onClick={scrapeData}
                    className={` ${loading ? "opacity-50 cursor-not-allowed" : ""} ${success ? "bg-green-500 cursor-not-allowed" : ""} px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition-all`}
                >
                    {loading ? "Loading..." : success ? "Scraped Successfully" : "Scrape the first 2 pages of each category"}
                </button>
            </div>
        </div>
    )
}
