# Pergaminhos Nerd

Um blog pessoal explorado como uma cidade de RPG. Apenas HTML5, CSS3 e JavaScript puro. Sem build, pacotes ou backend obrigatório. Arte original em SVG, fontes do sistema, nenhum asset de Tibia.

## Rodar localmente

Abra index.html no navegador. Busca, filtros, mapa e inventário não precisam de servidor. Para persistência consistente e comentários, prefira HTTP: navegadores podem restringir localStorage em file://.

Se tiver Python instalado, execute na pasta:

~~~sh
python -m http.server 8000
~~~

Abra http://localhost:8000. Live Server do editor ou qualquer servidor estático também funciona. Python e Node.js não são necessários na hospedagem nem no funcionamento principal.

## Estrutura

- index.html: portão, mapa, quests recentes e prévia da taverna.
- explorar.html: Biblioteca / Arquivo das Crônicas, busca e filtros por categoria, ano, mês e crônicas salvas.
- sobre.html: ficha provisória de Paulo / Robb.
- inventario.html: favoritos em slots e modais.
- taverna.html: notas curtas e Sala do Bardo.
- posts/: seis páginas de leitura independentes.
- css/styles.css: tokens, layouts, dia/noite, mapa, header e footer.
- css/components.css: mural, slots, leitor, formulários e diálogos.
- css/responsive.css: layouts móveis e redução de movimento.
- js/posts.js: dados centrais e textos das crônicas.
- js/app.js: componentes compartilhados, navegação, tema, storage, NPCs e baú.
- js/search.js: rastreador e arquivo agrupado por mês/ano.
- js/post.js: leitor, capítulos, favoritos e XP.
- js/inventory-data.js e js/inventory.js: itens e interação.
- js/comments-config.js e js/comments.js: configuração e comentários.
- js/secrets.js: descobertas adicionais, sem spoilers neste README.
- js/tavern.js: crônicas relacionadas à taverna.
- assets/icons/: ícones originais em pixel art.
- assets/images/: cidade e mapa originais.
- assets/textures/: espaço para futuras texturas; as atuais são CSS.
- supabase/schema.sql: tabela, limites, índice, grants e RLS.
- .nojekyll: publicação estática direta no GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie esta pasta com index.html na raiz.
2. Em Settings → Pages, selecione Deploy from a branch.
3. Escolha a branch usada (exemplo: main) e a pasta / (root); salve.
4. Aguarde a publicação e visite a URL informada pelo GitHub.
5. Exemplo: https://SEU-USUARIO.github.io/SEU-REPOSITORIO/.

Não precisa de workflow de build. Links não apontam para a raiz do domínio. O JS resolve caminhos pela localização de js/app.js, mantendo o funcionamento em /SEU-REPOSITORIO/, inclusive dentro de posts/.

## Adicionar crônicas

1. Duplique posts/pequenas-pausas.html com um novo slug em letras minúsculas, números e hífens.
2. Troque data-post no body pelo novo slug.
3. Adicione um objeto no começo de ROBB_POSTS em js/posts.js:

~~~js
{
 slug: "minha-nova-cronica",
 title: "Um título natural",
 category: "Música",
 description: "Uma descrição curta.",
 date: "2026-10-04",
 readingTime: 3,
 icon: "music",
 color: "#ded9c8",
 keywords: ["playlist", "bardo"],
 body: [
   {type: "p", text: "Primeiro parágrafo."},
   {type: "h2", text: "Um capítulo"},
   {type: "p", text: "Outra ideia."},
   {type: "quote", text: "Um pensamento seu."}
 ]
}
~~~

4. Atualize title, meta description e o conteúdo estático da página duplicada. Eles são o fallback sem JavaScript; no uso normal o conteúdo central substitui esse fallback.
5. Confira se posts/SLUG.html existe.

A home mostra os três primeiros objetos. A Biblioteca ordena por data. Os cards são gerados somente a partir dos dados centrais. Tempo de leitura é uma estimativa editorial. Preserve o slug depois de publicar: ele identifica comentários e favoritos. As seis crônicas são exemplos fictícios.

## Adicionar categorias e destinos

Uma nova category em posts.js aparece automaticamente nos filtros. Não há enumeração de categorias no banco. Para um novo destino no mapa, duplique um link .map-location em index.html e altere href, nome, descrição, ícone e coordenadas --x / --y. Em mobile os destinos viram uma lista em duas colunas.

Links de filtro: explorar.html?categoria=Música. Portal e Observatório abrem uma categoria inicial; os filtros permitem alternar para Tecnologia ou Anime. Sala do Bardo fica na Taverna.

## Alterar inventário e ficha

Edite ROBB_INVENTORY em js/inventory-data.js: name, category, icon, description, why e rating. Favoritos são provisórios, não avaliações reais. Categorias se atualizam automaticamente.

