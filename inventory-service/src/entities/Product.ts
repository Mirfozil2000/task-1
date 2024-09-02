import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Stock } from "./Stock";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  plu!: string;

  @Column()
  name!: string;

  @OneToMany(() => Stock, stock => stock.product)
  stocks!: Stock[];
}
