##  Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Integrações](#integrações)
- [Entidades Integradas](#entidades-integradas)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Endpoints Principais](#endpoints-principais)
- [Imagens / Screenshots](#imagens-e-ícones)
- [Integrantes](#integrantes)
- [Links Importantes](#links-importantes)
- [Contato](#contato)

#  ArrumAi – Reformas & Obras Inteligentes

##  Sobre o Projeto

O projeto ArrumAi foi desenvolvido nas disciplinas integradas da GS – Front-End Design Engineering da FIAP.

O objetivo é conectar clientes a profissionais de obras, reformas e serviços gerais de forma rápida, eficiente e segura — proporcionando acessibilidade, praticidade e transparência para ambos os lados.

Durante a GS, o sistema foi reestruturado para utilizar React + Vite + TypeScript, implementando uma SPA (Single Page Application) moderna, performática e responsiva.

A aplicação é totalmente integrada à API em Java (Domain Driven Design) hospedada no Render, garantindo CRUD completo para todas as entidades do sistema, incluindo Clientes, Contratados, Pagamentos, Seguros, Serviços e Feedbacks.

---

##  Tecnologias Utilizadas
-  **React + Vite + TypeScript** → estrutura moderna e tipada  
-  **TailwindCSS** → estilização e responsividade  
-  **React Router DOM** → navegação SPA  
-  **Fetch API** → consumo da API Java (CRUD completo)  
-  **Git / GitHub / GitFlow** → versionamento e colaboração da equipe  

---

##  Integrações
O projeto consome endpoints da **API em Java hospedada no Render**, realizando operações **CRUD completas** com integração direta ao banco de dados Oracle.

---

### Entidades Integradas:
- Clientes  
- Contratados  
- Serviços  
- Pagamentos  
- Seguros 
- Feedbacks  

---

## Instalação

# 1. Clone o repositório
git clone https://github.com/brunoferr10/GS_Front-End.git

# 2. Acesse a pasta
cd GS_Front-End

# 3. Instale as dependências
npm install

# 4. Rode o projeto
npm run dev

---

## Como Usar

# Login

-Use o login de testes:
-E-mail: admin@arrumai.com
-Senha: 123456

# Navegação

-Ao entrar, o usuário tem acesso a:

-Clientes
-Contratados
-Serviços
-Pagamentos
-Seguros
-Feedbacks

Todos com CRUD 100% funcional.

# Responsividade

Menu responsivo com ícones em telas pequenas

Layout adaptativo (XS → XL)

Tema escuro e claro com persistência

---

##  Estrutura de Pastas

ARRUMAI-FRONTEND/
│
├── src/                     # Código-fonte principal
│ │
│ ├── assets/                # Imagens e ícones do projeto
│ │ ├── Bruno.jpeg
│ │ ├── Gabriel.jpeg
│ │ ├── leonardo.jpeg
│ │ ├── logo.jpeg
│ │ └── fotoHome.jpeg
│ │
│ ├── components/            # Componentes reutilizáveis
│ │ ├── Header.tsx
│ │ ├── HeaderPainel.tsx
│ │ ├── Footer.tsx
│ │ ├── ThemeSwitch.tsx
│ │ └── PrivateRoute.tsx
│ │
│ ├── contexts/              # Contextos globais da aplicação
│ │ ├── AuthContext.tsx      # Autenticação + login
│ │ └── ThemeContext.tsx     # Tema (dark/light)
│ │
│ ├── pages/                 # Páginas principais
│ │ ├── Home/                # Página inicial (Landing Page)
│ │ │ └── Home.tsx
│ │ │
│ │ ├── Integrantes/
│ │ │ └── Integrantes.tsx
│ │ │
│ │ ├── Sobre/
│ │ │ └── Sobre.tsx
│ │ │
│ │ ├── FAQ/
│ │ │ └── FAQ.tsx
│ │ │
│ │ ├── Contato/
│ │ │ └── Contato.tsx
│ │ │
│ │ ├── Login/
│ │ │ └── Login.tsx
│ │ │
│ │ ├── Painel/              # Área logada com CRUDs integrados à API
│ │ │ ├── PainelLayout.tsx
│ │ │ ├── HomePainel.tsx
│ │ │ ├── Clientes/
│ │ │ │ └── Clientes.tsx
│ │ │ ├── Servicos/
│ │ │ │ └── Servicos.tsx
│ │ │ ├── Contratados/
│ │ │ │ └── Contratados.tsx
│ │ │ ├── Pagamentos/
│ │ │ │ └── Pagamentos.tsx
│ │ │ ├── Seguros/
│ │ │ │ └── Seguros.tsx
│ │ │ └── Feedback/
│ │ │    └── Feedback.tsx
│ │
│ ├── App.tsx                # Estrutura principal do React Router
│ ├── main.tsx               # Ponto de entrada da aplicação
│ ├── index.css              # Estilos globais
│ └── vite-env.d.ts          # Tipagem Vite
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── .gitignore
└── README.md                # Este arquivo

---

## Endpoints Principais

-Clientes
-GET /cliente
-POST /cliente
-PUT /cliente/{id}
-DELETE /cliente/{id}
-Contratados
-GET /contratado
-Serviços
-GET /servico
-Pagamentos
-GET /pagamento
-Seguros
-GET /seguro
-Feedback
-GET /feedback

Todos hospedados no Render:
 https://five63489.onrender.com/

 ---

##  Imagens e Ícones

###  Página Inicial
![Home](./src/assets/fotoHome.jpeg)

###  Página de Integrantes
<img src="./src/assets/Bruno.jpeg" alt="Bruno Ferreira" width="180"/>  
<img src="./src/assets/Gabriel.jpeg" alt="Gabriel Robertoni" width="180"/>  
<img src="./src/assets/leonardo.jpeg" alt="Leonardo Aragaki" width="180"/>

---

##  Integrantes
| Nome | RM | Turma |
|------|----|--------|
| **Bruno Ferreira** | 563489 | 1TDSR |
| **Gabriel Robertoni Padilha** | 566293 | 1TDSR |
| **Leonardo Aragaki Rodrigues** | 562944 | 1TDSR |

---

##  Links Importantes

###  Repositório GitHub  
 [https://github.com/brunoferr10/GS_Front-End.git](https://github.com/brunoferr10/GS_Front-End.git)

###  Deploy na Vercel  
 [https://gs-front-end-one.vercel.app/](https://gs-front-end-one.vercel.app/)

###  Vídeo de Apresentação (YouTube)  
 [https://www.youtube.com/watch?v=WBpXPwi-oos](https://www.youtube.com/watch?v=WBpXPwi-oos)

---

## Contato

Caso deseje falar com o grupo:

-Bruno Ferreira – brunoferr2014@gmail.com
-GitHub: https://github.com/brunoferr10
-LinkedIn: https://www.linkedin.com/in/bruno-ferreira-4837a0207/
