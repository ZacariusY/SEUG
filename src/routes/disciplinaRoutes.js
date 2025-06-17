const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Disciplina = require("../entities/Disciplina");

const disciplinaRepo = AppDataSource.getRepository(Disciplina);

// Rota específica para /novo (DEVE VIR ANTES DE /:id)
router.get("/novo", (req, res) => {
  // Esta rota deve ser tratada pelo React Router do frontend
  // Retornar o HTML do React
  if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
  } else {
    res.status(404).json({ message: "Esta rota deve ser acessada pelo frontend em desenvolvimento" });
  }
});

// Criar uma nova disciplina
router.post("/", async (req, res) => {
  try {
    // Remover campos que não devem ser enviados (como id)
    const { id, ...dadosLimpos } = req.body;
    
    const disciplina = disciplinaRepo.create(dadosLimpos);
    const result = await disciplinaRepo.save(disciplina);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    res.status(400).json({ 
      message: error.message, 
      details: error.detail || error.query || 'Erro interno'
    });
  }
});

// Listar todas as disciplinas
router.get("/", async (_, res) => {
  try {
    const disciplinas = await disciplinaRepo.find();
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar disciplinas", error: error.message });
  }
});

// Buscar uma disciplina específica
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const disciplina = await disciplinaRepo.findOneBy({ id: id });
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }
    res.json(disciplina);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar disciplina", error: error.message });
  }
});

// Atualizar uma disciplina
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const disciplina = await disciplinaRepo.findOneBy({ id: id });
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }
    disciplinaRepo.merge(disciplina, req.body);
    const resultado = await disciplinaRepo.save(disciplina);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar disciplina", error: error.message });
  }
});

// Alterar status da disciplina
router.patch("/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const disciplina = await disciplinaRepo.findOneBy({ id: id });
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }
    disciplina.ativo = !disciplina.ativo;
    const resultado = await disciplinaRepo.save(disciplina);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao alterar status da disciplina", error: error.message });
  }
});

module.exports = router; 