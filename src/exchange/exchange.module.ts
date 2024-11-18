import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	providers: [ExchangeService],
	exports: [ExchangeService],
	imports: [ScheduleModule.forRoot()]
})
export class ExchangeModule { }
