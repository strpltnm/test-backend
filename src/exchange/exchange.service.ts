import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { parseString } from 'xml2js';

@Injectable()
export class ExchangeService {
	private exchangeRate: number;

	constructor() {
		this.exchangeRate = 0;
		this.updateExchangeRate();
	}

	@Cron('0 0 * * * *')
	private async updateExchangeRate(): Promise<void> {
		try {
			fetch(`http://www.cbr.ru/scripts/XML_daily.asp?date_req=${new Date().toLocaleDateString('ru-RU').replaceAll('.', '/')}`)
				.then((response) => response.text())
				.then((response) => {
					parseString(response, (err, res) => {

						if (err) {
							console.log(err);
						}

						const dollar = res.ValCurs.Valute.find((item) => item['$'].ID == 'R01235');
						this.exchangeRate = Number(dollar.Value[0].replace(',', '.'));
						console.log(`Курс доллара обновлен: ${this.exchangeRate} RUB`);
					});
				})

		} catch (error) {
			console.log('Ошибка при обновлении курса:', error.message);
		}
	}

	public convertToRubles(count: number): number {
		return count * this.exchangeRate;
	}
}