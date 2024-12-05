interface Product extends Document {
  name: string;
  url: string;
  image: string;
  offers: Offer[];
  shipping: Shipping[];
}

export default Product;
