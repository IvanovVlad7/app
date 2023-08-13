import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '4321',
  database: 'usersdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(express.json());

async function main() {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query('SELECT * FROM users');
    console.log('Data from users table:', rows);

    connection.release();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

app.post('/register', cors(), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    console.log(result);
    connection.release();

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (errodasdasr) {
    console.error('Ошибка при обработке запроса на регистрацию:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query('SELECT * FROM users');

    res.json(rows);

    connection.release();
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
process.on('exit', () => {
  pool.end();
});

(async () => {
  try {
    await main();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
})();





// Create request at Client with POST to send registered data here
