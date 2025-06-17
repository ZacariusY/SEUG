# Multi-stage build para otimizar a imagem final
FROM node:18-alpine AS frontend-build

# Definir diretório de trabalho para o frontend
WORKDIR /app/frontend

# Copiar package.json e package-lock.json do frontend
COPY frontend/package*.json ./

# Instalar dependências do frontend
RUN npm ci --only=production

# Copiar código fonte do frontend
COPY frontend/ ./

# Build do frontend para produção
RUN npm run build

# Stage 2: Backend + Frontend buildado
FROM node:18-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S seug -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json do backend
COPY package*.json ./

# Instalar dependências do backend
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte do backend
COPY src/ ./src/
COPY public/ ./public/

# Copiar build do frontend do stage anterior
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Criar diretório para o banco de dados SQLite
RUN mkdir -p /app/data && chown -R seug:nodejs /app

# Mudar para usuário não-root
USER seug

# Expor a porta 3001
EXPOSE 3001

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar a aplicação
CMD ["node", "src/app.js"] 