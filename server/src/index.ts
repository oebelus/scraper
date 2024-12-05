import App from "./app";
import dotenv from "dotenv";
import ProductController from "./resources/product/product.controller";

dotenv.config();

const app = new App([new ProductController()], Number(process.env.PORT));

app.listen();
