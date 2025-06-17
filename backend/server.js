const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config(); // Adicione esta linha

// Inicializar app
const app = express();

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));