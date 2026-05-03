const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// Mock Commission Logic
app.post('/calculate-commission', (req, res) => {
    const { amount, technicianRole } = req.body;
    let commission = amount * 0.10; // Default 10%
    if (technicianRole === 'SENIOR') commission = amount * 0.15;
    res.json({ amount, commission, technicianRole });
});

// Subscription Status
app.get('/subscription/:technicianId', (req, res) => {
    res.json({ technicianId: req.params.technicianId, status: 'ACTIVE', plan: 'PREMIUM' });
});

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