Para usar imagem, inclua image: "assets/images/minha-imagem.webp". Ela aparece no modal, com alt e lazy loading. Use arquivos seus ou licenciados.

Em sobre.html edite nome, classe, origem, guilda, biografia, interesses e os valores de progress. O brasão pode ser substituído por um retrato: mantenha alt, width e height.

Notas curtas ficam em taverna.html. A home tem uma seleção editorial de duas notas; atualize também se quiser trocar os destaques. Textos relacionados da taverna são filtrados em js/tavern.js.

## Comentários locais

Configuração vazia em js/comments-config.js usa localStorage. **As mensagens aparecem apenas para o próprio visitante, no mesmo navegador e origem. Não são compartilhadas.** Limpar os dados do site apaga mensagens, preferências e crônicas guardadas. São preservadas as 100 mensagens locais mais recentes de cada post.

Nome: 1–40 caracteres. Comentário: 1–600. O JS aplica trim, normalização Unicode e remoção de controles. Exibição exclusivamente com textContent; tags digitadas são texto, não HTML. Erros de armazenamento são mostrados sem afirmar que a mensagem foi salva.

## Comentários públicos com Supabase

1. Crie um projeto em https://supabase.com/ e abra o SQL Editor.
2. Execute supabase/schema.sql em um projeto sem uma tabela comments preexistente. Para uma tabela existente, faça uma migração revisada; o script não apaga dados.
3. Copie Project URL e a chave publishable ou anon/public destinada ao frontend.
4. Preencha js/comments-config.js:

~~~js
window.ROBB_COMMENTS_CONFIG = {
 supabaseUrl: "https://SEU-PROJETO.supabase.co",
 supabaseAnonKey: "SUA-CHAVE-PUBLICA"
};
~~~

5. Publique novamente. O rótulo vira Mural público.
6. Abra o mesmo post em outro navegador e confirme leitura e envio. Teste campos vazios, limites e tags.

**Nunca use service_role, secret key, senha do banco ou chave privada.** Chave pública é visível por definição; a segurança depende de RLS e grants. Configuração parcialmente preenchida desativa publicação até corrigir. Erro público não cai silenciosamente no modo local. Mensagens locais não são migradas.

Tabela: id UUID, post_slug, name, comment, created_at. Data vem do servidor. SELECT público; INSERT só em post_slug, name e comment, com limites também no banco. UPDATE e DELETE não são concedidos aos visitantes. A API mostra as 100 mensagens mais recentes por post, sem apagar anteriores no banco.

### RLS e moderação

Mantenha RLS ativa. A política aceita publicação anônima dentro dos limites. Modere pelo dashboard com sua conta administrativa. Honeypot é apenas uma ajuda contra robôs simples. **RLS e limites não impedem spam por volume.** Para tráfego relevante, adicione uma Edge Function com CAPTCHA/rate limit ou autenticação/moderação, e revogue INSERT direto de anon. Essa extensão é opcional e não está incluída.

Documentação oficial: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) e [Segurança da API](https://supabase.com/docs/guides/api/securing-your-api).

Sem um projeto e credenciais seus, a integração pública fica preparada; a validação local usa demonstração e simulação da API.

## Cores e imagens

Edite os tokens em :root de styles.css. body[data-theme="night"] redefine a paleta; leitura continua em fundo claro. Hora local decide o primeiro tema, e a preferência manual persiste.

Troque assets/images/cidade.svg e mapa.svg por arte própria com proporções semelhantes. Ícones pequenos usam shape-rendering crispEdges. Para fotos prefira WebP/AVIF, dimensões explícitas e lazy loading fora do hero. Não use sprites oficiais sem licença.

## Componentes e easter eggs

- NPCs, balões e baú: js/app.js; atributos data-npc e data-chest.
- Descobertas extras: js/secrets.js e atributos data-* nas páginas.
- Cards: Realm.card em app.js.
- Modais: Realm.dialog com dialog nativo, Escape e retorno de foco.
- Texturas: CSS do body, mapa e mural.
- Movimento: responsive.css, prefers-reduced-motion e controle no footer.
- Atalhos: app.js. Tab percorre destinos; Enter ativa; Escape fecha menus e modais.
- Storage: chaves robbverse:. Sem login ou rastreamento externo.

XP é uma brincadeira: +100 quando o fim do texto entra na viewport, não uma prova de leitura. A barra ignora comentários. Favoritos privados ficam no filtro de crônicas guardadas da Biblioteca. Nenhum áudio ou música toca automaticamente.

## Revisão

Teste cidade, Biblioteca, inventário, ficha, taverna e todos os posts em 320, 375, 768, 1024 e 1440 px. Confira busca sem acentos, categorias, ano, mês, vazio, favoritos salvos, modal por teclado, persistência do tema, menu mobile, XP no final e comentários após recarregar. Caminhos devem funcionar também dentro de um subdiretório.

O modo público requer configuração do seu Supabase. O site não faz requisições externas por padrão.
