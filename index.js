const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

const menuFile = './data/menu.json';
const ordersFile = './data/orders.json';

// Load data or initialize empty arrays
const loadData = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []);
let menu = loadData(menuFile);
let orders = loadData(ordersFile);

// Save data back to files
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Endpoint: Add Menu Item (POST /menu)
app.post('/menu', (req, res) => {
  const { name, price, category } = req.body;

  if (!name || price <= 0 || !['Starter', 'Main Course', 'Dessert'].includes(category)) {
    return res.status(400).json({ message: 'Invalid menu item details' });
  }

  const existingItem = menu.find((item) => item.name === name);
  if (existingItem) {
    existingItem.price = price;
    existingItem.category = category;
  } else {
    menu.push({ id: menu.length + 1, name, price, category });
  }

  saveData(menuFile, menu);
  res.json({ message: 'Menu item added/updated', menu });
});

// Endpoint: Get Menu (GET /menu)
app.get('/menu', (req, res) => {
  res.json(menu);
});

// Endpoint: Place Order (POST /orders)
app.post('/orders', (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid order details' });
  }

  const invalidItems = items.filter((id) => !menu.some((item) => item.id === id));
  if (invalidItems.length) {
    return res.status(400).json({ message: 'Invalid item IDs in order', invalidItems });
  }

  const newOrder = {
    id: orders.length + 1,
    items,
    status: 'Preparing',
  };

  orders.push(newOrder);
  saveData(ordersFile, orders);
  res.json({ message: 'Order placed', order: newOrder });
});

// Endpoint: Get Order Details (GET /orders/:id)
app.get('/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// CRON job: Update Order Status
cron.schedule('*/1 * * * *', () => {
  orders.forEach((order) => {
    if (order.status === 'Preparing') {
      order.status = 'Out for Delivery';
    } else if (order.status === 'Out for Delivery') {
      order.status = 'Delivered';
    }
  });

  saveData(ordersFile, orders);
  console.log('Order statuses updated');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
