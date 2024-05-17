import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ORDER_STATUS } from '../enum/order-status.enum';
import { envs } from 'src/config';
import { OrderItem } from './order-item.entity';
import { OrderReceipt } from './order-receipt.entity';

@Entity('orders', { schema: envs.dbName })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('decimal', { name: 'total_amount' })
  totalAmount: number;

  @Column('int', { name: 'total_items' })
  totalItems: number;

  @Column('enum', { name: 'status', enum: [ORDER_STATUS.PENDING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.PAID], default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Column('boolean', { name: 'paid', nullable: true })
  paid: boolean;

  @Column('timestamp', { name: 'paid_at ', nullable: true })
  paidAt?: Date;

  @Column('varchar', { name: 'stripe_charge_id', nullable: true })
  stripeChargeId?: string;

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @OneToOne(() => OrderReceipt, (orderReceipt) => orderReceipt.order, { cascade: true })
  orderReceipt: OrderReceipt;
}
