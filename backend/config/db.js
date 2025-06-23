import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'test' // Forçar uso do banco 'test'
    });
    console.log('Conectado ao MongoDB Atlas (banco: test)');
  } catch (err) {
    console.error('Erro de conexão:', err.message);
    process.exit(1);
  }
};

export default connectDB;