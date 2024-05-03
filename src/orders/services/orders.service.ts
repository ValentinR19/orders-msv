import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { Order } from '../models/classes/order.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from '../../common/pagination.dto';
import { take } from 'rxjs';
import { ChangeStatusDTO } from '../models/dto/change-status.dto';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      this.logger.log(`Comienza el guardado de una orden con la siguiente informacion : ${JSON.stringify(createOrderDto)}`);
      const orden = await this.orderRepository.save(createOrderDto);
      this.logger.log(`Se completa el guardado de una orden con la siguiente informacion : ${JSON.stringify(createOrderDto)}`);
      return orden;
    } catch (error) {
      throw new RpcException(new InternalServerErrorException('No se pudo guardar la orden en la base de datos', error));
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const query = this.orderRepository.createQueryBuilder('order');

    const [data, count] = await query
      .skip(paginationDTO.limit * (paginationDTO.page - 1))
      .take(paginationDTO.limit)
      .orderBy('horno.createdAt', 'DESC')
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: number) {
    try {
      this.logger.log(`Comienza la busqueda de una orden con el siguiente id: ${id}`);
      const orden = await this.orderRepository.findOneOrFail({ where: { id } });
      this.logger.log(`Comienza la busqueda de una orden con el siguiente id: ${id}`);
      return orden;
    } catch (error) {
      throw new RpcException('La orden no pudo ser encontrada en la base de datos');
    }
  }

  async changesStatus({ id, status }: ChangeStatusDTO) {
    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }

    return this.orderRepository.update({ id: id }, { status: status });
  }
}
