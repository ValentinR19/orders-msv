import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { Order } from '../models/classes/order.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from '../../common/pagination.dto';
import { ChangeStatusDTO } from '../models/dto/change-status.dto';
import { OrderItem } from '../models/classes/order-item.entity';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async validateProducts(ids: number[]): Promise<any[]> {
    try {
      const products = await firstValueFrom(this.client.send({ cmd: 'validateProducts' }, { ids }));
      return products;
    } catch (error) {
      throw new RpcException({ message: 'Los productos ingresados no son validos', status: HttpStatus.NOT_FOUND });
    }
  }

  //DEVOLVER TAMBIEN EL NOMBRE DEL PRODUCTO
  async create(createOrderDto: CreateOrderDto) {
    const ids = createOrderDto.orderItems.map((item: OrderItem) => item.idProduct);
    const products = await this.validateProducts(ids);
    const totalAmount = createOrderDto.orderItems.reduce((acc, item: OrderItem) => {
      const price = products.find((producto) => producto.id === item.idProduct).price;

      return acc + price * item.quantity;
    }, 0);
    const totalItems = createOrderDto.orderItems.reduce((acc, item: OrderItem) => {
      return acc + item.quantity;
    }, 0);
    createOrderDto.orderItems = createOrderDto.orderItems.map((item: any) => {
      item.price = products.find((product) => product.id === item.idProduct).price;
      item.name = products.find((product) => product.id === item.idProduct).name;
      return item;
    });
    return this.save({
      totalAmount,
      totalItems,
      ...createOrderDto,
    });
  }

  private async save(order: DeepPartial<Order>): Promise<Order> {
    try {
      this.logger.log(`Comienza el guardado de una orden con la siguiente informacion : ${JSON.stringify(order)}`);
      const createdOrder = await this.orderRepository.save(order);
      this.logger.log(`Se completa el guardado de una orden con la siguiente informacion : ${JSON.stringify(createdOrder)}`);
      return createdOrder;
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
      const ids = orden.orderItems.map((item: OrderItem) => item.idProduct);
      const products = this.findProducts(ids);

      return { orden, products };
    } catch (error) {
      throw new RpcException({ message: 'La orden no pudo ser encontrada en la base de datos', status: HttpStatus.NOT_FOUND });
    }
  }

  private async findProducts(ids: number[]): Promise<any[]> {
    try {
      ids = Array.from(new Set(ids));
      this.logger.log(`Comienza la busqueda de los productos con id: ${ids}`);
      const products = await firstValueFrom(this.client.send({ cmd: 'findProductsByIds' }, { ids }));
      this.logger.log(`Se completa la busqueda de los productos`);
      return products;
    } catch (error) {
      throw new RpcException({ message: 'Ha ocurrido un error buscando los productos', status: HttpStatus.BAD_REQUEST });
    }
  }

  async changesStatus({ id, status }: ChangeStatusDTO) {
    const order = await this.findOne(id);
    if (order.orden.status === status) {
      return order;
    }

    return this.orderRepository.update({ id: id }, { status: status });
  }

  async createSessionPayment(order: Order) {

    const session = await firstValueFrom(
      this.client.send('create.payment.session', {
        idOrder: order.id,
        currency: 'usd',
        items: order.orderItems.map((item: any) => ({
          price: item.price,
          name: item.name,
          quantity: item.quantity,
        })),
      }),
    );
    return session;
  }
}
