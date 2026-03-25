"use strict";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";

import authRoutes from "./routes/auth.js";
import newsRoutes from "./src/infrastructure/web/routes/news.js"; // Novo caminho
import connectDB from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 🛡️ SEGURANÇA: Configuração do Helmet
 * Protege contra vulnerabilidades comuns (XSS, Clickjacking, MIME sniffing).
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:8000"] // Permitir conexão com o ML Service
    }
  }
}));

// 🛡️ SEGURANÇA: Remover cabeçalho de impressão digital
app.disable("x-powered-by");

// 🌐 CORS: Configuração de privilégio mínimo
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🚀 OTIMIZAÇÃO
app.use(compression());

/**
 * 🛡️ SEGURANÇA: Limitação de Payload (Anti-DoS)
 * (Regra: EXPRESS-BODY-001)
 */
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb", parameterLimit: 100 }));

// 📝 LOGGER ESTRUTURADO
app.use(pinoHttp({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV !== "production" ? {
    target: "pino-pretty",
    options: { colorize: true }
  } : undefined
}));

// 🏰 ROTAS (Clean Architecture)
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// CHECK DE SAÚDE
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", timestamp: new Date().toISOString() });
});

// 🛡️ MANIPULADOR GLOBAL DE ERROS
app.use(errorHandler);

// INICIALIZAÇÃO
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Scandit.AI Backend rodando em modo ${process.env.NODE_ENV || "development"} na porta ${PORT}`);
    });
  } catch (err) {
    console.error("💥 Erro fatal na inicialização:", err);
    process.exit(1);
  }
};

startServer();