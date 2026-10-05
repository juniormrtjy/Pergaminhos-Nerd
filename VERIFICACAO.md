# Verificação do Pergaminhos Nerd

Revisão realizada em 4 de outubro de 2026 com Microsoft Edge headless.

- 11 páginas verificadas em 320, 375, 768, 1024 e 1440 px, sem overflow horizontal.
- Links e arquivos referenciados: nenhum caminho estático quebrado.
- Preview servido em /robbverse/ para validar hospedagem em subdiretório.
- Busca por texto/categoria e busca sem acentos: aprovadas.
- Filtros de categoria, mês, estado vazio e crônicas guardadas: aprovados.
- Inventário, filtro, abertura de modal e fechamento por Escape: aprovados.
- Tema dia/noite e persistência após recarregar: aprovados.
- Menu mobile e Escape: aprovados.
- Comentários locais, recarga e tags exibidas como texto: aprovados.
- XP no final do texto e registro de conclusão: aprovados.
- prefers-reduced-motion: efeitos ambientais desativados.
- API pública simulada: leitura e envio aprovados; dados do visitante não geram HTML.
- Sintaxe dos arquivos JS: válida.
- Console nas páginas e interações verificadas: sem erros.
- Revisão visual de desktop, cidade mobile e leitor mobile realizada.
- Proporção da ilustração refinada e verificada nas cinco larguras.

Limites: Supabase real não configurado, portanto sua RLS e conectividade precisam ser verificadas após executar o SQL e preencher a chave pública. Busca, modais e demais sistemas não dependem desse serviço. As referências externas solicitadas não puderam ser abertas pelas ferramentas disponíveis; a identidade visual foi criada originalmente a partir do briefing.

O projeto não foi publicado no GitHub: os arquivos estão prontos para você enviar.

## Player do Spotify

A playlist enviada foi configurada em js/music-config.js.

Verificação adicional:
- Botão opt-in presente nas páginas; sem solicitação ao Spotify antes de entrar no modo música.
- Layout das páginas principais, leitor e painel nas cinco larguras: sem overflow.
- Embed não recriado ao navegar entre Biblioteca, post e Inventário, nem ao recolher/reabrir.
- Play/Pause verificados com um iframe simulado; não houve teste de áudio real ou login Spotify.
- Playlist padrão enviada carrega o endereço correto no embed.
- Links de fora do domínio Spotify e páginas externas no parâmetro de navegação são rejeitados.
- Busca e modais do inventário continuam funcionando dentro da sessão musical.
- Sintaxe JavaScript e console: sem erros.
- Revisão visual do painel em celular realizada.

A reprodução real e seu alcance dependem do serviço Spotify, do navegador e da sessão do visitante. O blog não inicia áudio automaticamente.
