import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length: 30 })
  name: string

  @Column({type: 'int'})
  percentage: number

  @Column({type: 'date'})
  expirationDate: Date
}