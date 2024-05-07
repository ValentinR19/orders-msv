import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('orders_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_product' })
  idProduct: number;

  @Column('int', { name: 'id_order' })
  idOrder: number;

  @Column('int', { name: 'quantity' })
  quantity: number;

  @Column('decimal', { name: 'price' })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'id_order', referencedColumnName: 'id' })
  order: Order;
}
