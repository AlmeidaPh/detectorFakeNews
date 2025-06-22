require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Atlas conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB Atlas:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;