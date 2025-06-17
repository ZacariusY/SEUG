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

// ROTA DE TESTE - REMOVER DEPOIS (DEVE VIR ANTES DE /:id)
router.post("/teste", async (req, res) => {
  try {
    console.log("=== TESTE CRIAÇÃO ALUNO ===");
    console.log("Body recebido:", JSON.stringify(req.body, null, 2));
    
    // Teste 1: Criar sem salvar
    const aluno = alunoRepository.create({
      nome: "Teste Manual",
      email: "teste@teste.com",
      ativo: true
    });
    console.log("Aluno criado na memória:", JSON.stringify(aluno, null, 2));
    
    // Teste 2: Tentar salvar
    const result = await alunoRepository.save(aluno);
    console.log("Aluno salvo no banco:", JSON.stringify(result, null, 2));
    
    res.json({ success: true, result });
  } catch (error) {
    console.error("ERRO TESTE:", error.message);
    console.error("Stack completo:", error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Buscar turmas de um aluno (ESPECÍFICA - DEVE VIR ANTES DE /:id)
router.get("/:id/turmas", async (req, res) => {
  try {
    const alunoId = parseInt(req.params.id);
    if (isNaN(alunoId)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
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

// Buscar aluno por ID (DEVE VIR APÓS ROTAS ESPECÍFICAS)
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      console.log("⚠️  Tentativa de acessar aluno com ID inválido:", req.params.id, "URL:", req.originalUrl);
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const aluno = await alunoRepository.findOne({
      where: { id: id },
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
    const aluno = alunoRepository.create({
      nome: req.body.nome,
      email: req.body.email,
      ativo: true
    });
    
    const result = await alunoRepository.save(aluno);
    res.status(201).json(result);
  } catch (error) {
    console.error("ERRO ALUNO:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Atualizar aluno
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const aluno = await alunoRepository.findOne({
      where: { id: id },
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const aluno = await alunoRepository.findOne({
      where: { id: id },
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const aluno = await alunoRepository.findOne({
      where: { id: id },
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

module.exports = router; 