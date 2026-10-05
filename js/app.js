/* Componentes compartilhados e navegação. Todo conteúdo variável usa textContent. */
(() => {
"use strict";
const script = document.currentScript;
const base = new URL("../", script.src);
const url = path => new URL(path, base).href;
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const storage = {
 get(key, fallback=null) {try {return JSON.parse(localStorage.getItem("robbverse:"+key)) ?? fallback;} catch {return fallback;}},
 set(key, value) {try {localStorage.setItem("robbverse:"+key,JSON.stringify(value));return true;} catch {return false;}}
};
const image = (icon, alt="") => {
 const img = el("img","icon"); img.src=url("assets/icons/"+icon+".svg");img.alt=alt;img.width=32;img.height=32;return img;
};
let toastTimer;
const toast = text => {
 let node=document.getElementById("realm-toast");
 if (!node) {node=el("div","toast");node.id="realm-toast";node.setAttribute("role","status");document.body.append(node);}
 node.textContent=text;node.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.hidden=true,5500);
};
function dialog(title, description, icon="chest") {
 const node=el("dialog");node.setAttribute("aria-label",title);
 const close=el("button","icon-button close-dialog","×");close.setAttribute("aria-label","Fechar janela");
 close.addEventListener("click",()=>node.close());node.append(close,image(icon),el("h2","",title),el("p","",description));
 node.addEventListener("click",event=>{if(event.target===node){const r=node.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)node.close();}});
 node.addEventListener("close",()=>node.remove());document.body.append(node);node.showModal();return node;
}
function card(post, number) {
 const article=el("article","quest-card");
 const art=el("div","quest-illustration");art.style.setProperty("--card-color",post.color);
 const img=image(post.icon);img.loading="lazy";art.append(el("span","quest-number","REGISTRO "+String(number??window.ROBB_POSTS.indexOf(post)+1).padStart(2,"0")),img);
 const body=el("div","quest-body");
 const title=el("h3");const titleLink=el("a","",post.title);titleLink.href=url("posts/"+post.slug+".html");title.append(titleLink);
 const meta=el("div","quest-meta");const time=el("time","",new Date(post.date+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}));time.dateTime=post.date;meta.append(time,el("span","",post.readingTime+" min de leitura"));
 const link=el("a","text-link","Ler crônica ↗");link.href=titleLink.href;
 body.append(el("div","quest-category",post.category),title,el("p","",post.description),meta,link);article.append(art,body);return article;
}
window.Realm={url,el,image,storage,toast,dialog,card};
document.querySelectorAll("[data-post-count]").forEach(node=>node.textContent=window.ROBB_POSTS.length+" crônicas no reino");
const header=document.querySelector(".site-header");
if(header){
 const inner=el("div","container header-inner");const brand=el("a","brand");brand.href=url("index.html");brand.append(image("crest"),el("span","","Pergaminhos Nerd"));brand.setAttribute("aria-label","Pergaminhos Nerd — início");
 const nav=el("nav","main-nav");nav.id="main-nav";nav.setAttribute("aria-label","Navegação principal");
 const links=[["index.html","A cidade","city"],["explorar.html","Biblioteca","library"],["taverna.html","Taverna","tavern"],["inventario.html","Inventário","inventory"],["sobre.html","O viajante","about"]];
 links.forEach(([path,text,page])=>{const a=el("a","",text);a.href=url(path);if(document.body.dataset.page===page)a.setAttribute("aria-current","page");nav.append(a);});
 const actions=el("div","header-actions");
 const theme=el("button","icon-button");theme.id="theme-toggle";theme.type="button";
 const menu=el("button","icon-button menu-toggle","☰");menu.id="menu-toggle";menu.type="button";menu.setAttribute("aria-label","Abrir menu");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-controls","main-nav");
 function closeMenu(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Abrir menu");}
 menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();menu.focus();}});
 document.addEventListener("click",e=>{if(!header.contains(e.target))closeMenu();});
 nav.addEventListener("click",e=>{if(e.target.closest("a"))closeMenu();});
 matchMedia("(min-width:768px)").addEventListener("change",e=>{if(e.matches)closeMenu();});
 /* Alternância dia/noite: preferência manual persiste, horário local é o padrão. */
 const hour=new Date().getHours();let mode=storage.get("theme",hour>=18||hour<6?"night":"day");
 function setTheme(){document.body.dataset.theme=mode;theme.textContent=mode==="night"?"☾":"☀";theme.setAttribute("aria-label",mode==="night"?"Ativar tema dia":"Ativar tema noite");theme.setAttribute("aria-pressed",String(mode==="night"));document.querySelectorAll("[data-realm-time]").forEach(n=>n.textContent=mode==="night"?"NOITE NO REINO":"DIA NO REINO");}
 theme.addEventListener("click",()=>{mode=mode==="night"?"day":"night";storage.set("theme",mode);setTheme();});actions.append(theme,menu);inner.append(brand,nav,actions);header.append(inner);setTheme();
}
const footer=document.querySelector(".site-footer");
if(footer){
 const inner=el("div","container footer-inner");const identity=el("div");const brand=el("a","brand");brand.href=url("index.html");brand.append(image("crest"),el("span","","Pergaminhos Nerd"));identity.append(brand,el("p","","Um pequeno mundo para guardar pensamentos grandes, partidas longas e histórias pelo caminho."));
 const places=el("div");places.append(el("h3","","CAMINHOS DO REINO"));const links=el("div","footer-links");[["explorar.html","Todas as crônicas"],["inventario.html","Meus favoritos"],["sobre.html","Ficha do viajante"],["taverna.html","Notas da taverna"]].forEach(([path,text])=>{const a=el("a","",text);a.href=url(path);links.append(a);});places.append(links);
 const rest=el("div");rest.append(el("h3","","VIAJE NO SEU RITMO"),el("p","","Sem pressa, sem autoplay. A próxima aventura pode esperar."));
 const motion=el("button","footer-secret");const motionOff=storage.get("motionOff",false);document.body.dataset.motion=motionOff?"off":"on";
 function motionText(){motion.textContent=document.body.dataset.motion==="off"?"Ativar efeitos leves":"Pausar efeitos leves";motion.setAttribute("aria-pressed",String(document.body.dataset.motion==="off"));}
 motionText();motion.addEventListener("click",()=>{document.body.dataset.motion=document.body.dataset.motion==="off"?"on":"off";storage.set("motionOff",document.body.dataset.motion==="off");motionText();});rest.append(motion);
 inner.append(identity,places,rest);const bottom=el("div","container footer-bottom");bottom.append(el("span","","© "+new Date().getFullYear()+" Pergaminhos Nerd · Feito de curiosidade e café."));
 const secret=el("button","footer-secret","Todos os caminhos levam a alguma história. ✧");secret.addEventListener("click",()=>dialog("Uma passagem nas margens","Você encontrou uma porta que não aparece no mapa. Do outro lado: um rascunho, um dia livre e a coragem de começar.","leaf"));bottom.append(secret);footer.append(inner,bottom);
}
document.querySelectorAll("[data-recent-posts]").forEach(node=>{window.ROBB_POSTS.slice(0,3).forEach(p=>node.append(card(p)));});
/* NPC easter eggs: interações opcionais, nunca interrompem a navegação. */
const npcLines={
 guard:["Pode entrar. Não encontramos nada suspeito no seu histórico.","O dragão hoje está de folga. O Wi-Fi continua instável.","Documento? Basta ter uma boa história."],
 librarian:["Você voltou. Os livros fingiram que não perceberam.","Aqui as opiniões ficam em ordem alfabética. As certezas, não.","Silêncio. Tem alguém tentando terminar um parágrafo."],
 bard:["Aceito pedidos. O JavaScript ainda não me paga o suficiente.","Esta música é sobre uma quest que eu não entreguei.","A próxima canção tem sete minutos. Pode pular a introdução."],
 innkeeper:["A mesa é sua. As notificações podem esperar.","O café concede +10 de concentração. Não acumula com ansiedade.","O rumor da semana: alguém fechou todas as abas. Não há testemunhas."]
};
document.querySelectorAll("[data-npc]").forEach(node=>{const role=node.dataset.npc;let index=0;const button=node.querySelector("button"),text=node.querySelector("[data-npc-text]");button.addEventListener("click",()=>{index=(index+1)%npcLines[role].length;text.textContent=npcLines[role][index];});});
document.querySelectorAll("[data-chest]").forEach(button=>button.addEventListener("click",()=>{storage.set("chest",true);dialog("O baú contém…","3 moedas, 1 meia perdida e 17 abas abertas. Você deixa a meia para o próximo aventureiro.");}));
document.querySelectorAll("[data-milestone]").forEach(button=>button.addEventListener("click",()=>toast("Marco zero descoberto. Coordenadas: exatamente onde você precisava estar.")));
document.querySelectorAll(".fireflies").forEach(node=>{for(let i=0;i<7;i++){const mote=el("i");mote.style.setProperty("--x",(20+i*11)+"%");mote.style.setProperty("--y",(32+(i%3)*18)+"%");mote.style.setProperty("--delay",(-i*.7)+"s");node.append(mote);}});
/* Caminhos visitados e atalhos: pequenas descobertas persistentes, sem conta. */
const visited=new Set(storage.get("visited",[]));visited.add(document.body.dataset.page);storage.set("visited",[...visited]);
const passport=document.querySelector("[data-passport]");if(passport)passport.textContent=visited.size+" "+(visited.size===1?"lugar visitado":"lugares visitados");
document.addEventListener("keydown",e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest("input,textarea,select,[contenteditable]")||document.querySelector("dialog[open]"))return;
 if(e.key==="/"){const search=document.getElementById("post-search");if(search){e.preventDefault();search.focus();}}
 if(e.key==="?"){dialog("Guia do viajante","Tab percorre os caminhos; Enter abre portas; Esc fecha janelas. Na Biblioteca, / chama o rastreador. Explore no seu ritmo.","scroll");}
});
})();