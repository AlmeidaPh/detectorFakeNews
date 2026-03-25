import mongoose from 'mongoose';

/**
 * Configuração de conexão com o MongoDB Atlas.
 * Utiliza as melhores práticas da skill @mongoose-mongodb para resiliência e performance.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,               // Gerencia até 10 conexões simultâneas
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
      dbName: process.env.DB_NAME || 'scandit_ai'
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Erro de conexão: ${err.message}`);
    process.exit(1);
  }
};

// Listeners para monitoramento em tempo real
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB desconectado. Tentando reconectar...');
});

mongoose.connection.on('error', (err) => {
  console.error(`🔥 Erro crítico no MongoDB: ${err}`);
});

export default connectDB;