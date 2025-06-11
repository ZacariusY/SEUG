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
app.use(express.static(path.join(__dirname, "../public")));

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco conectado");

    app.use("/alunos", alunoRoutes);
    app.use("/professores", professorRoutes);
    app.use("/disciplinas", disciplinaRoutes);
    app.use("/turmas", turmaRoutes);
    app.use("/locais", localRoutes);

    app.listen(3001, () => console.log("🚀 Servidor rodando na porta 3001"));
  })
  .catch((error) => console.error("Erro ao conectar banco:", error));
