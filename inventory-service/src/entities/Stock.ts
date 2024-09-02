import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, product => product.stocks)
  product!: Product;

  @Column()
  shop_id!: number;

  @Column()
  quantity_on_shelf!: number;

  @Column()
  quantity_in_order!: number;
}
