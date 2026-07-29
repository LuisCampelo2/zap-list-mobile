# Zap List Mobile

Reescrita do Zap List (originalmente React + Vite) como app mobile nativo com
**React Native + Expo**, com um backend **Express/Sequelize novo** (mesma
funcionalidade do server original em `c:\projects\Zap-List`, reescrito do zero
com segurança embutida desde o início). O server original não foi alterado.

## Estrutura

```
zap-list-mobile/
├── mobile/          # App Expo (React Native + TypeScript + Expo Router)
├── server/          # API Express + Sequelize + PostgreSQL
└── docker-compose.yml  # PostgreSQL local para desenvolvimento
```

## Status

### Fase 1 — Scaffold + autenticação (concluída)

- **Server**: registro, ativação de conta (deep link), login, refresh token
  com rotação, logout, recuperação de senha (código de 6 dígitos → token de
  redefinição → nova senha), `GET /users/me`.
- **Mobile**: design system base, tema claro/escuro, navegação (Expo Router
  com grupos protegidos e tabs), Redux Toolkit + RTK Query, armazenamento
  seguro, e todas as 6 telas de autenticação.

### Fase 2 — Catálogo de produtos (concluída)

- **Server**: `Product` e `Favorite` (models novos), `GET /products` (público,
  filtro opcional por categoria, marca `isFavorite` se autenticado),
  `GET /products/favorites`, `POST /products/:id/favorite` (toggle). Seed com
  46 produtos curados em ~15 categorias (`npm run db:seed`), imagens servidas
  em `/images/products/*`.
- **Mobile**: tela de Produtos com busca fuzzy (Fuse.js, 100% client-side),
  chips de categoria, favoritos com atualização otimista, grid via FlashList,
  skeleton de carregamento, pull-to-refresh. Componentes novos no design
  system: `Chip`, `SearchBar`.

> **Atualização**: o ambiente de desenvolvimento agora aponta para o banco
> Postgres real do projeto `Zap-List` original (213 produtos reais, 11
> usuários reais) em vez de um banco vazio com o seed curado — ver "Banco de
> dados: real vs. vazio" abaixo. O seed de 46 itens continua existindo em
> `server/src/scripts/seedProducts.js` para quem quiser rodar contra um banco
> novo/vazio.

### Fase 3 — Listas de compras (em andamento)

- **Server**: `ShoppingList` e `ShoppingListProduct` (mapeados nas tabelas
  reais `shoppinglists`/`shoppinglistproducts`, 11 listas / 299 itens
  existentes). `GET/POST /lists`, `DELETE /lists/:id`, `GET/POST
  /lists/:id/items`, `PATCH/DELETE /lists/:id/items/:itemId`. Preço total
  recalculado a cada mudança (mesma fórmula do original: preço por KG ×
  peso médio para produtos vendidos a granel). Validação de quantidade
  inteira para produtos não vendidos por KG, bloqueio de produto duplicado
  na mesma lista, e — diferente do original — todas as rotas exigem dono da
  lista autenticado (o endpoint de adicionar produto não tinha nenhuma
  autenticação antes).
- **Mobile**: aba Listas (criar/ver listas reais com contagem de itens e
  total), tela de detalhe da lista (marcar comprado, remover item), e um
  bottom sheet "Adicionar à lista" acionado direto da tela de Produtos
  (escolher lista existente ou criar uma nova, ajustar quantidade — inteira
  ou fracionada conforme a unidade do produto).

**Ainda não implementado**: swipe actions e arrastar-para-reordenar nos itens
da lista, produtos recentes/populares (dependem do histórico de uso das
listas), dashboard (resumo/insights), configurações de perfil, scraping de
preços (cron + Puppeteer), notificações push, biometria, testes
automatizados, CI/CD.

## Rodando localmente

### 1. Banco de dados

Duas opções, dependendo do que você quer:

**(a) Banco vazio novo** (Postgres via Docker, sem dados reais):
```bash
docker compose up -d postgres
```
Depois no server: `npm run db:sync` (cria as tabelas do zero) + `npm run db:seed` (popula 46 produtos curados).

**(b) Banco real existente** (o do projeto `Zap-List` original — 213 produtos, 11 usuários reais):
Aponte `PGDATABASE`/`PGUSER`/`PGPASSWORD`/`PGHOST`/`PGPORT` no `server/.env` para essa instância, depois rode `npm run db:migrate` (**nunca** `db:sync` nesse banco — ver "Banco de dados: real vs. vazio" abaixo).

### 2. Server

```bash
cd server
cp .env.example .env   # preencha JWT_ACCESS_SECRET, JWT_REFRESH_PEPPER e dados do Postgres
npm install
npm run db:migrate     # OU db:sync, dependendo da opção (a) ou (b) acima
npm run dev
```

