import { createFileRoute } from "@tanstack/react-router";
import { totalPaginas } from "@/lib/flows";

export const Route = createFileRoute("/relatorio")({
  head: () => ({
    meta: [
      { title: "Relatório de pré-auditoria | Fluxogramas Gebalis" },
      {
        name: "description",
        content:
          "Caracterização e pré-auditoria externa da aplicação Fluxogramas Contact Center da Gebalis: âmbito, arquitetura, privacidade, riscos e evidências.",
      },
      { property: "og:title", content: "Relatório de pré-auditoria | Fluxogramas Gebalis" },
      {
        property: "og:description",
        content:
          "Âmbito funcional, arquitetura a confirmar, dados e privacidade, riscos preliminares e plano de testes para o auditor externo.",
      },
    ],
  }),
  component: Relatorio,
});

type Linha = string[];

function Tabela({ cabecalho, linhas }: { cabecalho: Linha; linhas: Linha[] }) {
  return (
    <div className="cartao mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted text-left">
            {cabecalho.map((c) => (
              <th key={c} className="border-b border-border px-4 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i} className="align-top">
              {l.map((c, j) => (
                <td key={j} className="border-b border-border px-4 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Seccao({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  const id = `s${numero}`;
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10">
      <h2 className="text-2xl font-semibold">
        <span className="mr-2 text-magenta">{numero}.</span>
        {titulo}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">{children}</div>
    </section>
  );
}

function Lista({ itens }: { itens: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
      {itens.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

const indice = [
  "Finalidade do documento",
  "Identificação da aplicação",
  "Objetivo e âmbito funcional",
  "Arquitetura a confirmar",
  "Fluxo de utilização",
  "Dados e privacidade",
  "Acessos e responsabilidades",
  "Avaliação preliminar de riscos",
  "Requisitos de segurança",
  "Acessibilidade e UX",
  "Desempenho e disponibilidade",
  "Plano de testes para auditor",
  "Evidências a entregar",
  "Lacunas críticas antes da auditoria",
  "Declaração para o auditor",
];

function Relatorio() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
        Versão 0.1 · documento de preparação
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Relatório de caracterização e pré-auditoria externa
      </h1>
      <p className="mt-2 text-muted-foreground">
        Aplicação web interativa — Fluxogramas Contact Center Gebalis
      </p>

      <nav aria-label="Índice" className="cartao mt-8 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Índice
        </h2>
        <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          {indice.map((t, i) => (
            <li key={t}>
              <a href={`#s${i + 1}`} className="hover:underline">
                {i + 1}. {t}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        <Seccao numero="1" titulo="Finalidade do documento">
          <p>
            Este relatório descreve a aplicação web interativa “Fluxogramas Contact Center”,
            para permitir a compreensão do seu objetivo, âmbito funcional, informação tratada,
            controlos conhecidos, limitações e evidências necessárias a uma auditoria externa.
          </p>
          <p>
            O documento é uma pré-auditoria documental. Não constitui certificação de segurança,
            conformidade legal, acessibilidade ou desempenho; os pontos assinalados como “a
            confirmar” requerem evidência técnica e validação independente.
          </p>
        </Seccao>

        <Seccao numero="2" titulo="Identificação da aplicação">
          <Tabela
            cabecalho={["Campo", "Descrição"]}
            linhas={[
              ["Designação", "Fluxogramas Contact Center / fluxograma-vision"],
              ["Entidade de negócio", "Gebalis — organização municipal de habitação de Lisboa"],
              [
                "Objetivo",
                "Disponibilizar navegação interativa pelos fluxogramas de atendimento e encaminhamento do Contact Center.",
              ],
              [
                "Base documental",
                `Exportação Visio “Fluxograma_Vision_T1”, com ${totalPaginas} páginas.`,
              ],
              [
                "Áreas abrangidas",
                "Social, Edificado, DAF/DRA, Rendas, GC, ENH, DAJ, SR, 855 e outras páginas do documento de origem.",
              ],
              [
                "Público-alvo previsto",
                "Colaboradores autorizados e, caso aplicável, outros utilizadores definidos pela Gebalis.",
              ],
              [
                "Ambiente conhecido",
                "Aplicação web publicada; alojamento, repositório, base de dados e pipeline de entrega a confirmar.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="3" titulo="Objetivo e âmbito funcional">
          <p>
            A aplicação transforma um conjunto extenso de diagramas de processo numa experiência
            de consulta navegável, reduzindo o tempo de localização de procedimentos e apoiando o
            encaminhamento consistente dos temas tratados pelo Contact Center.
          </p>
          <Tabela
            cabecalho={["Função", "Descrição observada", "Evidência a fornecer"]}
            linhas={[
              [
                "Consulta de fluxogramas",
                "Navegação por conteúdos provenientes do export Visio.",
                `Inventário das ${totalPaginas} páginas e mapeamento de navegação.`,
              ],
              [
                "Navegação institucional",
                "O logótipo funciona como acesso à página inicial.",
                "Teste funcional e captura de ecrã por página/rota.",
              ],
              [
                "Identidade visual",
                "Utiliza cores e marca Gebalis.",
                "Manual de marca e validação do responsável de comunicação.",
              ],
              [
                "Rodapé",
                "Apresenta “Fluxogramas - Contact Center” e a data corrente.",
                "Captura de ecrã e especificação do formato/data.",
              ],
              [
                "Administração",
                "Existe um perfil administrativo para edição e publicação.",
                "Matriz de permissões, método de autenticação e registos de atividade.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="4" titulo="Arquitetura a confirmar">
          <p>
            O auditor deve obter uma arquitetura técnica validada pelo responsável de
            desenvolvimento/fornecedor antes de concluir qualquer avaliação de risco.
          </p>
          <Tabela
            cabecalho={["Componente", "Estado documental", "Questões para auditoria"]}
            linhas={[
              [
                "Frontend",
                "Aplicação web interativa; tecnologia específica não documentada.",
                "Framework, versão, rotas, tratamento de erros, dependências e build.",
              ],
              [
                "Conteúdo",
                `Derivado de exportação Visio de ${totalPaginas} páginas.`,
                "Onde reside, formato, processo de atualização, versionamento e validação.",
              ],
              [
                "Autenticação administrativa",
                "Existe; mecanismo e robustez não documentados.",
                "Gestão de credenciais, MFA, hash de palavras-passe, sessões e recuperação.",
              ],
              [
                "Backend/API",
                "A confirmar se existe.",
                "Endpoints, autenticação, autorização, validação, rate limiting e logs.",
              ],
              [
                "Persistência",
                "A confirmar.",
                "Base de dados, local storage, cookies, dados em cache e retenção.",
              ],
              [
                "Alojamento e rede",
                "A confirmar.",
                "Fornecedor, região, CDN, DNS, TLS, backups, WAF e monitorização.",
              ],
              [
                "Entrega de software",
                "A confirmar.",
                "Repositório, revisões de código, CI/CD, ambientes e gestão de segredos.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="5" titulo="Fluxo de utilização">
          <Tabela
            cabecalho={["Passo", "Utilizador normal", "Administrador"]}
            linhas={[
              [
                "1. Acesso",
                "Abre a aplicação no endereço publicado.",
                "Abre a aplicação e autentica-se na área administrativa.",
              ],
              [
                "2. Orientação",
                "Usa página inicial, áreas temáticas e ligações para encontrar o fluxograma aplicável.",
                "Acede às funções de manutenção autorizadas.",
              ],
              [
                "3. Consulta",
                "Lê o fluxograma e segue ligações internas, regressando ao início pelo logótipo.",
                "Revê ou altera conteúdos conforme competência atribuída.",
              ],
              [
                "4. Resultado",
                "Obtém orientação para encaminhamento/processo.",
                "Publica alterações segundo procedimento de aprovação a documentar.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="6" titulo="Dados e privacidade">
          <p>
            Pela finalidade declarada, a aplicação deve disponibilizar apenas informação
            processual e não necessitar de dados pessoais. Esta premissa tem de ser confirmada
            por inspeção técnica, testes e análise dos fluxos reais.
          </p>
          <Tabela
            cabecalho={["Categoria", "Estado atual", "Controlos/evidências exigidos"]}
            linhas={[
              [
                "Dados pessoais",
                "Não confirmados; não devem ser inseridos nos fluxogramas sem fundamento e controlo.",
                "Inventário de dados, finalidade, base legal, retenção e avaliação pelo DPO.",
              ],
              [
                "Credenciais administrativas",
                "Existem; classificação confidencial.",
                "Política de palavra-passe, armazenamento seguro, revogação, rotação e MFA.",
              ],
              [
                "Dados de utilização/logs",
                "A confirmar.",
                "Lista de eventos, IP/cookies, finalidade, retenção, acesso e anonimização.",
              ],
              [
                "Cookies e armazenamento local",
                "A confirmar.",
                "Inventário de cookies/local storage, informação e política de privacidade.",
              ],
              [
                "Conteúdo dos fluxogramas",
                "Informação operacional interna; classificação a definir.",
                "Responsável de conteúdo, aprovação, versões e controlo de publicação.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="7" titulo="Acessos e responsabilidades">
          <p>
            A aplicação deve operar segundo o princípio do menor privilégio. O acesso
            administrativo não pode depender de credenciais partilhadas nem de mecanismos apenas
            ocultos na interface.
          </p>
          <Tabela
            cabecalho={["Papel", "Permissões esperadas", "Risco a controlar"]}
            linhas={[
              [
                "Visitante/utilizador",
                "Consultar apenas as páginas autorizadas.",
                "Acesso indevido a conteúdos internos e enumeração de rotas.",
              ],
              [
                "Administrador",
                "Editar e publicar conteúdo, dentro de uma autorização formal.",
                "Alterações não autorizadas, publicação errada, apropriação de conta.",
              ],
              [
                "Responsável funcional",
                "Aprovar conteúdo e validar processos.",
                "Conteúdo desatualizado ou incorreto.",
              ],
              [
                "Responsável técnico/fornecedor",
                "Manter plataforma, acessos técnicos, atualizações e incidentes.",
                "Dependência de fornecedor, segredos e falhas sem resposta.",
              ],
              [
                "DPO/segurança/IT",
                "Validar privacidade, segurança e conformidade institucional.",
                "Ausência de supervisão e registo de decisões.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="8" titulo="Avaliação preliminar de riscos">
          <p>
            Classificação preliminar. A avaliação final resulta de testes de intrusão
            autorizados, revisão de código/configuração e entrevistas aos responsáveis.
          </p>
          <Tabela
            cabecalho={["ID", "Risco", "Impacto", "Probabilidade", "Prioridade", "Tratamento"]}
            linhas={[
              [
                "R-01",
                "Credencial administrativa fraca, partilhada ou exposta.",
                "Elevado",
                "Média",
                "Crítica",
                "Contas individuais, MFA, hash forte no servidor, rotação e rate limiting.",
              ],
              [
                "R-02",
                "Autorização insuficiente em rotas/API administrativas.",
                "Elevado",
                "Média",
                "Alta",
                "Impor autorização no servidor e testar acesso direto a URLs/endpoints.",
              ],
              [
                "R-03",
                "Conteúdo operacional incorreto ou desatualizado.",
                "Elevado",
                "Média",
                "Alta",
                "Workflow de aprovação, versão, proprietário por área e histórico.",
              ],
              [
                "R-04",
                "Exposição não intencional de dados pessoais ou internos.",
                "Elevado",
                "Baixa a média",
                "Alta",
                "Inventário de dados, revisão de conteúdo, classificação e regras de publicação.",
              ],
              [
                "R-05",
                "Dependências vulneráveis ou segredos no código.",
                "Elevado",
                "Média",
                "Alta",
                "SCA, análise de segredos, atualização contínua e SBOM.",
              ],
              [
                "R-06",
                "Falhas de acessibilidade impedem consulta por todos os utilizadores.",
                "Médio",
                "Média",
                "Média",
                "Auditoria WCAG 2.2 AA automática e manual.",
              ],
              [
                "R-07",
                "Ausência de logs, cópias de segurança ou resposta a incidentes.",
                "Médio",
                "Média",
                "Média",
                "Logging centralizado, retenção definida, backups testados e playbook.",
              ],
              [
                "R-08",
                "Indisponibilidade ou degradação em dispositivos móveis.",
                "Médio",
                "Média",
                "Média",
                "Testes de carga, Lighthouse/Core Web Vitals e testes responsivos.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="9" titulo="Requisitos de segurança">
          <Lista
            itens={[
              "Forçar HTTPS com certificado válido, TLS moderno e redireção de HTTP para HTTPS.",
              "Configurar cabeçalhos de segurança: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options e Referrer-Policy.",
              "Separar autenticação, autorização e apresentação; validar permissões no servidor para todas as operações de administração.",
              "Usar contas administrativas individuais, palavras-passe fortes, MFA e expiração/rotação conforme política institucional.",
              "Manter segredos fora do código e do cliente; proibir credenciais embutidas em JavaScript, repositórios ou ficheiros públicos.",
              "Aplicar validação de entradas, codificação de saídas e proteção contra XSS, CSRF, injeções, enumeração e força bruta.",
              "Executar análise de dependências e vulnerabilidades antes de cada publicação e periodicamente.",
              "Produzir logs de autenticação, alterações e publicações, protegidos contra alteração e com acesso restrito.",
            ]}
          />
        </Seccao>

        <Seccao numero="10" titulo="Acessibilidade e UX">
          <p>
            A meta recomendada é a conformidade WCAG 2.2 nível AA, com validação automática e
            testes manuais.
          </p>
          <Lista
            itens={[
              "Definir idioma da página como pt-PT, títulos estruturados e nomes acessíveis para todos os controlos.",
              "Garantir contraste suficiente, foco de teclado visível e operação integral por teclado.",
              "Fornecer texto alternativo para imagens e versões textuais dos fluxogramas essenciais.",
              "Testar menus, modais, pesquisa e mensagens de estado com leitor de ecrã.",
              "Testar em mobile, tablet e desktop, incluindo zoom e reflow sem perda de conteúdo.",
            ]}
          />
        </Seccao>

        <Seccao numero="11" titulo="Desempenho e disponibilidade">
          <Lista
            itens={[
              "Medir Lighthouse e Core Web Vitals em desktop e mobile, registando data e condições do teste.",
              "Otimizar imagens/diagramas, usar formatos adequados, compressão e carregamento diferido.",
              "Definir estratégia de cache, monitorização de disponibilidade e página de erro sem detalhes técnicos.",
              "Documentar objetivos de disponibilidade, janelas de manutenção, recuperação e testes de restauro.",
            ]}
          />
        </Seccao>

        <Seccao numero="12" titulo="Plano de testes para auditor">
          <Tabela
            cabecalho={["Domínio", "Testes mínimos", "Evidência final"]}
            linhas={[
              [
                "Segurança externa",
                "TLS, headers, enumeração, autenticação, autorização, XSS/CSRF, sessão, dependências e exposição de ficheiros.",
                "Relatório de pentest, severidade, evidências e plano de correção.",
              ],
              [
                "Código e configuração",
                "Revisão de repositório, segredos, bibliotecas, build/hosting e infraestrutura.",
                "Relatório SAST/SCA, SBOM, lista de correções e aprovações.",
              ],
              [
                "Funcional",
                `Amostra representativa das ${totalPaginas} páginas, links, retorno ao início, rodapé/data e administração.`,
                "Casos de teste, resultados, evidência de defeitos e retestes.",
              ],
              [
                "Acessibilidade",
                "axe/Lighthouse e testes manuais por teclado, leitor de ecrã, zoom e contraste.",
                "Declaração de conformidade, critérios e exceções justificadas.",
              ],
              [
                "Privacidade",
                "Inventário de dados, cookies, logs, fornecedores e retenção.",
                "Registo de tratamento/parecer DPO, política de privacidade e DPIA se necessária.",
              ],
              [
                "Resiliência",
                "Backups, restauro, indisponibilidade, gestão de incidentes e continuidade.",
                "Evidência de teste de restauro e plano de resposta a incidentes.",
              ],
            ]}
          />
        </Seccao>

        <Seccao numero="13" titulo="Evidências a entregar">
          <Lista
            itens={[
              "URL, proprietário do serviço, contactos técnicos/funcionais e classificação de informação.",
              "Diagrama de arquitetura, inventário de componentes, endpoints, fornecedores e localização de dados.",
              "Acesso temporário e controlado a ambiente de teste, contas de teste e regras de engagement para pentest.",
              "Código-fonte ou evidência de revisão independente, dependências, SBOM e resultados SAST/SCA/DAST.",
              "Configuração de DNS, TLS, CDN/WAF, alojamento, cópias de segurança, monitorização e logs.",
              "Matriz de acessos, procedimento de criação/revogação de contas e registos de publicação administrativa.",
              `Inventário das ${totalPaginas} páginas de fluxogramas, proprietário por conteúdo, revisão/aprovação e histórico de versões.`,
              "Relatórios de Lighthouse, acessibilidade WCAG, testes responsivos e testes funcionais.",
              "Políticas de privacidade, cookies, retenção, incidentes, continuidade e controlo de alterações.",
            ]}
          />
        </Seccao>

        <Seccao numero="14" titulo="Lacunas críticas antes da auditoria">
          <Lista
            itens={[
              "Mecanismo técnico da autenticação e autorização administrativa.",
              "Alojamento, tecnologias, repositório, dependências e processo de publicação.",
              "Existência e localização de dados, cookies, logs e integrações de terceiros.",
              "Política de palavras-passe, MFA, registos de auditoria e recuperação de conta.",
              "Inventário e classificação do conteúdo, incluindo revisão para evitar dados pessoais.",
              "Resultados recentes de testes de segurança, acessibilidade, desempenho, backups e restauro.",
            ]}
          />
        </Seccao>

        <Seccao numero="15" titulo="Declaração para o auditor">
          <p>
            A Gebalis disponibiliza esta documentação como enquadramento inicial para a auditoria
            externa da aplicação Fluxogramas Contact Center. O auditor deverá validar as
            afirmações mediante evidências técnicas, testes autorizados e entrevistas com os
            responsáveis funcionais e técnicos.
          </p>
          <p>
            Qualquer conclusão sobre conformidade, exposição a risco ou certificação deverá ser
            emitida exclusivamente pelo auditor externo, após delimitação do âmbito e execução dos
            procedimentos de auditoria acordados.
          </p>
        </Seccao>
      </div>
    </div>
  );
}
