const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    
    console.log('Recent orders:');
    orders.forEach(order => {
      console.log(`ID: ${order.order_id}, Session: ${order.checkout_session_id}, Email: ${order.email}, Items: ${order.items.length}, Created: ${order.created_at}`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkOrders();
