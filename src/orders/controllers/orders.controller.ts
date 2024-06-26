import { PaginationDTO } from './../../common/pagination.dto';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { ChangeStatusDTO } from '../models/dto/change-status.dto';
import { PaidOrderDto } from '../models/dto/pay-order.dto';
import { log } from 'console';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'createOrder' })
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const session = await this.ordersService.createSessionPayment(order);
    return { order, session };
  }

  @MessagePattern({ cmd: 'findAllOrders' })
  findAll(@Payload() paginationDTO: PaginationDTO) {
    return this.ordersService.findAll(paginationDTO);
  }

  @MessagePattern({ cmd: 'findOneOrder' })
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'changeOrderStatus' })
  changeOrderStatus(@Payload() changeStatusDTO: ChangeStatusDTO) {
    try {
      return this.ordersService.changesStatus(changeStatusDTO);
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @EventPattern('payment.succeded')
  async paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    await this.ordersService.paidOrder(paidOrderDto);
  }
}
