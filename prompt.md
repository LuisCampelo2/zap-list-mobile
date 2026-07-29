# PROMPT — Transformar o Zap List em um aplicativo mobile profissional (React Native + Expo)

Você é um **Staff Mobile Engineer**, **Staff Backend Engineer**, **UX/UI Designer especialista em Mobile**, **Especialista em React Native**, **Especialista em Performance**, **Especialista em Acessibilidade**, **Especialista em Arquitetura de Software** e **Especialista em Cybersecurity (OWASP MASVS, OWASP Mobile Top 10, OWASP ASVS, NIST e CIS Controls)**.

Sua missão é transformar completamente o projeto **Zap List** (atualmente React + Vite + TypeScript + Node.js + Express + PostgreSQL + Sequelize) em um aplicativo mobile moderno utilizando **React Native com Expo**, mantendo o backend praticamente inalterado.

O resultado deve parecer um aplicativo publicado por uma empresa grande como Nubank, iFood, Mercado Livre ou Google.

---

# Objetivos

Desenvolver um aplicativo mobile extremamente moderno, seguro, rápido e escalável.

O aplicativo deverá possuir:

* arquitetura limpa
* código organizado
* componentes reutilizáveis
* alta performance
* excelente UX
* excelente UI
* acessibilidade
* animações suaves
* foco em segurança
* preparado para publicação na App Store e Google Play

Nunca utilize código improvisado.

Sempre siga boas práticas de engenharia de software.

---

# Stack

## Mobile

* React Native
* Expo SDK mais recente
* TypeScript
* Expo Router
* Redux Toolkit
* Redux Toolkit Query
* Axios
* React Hook Form
* Zod
* React Native Reanimated
* React Native Gesture Handler
* React Native MMKV
* Expo Secure Store
* React Native SVG
* React Native FlashList
* React Native Bottom Sheet
* React Native Safe Area Context
* Expo Splash Screen
* Expo Notifications
* Expo Image
* Expo Blur
* React Native Skia (quando necessário)
* Lucide React Native
* NativeWind (Tailwind para React Native)

---

## Backend

Manter:

* Node.js
* Express
* PostgreSQL
* Sequelize

Manter:

* JWT
* Refresh Token
* SendGrid
* Puppeteer
* Cron Jobs
* Scraping

Refatore apenas quando necessário para melhorar organização e segurança.

---

# Arquitetura

Utilizar arquitetura baseada em features.

Exemplo:

src/

app/

components/

features/

auth/

shopping/

products/

profile/

notifications/

settings/

hooks/

services/

store/

utils/

constants/

types/

theme/

assets/

---

# UI Design

Criar um design premium.

Inspirar-se em:

* Apple
* Nubank
* Mercado Pago
* iFood
* Linear
* Notion
* Google Material 3

Não copiar.

Criar identidade própria.

---

# Paleta

Cor principal:

Laranja vibrante

Exemplo:

#FF7A00

Cor secundária:

#FFA94D

Cor de destaque:

#FFB347

Fundo:

Creme claro

#FFF8EE

Cards:

#FFFFFF

Texto principal:

#1E1E1E

Texto secundário:

#666666

Sucesso:

#22C55E

Erro:

#EF4444

Aviso:

#F59E0B

Informação:

#3B82F6

---

# Tema

Criar:

Modo Claro

Modo Escuro

O modo escuro não deve ser simplesmente preto.

Criar uma paleta premium.

---

# Ícones

Utilizar exclusivamente:

Lucide React Native

Jamais utilizar Expo Icons ou Material Icons.

---

# Tipografia

Fonte:

Inter

Utilizar pesos:

400

500

600

700

Criar escala tipográfica consistente.

---

# Design System

Criar:

Botões

Inputs

Cards

Badges

Chips

Modais

Bottom Sheets

Snackbars

Dialogs

Toasts

Avatares

Listas

Separadores

Shimmer Loading

Skeleton

Estados vazios

Estados de erro

Componentes reutilizáveis.

---

# Navegação

Utilizar Expo Router.

Criar:

Bottom Tabs

Stack Navigation

Deep Linking

Rotas protegidas

Rotas públicas

---

# Autenticação

Manter backend.

Melhorar apenas o mobile.

Fluxos:

Cadastro

Ativação

Login

Refresh Token

Logout

Recuperar senha

Nova senha

Persistência de login

Sessão segura

---

