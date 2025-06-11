const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Aluno",
  tableName: "aluno",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar" },
    email: { type: "varchar" },
    ativo: { type: "boolean", default: true }
  },
  relations: {
    turmas: {
      type: "many-to-many",
      target: "Turma",
      joinTable: {
        name: "turma_aluno",
        joinColumn: { name: "alunoId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "turmaId", referencedColumnName: "id" }
      }
    }
  },
});
