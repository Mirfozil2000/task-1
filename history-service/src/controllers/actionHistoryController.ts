// src/controllers/actionHistoryController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ActionHistory } from "../entities/ActionHistory";
import { ParsedQs } from "qs";

export const logAction = async (req: Request, res: Response) => {
  const { shop_id, plu, action, date } = req.body;

  if (!shop_id || !plu || !action || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const actionHistoryRepo = AppDataSource.getRepository(ActionHistory);
  const actionHistory = new ActionHistory();
  actionHistory.shop_id = shop_id;
  actionHistory.plu = plu;
  actionHistory.action = action;
  actionHistory.date = new Date(date);

  const result = await actionHistoryRepo.save(actionHistory);
  res.status(201).json(result);
};

export const getActionHistory = async (
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response
) => {
  const {
    shop_id,
    plu,
    startDate,
    endDate,
    action,
    page = 1,
    limit = 10,
  } = req.query;

  const actionHistoryRepo = AppDataSource.getRepository(ActionHistory);

  const queryBuilder = actionHistoryRepo.createQueryBuilder("actionHistory");

  if (shop_id)
    queryBuilder.andWhere("actionHistory.shop_id = :shop_id", {
      shop_id: parseInt(shop_id as string),
    });
  if (plu) queryBuilder.andWhere("actionHistory.plu = :plu", { plu });
  if (startDate) {
    const start = new Date(startDate as string);
    if (!isNaN(start.getTime())) {
      queryBuilder.andWhere("actionHistory.date >= :startDate", {
        startDate: start,
      });
    }
  }
  if (endDate) {
    const end = new Date(endDate as string);
    if (!isNaN(end.getTime())) {
      queryBuilder.andWhere("actionHistory.date <= :endDate", { endDate: end });
    }
  }
  if (action)
    queryBuilder.andWhere("actionHistory.action = :action", { action });

  queryBuilder
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string));

  const [result, total] = await queryBuilder.getManyAndCount();

  res.json({ total, data: result });
};