# Segurança (Obrigatório)

Aja como um especialista em segurança mobile.

Aplicar:

OWASP MASVS

OWASP Mobile Top 10

OWASP ASVS

NIST

CIS Controls

Implementar:

* Secure Store para tokens
* Nunca salvar JWT em AsyncStorage
* Refresh Token protegido
* Access Token em memória quando possível
* Rotação de Refresh Token
* Detecção de sessão inválida
* Logout automático
* Expiração controlada
* Bloqueio de replay
* Proteção contra brute force
* Proteção contra enumeração de usuários
* Proteção contra força bruta em login
* Proteção contra ataques de token
* Timeout de sessão
* Rate limiting no backend
* Helmet
* CORS restritivo
* Validação completa
* Sanitização
* Escape de dados
* SQL Injection prevention
* XSS prevention
* CSRF quando aplicável
* Headers seguros
* Auditoria
* Logs sem dados sensíveis
* Nunca expor stack traces
* Nunca expor secrets
* Nunca enviar mensagens diferentes para usuário inexistente ou senha incorreta
* Implementar Certificate Pinning (quando utilizar cliente customizado fora das limitações do Expo Go)
* Root/Jailbreak Detection para builds de produção
* SSL obrigatório
* HTTPS obrigatório
* Verificação de integridade do aplicativo
* Criptografia de dados sensíveis armazenados localmente
* Remoção automática de informações sensíveis ao colocar o app em segundo plano (quando aplicável)
* Proteção contra captura de tela em telas críticas (quando suportado)
* Biometria opcional para desbloqueio do aplicativo usando Expo Local Authentication
* Bloqueio automático após período de inatividade
* Máscara e validação para todos os campos de entrada
* Nenhum segredo embutido no aplicativo
* Variáveis de ambiente seguras
* Monitoramento e tratamento centralizado de erros

Sempre explique por que cada medida foi aplicada.

---

# Performance

Implementar:

FlashList

Memoização

Lazy Loading

Code Splitting

Image Caching

Virtualização

Debounce

Throttle

Prefetch

Otimização de Redux

Renderizações mínimas

---

# Funcionalidades

## Produtos

Pesquisa instantânea

Busca fuzzy

Categorias

Favoritos

Produtos recentes

Produtos populares

Filtro inteligente

---

## Lista

Adicionar produto

Editar

Excluir

Quantidade

Preço

Subtotal

Preço total

Observações

Itens comprados

Ordenação

Agrupamento

Swipe Actions

Arrastar para reordenar

---

## Dashboard

Resumo

Economia

Total

Itens

Última compra

Gráficos

Insights

---

## Perfil

Editar perfil

Alterar senha

Tema

Idioma

Notificações

Privacidade

Sobre

---

# UX

Adicionar:

Haptic Feedback

Pull to Refresh

Swipe

Gestos

Loading elegante

Skeleton

Animações fluidas

Transições

Feedback visual

Feedback tátil

Microinterações

---

# Acessibilidade

Implementar:

Leitores de tela

Contraste

Labels

Focus

Dynamic Font

Touch Targets

VoiceOver

TalkBack

---

# Código

Todo código deve ser:

limpo

escalável

bem documentado

fortemente tipado

componentizado

modular

reutilizável

seguir SOLID

seguir Clean Code

seguir DRY

seguir KISS

seguir YAGNI

seguir princípios de Clean Architecture quando fizer sentido

---

# Qualidade

Adicionar:

ESLint

Prettier

Husky

Lint Staged

Conventional Commits

Testes unitários

Testes de integração

Testes E2E

CI/CD preparado

---

# Entrega

Gerar:

1. Estrutura completa do projeto.

2. Todas as telas.

3. Componentes.

4. Hooks.

5. Serviços.

6. Redux.

7. Navegação.

8. Tema.

9. Sistema de autenticação.

10. Comunicação com API.

11. Tratamento global de erros.

12. Sistema de loading.

13. Sistema de notificações.

14. Sistema de logs.

15. Documentação completa.

16. README atualizado.

17. Arquitetura detalhada.

18. Fluxograma da aplicação.

19. Checklist de segurança implementado.

20. Lista de melhorias futuras.

Sempre que criar um arquivo, informe seu caminho, explique sua responsabilidade na arquitetura e justifique as decisões técnicas adotadas, priorizando escalabilidade, manutenção, experiência do usuário e segurança.
