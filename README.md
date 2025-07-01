# Sistema Web de Gerenciamento para Clínica Odontológica v0.1.0

Projeto desenvolvido com Node.js + Express no backend e React + Vite no frontend, para gerenciar pacientes(Módulo 1: cadastro de pacientes).

---

## Estrutura do Projeto

- `/backend` — API REST com Node.js e Express (conexão futura com banco MySQL)
- `/frontend` — Aplicação React usando Vite

---

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes)

---

## Como executar

### Backend
1. Abra o terminal na pasta `/backend`.
2. Instale as dependências: npm install
3. Inicie o servidor: node index.js
O backend rodará na porta 3001 (http://localhost:3001)

### Frontend
1. Abra o terminal na pasta `/frontend`.
2. Instale as dependências: npm install
3. Inicie o servidor de desenvolvimento: npm run dev
O frontend rodará geralmente na porta 5173 (exemplo: http://localhost:5173)
O frontend faz requisições ao backend no endereço http://localhost:3001