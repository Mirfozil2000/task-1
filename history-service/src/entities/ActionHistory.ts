import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ActionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  shop_id!: number;

  @Column()
  plu!: string;

  @Column()
  action!: string;

  @Column()
  date!: Date;
}
