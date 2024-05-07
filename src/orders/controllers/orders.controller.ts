import { PaginationDTO } from './../../common/pagination.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { ChangeStatusDTO } from '../models/dto/change-status.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'createOrder' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
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
}
