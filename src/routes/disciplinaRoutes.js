const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Disciplina = require("../entities/Disciplina");

const disciplinaRepo = AppDataSource.getRepository("Disciplina");

// Criar uma nova disciplina
router.post("/", async (req, res) => {
  try {
    const disciplina = disciplinaRepo.create(req.body);
    await disciplinaRepo.save(disciplina);
    res.status(201).json(disciplina);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar disciplina", error: error.message });
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
    const disciplina = await disciplinaRepo.findOneBy({ id: req.params.id });
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
    const disciplina = await disciplinaRepo.findOneBy({ id: req.params.id });
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
    const disciplina = await disciplinaRepo.findOneBy({ id: req.params.id });
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