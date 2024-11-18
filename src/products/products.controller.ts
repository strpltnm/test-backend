import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { TokenAuthGuard } from './guards/token-auth.guard';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Get()
	async getAllProducts() {
		return this.productsService.getAll();
	}

	@UseGuards(TokenAuthGuard)
	@Post()
	async postProducts(@Body() products: ProductDto[]) {
		this.productsService.addProducts(products);
	}
}