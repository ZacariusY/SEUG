const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TurmaAluno",
  tableName: "turmaaluno",
  columns: {
    id: { primary: true, type: "int", generated: true },
    turmaId: { type: "int" },
    alunoId: { type: "int" }
  },
  relations: {
    turma: {
      type: "many-to-one",
      target: "Turma",
      joinColumn: { name: "turmaId" },
      onDelete: "CASCADE",
    },
    aluno: {
      type: "many-to-one",
      target: "Aluno",
      joinColumn: { name: "alunoId" },
      onDelete: "CASCADE",
    },
  },
});
