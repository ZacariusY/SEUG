const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Disciplina",
  tableName: "disciplina",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar", nullable: false },
    codigo: { type: "varchar", nullable: true },
    periodo: { type: "varchar", nullable: true },
    professorId: { type: "int" },
    ativo: { type: "boolean", default: true, nullable: false }
  },
  relations: {
    professor: {
      type: "many-to-one",
      target: "Professor",
      joinColumn: { name: "professorId" },
      onDelete: "SET NULL",
    },
    turmas: {
      type: "one-to-many",
      target: "Turma",
      inverseSide: "disciplina",
    },
  },
});
