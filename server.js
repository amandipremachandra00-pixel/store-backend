
const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json());

// ---------- Products ----------

// 1. GET /api/products
// Get all products

app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');

        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 2. GET /api/products/:id
// Get one product using ID

app.get('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 3. POST /api/products
// Insert a new product

app.post('/api/products', async (req, res) => {
    try {
        const { product_name, category, price, stock } = req.body;

        if (
            product_name === undefined || product_name === null || product_name === '' ||
            category === undefined || category === null || category === '' ||
            price === undefined || price === null || price === '' ||
            stock === undefined || stock === null || stock === ''
        ) {
            return res.status(400).json({
                message: 'Required fields are missing'
            });
        }

        const sql = `
            INSERT INTO products
            (product_name, category, price, stock)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            product_name,
            category,
            price,
            stock
        ]);

        res.status(201).json({
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ---------- Customers ----------

// 4. GET /api/customers
// Get all customers

app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customers');

        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 5. POST /api/customers
// Insert a new customer

app.post('/api/customers', async (req, res) => {
    try {
        const { full_name, email, city } = req.body;

        if (
            !full_name || !email || !city ||
            typeof full_name !== 'string' ||
            typeof email !== 'string' ||
            typeof city !== 'string' ||
            !full_name.trim() ||
            !email.trim() ||
            !city.trim()
        ) {
            return res.status(400).json({
                message: 'Full name, email and city are required'
            });
        }

        const sql = `
            INSERT INTO customers
            (full_name, email, city)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            full_name,
            email,
            city
        ]);

        res.status(201).json({
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ---------- Start Server ----------

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
