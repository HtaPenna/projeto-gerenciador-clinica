# Sistema Web de Gerenciamento para Clínica Odontológica 0.6.3

Projeto desenvolvido com Node.js + Express no backend e React + Vite no frontend, para gerenciar pacientes e agendamento de consultas (Módulo 2: agendamento).

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

---

## Descrição das alterações

### Backend
- Atualização: padronização dos nomes dos campos nos models e banco de dados (paciente, eventos);
- Criação: do model, controller e routes do Dentista (Função de cadastrar dentista);
- Criação: do model, controller e routes do Procedimento (Função de cadastrar procedimentos padrão no catálogo de procedimentos para serem utilizados como referência em consultas);
- Criação: do model, controller e routes de Categoria do procedimento (Função de cadastrar diferentes categorias para selecionar o tipo do procedimento);
- Criação: do model, controller e routes do Tratamento (Função de cadastrar tratamentos pdrão, sem procedimentos especificados, no catálogo de tratamentos para serem utilizados como referência em consultas);
- Criação e Atualização (Evento x Procedimento): novas routes de eventos (Função de criar, adicionar, alterar e excluir associação entre procedimentos e consultas);
- Criação e Atualização (Paciente x Tratamento): novas routes de pacientes (Função de criar, alterar e excluir associação entre paciente e tratamento existentes, mostrar todos os tratamentos de um paciente, criar um tratamento específico a um paciente);
- Criação (Tratamento x Procedimento): novas routes de tratamentos (Função de criar, alterar e excluir associação entre tratamento e procedimento existentes, mostrar todos os procedimentos padrão de um tratamento, criar um tratamento com procedimentos especificados).

### Frontend
- Atualização em Pacientes: o forms de cadastro de paciente abre apenas quando o botão 'Novo Paciente'  é pressionado, sem mostrar a lista de pacientes existentes;
- Atualização em Pacientes: a lista de pacientes existentes é a tela principal da aba de Pacientes;
- Atualização: navbar no topo, para sobrepor a agenda;
- Criação: do modal para configurações da agenda (dentista consegue selecionar horário de início e fim do expediente);
- Atualização em Agendamento: é possivel selecionar o dentista, e a agenda mostra os eventos associados a ele, os eventos criados na agenda também são salvos associados ao dentista selecionado;
- Atualização em Agendamento: os eventos podem ser criados como 'bloqueados' para os horários indisponíveis naagenda do dentista ou como consultas com status 'confirmada' ou 'pendente';
- Atualização em Agendamento: na criação de uma consulta pode selecionar o paciente a ser atendido, pois mostra a lista de pacientes cadastrados conforme é digitado o nome;
- Atualização em Agendamento: a consulta é salva e apresentada com o nome do paciente como título.