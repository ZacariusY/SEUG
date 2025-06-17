# 🐳 SEUG - Deployment com Docker

Este documento explica como construir e executar o projeto SEUG usando Docker.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 1.29 ou superior)

## 🚀 Opção 1: Usando Docker Compose (Recomendado)

### Construir e executar:
```bash
docker-compose up --build
```

### Executar em background:
```bash
docker-compose up -d --build
```

### Parar o container:
```bash
docker-compose down
```

### Ver logs:
```bash
docker-compose logs -f seug-app
```

## 🛠️ Opção 2: Usando Docker diretamente

### 1. Construir a imagem:
```bash
docker build -t seug-sistema .
```

### 2. Executar o container:
```bash
docker run -d \
  --name seug-app \
  -p 3001:3001 \
  -v seug-data:/app/data \
  seug-sistema
```

### 3. Ver logs:
```bash
docker logs -f seug-app
```

### 4. Parar o container:
```bash
docker stop seug-app
docker rm seug-app
```

## 🌐 Acessando a aplicação

Após iniciar o container, acesse:
- **Frontend**: http://localhost:3001
- **API**: http://localhost:3001/alunos (exemplo de endpoint)

## 📊 Características da imagem Docker

- **Base**: Node.js 18 Alpine (imagem leve)
- **Multi-stage build**: Otimizada para produção
- **Segurança**: Executa com usuário não-root
- **Persistência**: Volume para banco de dados SQLite
- **Health check**: Monitoramento automático de saúde
- **Tamanho**: ~100MB (aproximadamente)

## 🔧 Configurações de ambiente

As seguintes variáveis de ambiente são configuradas automaticamente:
- `NODE_ENV=production`
- `PORT=3001`

## 📁 Estrutura de volumes

- `/app/data`: Diretório para persistir o banco de dados SQLite

## 🛡️ Segurança

- Container executa com usuário não-root (`seug`)
- Arquivos sensíveis excluídos via `.dockerignore`
- Health check configurado para monitoramento

## 🔍 Troubleshooting

### Container não inicia:
```bash
docker-compose logs seug-app
```

### Limpar volumes (ATENÇÃO: apaga dados):
```bash
docker-compose down -v
```

### Reconstruir imagem:
```bash
docker-compose build --no-cache
```

### Acessar shell do container:
```bash
docker exec -it seug-sistema sh
```

## 📦 Comandos úteis

### Ver imagens:
```bash
docker images | grep seug
```

### Ver containers:
```bash
docker ps -a | grep seug
```

### Limpar recursos não utilizados:
```bash
docker system prune -f
```

## 🏗️ Arquitetura do Container

```
┌─────────────────────────────────────┐
│           SEUG Container            │
├─────────────────────────────────────┤
│  Frontend React (Build estático)   │
│  ↓ Servido pelo Express             │
│  Backend Node.js + Express          │
│  ↓ Conecta ao                       │
│  Banco SQLite (Volume persistente)  │
└─────────────────────────────────────┘
```

## 📝 Notas importantes

1. **Primeira execução**: O banco será criado automaticamente
2. **Dados**: Persistidos no volume `seug-data`
3. **Porta**: Aplicação roda na porta 3001
4. **Logs**: Disponíveis via `docker-compose logs`
5. **Updates**: Reconstrua a imagem após mudanças no código 