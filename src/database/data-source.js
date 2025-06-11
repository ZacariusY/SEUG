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
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "644004",
  database: "seug",
  synchronize: true,
  logging: false,
  entities: [Aluno, Professor, Turma, Disciplina, Local, TurmaAluno], // Apenas as entidades desejadas
});

module.exports = { AppDataSource };
