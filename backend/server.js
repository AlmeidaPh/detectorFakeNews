import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from '/backEnd/routes/auth.js';
import newsRoutes from '/backEnd/routes/news.js';
import connectDB from '/backEnd/config/db.js'; 

dotenv.config();

const app = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:5500/fakeNewsDetector', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro na conexão:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/routes/auth.js', authRoutes);
app.use('/routes/news.js', newsRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Fake News Detector');
});

// Inicia o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});