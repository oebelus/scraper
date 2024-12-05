import express, { Application } from "express";
import cors from "cors";
import Controller from "./interfaces/controller.interface";
import morgan from "morgan";
import mongoose from "mongoose";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    console.log(process.env.MONGO_USER);

    this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeDatabaseConnection() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`)
      .then(() => console.log("Database connected successfully"))
      .catch((error) => console.error("Database connection error:", error));
  }

  private initializeMiddlewares() {
    this.express.use(cors());
    this.express.use(morgan("dev"));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api", controller.router);
    });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
