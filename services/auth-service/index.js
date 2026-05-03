const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'supersecret';

// Mock DB for now, will integrate Postgres later
const users = [];

app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, role });
    res.status(201).send({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email, role: user.role }, SECRET);
        return res.json({ token });
    }
    res.status(401).send({ message: 'Invalid credentials' });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
