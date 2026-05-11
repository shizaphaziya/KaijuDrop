import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');

// Mock order data
const order = {
  customerName: 'Test User',
  customerEmail: 'test@example.com',
  items: [
    {
      productId: 46,
      variantId: 79,
      quantity: 1,
      price: 18900,
      title: 'Satoru Gojo: Hollow Purple Ver.',
      variantName: '1/7 Scale'
    }
  ]
};

async function simulateCheckout() {
  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const result = await response.json();
    console.log('Checkout Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Checkout Failed:', error);
  }
}

simulateCheckout();
