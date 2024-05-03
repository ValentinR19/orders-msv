import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ORDER_STATUS } from '../enum/order-status.enum';
import { envs } from 'src/config';

@Entity('orders', { schema: envs.dbName })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('decimal', { name: 'total_amount' })
  totalAmount: number;

  @Column('int', { name: 'total_items' })
  totalItems: number;

  @Column('enum', { name: 'status', enum: [ORDER_STATUS.PENDING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED], default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Column('boolean', { name: 'paid', nullable: true })
  paid: boolean;

  @Column('timestamp', { name: 'paid_at ', nullable: true })
  paidAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;
}
