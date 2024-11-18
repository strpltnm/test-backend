export class ProductDto {
	id: number;
	title: string;
	description: string;
	price: number;
	price_rub?: number;
	discountPercentage: number;
	rating: number;
	stock: number;
	brand: string;
	category: string;
	thumbnail: string;
	images?: string[];
}