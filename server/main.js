import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { log } from 'console';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

function CreateMySqlConnection() {
  let connection;

  return async () => {
    if (!connection) {
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '4321',
        database: 'usersdb',
      });

      await connection.connect();
    }

    return connection;
  }
}

const GetMySqlConnection = CreateMySqlConnection();


async function main() {
  try {
    const connection = await GetMySqlConnection();
    const [tables, fields] = await connection.query("SHOW TABLES FROM `usersdb`");
    if (tables.length == 0) {
      console.log('start creating');
      await connection.query("CREATE TABLE Users (ID INT AUTO_INCREMENT PRIMARY KEY, name varchar(255) , email varchar(255), password varchar(255),registration_date DATETIME,last_login_date DATETIME, status varchar(255))");
    }
  }
  catch (err) {
    console.log('error: ', err)
  }
}

app.post('/register', cors(), async (req, res) => {
  try {
    const connection = await GetMySqlConnection();
    const { username, email, password } = req.body;

    const checkExistingUserQuery = `
      SELECT * FROM Users
      WHERE name = ? OR email = ?`;


    const [existingUsers] = await connection.query(checkExistingUserQuery, [username, email]);

    const existingUserWithSameName = existingUsers.some(user => user.name === username);
    const existingUserWithSameEmail = existingUsers.some(user => user.email === email);

    if (existingUserWithSameName && existingUserWithSameEmail) {
      return res.status(400).json({ message: 'Пользователь с таким именем и электронной почтой уже существует' });
    } else if (existingUserWithSameName) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    } else if (existingUserWithSameEmail) {
      return res.status(400).json({ message: 'Пользователь с такой электронной почтой уже существует' });
    }
    const insertQuery = `
      INSERT INTO Users (name, email, password, registration_date, status)
      VALUES (?, ?, ?, NOW(), ?)`;

    const [result] = await connection.query(insertQuery, [username, email, password, 'active']);
    console.log(result);
    if (result.affectedRows === 1) {
      res.status(201).json({ message: 'Пользователь зарегистрирован', payload: { userId: result.insertId } });
    } else {
      res.status(500).json({ message: 'Не удалось зарегистрировать пользователя' });
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса на регистрацию:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/login', cors(), async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const connection = await GetMySqlConnection();

    const checkQuery = `
    SELECT * FROM Users
    WHERE name = ? AND email = ? AND password = ?`;

    const [existingUser] = await connection.query(checkQuery, [name, email, password]);

    console.log(existingUser, req.body);
    if (existingUser.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    if (existingUser[0].status === 'inactive') {
      return res.status(401).json({ message: 'Пользователь неактивен', payload: { userId: existingUser[0].ID } });
    }

    const updateQuery = 'UPDATE Users SET last_login_date = NOW() WHERE ID = ?';
    const [updateResult] = await connection.query(updateQuery, [existingUser[0].ID]);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: 'Логин успешен', payload: { userId: existingUser[0].ID } });
    } else {
      res.status(500).json({ message: 'Не удалось обновить логин' });
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса на обновление логина:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/dashboard/update/:userId', cors(), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { status } = req.body;
    const connection = await GetMySqlConnection();

    const updateQuery = 'UPDATE Users SET status = ? WHERE ID = ?';
    const [updateResult] = await connection.query(updateQuery, [status, userId]);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: 'Статус пользователя обновлен' });
    } else {
      res.status(500).json({ message: 'Не удалось обновить статус пользователя' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении статуса пользователя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.delete('/dashboard/delete/:userId', cors(), async (req, res) => {
  try {
    const userId = req.params.userId;
    const connection = await GetMySqlConnection();

    const deleteQuery = 'DELETE FROM Users WHERE ID = ?';
    const [deleteResult] = await connection.query(deleteQuery, [userId]);

    if (deleteResult.affectedRows === 1) {
      res.status(200).json({ message: 'Пользователь удален' });
    } else {
      res.status(500).json({ message: 'Не удалось удалить пользователя' });
    }
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});




app.get('/dashboard', async (req, res) => {
  try {
    const connection = await GetMySqlConnection();
    const [rows, fields] = await connection.query('SELECT * FROM users');
    res.json(rows);
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
//1.при входе в логин мне