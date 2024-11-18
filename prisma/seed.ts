import { PrismaClient } from '@prisma/client'
import { products } from './seeding-data/products-seed'

const prisma = new PrismaClient();

async function main() {
	for (const product of products) {
		await prisma.products.create({
			data: {
				...product,
				images: {
					create: product.images.map((url) => ({ url })),
				}
			}
		})
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})