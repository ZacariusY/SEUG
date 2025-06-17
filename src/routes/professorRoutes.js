const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Professor = require("../entities/Professor");

const professorRepository = AppDataSource.getRepository(Professor);

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

// Listar todos os professores
router.get("/", async (req, res) => {
  try {
    const professores = await professorRepository.find({
      relations: ["disciplinas"],
    });
    res.json(professores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar professor por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const professor = await professorRepository.findOne({
      where: { id: id },
      relations: ["disciplinas"],
    });
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    res.json(professor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar novo professor
router.post("/", async (req, res) => {
  try {
    // Remover campos que não devem ser enviados (como id)
    const { id, ...dadosLimpos } = req.body;
    
    const professor = professorRepository.create(dadosLimpos);
    const result = await professorRepository.save(professor);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar professor:", error);
    res.status(400).json({ 
      message: error.message, 
      details: error.detail || error.query || 'Erro interno'
    });
  }
});

// Atualizar professor
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const professor = await professorRepository.findOne({
      where: { id: id },
    });
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    professorRepository.merge(professor, req.body);
    const result = await professorRepository.save(professor);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Excluir professor
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const professor = await professorRepository.findOne({
      where: { id: id },
    });
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    await professorRepository.remove(professor);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Alterar status do professor
router.patch("/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const professor = await professorRepository.findOne({
      where: { id: id },
    });
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    professor.ativo = !professor.ativo;
    const result = await professorRepository.save(professor);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 