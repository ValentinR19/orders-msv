import { IsNumber, IsString, IsUrl } from 'class-validator';

export class PaidOrderDto {
  @IsString()
  stripePaymentId: string;
  
  @IsNumber()
  idOrder: number;

  @IsString()
  @IsUrl()
  receipUrl: string;
}
