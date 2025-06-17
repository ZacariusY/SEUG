# SEUG - Configuração PostgreSQL

Este projeto está configurado para usar PostgreSQL como banco de dados.

## 🚀 Executando com Docker (Recomendado)

### Pré-requisitos
- Docker e Docker Compose instalados

### Iniciar o projeto
```bash
# Construir e iniciar todos os serviços (PostgreSQL + Aplicação)
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Parar os serviços
docker-compose down
```

### Serviços disponíveis
- **Aplicação**: http://localhost:3001
- **PostgreSQL**: localhost:5432
  - Database: `seug`
  - Username: `postgres` 
  - Password: `644004`

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- PostgreSQL instalado localmente

### Configuração
1. **Instalar PostgreSQL** localmente (se não usar Docker)

2. **Criar banco de dados**:
```sql
CREATE DATABASE seug;
```

3. **Configurar variáveis de ambiente** (opcional):
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as configurações se necessário
```

4. **Instalar dependências**:
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

5. **Executar o projeto**:
```bash
# Windows
iniciar_projeto.bat

# Ou manualmente:
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend  
cd frontend && npm start
```

## 📝 Variáveis de Ambiente

### Desenvolvimento Local
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=644004
DB_DATABASE=seug
NODE_ENV=development
PORT=3001
```

### Docker/Produção
As variáveis são definidas automaticamente no `docker-compose.yml`.

## 🔧 Comandos Docker Úteis

```bash
# Ver status dos containers
docker-compose ps

# Acessar logs do PostgreSQL
docker-compose logs postgres

# Acessar logs da aplicação
docker-compose logs seug-app

# Executar comandos no container PostgreSQL
docker-compose exec postgres psql -U postgres -d seug

# Limpar volumes (CUIDADO: remove dados!)
docker-compose down -v
```

## 📊 Conectando ao PostgreSQL

### Via aplicação cliente (pgAdmin, DBeaver, etc.)
- Host: `localhost`
- Port: `5432`
- Database: `seug`
- Username: `postgres`
- Password: `644004`

### Via linha de comando
```bash
# Se PostgreSQL instalado localmente
psql -h localhost -p 5432 -U postgres -d seug

# Via Docker
docker-compose exec postgres psql -U postgres -d seug
```

## 🏗️ Estrutura do Banco

O TypeORM está configurado com `synchronize: true`, então as tabelas são criadas automaticamente baseadas nas entidades:

- `alunos`
- `professores` 
- `disciplinas`
- `turmas`
- `locais`
- `turma_alunos` (relacionamento)

## ⚠️ Notas Importantes

1. **Em produção**, desative `synchronize: true` e use migrations
2. **Backup**: Os dados ficam no volume Docker `postgres_data`
3. **Performance**: Configure adequadamente para produção
4. **Segurança**: Altere as senhas padrão em produção 