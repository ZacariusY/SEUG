# SEUG - Sistema Escolar Universitário de Gestão

Um sistema completo de gestão escolar desenvolvido com React.js (frontend) e Node.js (backend), utilizando TypeORM para gerenciamento de banco de dados.

## 🚀 Características

- **Frontend moderno** em React.js com interface responsiva
- **Backend robusto** em Node.js com Express
- **Banco de dados** gerenciado com TypeORM
- **Tema escuro/claro** totalmente funcional
- **Interface profissional** com animações e efeitos elegantes
- **Sistema completo** de CRUD para todas as entidades

## 📋 Funcionalidades

### Gerenciamento de Entidades
- ✅ **Alunos**: Cadastro, edição, visualização e desativação
- ✅ **Professores**: Gestão completa com matrícula automática
- ✅ **Disciplinas**: Controle de disciplinas e professores responsáveis
- ✅ **Turmas**: Gestão de turmas com relacionamentos
- ✅ **Locais**: Gerenciamento de salas e espaços
- ✅ **Pesquisa**: Sistema de busca global

### Recursos Técnicos
- 🎨 **Tema Dinâmico**: Alternância entre modo claro e escuro
- 📱 **Design Responsivo**: Interface adaptável a todos os dispositivos
- ⚡ **Performance**: Carregamento rápido e otimizado
- 🔄 **Estados**: Ativação/desativação de registros
- 🔍 **Filtros**: Sistema de pesquisa e ordenação avançado

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
- CORS habilitado

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/seug.git
   cd seug
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
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📁 Estrutura do Projeto

```
SEUG/
├── src/                    # Backend
│   ├── entities/          # Modelos do banco de dados
│   ├── routes/            # Rotas da API
│   ├── database/          # Configuração do banco
│   └── app.js             # Servidor principal
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Context API (Tema)
│   │   └── App.js         # Componente principal
│   └── public/            # Arquivos estáticos
├── public/                # Páginas HTML estáticas (legacy)
├── iniciar_projeto.bat    # Script de inicialização
└── parar_projeto.bat      # Script para parar o projeto
```

## 🎨 Interface

O sistema possui uma interface moderna e profissional com:

- **Cards interativos** com efeitos hover elegantes
- **Bordas animadas** e sombras dinâmicas
- **Botões com efeitos** de brilho e elevação
- **Transições suaves** em todas as interações
- **Tema adaptativo** para melhor experiência do usuário

## 🔧 Configuração

### Banco de Dados
O sistema utiliza SQLite por padrão para desenvolvimento. Para produção, configure a conexão no arquivo de configuração do TypeORM.

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto se necessário para configurações específicas.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para facilitar a gestão escolar.

---

**SEUG** - Sistema Escolar Universitário de Gestão © 2024
