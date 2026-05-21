# NBA Statics — Frontend

Interface web para o NBA Statics, construída com **Next.js 14** (App Router), **TypeScript** e **Tailwind CSS**.

Consome a [NBA Statics API](https://github.com/PedroADiniz/nba-statics-api) para exibir agenda de jogos, box score por partida, perfil de jogadores, elencos e análise H2H entre times.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| [Node.js](https://nodejs.org) | 18+ |
| [NBA Statics API](https://github.com/PedroADiniz/nba-statics-api) | rodando localmente |

> O frontend é apenas uma interface — ele precisa da API rodando para funcionar. Configure a API primeiro.

---

## Instalação e configuração

### 1. Clone o repositório

```bash
git clone https://github.com/PedroADiniz/nba-statics-front.git
cd nba-statics-front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

Ou crie manualmente com o seguinte conteúdo:

```env
# URL base da NBA Statics API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Chave de API — deve ser igual ao API_KEY configurado na API
NEXT_PUBLIC_API_KEY=troque-por-um-valor-secreto
```

> **Atenção:** use o mesmo valor de `API_KEY` configurado no backend.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em **http://localhost:3001**.

---

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API (ex: `http://localhost:3000/api/v1`) |
| `NEXT_PUBLIC_API_KEY` | Chave enviada no header `x-api-key` de todas as requisições |

---

## Scripts disponíveis

```bash
npm run dev      # Inicia em modo desenvolvimento na porta 3001
npm run build    # Gera o build de produção
npm run start    # Inicia o build de produção na porta 3001
npm run lint     # Verifica erros de lint
```

---

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Agenda do dia com calendário mensal |
| `/jogos/:gameId` | Box score detalhado de uma partida (placar por quarto + estatísticas dos jogadores) |
| `/h2h` | Análise H2H entre dois times |
| `/times` | Lista de todos os times da NBA |
| `/times/:id` | Perfil do time: elenco e estatísticas da temporada |
| `/jogadores/:id` | Perfil do jogador: bio, estatísticas da carreira e últimas partidas |

---

## Rodando API e Frontend juntos

### Com Docker (backend) + Node (frontend)

**Terminal 1 — sobe a API:**
```bash
cd nba-statics-api
docker compose up -d
```

**Terminal 2 — sobe o frontend:**
```bash
cd nba-statics-front
npm run dev
```

Acesse **http://localhost:3001**.

---

## Estrutura do projeto

```
app/                   # Páginas (Next.js App Router)
├── page.tsx           # Home — agenda de jogos
├── jogos/[id]/        # Box score da partida
├── h2h/               # Análise H2H
├── times/[id]/        # Perfil do time
└── jogadores/[id]/    # Perfil do jogador

components/
├── h2h/               # Widgets de análise H2H
├── layout/            # Header e Footer
├── players/           # Tabelas e gráficos de jogadores
├── schedule/          # Agenda, calendário e card de jogo
├── teams/             # Cards e seletores de times
└── ui/                # Componentes genéricos

lib/
├── api.ts             # Funções de fetch para cada endpoint
└── utils.ts           # Formatação de datas, estatísticas, conversões

types/
└── api.ts             # Tipos TypeScript dos DTOs da API
```
