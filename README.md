# SEUG - Sistema Escolar Universitário de Gestão

Um sistema completo de gestão escolar desenvolvido com React.js (frontend) e Node.js (backend), utilizando TypeORM para gerenciamento de banco de dados.

## 🚀 Características

- **Frontend moderno** em React.js com interface responsiva
- **Backend robusto** em Node.js com Express
- **API RESTful** com prefixo `/api/` para organização
- **Banco de dados** gerenciado com TypeORM
- **Tema escuro/claro** totalmente funcional
- **Interface profissional** com animações e efeitos elegantes
- **Sistema completo** de CRUD para todas as entidades
- **Roteamento otimizado** com React Router sem conflitos

## 📋 Funcionalidades

### Gerenciamento de Entidades
- ✅ **Alunos**: Cadastro, edição, visualização e desativação
- ✅ **Professores**: Gestão completa com validação de CPF
- ✅ **Disciplinas**: Controle de disciplinas e professores responsáveis
- ✅ **Turmas**: Gestão de turmas com relacionamentos
- ✅ **Locais**: Gerenciamento de salas e espaços
- ✅ **Pesquisa**: Sistema de busca global
- ✅ **Gerenciamento de Alunos por Turma**: Interface completa para matricular/remover alunos

### Recursos Técnicos
- 🎨 **Tema Dinâmico**: Alternância entre modo claro e escuro
- 📱 **Design Responsivo**: Interface adaptável a todos os dispositivos
- ⚡ **Performance**: Carregamento rápido e otimizado
- 🔄 **Estados**: Ativação/desativação de registros
- 🔍 **Filtros**: Sistema de pesquisa e ordenação avançado
- 🛡️ **Validação**: Validação completa de formulários
- 🔗 **API Organizada**: Todas as rotas com prefixo `/api/`

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js 18
- React Router DOM
- Axios para requisições HTTP
- Bootstrap 5 para estilização
- CSS3 com animações customizadas

### Backend
- Node.js
- Express.js
- TypeORM
- SQLite (desenvolvimento)
- PostgreSQL (produção)
- CORS habilitado

### DevOps
- Docker & Docker Compose
- Scripts automatizados de inicialização
- Dockerfile otimizado para produção

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- Docker & Docker Compose (recomendado)
- npm ou yarn

### 🐳 Execução com Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ZacariusY/SEUG.git
   cd SEUG
   ```

2. **Execute com Docker**
   ```bash
   # Windows
   iniciar_projeto.bat
   
   # Linux/Mac
   docker-compose up --build -d
   ```

3. **Acesse o sistema**
   - **Frontend**: http://localhost:3001
   - **API**: http://localhost:3001/api/

### 💻 Execução Manual (Desenvolvimento)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ZacariusY/SEUG.git
   cd SEUG
   ```

2. **Instale as dependências do backend**
   ```bash
   npm install
   ```

3. **Instale as dependências do frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Execute o projeto**
   ```bash
   # Windows
   iniciar_projeto.bat
   
   # Ou manualmente:
   # Terminal 1 - Backend
   npm start
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

5. **Acesse o sistema**
   - Frontend: http://localhost:3000 (desenvolvimento)
   - Backend API: http://localhost:3001/api/

## 📁 Estrutura do Projeto

```
SEUG/
├── src/                    # Backend
│   ├── entities/          # Modelos do banco de dados
│   ├── routes/            # Rotas da API (prefixo /api/)
│   ├── database/          # Configuração do banco
│   └── app.js             # Servidor principal
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Context API (Tema)
│   │   └── App.js         # Componente principal
│   └── public/            # Arquivos estáticos
├── public/                # Páginas HTML estáticas (legacy)
├── docker-compose.yml     # Configuração Docker
├── Dockerfile             # Build da aplicação
├── iniciar_projeto.bat    # Script de inicialização
└── parar_projeto.bat      # Script para parar o projeto
```

## 🎯 API Endpoints

### Base URL: `/api/`

- **Alunos**: `/api/alunos`
- **Professores**: `/api/professores`
- **Disciplinas**: `/api/disciplinas`
- **Turmas**: `/api/turmas`
- **Locais**: `/api/locais`

### Endpoints Especiais

- **Gerenciar Alunos da Turma**: `GET/POST/DELETE /api/turmas/:id/alunos`
- **Alterar Status**: `PATCH /api/{entidade}/:id/status`

## 🎨 Interface

O sistema possui uma interface moderna e profissional com:

- **Cards interativos** com efeitos hover elegantes
- **Bordas animadas** e sombras dinâmicas
- **Botões com efeitos** de brilho e elevação
- **Transições suaves** em todas as interações
- **Tema adaptativo** para melhor experiência do usuário
- **Formulários validados** com feedback visual
- **Tabelas responsivas** com ordenação e filtros

## 🔧 Configuração

### Banco de Dados
- **Desenvolvimento**: SQLite (automático)
- **Produção**: PostgreSQL via Docker

### Docker

O sistema utiliza Docker Compose para orquestração:
- **Aplicação**: Node.js + React (build de produção)
- **Banco**: PostgreSQL 15
- **Rede**: Isolada para segurança

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto se necessário:
```env
NODE_ENV=production
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=seug_user
DB_PASSWORD=seug_password
DB_DATABASE=seug_db
```

## 🐛 Correções Recentes

### v2.0 - Correção Completa do Roteamento

- ✅ **Implementado prefixo `/api/`** para todas as rotas do backend
- ✅ **Resolvido conflito** entre Express routes e React Router
- ✅ **Corrigido problema** de tela em branco em rotas aninhadas
- ✅ **Adicionadas rotas específicas** `/novo` para evitar conflitos
- ✅ **Atualizadas todas as URLs** do frontend
- ✅ **Sistema de gerenciamento** de alunos por turma funcionando

### Bugs Resolvidos

- ❌ Tela em branco ao acessar `/turmas/:id/alunos`
- ❌ Erro "ID inválido" ao acessar rotas `/novo`
- ❌ Connection refused em URLs específicas
- ❌ Conflitos entre rotas de API e React Router

## 🧪 Testes

### Funcionalidades Testadas

- ✅ Cadastro e edição de todas as entidades
- ✅ Sistema de busca e filtros
- ✅ Gerenciamento de alunos por turma
- ✅ Ativação/desativação de registros
- ✅ Navegação entre páginas
- ✅ Tema claro/escuro
- ✅ Responsividade mobile

### URLs Principais para Teste

- `http://localhost:3001/` → Página inicial
- `http://localhost:3001/alunos/novo` → Cadastrar aluno
- `http://localhost:3001/turmas/:id/alunos` → Gerenciar alunos da turma
- `http://localhost:3001/pesquisa` → Sistema de busca

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para facilitar a gestão escolar.

### �� Recursos Avançados

- **Validação de CPF** para professores
- **Códigos únicos** para disciplinas
- **Capacidade de salas** com validação
- **Horários de turma** com verificação de conflitos
- **Sistema de matricula** aluno-turma
- **Pesquisa global** em todas as entidades

---

**SEUG** - Sistema Escolar Universitário de Gestão © 2024

🚀 **Status**: Totalmente Funcional | �� **API**: `/api/` | 🎨 **Interface**: React Router
