# Heroes Factory

CRUD de heróis fullstack — Node.js/Fastify + React + MySQL — construído como resposta a um desafio técnico, com foco em REST, SOLID, Design Patterns, testes automatizados e decisões de arquitetura conscientes (e documentadas).

Este README cobre **como rodar o projeto**, **o que foi construído**, **por que foi construído desse jeito** e **o que ficaria como próximo passo**.

## Sumário

- [Visão geral](#visão-geral)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Stack tecnológica](#stack-tecnológica)
- [Arquitetura — Backend](#arquitetura--backend)
- [Arquitetura — Frontend](#arquitetura--frontend)
- [Design Patterns aplicados](#design-patterns-aplicados)
- [SOLID na prática](#solid-na-prática)
- [Estratégia de testes](#estratégia-de-testes)
- [Fluxo de trabalho (git)](#fluxo-de-trabalho-git)
- [Decisões e trade-offs — referência rápida](#decisões-e-trade-offs--referência-rápida)
- [Possíveis evoluções](#possíveis-evoluções)

## Visão geral

**Hero Factory** é uma plataforma de gestão de heróis: criar, listar (com paginação e busca), editar, "excluir" (soft delete) e reativar.

O projeto é dividido em duas aplicações independentes, cada uma com seu próprio `package.json`:

```
heroes-factory/
  backend/   # API REST — Fastify + TypeScript + Prisma + MySQL
  frontend/  # SPA — React + TypeScript + Vite
```

## Como rodar o projeto

### Pré-requisitos

- Node.js 20+
- Docker (só o banco roda em container — as duas aplicações rodam localmente via `npm run dev`)

### Backend

```bash
cd backend
npm install
docker-compose up -d          # sobe o MySQL 8.0 na porta 3307
npx prisma db push            # sincroniza o schema com o banco
npm run dev                   # http://localhost:3333
```

A documentação interativa da API (Swagger, gerada automaticamente a partir dos schemas Zod das rotas) fica em `http://localhost:3333/api-docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

Configure `VITE_API_URL` num `.env` (veja `.env.example`) apontando para a URL do backend.

### Testes

```bash
# backend
cd backend
npm run test:unit          # unitários — sem banco, sem servidor
npm run test:integration   # precisa do docker-compose (banco real) no ar

# frontend
cd frontend
npm run test
```

## Stack tecnológica

| Camada | Tecnologias |
|---|---|
| Backend | Node.js, TypeScript, Fastify, Zod (`fastify-type-provider-zod`), Prisma ORM, MySQL 8.0, Jest |
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router, React Hook Form + Zod, Tailwind CSS v4, react-toastify, Vitest + Testing Library |
| Infra | Docker (MySQL), Swagger/OpenAPI (gerado automaticamente) |

## Arquitetura — Backend

### De onde veio, e por que mudou

O backend passou por duas fases de design: a primeira propunha camadas e domínios explícitos (`domain/` + `application/` + `infrastructure/`, com uma entidade `Hero`, um `HeroRepository` e seis classes de use-case). Na prática, ao comparar esse desenho outras opções e possibilidades ficou claro que aquilo era mais cerimônia do que o escopo (uma única entidade).

O resultado final é **feature-first e propositalmente enxuto, mas escalável verticalmente**: tudo relacionado a herói mora em `features/hero/`, a camada é sinalizada pelo **sufixo do nome do arquivo** (módulos), não por uma árvore de pastas, e a lógica de negócio/acesso a dado viram **funções**.

```
backend/src/
  features/hero/
    hero.model.ts          # createHero, listHeroes, getHeroById, updateHero,
                            # deactivateHero, activateHero — chamam prisma.hero.* direto
    hero.validators.ts      # validateHero() (invariantes de negócio) + canBeEdited()
    hero.errors.ts          # HeroNotFoundError, HeroInactiveError, HeroValidationError
    hero.controller.ts      # HeroController — parse já veio validado do Zod da rota
    hero.routes.ts          # rotas com schema Zod inline (body/params/response) + Swagger
    hero.schema.ts          # schemas Zod de request e de response
    index.ts

  server/
    app.ts                  # monta o Fastify (cors, swagger, error handler, rotas)
    routes.ts                # agrega as rotas de todas as features
    plugins/
      cors.plugin.ts
      prisma.plugin.ts       # instancia o PrismaClient

  shared/
    config/env.ts
    middleware/errorHandler.ts
    types/fastifyTypedInstance.ts

  prisma/schema.prisma

  main.ts                    # buildApp() + listen()
```

### Decisões

**Sem classe de entidade, repository ou use-case.** `hero.model.ts` é um conjunto de funções exportadas que chamam `prisma.hero.*` diretamente. Não existe uma interface de repository com múltiplas implementações porque o projeto tem uma única fonte de dado (MySQL via Prisma) e nenhuma previsão real de trocar, a abstração existiria só pra parecer "arquitetura", sem resolver problema nenhum. Trade-off aceito conscientemente: os testes unitários mockam o client do Prisma diretamente (via `jest.mock`), em vez de injetar uma implementação fake via interface. Mais pragmático, menos "puro" do ponto de vista de Clean Architecture, suficiente pro escopo.

**Validação em duas camadas.** O Zod valida formato na borda HTTP, declarado direto no `schema` de cada rota (`hero.routes.ts`), validado automaticamente pelo `fastify-type-provider-zod` antes do handler rodar (nada de `.parse()` manual espalhado pelo controller). `validateHero()` (em `hero.validators.ts`) valida invariantes de domínio na criação/atualização, independente de como o dado chegou ali com a mesma regra ("nome obrigatório", por exemplo) é checada duas vezes de propósito, porque as duas validações têm propósitos diferentes: uma é sobre formato de entrada, a outra sobre integridade do dado.

**`canBeEdited()` como guarda de negócio isolada.** Em vez de espalhar `if (!hero.is_active) throw ...` em todo lugar que edita um herói, existe uma função só (`canBeEdited(hero)`) que expressa essa regra, testada isoladamente e reaproveitada tanto no backend quanto (via replicação intencional) na UI do frontend (o formulário de edição já bloqueia visualmente antes mesmo de chamar a API).

**Timestamps vêm do Prisma, não da aplicação.** `created_at`/`updated_at` são gerados pelo `@default(now())` e `@updatedAt` do schema Prisma — as funções de `hero.model.ts` nunca setam essas datas manualmente, e sempre retornam a linha que o Prisma efetivamente gravou. Isso elimina uma classe inteira de bug (relógio da aplicação divergindo do banco, ou esquecer de atualizar `updated_at` num fluxo novo).

**Soft delete.** O botão "Excluir" da UI não faz um `DELETE` físico, ele seta `is_active = false` (mesma operação usada por "Desativar"), porque o próprio fluxo de negócio permite reativar um herói excluído. Um hard delete tornaria isso impossível sem recriar o registro do zero.

**Erros de domínio + `errorHandler` central.** `HeroNotFoundError` (404), `HeroInactiveError` (410 — o recurso existe mas não está mais disponível pra edição), `HeroValidationError` (400) e erros de validação do Zod (400, com `issues` detalhado) são todos mapeados num único `setErrorHandler`, em vez de `try/catch` repetido em cada rota.

**Swagger real, gerado a partir dos mesmos schemas Zod.** Cada rota declara `body`/`params`/`querystring`/`response` com os schemas Zod já usados pra validação o `fastify-type-provider-zod` transforma isso em OpenAPI automaticamente. Não existe uma segunda fonte de verdade (spec YAML escrita à mão) que possa divergir do código.

## Arquitetura — Frontend

### Estrutura

```
frontend/src/
  pages/
    HeroesPage/
      HeroesPage.tsx           # monta a tela combinando a feature heroes
      HeroesPage.route.ts
    routes.ts

  features/heroes/
    components/                # HeroList, HeroCard, HeroActionsMenu, HeroFormModal,
                                # HeroDetailModal, HeroConfirmationModal, HeroSearchInput
    hooks/                     # useHeroes, useHero, useCreateHero, useUpdateHero,
                                # useDeactivateHero, useActivateHero
    context/
      HeroActionsContext.ts    # ver "Context pontual" abaixo
    services/
      hero.api.ts              # chamadas HTTP (axios)
      hero.schema.ts           # schema Zod do formulário (validação + tipagem)
      hero.keys.ts             # query key factory do TanStack Query
    types/
    index.ts                   # barrel — única porta pública da feature

  shared/
    ui/                        # Button, Input, Pagination, Switch, Spinner, EmptyState,
                                # ConfirmDialog, Modal/ (Modal, ModalHeader, ModalActions)
    layouts/                   # AppLayout, PageContainer
    router/                    # AppRouter
    query/                     # queryClient (com o bridge de toast, ver abaixo)
    services/                  # httpClient (axios configurado)
    hooks/                     # useDebounce
    types/                     # PaginatedResult<T>

  App.tsx
  main.tsx
```

### Decisões

**TanStack Query em toda chamada de servidor.** Nenhum dado vindo da API passa por `useState` + `useEffect` manual — todos os 6 hooks (`useHeroes`, `useCreateHero`, etc.) usam `useQuery`/`useMutation`, o que já resolve de graça o requisito de loading (`isPending`) e invalidação automática de cache após criar/editar/excluir/ativar.

**Toast disparado a partir do próprio `queryClient`, não de cada hook.** Cada `useQuery`/`useMutation` declara `meta: { successMessage, errorMessage }`; um `QueryCache`/`MutationCache` central (em `shared/query/queryClient.ts`) lê esse `meta` e chama `toast.success`/`toast.error` (react-toastify). Isso evita repetir `onSuccess`/`onError` com toast manual em cada um dos 6 hooks, com isso, toda ação assíncrona tem sua mensagem de erro ou sucesso.

**Zod compartilhado entre formulário e tipagem.** `hero.schema.ts` define um único schema (`heroFormSchema`), usado tanto pelo `react-hook-form` (via `zodResolver`) quanto como fonte do tipo TypeScript do formulário (`z.infer`) e evita manter schema de validação e interface de tipos como duas fontes de verdade que podem divergir.

**`canBeEdited` replicado na UI (defesa em profundidade).** O `HeroFormModal` verifica `hero.is_active` antes de renderizar o formulário de edição e mostra um aviso em vez de permitir a tentativa. Mesmo que o backend já rejeite essa edição com `410`, é importante que a UI não dependa só do backend e que a mesma regra de negócio seja reforçada nos dois lados.

**`HeroActionsContext` — Context pontual pra resolver um prop drilling real.** Durante o desenvolvimento, `HeroList` e `HeroCard` estavam repassando `onEdit`/`onDelete`/`onToggleActive` de `HeroesPage` até `HeroActionsMenu` sem nunca usar esses callbacks, puro repasse por 3 arquivos. A solução foi um Context **escopado à feature `heroes`** (não um estado global de app) carregando só as funções de abrir cada ação (`openEdit`, `openDelete`, `openActivate`), nenhum dado, nenhum estado de "qual modal está aberto". Quem guarda esse estado e renderiza os modais continua sendo só `HeroesPage`. O Context existe apenas pra `HeroActionsMenu` acionarem essas funções sem que `HeroList` e `HeroCard` precise saber que elas existem.

**`HeroConfirmationModal` — duas telas quase idênticas viraram uma.** As confirmações de "Excluir" e "Ativar" tinham a mesma estrutura (`ConfirmDialog` + uma mutation + `onConfirm={() => mutate(hero.id, { onSuccess: onClose })}`), diferindo só no hook chamado e no texto/cor do botão. Viraram um componente único com uma variante `action: 'delete' | 'activate'` e um mapa de configuração (`título`/`label`/`variant`/`descrição`) por ação. Os dois hooks de mutation são sempre instanciados (regra de hooks do React não permite chamada condicional), mas só o da ação atual é de fato usado.

**Família `Modal`/`ModalHeader`/`ModalActions`.** O mesmo padrão de cabeçalho (título + X) e rodapé (ações com borda separando do conteúdo) se repetia em `HeroFormModal`, `HeroDetailModal` e `ConfirmDialog` — foi extraído pra `shared/ui/Modal/`, com `ModalActions` aceitando uma prop `showSave` pra alternar entre "Cancelar + Salvar" (formulário) e só "Fechar" (leitura).

## Design Patterns aplicados

| Pattern | Exemplos de onde | Papel |
|---|---|---|
| **Provider / Context** | `HeroActionsContext` (frontend) | Distribui as funções de abrir ação sem acoplar `HeroList`/`HeroCard` a elas |
| **Strategy (via mapa de configuração)** | `HeroConfirmationModal` (`CONFIG` por `action`), `HeroActionsMenu` (ativo vs. inativo) | Troca de comportamento/aparência por um parâmetro, sem `if/else` espalhado |
| **Factory (query key factory)** | `hero.keys.ts` | Centraliza a construção das chaves de cache do TanStack Query, evitando strings soltas divergentes |
| **Chain of Responsibility (implícito)** | `errorHandler.ts` (backend) | Cadeia de `instanceof` que resolve qual status HTTP cada erro de domínio deve virar, num lugar só |
| **Facade** | `hero.model.ts` (backend), `hero.api.ts` (frontend) | Escondem os detalhes de Prisma/axios atrás de funções com nome de negócio (`createHero`, `heroApi.update`) |
| **Compound/composição de componentes** | `Modal` + `ModalHeader` + `ModalActions` | Comportamento (borda, fechar, ações) reaproveitado por composição em vez de duplicado |

## SOLID na prática

| Princípio | Exemplos de como aparece aqui |
|---|---|
| **S** — Single Responsibility | Cada função de `hero.model.ts` faz uma operação só; cada componente React faz uma coisa (`HeroCard` só exibe, `HeroSearchInput` só captura busca) |
| **O** — Open/Closed | `shared/ui/Button` ganha variantes via prop (`variant="danger"`), sem precisar editar o componente pra cada novo caso de uso |
| **L** — Liskov Substitution | `ConfirmDialog` genérico atende tanto "Excluir" quanto "Ativar" com a mesma interface de props, sem o chamador saber a diferença |
| **I** — Interface Segregation | Hooks expõem só o que quem consome precisa (`useCreateHero()` devolve `{ mutate, isPending }`, não o estado interno inteiro do TanStack Query) |
| **D** — Dependency Inversion (pragmática) | Features dependem de `shared/services/httpClient` e `hero.model.ts` depende só de `prisma.hero.*` — a inversão "de verdade" (interfaces com múltiplas implementações) foi conscientemente deixada de fora por não haver necessidade real no escopo |

## Estratégia de testes

Maioria unitária (rápida, isolada), com integração cirúrgica só nos pontos onde a interação real entre camadas é o que pode quebrar silenciosamente.

| Suíte | Cobertura | Como roda |
|---|---|---|
| Backend unitário (`tests/unit/`) | `validateHero`, `canBeEdited` e as 6 operações de `hero.model.ts`, com o client do Prisma mockado | `npm run test:unit` — sem banco, sem servidor |
| Backend integração (`tests/integration/`) | `POST /heroes` (201 + contrato exato), `PUT` em herói inativo (410), `GET` com busca+paginação, `DELETE` (soft delete mantém a linha), `POST` inválido (400 com `issues`) | `npm run test:integration` — precisa do MySQL do `docker-compose` no ar |
| Frontend (`vitest`) | Componentes críticos (`HeroCard`, `HeroActionsMenu`, `HeroFormModal`, `HeroConfirmationModal`, `HeroDetailModal`, família `Modal`, `Pagination`, `Switch`), hooks da feature `heroes`, o bridge de toast do `queryClient` e a `HeroesPage` montando tudo | `npm run test` |

Regra prática usada pra decidir o que vira teste de integração: se o bug só aparece quando duas ou mais camadas reais interagem (Zod real + Prisma real + `errorHandler` real), vira integração. Se é uma regra isolada sem dependência de infraestrutura, fica unitário.

## Fluxo de trabalho (git)

O histórico deste repositório foi construído de propósito pra ser legível: um commit inicial "limpo" (só scaffold + tooling, nada de código de domínio) inicializando o repositório, seguido de branches por camada técnica ou por feature ajustado, cada uma mergeada só depois de testes passando:

`frontend-scaffold` → `frontend-shell` → `heroes-data-layer` → `heroes-list` → `heroes-form` → `cors-fix` → `pagination-fix` → `heroes-lifecycle` → `hero-actions-context`

Convenção de commit usada em todo o histórico: `Heroes Factory - <FEATURE> - <comentário detalhado do que foi desenvolvido>`.

## Decisões e trade-offs — referência rápida

| Decisão | Escolha | Por quê |
|---|---|---|
| Camadas do backend | Feature-first, sufixo de arquivo em vez de pasta | Menos nesting, sinalização de camada ainda explícita pelo nome |
| Acesso a dado | Funções chamando Prisma direto, sem repository/interface | Fonte de dado única, sem necessidade real de abstração |
| Validação | Zod (borda HTTP, automático) + `validateHero` (domínio) | Formato de entrada ≠ integridade do dado |
| "Excluir" | Soft delete (`is_active = false`) | Fluxo de reativação exige que o dado persista |
| Timestamps | Gerados pelo Prisma (`@default`/`@updatedAt`) | Uma fonte de verdade, sem gestão manual na aplicação |
| Erros | `throw` + `errorHandler` central | Evita `try/catch` repetido, status HTTP mapeado num só lugar |
| Toast (frontend) | Disparado pelo `queryClient` via `meta` | Uma regra só em vez de repetir em cada hook |
| Prop drilling de ações | `HeroActionsContext` (funções, sem estado) | Resolve o repasse sem uso real em `HeroList`/`HeroCard` |
| Modais de confirmação | `HeroConfirmationModal` único, parametrizado por `action` | Duas telas quase idênticas viraram uma |
| Testes | Majoritariamente unitários + integração pontual | Integração só onde camadas reais interagem de forma arriscada |

## Possíveis evoluções

- **Lint contra import direto dentro de uma feature** (`eslint-plugin-import` com `no-restricted-imports`), pra garantir que ninguém importe `features/heroes/components/HeroCard` fora do barrel `features/heroes/index.ts`.
- **Migrations formais do Prisma** (`prisma migrate`) em vez de `db push` — hoje o schema é aplicado direto, sem histórico versionado de alterações.
- **CI** (GitHub Actions) rodando lint + testes + build a cada PR.
- **Testes E2E** (Playwright/Cypress) cobrindo o fluxo completo (criar → listar → editar → excluir → reativar) num navegador real.
- **Autenticação**
