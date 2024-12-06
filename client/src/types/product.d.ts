type Product = {
  _id: string;
  name: string;
  url: string;
  image: string;
  category: string;
  offers: Offer[];
  shipping: Shipping[];
  rating: Rating;
};

type Shipping = {
  type: string;
  cost: string;
  duration: string;
};

type Offer = {
  storeName?: string;
  price: string;
  availability: string;
};

type Rating = {
  rate: string;
  reviews: string;
  sold: string;
};
