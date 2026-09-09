# Fluxogramas Contact Center — Gebalis

Aplicação web em português (Portugal) para consulta interativa dos fluxos de atendimento e encaminhamento do Contact Center da Gebalis. Construída a partir da exportação Visio `Fluxograma_Vision_T1.vsdx` e organizada segundo a estrutura do *Relatório de Caracterização e Pré-Auditoria Externa*.

**Aplicação publicada:** https://report-buddy-pt.lovable.app

---

## 1. Propósito e contexto

- Navegação por áreas temáticas: Social, Edificado, Rendas, DAF/DRA, GC, ENH, DAJ, SR e 855.
- Visualização responsiva dos fluxogramas em SVG, com zoom, pan e setas clicáveis.
- Versão textual acessível de cada fluxo.
- Índice pesquisável e navegação anterior/seguinte entre fluxos.
- Identidade visual baseada no logótipo e cores institucionais da Gebalis.

> **Nota:** O separador "Relatório" e o painel de administrador para edição de fluxogramas estão planejados mas ainda não implementados.

---

## 2. Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework full-stack | TanStack Start v1 |
| Frontend | React 19 + TypeScript |
| Build tool | Vite 7 |
| Estilos | Tailwind CSS v4 + CSS variables |
| Componentes UI | shadcn/ui (Radix) |
| Backend / Auth / DB | Lovable Cloud (Supabase: PostgreSQL + Auth) |
| Server functions | `createServerFn` do TanStack Start |
| Public API / webhooks | Rotas TanStack em `src/routes/api/public/` |
| Package manager | bun |

---

## 3. Estrutura de pastas

```
├── public/                     # Assets estáticos (favicon, etc.)
├── src/
│   ├── assets/                 # Logótipo processado
│   ├── components/             # Componentes reutilizáveis (FlowCanvas, header, footer)
│   ├── components/ui/          # Componentes shadcn/ui
│   ├── data/
│   │   └── flows.json          # Dados estáticos dos 145 fluxogramas
│   ├── hooks/                  # Hooks auxiliares
│   ├── integrations/supabase/  # Clientes Supabase gerados (auth, middleware, server)
│   ├── lib/                    # Utilitários, parser de fluxos, captura de erros
│   ├── routes/                 # Rotas TanStack Start
│   │   ├── __root.tsx          # Layout raiz
│   │   ├── index.tsx           # Página inicial
│   │   ├── fluxos.index.tsx   # Índice de fluxogramas
│   │   ├── fluxos.$slug.tsx   # Detalhe de um fluxograma
│   │   └── relatorio.tsx       # Relatório de pré-auditoria (a remover)
│   ├── server.ts               # Configuração do servidor Nitro
│   ├── start.ts                # Configuração do TanStack Start (middleware)
│   └── styles.css              # Variáveis de tema Tailwind
├── supabase/
│   └── config.toml             # Configuração do projeto Supabase (auto-gerado)
├── .env                        # Variáveis de ambiente (não commitado)
├── .env.example                # Template das variáveis de ambiente
├── BACKEND.md                  # Documentação técnica do backend
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Como executar localmente

### Pré-requisitos

- [bun](https://bun.sh/) instalado (ou Node.js + npm)
- Acesso às variáveis de ambiente do projeto Lovable Cloud

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/spompeu-eng/report-buddy-pt.git
cd report-buddy-pt

# 2. Instalar dependências
bun install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Preencher .env com os valores reais do projeto Lovable Cloud

# 4. Iniciar o servidor de desenvolvimento
bun run dev

# 5. Abrir no navegador
# http://localhost:8080
```

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | Servidor de desenvolvimento com HMR |
| `bun run build` | Build de produção |
| `bun run build:dev` | Build em modo desenvolvimento |
| `bun run preview` | Preview do build de produção |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |

---

## 5. Variáveis de ambiente

Ver `.env.example` para a lista completa. As mais importantes:

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` / `SUPABASE_URL` | URL do projeto Lovable Cloud / Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | Chave pública anon |
| `VITE_SUPABASE_PROJECT_ID` / `SUPABASE_PROJECT_ID` | ID do projeto |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço — apenas no servidor, nunca no browser |
| `LOVABLE_CRON_SECRET` | Segredo para cron jobs (se configurados) |

> **Atenção:** o ficheiro `.env` está excluído do controlo de versões via `.gitignore`. Nunca o partilhe nem o commite.

---

## 6. Backend e dados

### Lovable Cloud / Supabase

- **Base de dados:** PostgreSQL gerido pelo Lovable Cloud.
- **Autenticação:** Supabase Auth, com middleware `requireSupabaseAuth` para server functions protegidas.
- **Storage:** disponível para futura gestão de imagens/logótipo.
- **RLS:** qualquer tabela no schema `public` deve ter Row Level Security ativado e políticas + `GRANT` adequados.

### Dados estáticos

Os 145 fluxogramas estão serializados em `src/data/flows.json` (~1.355 nós e 1.123 ligações). Este ficheiro é carregado em build/runtime e contém:

- `pages` — definição de cada página Visio
- `nodes` — caixas de texto/decisão com posição, dimensão e estilo
- `edges` — ligações/setas entre nós
- `steps` — versão textual sequencial do fluxo

### Server functions

Lógica do lado do servidor implementada com `createServerFn` do `@tanstack/react-start`. Ficheiros relevantes:

- `src/integrations/supabase/auth-middleware.ts` — middleware de autenticação
- `src/integrations/supabase/auth-attacher.ts` — anexação do bearer token no cliente
- `src/integrations/supabase/client.server.ts` — cliente com service role (uso restrito)
- `src/start.ts` — registo do middleware

Para mais detalhes, consultar `BACKEND.md`.

---

## 7. Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com áreas temáticas e fluxo geral |
| `/fluxos` | Índice pesquisável de todos os fluxogramas |
| `/fluxos/$slug` | Detalhe de um fluxograma específico |
| `/relatorio` | Relatório de pré-auditoria (planeado para remoção) |

---

## 8. Notas de segurança para revisores

- `.env` não está no repositório; usar `.env.example` como referência.
- `SUPABASE_SERVICE_ROLE_KEY` só deve ser usada dentro de server functions autorizadas.
- O cliente de service role em `client.server.ts` ignora RLS — verificar sempre a identidade/permissões do chamador antes de o usar.
- Papéis de utilizador, se implementados no futuro, devem residir numa tabela separada (`user_roles`), nunca na tabela `profiles`/`users`.
- Endpoints públicos/webhooks devem ser colocados em `src/routes/api/public/` e validar a origem (assinaturas, Zod, etc.).

---

## 9. Limitações e próximos passos conhecidos

1. **Separador "Relatório":** a rota `/relatorio` ainda existe; o utilizador pediu para a remover.
2. **Painel de administrador:** não implementado. O objetivo é permitir a um administrador autenticado editar textos, tamanhos/posições de caixas, estilo/cor de setas e zoom dos fluxogramas, com persistência na base de dados.
3. **Migrações locais:** não existem ficheiros em `supabase/migrations/`. O schema é gerido pelo Lovable Cloud.
4. **Exportação de dados:** para obter schema/dados de produção, usar **Cloud → Advanced settings → Export data** no editor Lovable.

---

## 10. Recursos úteis

- [Documentação Lovable](https://docs.lovable.dev)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)

---

## 11. Suporte

Para questões sobre o projeto, contactar o proprietário do repositório ou abrir uma *issue* no GitHub.

*Última atualização do README: 9 de setembro de 2026.*
