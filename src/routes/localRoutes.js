const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Local = require("../entities/Local");

const localRepository = AppDataSource.getRepository(Local);

// Listar todos os locais
router.get("/", async (req, res) => {
  try {
    const locais = await localRepository.find({
      relations: ["turmas"],
    });
    res.json(locais);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar local por ID
router.get("/:id", async (req, res) => {
  try {
    const local = await localRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["turmas"],
    });
    if (!local) {
      return res.status(404).json({ message: "Local não encontrado" });
    }
    res.json(local);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar novo local
router.post("/", async (req, res) => {
  try {
    const local = localRepository.create(req.body);
    const result = await localRepository.save(local);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar local
router.put("/:id", async (req, res) => {
  try {
    const local = await localRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!local) {
      return res.status(404).json({ message: "Local não encontrado" });
    }
    localRepository.merge(local, req.body);
    const result = await localRepository.save(local);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Excluir local
router.delete("/:id", async (req, res) => {
  try {
    const local = await localRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!local) {
      return res.status(404).json({ message: "Local não encontrado" });
    }
    await localRepository.remove(local);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Alterar status do local
router.patch("/:id/status", async (req, res) => {
  try {
    const local = await localRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (!local) {
      return res.status(404).json({ message: "Local não encontrado" });
    }
    local.ativo = !local.ativo;
    const result = await localRepository.save(local);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 