type Product = {
  name: string;
  url: string;
  image: string;
  category: string;
  offers: Offer[];
  shipping: Shipping[];
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
