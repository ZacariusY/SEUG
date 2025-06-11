const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Professor = require("../entities/Professor");

const professorRepository = AppDataSource.getRepository(Professor);

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
    const professor = await professorRepository.findOne({
      where: { id: parseInt(req.params.id) },
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
    // Gerar matrícula automática
    const ultimoProfessor = await professorRepository.find({
      order: { id: "DESC" },
      take: 1
    });
    let novoNumero = 1;
    if (ultimoProfessor.length > 0 && ultimoProfessor[0].matricula) {
      const match = ultimoProfessor[0].matricula.match(/PROF-(\d+)/);
      if (match) {
        novoNumero = parseInt(match[1], 10) + 1;
      }
    }
    const matricula = `PROF-${String(novoNumero).padStart(4, '0')}`;
    const professor = professorRepository.create({ ...req.body, matricula });
    const result = await professorRepository.save(professor);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar professor
router.put("/:id", async (req, res) => {
  try {
    const professor = await professorRepository.findOne({
      where: { id: parseInt(req.params.id) },
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
    const professor = await professorRepository.findOne({
      where: { id: parseInt(req.params.id) },
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
    const professor = await professorRepository.findOne({
      where: { id: parseInt(req.params.id) },
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