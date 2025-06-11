const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Local",
  tableName: "local",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar", nullable: false },
    local: { type: "varchar", nullable: true },
    capacidade: { type: "int", nullable: true },
    descricao: { type: "varchar" },
    ativo: { type: "boolean", default: true, nullable: false }
  },
  relations: {
    turmas: {
      type: "one-to-many",
      target: "Turma",
      inverseSide: "local",
    },
  },
});
