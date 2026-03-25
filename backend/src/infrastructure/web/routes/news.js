import express from "express";
import { NewsController } from "../controllers/NewsController.js";
import auth from "../../../../middlewares/auth.js";
import optionalAuth from "../../../../middlewares/optionalAuth.js";

const router = express.Router();
const newsController = new NewsController();

// 🔍 Analisar notícia (Autenticação opcional para permitir testes rápidos)
router.post("/verify", optionalAuth, (req, res, next) => newsController.verify(req, res, next));

// 📁 Histórico de análises do usuário (Protegido)
router.get("/history", auth, (req, res, next) => newsController.history(req, res, next));

// 📄 Detalhes de uma análise específica
router.get("/:id", auth, (req, res, next) => newsController.detail(req, res, next));

export default router;
