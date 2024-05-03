import { IsEnum, IsNumber } from 'class-validator';
import { ORDER_STATUS } from '../enum/order-status.enum';

export class ChangeStatusDTO {
  @IsNumber()
  id: number;

  @IsEnum([ORDER_STATUS.PENDING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED], { message: 'El tipo de dato es incorrecto' })
  status: ORDER_STATUS;
}