Gere os segredos JWT com:
`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Sem `SENDGRID_API_KEY` configurada, emails de ativação/recuperação de senha
são apenas logados no console (modo dev).

### 3. Mobile

```bash
cd mobile
cp .env.example .env   # aponte EXPO_PUBLIC_API_URL para o IP da sua máquina (não localhost) na mesma rede do celular
npm install
npm start
```

Escaneie o QR code com o app **Expo Go** (Android/iOS). O projeto roda 100%
dentro do Expo Go — de propósito não usamos nenhuma biblioteca que exija
development build (por isso `react-native-mmkv` foi trocado por
`expo-secure-store` também para preferências não sensíveis, ver decisão
abaixo).

> **Por que Expo SDK 54 e não a versão mais nova?** O app Expo Go publicado
> na Play Store/App Store só roda o SDK 54 — a Expo parou de atualizar a
> versão de loja a cada SDK novo (fica reservada como ferramenta educacional;
> projetos "reais" são direcionados a development builds). Rebaixamos o
> projeto de SDK 57 para 54 de propósito para continuar funcionando no Expo
> Go puro, sem precisar de build próprio.

## Decisões de arquitetura e segurança

### Server — arquitetura em camadas

`routes → validators (Zod) → controllers → services → models`. Cada camada
tem uma única responsabilidade: rotas não sabem de regra de negócio,
controllers não sabem de SQL, services encapsulam lógica reutilizável
(tokens, senha, email).

### Autenticação mobile — por que não cookies

O server original usava refresh token em cookie `httpOnly`, um padrão pensado
para navegador. Apps mobile nativos não têm um cookie jar automático
equivalente ao de um browser, então o novo server retorna o refresh token no
corpo da resposta JSON; o app o persiste no **Keychain/Keystore** via
`expo-secure-store` (nunca em `AsyncStorage`). O access token vive **só em
memória** (Redux) — se o app for encerrado, é obtido de novo silenciosamente
no próximo boot trocando o refresh token salvo.

### Rotação de refresh token + detecção de replay

Refresh tokens são strings opacas de alta entropia; só o **hash HMAC** é
persistido no banco (`refresh_tokens`), nunca o valor puro. A cada uso, o
token é invalidado e substituído por um novo (`family` agrupa a cadeia de
rotação). Se um token já revogado for reapresentado — sinal de que foi
roubado e reusado —, a família inteira é revogada, derrubando a sessão em
todos os dispositivos.

### Correções de segurança em relação ao server original

- **Enumeração de usuário**: o login original retornava mensagens diferentes
  para "email não existe" vs "senha errada" (e recuperação de senha também).
  Agora ambos os fluxos respondem de forma idêntica nesses casos.
- **Reset de senha sem posse do código**: no original, `reset-password`
  trocava a senha só com `email`, sem validar nenhum token vinculado à
  verificação do código — bastava saber o email da vítima. Agora a troca só é
  aceita mediante um `resetToken` de curta duração (10 min), emitido apenas
  após verificar o código de 6 dígitos.
- **Sem rate limiting nem lockout**: adicionado rate limiting nas rotas de
  auth e bloqueio progressivo de conta após tentativas de login malsucedidas.
- **Sem helmet**: adicionado com headers padrão seguros.

Ver `server/.env.example` para todas as variáveis necessárias.

### Banco de dados: real vs. vazio

O server foi originalmente desenhado para um schema próprio, novo (IDs UUID,
`refresh_tokens`, `favorites` etc.). Na prática, o banco Postgres local
disponível já é o banco **real** do projeto `Zap-List` original — com 213
produtos e 11 usuários de verdade, em tabelas com IDs `INTEGER`
autoincrement, coluna `password` (não `password_hash`), `activationToken` em
vez de um booleano `is_active`, e por aí vai.

Em vez de exigir um banco novo separado, os models (`User`, `Product`) foram
adaptados para mapear **exatamente** essas colunas existentes — inclusive
preservando um typo histórico da coluna `unitOFMeasure`. Os campos extras
que os novos recursos de segurança precisam (lockout, expiração de token de
ativação, código de reset com tentativas) foram adicionados via
`server/src/scripts/migrateExistingDb.js`, que só executa `ADD COLUMN IF NOT
EXISTS` / `CREATE TABLE IF NOT EXISTS` — nunca `ALTER`/`DROP` em algo que já
existe, nunca toca uma linha já gravada. Por isso esse script substitui
`sequelize.sync({ alter: true })` para esse banco: o diffing automático do
Sequelize é ótimo para um banco vazio, mas arriscado demais para rodar sem
supervisão contra dados reais.

Consequências práticas:
- `is_active` não existe como coluna — continua sendo `activationToken IS
  NULL`, igual ao app original.
- As imagens de produto vêm de `server/src/imgs` (a mesma pasta do projeto
  original, ~187 arquivos), servidas em `/images/products/*`.
- `npm run db:seed` (46 produtos curados) é só para quem rodar contra um
  banco novo/vazio — **nunca** rodar contra o banco real, senão cria produtos
  duplicados ao lado dos 213 reais.

### Expo Go em vez de development build

O plano original previa `react-native-mmkv` para cache local. MMKV depende de
código nativo customizado (Nitro Modules) que **não existe dentro do app Expo
Go** — só funciona com um development build próprio (`expo run:android` ou
EAS Build). Como o fluxo de teste aqui é só pelo Expo Go, trocamos MMKV por
`expo-secure-store` também para a preferência de tema (não sensível, mas é um
valor único e pequeno — o overhead do Keychain/Keystore não importa nesse
volume). Todo o resto do stack (Reanimated, Gesture Handler, FlashList,
Bottom Sheet, NativeWind etc.) já é compatível com Expo Go sem alterações.

## Design

Paleta: laranja vibrante (`#FF7A00`) como cor primária, fundo creme claro no
modo claro, modo escuro em tons de carvão/marrom (nunca preto puro). Fonte
Inter (400/500/600/700). Ícones exclusivamente `lucide-react-native`.
# zap-list-mobile
