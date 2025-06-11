const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Turma = require("../entities/Turma");

const turmaRepository = AppDataSource.getRepository(Turma);

// Listar todas as turmas
router.get("/", async (req, res) => {
  try {
    const turmas = await turmaRepository.find({
      relations: ["disciplina", "local"],
    });
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar turma por ID
router.get("/:id", async (req, res) => {
  try {
    const turma = await turmaRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["disciplina", "local"],
    });
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    res.json(turma);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar nova turma
router.post("/", async (req, res) => {
  try {
    const turma = turmaRepository.create(req.body);
    const result = await turmaRepository.save(turma);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar turma
router.put("/:id", async (req, res) => {
  try {
    const turma = await turmaRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    turmaRepository.merge(turma, req.body);
    const result = await turmaRepository.save(turma);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Excluir turma
router.delete("/:id", async (req, res) => {
  try {
    const turma = await turmaRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    await turmaRepository.remove(turma);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Alterar status da turma
router.patch("/:id/status", async (req, res) => {
  try {
    const turma = await turmaRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    turma.ativo = !turma.ativo;
    const result = await turmaRepository.save(turma);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 