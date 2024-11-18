import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [ProductsModule, PrismaModule, ExchangeModule],
})
export class AppModule { }