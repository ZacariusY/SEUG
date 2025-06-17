const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Aluno = require("../entities/Aluno");
const TurmaAluno = require("../entities/TurmaAluno");

const alunoRepository = AppDataSource.getRepository(Aluno);
const turmaAlunoRepository = AppDataSource.getRepository(TurmaAluno);

// Listar todos os alunos
router.get("/", async (req, res) => {
  try {
    const alunos = await alunoRepository.find({
      relations: ["turmas"],
    });
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar aluno por ID
router.get("/:id", async (req, res) => {
  try {
    const aluno = await alunoRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["turmas"],
    });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar novo aluno
router.post("/", async (req, res) => {
  try {
    const aluno = alunoRepository.create(req.body);
    const result = await alunoRepository.save(aluno);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar aluno
router.put("/:id", async (req, res) => {
  try {
    const aluno = await alunoRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    alunoRepository.merge(aluno, req.body);
    const result = await alunoRepository.save(aluno);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Excluir aluno
router.delete("/:id", async (req, res) => {
  try {
    const aluno = await alunoRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    await alunoRepository.remove(aluno);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Alterar status do aluno
router.patch("/:id/status", async (req, res) => {
  try {
    const aluno = await alunoRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    aluno.ativo = !aluno.ativo;
    const result = await alunoRepository.save(aluno);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Buscar turmas de um aluno
router.get("/:id/turmas", async (req, res) => {
  try {
    const alunoId = parseInt(req.params.id);
    const turmasAluno = await turmaAlunoRepository.find({
      where: { alunoId },
      relations: ["turma", "turma.disciplina", "turma.local"]
    });
    
    const turmas = turmasAluno.map(ta => ta.turma);
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 