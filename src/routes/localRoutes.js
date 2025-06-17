const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../database/data-source");
const Local = require("../entities/Local");

const localRepository = AppDataSource.getRepository(Local);

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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const local = await localRepository.findOne({
      where: { id: id },
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
    // Remover campos que não devem ser enviados (como id)
    const { id, ...dadosLimpos } = req.body;
    
    const local = localRepository.create(dadosLimpos);
    const result = await localRepository.save(local);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar local:", error);
    res.status(400).json({ 
      message: error.message, 
      details: error.detail || error.query || 'Erro interno'
    });
  }
});

// Atualizar local
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const local = await localRepository.findOne({
      where: { id: id },
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const local = await localRepository.findOne({
      where: { id: id },
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const local = await localRepository.findOne({
      where: { id: id },
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