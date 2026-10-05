/* Leitor de crônicas: corpo sem HTML arbitrário, índice e XP. */
(() => {
"use strict";
const {el,url,card,storage,toast}=window.Realm;
const slug=document.body.dataset.post,post=window.ROBB_POSTS.find(p=>p.slug===slug);
const article=document.getElementById("post-article");if(!article||!post)return;
document.title=post.title+" · Pergaminhos Nerd";
document.querySelector('meta[name="description"]').content=post.description;
article.querySelector("[data-post-category]").textContent=post.category;
article.querySelector("h1").textContent=post.title;
article.querySelector("[data-post-description]").textContent=post.description;
const date=article.querySelector("[data-post-date]");date.dateTime=post.date;date.textContent=new Date(post.date+"T12:00:00").toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"});
article.querySelector("[data-post-time]").textContent=post.readingTime+" min de leitura";
const content=article.querySelector(".post-content"),toc=document.querySelector(".post-toc");let sectionNumber=0;
content.replaceChildren();
post.body.forEach(block=>{
 const tag=block.type==="h2"?"h2":block.type==="quote"?"blockquote":"p";const node=el(tag,"",block.text);
 if(tag==="h2"){node.id="capitulo-"+(++sectionNumber);const link=el("a","",block.text);link.href="#"+node.id;toc.append(link);}
 content.append(node);
});
const related=document.querySelector("[data-related-posts]");
window.ROBB_POSTS.filter(p=>p.slug!==slug).slice(0,2).forEach(p=>related.append(card(p)));
const save=document.getElementById("save-post");
function saveLabel(){const isSaved=storage.get("saved",[]).includes(slug);save.textContent=isSaved?"✓ Crônica guardada":"＋ Guardar crônica";save.setAttribute("aria-pressed",String(isSaved));}
saveLabel();save.addEventListener("click",()=>{const bookmarks=new Set(storage.get("saved",[]));if(bookmarks.has(slug))bookmarks.delete(slug);else bookmarks.add(slug);if(!storage.set("saved",[...bookmarks]))toast("O navegador não permitiu guardar esta crônica.");saveLabel();});
/* Atualiza XP de leitura. Só o texto conta; comentários não alongam a jornada. */
const progress=document.getElementById("reading-progress"),label=document.getElementById("xp-value"),fill=document.querySelector(".xp-fill"),mobile=document.querySelector(".reading-mobile>div"),status=document.getElementById("journey-status"),completion=document.querySelector("[data-completion]");
let completed=false,pending=false;
function update(){
 pending=false;
 const end=content.getBoundingClientRect().bottom+scrollY;
 const start=content.getBoundingClientRect().top+scrollY;
 const percent=Math.max(0,Math.min(100,Math.round((scrollY+innerHeight-start)/Math.max(1,end-start)*100)));
 progress.setAttribute("aria-valuenow",String(percent));label.textContent=percent+"%";fill.style.width=percent+"%";mobile.style.width=percent+"%";
 if(percent===100&&!completed){completed=true;fill.classList.add("complete");status.textContent="+100 XP · Crônica concluída.";completion.textContent="JORNADA CONCLUÍDA · 100%";
 const read=new Set(storage.get("read",[]));if(!read.has(slug)){read.add(slug);storage.set("read",[...read]);toast("+100 XP · Mais uma história no seu repertório.");}}
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);update();
})();