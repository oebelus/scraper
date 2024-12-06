import HttpException from "../../interfaces/exceptions/http.exception";
import Scraper from "../scraper/scrape";
import productModel from "./product.model";

class ProductService {
  private product = productModel;
  private scraper = new Scraper();
  private link = "https://www.aliexpress.com/w/wholesale-";

  private categories = {
    "coffee grinder":
      "https://www.aliexpress.com/w/wholesale-Coffee-Grinders.html",
    laptops: "https://www.aliexpress.com/w/wholesale-Laptops.html",
    "building blocks": "https://www.aliexpress.com/w/wholesale-Blocks.html",
  };

  private pages = 2;

  public async getAllProducts(): Promise<Product[] | Error> {
    try {
      const products = await this.product.find();
      return products;
    } catch (error) {
      throw new HttpException(400, (error as Error).message);
    }
  }

  public async getProductByCategory(
    category: string
  ): Promise<Product[] | Error> {
    try {
      const products = await this.product.find({ category });
      return products;
    } catch (error) {
      throw new HttpException(400, (error as Error).message);
    }
  }

  public async getProductById(id: string): Promise<Product | Error> {
    try {
      const product = await this.product.findById(id);

      if (!product) throw new HttpException(404, "Product not found");
      return product;
    } catch (error) {
      throw new HttpException(400, (error as Error).message);
    }
  }

  public async scrapeAll() {
    const allProducts = [];

    try {
      for (const [category, url] of Object.entries(this.categories)) {
        console.log(`Scraping ${category}...`);
        const products = await this.scraper.scrape(category, url, this.pages);

        for (const product of products) {
          product.category = category;
          await this.product.create(product);
        }

        allProducts.push(...products);
      }

      return allProducts;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error((error as HttpException).message);
      } else {
        console.log(error);
      }
    }
  }

  public async scrapeByCategory(category: string, n: number) {
    try {
      this.link = `${this.link}${category}.html`;
      console.log(`Link: ${this.link}`);
      const products = await this.scraper.scrape(
        category,
        this.link,
        this.pages,
        n
      );

      for (const product of products) {
        product.category = category;
        await this.product.create(product);
      }

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error((error as HttpException).message);
      } else {
        console.log(error);
      }
    }
  }

  public async getAllCategories() {
    try {
      console.log("Fetching unique categories...");
      const categories = await this.product.distinct("category");

      console.log("Unique categories:", categories);
      return categories;
    } catch (error) {
      if (error instanceof HttpException) {
        console.error((error as HttpException).message);
      } else {
        console.log(error);
      }
    }
  }

  public async saveAllProducts(products: Product[]) {
    try {
      for (const product of products) {
        await this.product.create(product);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        console.error((error as HttpException).message);
      } else {
        console.log(error);
      }
    }
  }
}

export default ProductService;
