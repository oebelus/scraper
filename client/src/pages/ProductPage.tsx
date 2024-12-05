import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`);
        console.log(res.data);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("product " + product);
  }, [product]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md mx-auto lg:max-w-none lg:w-auto lg:h-auto rounded-md shadow-lg"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{product.category}</p>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Offers</h2>
            {product.offers && product.offers.length > 0 ? (
              product.offers.map((offer, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-700 rounded-md shadow-sm mb-2"
                >
                  <p>
                    <span className="font-bold">Store:</span>{" "}
                    {offer.storeName || "Unknown"}
                  </p>
                  <p>
                    <span className="font-bold">Price:</span> {offer.price}
                  </p>
                  <p>
                    <span className="font-bold">Availability:</span>{" "}
                    {offer.availability || "In Stock"}
                  </p>
                </div>
              ))
            ) : (
              <p>No offers available.</p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
            {product.shipping && product.shipping.length > 0 ? (
              product.shipping.map((shipping, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-700 rounded-md shadow-sm mb-2"
                >
                  <p>
                    <span className="font-bold">Type:</span> To Home
                  </p>
                  <p>
                    <span className="font-bold">Cost:</span> {shipping.cost}
                  </p>
                  <p>
                    <span className="font-bold">Duration:</span>{" "}
                    {shipping.duration}
                  </p>
                </div>
              ))
            ) : (
              <p>No shipping details available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
