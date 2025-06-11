const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Professor",
  tableName: "professor",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar", nullable: false },
    cpf: { type: "varchar", length: 11, nullable: true, unique: true },
    titulacao: { type: "varchar", nullable: true },
    departamento: { type: "varchar" },
    ativo: { type: "boolean", default: true, nullable: false }
  },
  relations: {
    disciplinas: {
      type: "one-to-many",
      target: "Disciplina",
      inverseSide: "professor",
    },
  },
});
