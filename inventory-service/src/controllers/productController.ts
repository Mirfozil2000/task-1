import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

export const createProduct = async (req: Request, res: Response) => {
  const { plu, name } = req.body;
  const productRepo = AppDataSource.getRepository(Product);
  const product = productRepo.create({ plu, name });
  const result = await productRepo.save(product);
  res.status(201).json(result);
};

export const getProducts = async (req: Request, res: Response) => {
  const { name, plu } = req.query;
  const productRepo = AppDataSource.getRepository(Product);

  const queryBuilder = productRepo.createQueryBuilder("product");

  if (name)
    queryBuilder.andWhere("product.name ILIKE :name", { name: `%${name}%` });
  if (plu) queryBuilder.andWhere("product.plu = :plu", { plu });

  const result = await queryBuilder.getMany();
  res.json(result);
};
