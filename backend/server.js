const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Conexão com o banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração para arquivos estáticos
app.use(express.static(path.join(__dirname, 'frontEnd')));
app.use('/css', express.static(path.join(__dirname, 'frontEnd/css')));
app.use('/js', express.static(path.join(__dirname, 'frontEnd/js')));
app.use('/imgs', express.static(path.join(__dirname, 'frontEnd/imgs')));

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Rota para o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontEnd', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));