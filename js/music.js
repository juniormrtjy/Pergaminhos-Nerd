/* Entrada opt-in: ativa uma sessão que preserva o player durante a navegação. */
(() => {
"use strict";
const {el,image,url}=window.Realm;
try {
 if (window.parent !== window && window.parent.document.body.dataset.musicShell === "true") {
   document.body.classList.add("music-session");
   return; // O player fica no documento pai; não criamos players duplicados.
 }
} catch {} // Se outro site embutir a página, preservamos a navegação comum.
const button=el("a","music-launcher");
const current=new URL(location.href),root=new URL("./",url("index.html"));
const relative=current.pathname.startsWith(root.pathname)
 ? current.pathname.slice(root.pathname.length)+current.search+current.hash
 : "index.html";
const session=new URL(url("ouvir.html"));session.searchParams.set("pagina",relative);
button.href=session.href;button.setAttribute("aria-label","Abrir Sala do Bardo — player do Spotify");
button.append(image("music"),el("span","","Sala do Bardo"),el("span","music-launcher-note","Spotify"));
document.body.append(button);
document.querySelectorAll("[data-open-music]").forEach(link=>link.href=session.href);
})();