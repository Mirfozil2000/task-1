import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Stock } from "../entities/Stock";
import { Product } from "../entities/Product";

export const createStock = async (req: Request, res: Response) => {
  const { productId, shopId, quantityOnShelf, quantityInOrder } = req.body;

  const productRepo = AppDataSource.getRepository(Product);
  const stockRepo = AppDataSource.getRepository(Stock);

  // Проверяем, существует ли продукт
  const product = await productRepo.findOneBy({ id: productId });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const stock = stockRepo.create({
    product,
    shop_id: shopId,
    quantity_on_shelf: quantityOnShelf,
    quantity_in_order: quantityInOrder,
  });

  const result = await stockRepo.save(stock);
  res.status(201).json(result);
};

export const increaseStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const stockRepo = AppDataSource.getRepository(Stock);

  const stock = await stockRepo.findOneBy({ id: parseInt(id) });
  if (stock) {
    stock.quantity_on_shelf += quantity;
    const result = await stockRepo.save(stock);
    res.json(result);
  } else {
    res.status(404).json({ error: "Stock not found" });
  }
};

export const decreaseStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const stockRepo = AppDataSource.getRepository(Stock);

  const stock = await stockRepo.findOneBy({ id: parseInt(id) });
  if (stock) {
    stock.quantity_on_shelf -= quantity;
    const result = await stockRepo.save(stock);
    res.json(result);
  } else {
    res.status(404).json({ error: "Stock not found" });
  }
};

export const getStocks = async (req: Request, res: Response) => {
  const {
    plu,
    shop_id,
    quantity_on_shelf_min,
    quantity_on_shelf_max,
    quantity_in_order_min,
    quantity_in_order_max,
  } = req.query;

  const stockRepo = AppDataSource.getRepository(Stock);
  const queryBuilder = stockRepo
    .createQueryBuilder("stock")
    .leftJoinAndSelect("stock.product", "product");

  if (plu) queryBuilder.andWhere("product.plu = :plu", { plu });
  if (shop_id) queryBuilder.andWhere("stock.shop_id = :shop_id", { shop_id });
  if (quantity_on_shelf_min)
    queryBuilder.andWhere(
      "stock.quantity_on_shelf >= :quantity_on_shelf_min",
      { quantity_on_shelf_min }
    );
  if (quantity_on_shelf_max)
    queryBuilder.andWhere(
      "stock.quantity_on_shelf <= :quantity_on_shelf_max",
      { quantity_on_shelf_max }
    );
  if (quantity_in_order_min)
    queryBuilder.andWhere(
      "stock.quantity_in_order >= :quantity_in_order_min",
      { quantity_in_order_min }
    );
  if (quantity_in_order_max)
    queryBuilder.andWhere(
      "stock.quantity_in_order <= :quantity_in_order_max",
      { quantity_in_order_max }
    );

  const result = await queryBuilder.getMany();
  res.json(result);
};
