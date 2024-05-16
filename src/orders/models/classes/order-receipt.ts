import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { envs } from 'src/config';

@Entity('orders_receipt', { schema: envs.dbName })
export class OrderReceipt {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_order' })
  idOrder: number;

  @Column('varchar', { name: 'receip_url' })
  receipUrl: string;

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

  @OneToOne(() => Order)
  @JoinColumn({ name: 'id_order', referencedColumnName: 'id' })
  order: Order;
}
