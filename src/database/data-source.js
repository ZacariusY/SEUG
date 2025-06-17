const { DataSource } = require("typeorm");

// Importe suas entidades
const Aluno = require("../entities/Aluno");
const Professor = require("../entities/Professor.js");
const Turma = require("../entities/Turma");
const Disciplina = require("../entities/Disciplina");
const Local = require("../entities/Local");
const TurmaAluno = require("../entities/TurmaAluno");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "644004",
  database: process.env.DB_DATABASE || "seug",
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [Aluno, Professor, Turma, Disciplina, Local, TurmaAluno], // Apenas as entidades desejadas
});

module.exports = { AppDataSource };
