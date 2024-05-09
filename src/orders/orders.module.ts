import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './models/classes/order.entity';
import { OrderItem } from './models/classes/order-item.entity';

import { NatsModule } from 'src/nats/nats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), NatsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
