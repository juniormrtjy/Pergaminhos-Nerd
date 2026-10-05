/* Sistema de filtro dos posts: título, categoria, descrição e palavras-chave. */
(() => {
"use strict";
const {el,card,storage}=window.Realm;
const results=document.getElementById("archive-results");if(!results)return;
const search=document.getElementById("post-search"),tabs=document.getElementById("category-filters"),year=document.getElementById("year-filter"),month=document.getElementById("month-filter"),saved=document.getElementById("saved-filter"),count=document.getElementById("result-count");
const normalize=value=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const categories=["Todos",...new Set(window.ROBB_POSTS.map(p=>p.category))];
const param=new URLSearchParams(location.search).get("categoria");let active=categories.includes(param)?param:"Todos";
categories.forEach(category=>{const button=el("button","",category);button.type="button";button.setAttribute("aria-pressed",String(active===category));button.addEventListener("click",()=>{active=category;tabs.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.textContent===active)));const current=new URL(location.href);if(active==="Todos")current.searchParams.delete("categoria");else current.searchParams.set("categoria",active);try{history.replaceState(null,"",current)}catch{}render();});tabs.append(button);});
[...new Set(window.ROBB_POSTS.map(p=>p.date.slice(0,4)))].sort().reverse().forEach(y=>{const option=el("option","",y);option.value=y;year.append(option);});
const monthNames=Array.from({length:12},(_,i)=>new Date(2026,i,1).toLocaleDateString("pt-BR",{month:"long"}));
monthNames.forEach((name,i)=>{const option=el("option","",name);option.value=String(i+1).padStart(2,"0");month.append(option);});
function render(){
 const needle=normalize(search.value.trim()),bookmarks=storage.get("saved",[]);
 const posts=window.ROBB_POSTS.filter(p=>(active==="Todos"||p.category===active)&&(!year.value||p.date.startsWith(year.value))&&(!month.value||p.date.slice(5,7)===month.value)&&(!saved.checked||bookmarks.includes(p.slug))&&normalize([p.title,p.category,p.description,...p.keywords].join(" ")).includes(needle)).sort((a,b)=>b.date.localeCompare(a.date));
 results.replaceChildren();count.textContent=posts.length+" "+(posts.length===1?"crônica encontrada":"crônicas encontradas");
 if(!posts.length){const empty=el("div","empty-state");empty.append(el("h2","","Nenhum rastro por aqui"),el("p","","Tente outra palavra ou remova um filtro."));const reset=el("button","button secondary","Limpar rastros");reset.addEventListener("click",()=>{search.value="";year.value="";month.value="";saved.checked=false;tabs.querySelector("button").click();});empty.append(reset);results.append(empty);return;}
 const groups=new Map();posts.forEach(p=>{const key=p.date.slice(0,7);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);});
 for(const [key,group] of groups){const section=el("section","archive-month");const heading=el("h2","",monthNames[Number(key.slice(5))-1]+" · "+key.slice(0,4));const grid=el("div","quest-grid");group.forEach(p=>grid.append(card(p)));section.append(heading,grid);results.append(section);}
}
search.addEventListener("input",render);[year,month,saved].forEach(n=>n.addEventListener("change",render));render();
})();