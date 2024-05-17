import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';
import { OrderReiptDTO } from './order-receipt.dto';

export class PaidOrderDto {
  @IsString()
  stripePaymentId: string;

  @IsNumber()
  @Type(() => Number)
  idOrder: number;

  @IsString()
  @IsUrl()
  receiptUrl: string;
}
