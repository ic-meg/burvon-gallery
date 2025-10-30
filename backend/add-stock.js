const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addStock() {
  try {
    // Add stock to product 15
    await prisma.product.update({
      where: { product_id: 15 },
      data: { stock: 10 }
    });
    
    console.log('Added stock to product 15');
    
    // Add some size-specific stock for testing
    await prisma.sizeStock.upsert({
      where: {
        product_id_size: {
          product_id: 15,
          size: '4'
        }
      },
      update: {
        stock: 5
      },
      create: {
        product_id: 15,
        size: '4',
        stock: 5
      }
    });
    
    console.log('Added size-specific stock for product 15, size 4');
    
    // Add stock to a few more products
    await prisma.product.updateMany({
      where: { 
        product_id: { in: [16, 17, 18, 19, 20] }
      },
      data: { stock: 10 }
    });
    
    console.log('Added stock to products 16-20');
    
  } catch (error) {
    console.error('Error adding stock:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addStock();
