import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: String,
  url: String,
  image: String,
  category: String,
  offers: [
    {
      storeName: { type: String },
      price: { type: String },
      availability: { type: String },
    },
  ],
  shipping: [
    {
      type: { type: String },
      cost: { type: String },
      duration: { type: String },
    },
  ],
  rating: [
    {
      rate: { type: String },
      reviews: { type: String },
      sold: { type: String },
    },
  ],
});

const Product = mongoose.model<Product>("Product", productSchema);

export default Product;
