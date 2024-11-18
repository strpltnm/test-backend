import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { ExchangeService } from 'src/exchange/exchange.service';
import { GetProductDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
	constructor(
		private prisma: PrismaService,
		private exchangeService: ExchangeService
	) { }

	async getAll(): Promise<GetProductDto> {
		type ProductWithImages = Prisma.ProductsGetPayload<null> & { images?: { url: string }[] };

		const products: ProductWithImages[] = await this.prisma.products.findMany({
			include: {
				images: {
					select: {
						url: true
					},
				}
			}
		});

		const productsWithRub: ProductDto[] = products.map((product: ProductWithImages): ProductDto => {
			const { price, discountPercentage } = product;

			const price_rub = this.exchangeService.convertToRubles(price - ((price / 100) * discountPercentage))

			return {
				...product,
				price_rub: Math.ceil(price_rub + ((price_rub / 100) * 10)),
				images: product.images.map(image => image.url)
			}
		})

		return { products: productsWithRub };
	}

	async addProducts(products: ProductDto[]) {

		for (const product of products) {
			const { id, images, ...productData } = product;

			if (id) {
				const existingProduct = await this.prisma.products.findUnique({ where: { id } });

				if (existingProduct) {
					await this.prisma.products.update({
						where: { id },
						data: {
							...productData,
							images: {
								deleteMany: {},
								create: images.map((url) => ({ url })),
							}
						}
					});
				} else {
					await this.prisma.products.create({
						data: {
							...productData,
							images: {
								create: images.map((url) => ({ url })),
							}
						}
					});
				}
			} else {
				await this.prisma.products.create({
					data: {
						...productData,
						images: {
							create: images.map((url) => ({ url })),
						}
					}
				});
			}
		}
	}

}