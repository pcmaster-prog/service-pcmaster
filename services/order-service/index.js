const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

let orders = [
    { id: '1', customer: 'Juan Perez', equipment: 'Laptop HP', status: 'PENDING', assignedTo: null },
    { id: '2', customer: 'Maria Garcia', equipment: 'MacBook Pro', status: 'IN_PROGRESS', assignedTo: 'tech_1' }
];

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const newOrder = { id: Date.now().toString(), ...req.body, status: 'PENDING' };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.patch('/orders/:id', (req, res) => {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex > -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...req.body };
        return res.json(orders[orderIndex]);
    }
    res.status(404).send({ message: 'Order not found' });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
