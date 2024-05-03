import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // url: envs.databaseUrl,
      host: envs.dbHost,
      port: 5432,
      username: envs.dbUsername,
      password: envs.dbPassword,
      schema: envs.dbName,
      logging: true,
      entities: ['dist/**/models/*/*{.entity.ts,.entity.js}'],
      synchronize: true,
      extra: {
        timezone: 'local',
      },
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
