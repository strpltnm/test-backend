import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExchangeModule } from 'src/exchange/exchange.module';

@Module({
  imports: [
    PrismaModule,
    ExchangeModule
  ],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule { }
