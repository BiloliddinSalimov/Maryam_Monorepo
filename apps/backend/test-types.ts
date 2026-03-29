import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  // Test User model
  const user = await prisma.user.findFirst();
  
  // Test Category model
  const category = await prisma.category.findMany();
  
  // Test Product model
  const product = await prisma.product.findUnique({
    where: { id: 1 }
  });
  
  // Test ProductImage model
  const productImage = await prisma.productImage.findMany();
  
  // Test Discount model
  const discount = await prisma.discount.create({
    data: { percent: 10, startDate: new Date(), endDate: new Date(), productId: 1 }
  });
  
  // Test Banner model
  const banner = await prisma.banner.findMany();
  
  // Test Basket model
  const basket = await prisma.basket.findFirst();
  
  // Test BasketItem model
  const basketItem = await prisma.basketItem.count();
  
  // Test Wishlist model
  const wishlist = await prisma.wishlist.findMany();
  
  // Test WishlistItem model
  const wishlistItem = await prisma.wishlistItem.findMany();
  
  // Test Order model
  const order = await prisma.order.findMany();
  
  // Test OrderItem model
  const orderItem = await prisma.orderItem.findMany();
  
  // Test transaction
  await prisma.$transaction([
    prisma.user.findMany(),
    prisma.product.findMany()
  ]);
}
