// check_connection.js
const db = require('./db');

async function verifyDB() {
  try {
    const [products] = await db.query('SELECT * FROM products');
    console.log('Connected to store_db successfully!');
    console.table(products); // Displays database rows in a clean table format
    process.exit(0);
  } catch (err) {
    console.error('Connection Error:', err.message);
    process.exit(1);
  }
}

verifyDB();