import express from "express";
import { AppDataSource } from "./data-source";
import {
  createStock,
  increaseStock,
  decreaseStock,
  getStocks,
} from "./controllers/stockController";
import { Product } from "./entities/Product";

const app = express();
app.use(express.json());

// Создание продукта
app.post("/products", async (req, res) => {
  const { plu, name } = req.body;
  const product = AppDataSource.getRepository(Product).create({ plu, name });
  const result = await AppDataSource.getRepository(Product).save(product);
  res.json(result);
});

// Создание остатка
app.post("/stocks", createStock);

// Увеличение остатков
app.patch("/stocks/increase/:id", increaseStock);

// Уменьшение остатков
app.patch("/stocks/decrease/:id", decreaseStock);

// Получение остатков
app.get("/stocks", getStocks);

app.listen(3000, () => console.log("Server is running on port 3000"));
