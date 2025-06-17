const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./database/data-source");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const localRoutes = require("./routes/localRoutes");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend React (produção)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
} else {
  // Desenvolvimento - servir arquivos da pasta public
  app.use(express.static(path.join(__dirname, "../public")));
}

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco conectado");

    // Rotas da API
    app.use("/alunos", alunoRoutes);
    app.use("/professores", professorRoutes);
    app.use("/disciplinas", disciplinaRoutes);
    app.use("/turmas", turmaRoutes);
    app.use("/locais", localRoutes);

    // Em produção, servir o React app para todas as rotas não-API
    if (process.env.NODE_ENV === 'production') {
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
      });
    }

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
  })
  .catch((error) => console.error("Erro ao conectar banco:", error));
