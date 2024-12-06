import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import ProductService from "./product.service";

class ProductController implements Controller {
  public path = "/products";
  public router = Router();
  private productService = new ProductService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/all`, this.getAllProducts);

    this.router.get(
      `${this.path}/category/:category`,
      this.getProductByCategory
    );

    this.router.get(`${this.path}/:id`, this.getProductById);

    this.router.post(`${this.path}/scrape`, this.scrapeAll);

    this.router.post(
      `${this.path}/scrape/:category/:number`,
      this.scrapeByCategory
    );

    this.router.get(`${this.path}/categories`, this.getAllCategories);

    this.router.post(`${this.path}/save`, this.saveAllProducts);
  }

  private getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  private getProductByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = req.params.category;
      console.log(category.toLowerCase());
      const products = await this.productService.getProductByCategory(
        category.toLowerCase()
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  private getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      console.log(id);
      // const product = await this.productService.getProductById(id);
      // console.log("Controller - Fetched Product:", product);
      // console.log(product);
      // res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  private scrapeAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await this.productService.scrapeAll();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  private scrapeByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = req.params.category.toLowerCase().split(" ").join("-");
      const number = Number(req.params.number);
      const products = await this.productService.scrapeByCategory(
        category,
        number
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  private getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Categories route hit!");
      console.log("Fetching unique categories...");
      const categories = await this.productService.getAllCategories();
      console.log("Unique categories:", categories);
      res.status(200).json({ categories: categories });
    } catch (error) {
      next(error);
    }
  };

  private saveAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = req.body;
      console.log("Received products:", products);
      console.log("Saving all products...");
      await this.productService.saveAllProducts(products);
      res.status(200).json({ message: "Products saved successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
