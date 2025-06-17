const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Turma = require("../entities/Turma");
const TurmaAluno = require("../entities/TurmaAluno");
const Aluno = require("../entities/Aluno");

const turmaRepository = AppDataSource.getRepository(Turma);
const turmaAlunoRepository = AppDataSource.getRepository(TurmaAluno);
const alunoRepository = AppDataSource.getRepository(Aluno);

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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const turma = await turmaRepository.findOne({
      where: { id: id },
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
    // Remover campos que não devem ser enviados (como id)
    const { id, ...dadosLimpos } = req.body;
    
    const turma = turmaRepository.create(dadosLimpos);
    const result = await turmaRepository.save(turma);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    res.status(400).json({ 
      message: error.message, 
      details: error.detail || error.query || 'Erro interno'
    });
  }
});

// Atualizar turma
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const turma = await turmaRepository.findOne({
      where: { id: id },
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const turma = await turmaRepository.findOne({
      where: { id: id },
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const turma = await turmaRepository.findOne({
      where: { id: id },
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

// Listar alunos de uma turma
router.get("/:id/alunos", async (req, res) => {
  try {
    const turmaId = parseInt(req.params.id);
    if (isNaN(turmaId)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const turmaAlunos = await turmaAlunoRepository.find({
      where: { turmaId },
      relations: ["aluno"]
    });
    
    const alunos = turmaAlunos.map(ta => ta.aluno);
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adicionar aluno à turma
router.post("/:id/alunos", async (req, res) => {
  try {
    const turmaId = parseInt(req.params.id);
    if (isNaN(turmaId)) {
      return res.status(400).json({ message: "ID da turma inválido" });
    }
    
    const { alunoId } = req.body;
    const alunoIdParsed = parseInt(alunoId);
    if (isNaN(alunoIdParsed)) {
      return res.status(400).json({ message: "ID do aluno inválido" });
    }
    
    // Verificar se a turma existe
    const turma = await turmaRepository.findOne({
      where: { id: turmaId }
    });
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    
    // Verificar se o aluno existe
    const aluno = await alunoRepository.findOne({
      where: { id: alunoIdParsed }
    });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    
    // Verificar se o aluno já está na turma
    const existeRelacao = await turmaAlunoRepository.findOne({
      where: { turmaId, alunoId: alunoIdParsed }
    });
    if (existeRelacao) {
      return res.status(400).json({ message: "Aluno já está cadastrado nesta turma" });
    }
    
    // Criar a relação
    const turmaAluno = turmaAlunoRepository.create({
      turmaId,
      alunoId: alunoIdParsed
    });
    
    const result = await turmaAlunoRepository.save(turmaAluno);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remover aluno da turma
router.delete("/:id/alunos/:alunoId", async (req, res) => {
  try {
    const turmaId = parseInt(req.params.id);
    const alunoId = parseInt(req.params.alunoId);
    
    if (isNaN(turmaId)) {
      return res.status(400).json({ message: "ID da turma inválido" });
    }
    
    if (isNaN(alunoId)) {
      return res.status(400).json({ message: "ID do aluno inválido" });
    }
    
    const turmaAluno = await turmaAlunoRepository.findOne({
      where: { turmaId, alunoId }
    });
    
    if (!turmaAluno) {
      return res.status(404).json({ message: "Aluno não encontrado nesta turma" });
    }
    
    await turmaAlunoRepository.remove(turmaAluno);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 