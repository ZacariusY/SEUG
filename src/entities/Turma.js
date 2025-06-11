const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Turma",
  tableName: "turma",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar", nullable: false },
    diaSemana: { type: "varchar", nullable: true },
    horarioInicio: { type: "time", nullable: true },
    horarioTermino: { type: "time", nullable: true },
    disciplinaId: { type: "int" },
    localId: { type: "int" },
    ativo: { type: "boolean", default: true, nullable: false }
  },
  relations: {
    disciplina: {
      type: "many-to-one",
      target: "Disciplina",
      joinColumn: { name: "disciplinaId" },
      onDelete: "SET NULL",
    },
    local: {
      type: "many-to-one",
      target: "Local",
      joinColumn: { name: "localId" },
      onDelete: "SET NULL",
    },
    turmaAlunos: {
      type: "one-to-many",
      target: "TurmaAluno",
      inverseSide: "turma",
    },
  },
});
