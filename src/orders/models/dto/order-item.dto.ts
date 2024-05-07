import { IsNumber, IsPositive } from 'class-validator';
import { OrderItem } from '../classes/order-item.entity';

export class OrderItemDTO  {
  @IsNumber()
  @IsPositive()
  idProduct: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
