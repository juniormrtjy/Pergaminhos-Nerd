/* Comentários: modo local é uma demonstração privada deste navegador.
   No modo público, a API REST do Supabase aplica os limites e RLS do schema.sql. */
(() => {
"use strict";
const {el,storage}=window.Realm;
const form=document.getElementById("comment-form");if(!form)return;
const slug=document.body.dataset.post,config=window.ROBB_COMMENTS_CONFIG||{};
const hasUrl=Boolean(config.supabaseUrl?.trim()),hasKey=Boolean(config.supabaseAnonKey?.trim());
const publicMode=hasUrl&&hasKey,incomplete=hasUrl!==hasKey;
const list=document.getElementById("comments-list"),status=document.getElementById("comments-status"),mode=document.getElementById("comments-mode"),submit=form.querySelector('button[type="submit"]'),name=form.elements.name,body=form.elements.comment;
const clean=value=>value.normalize("NFC").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"").trim();
const valid=row=>row&&typeof row.name==="string"&&typeof row.comment==="string"&&row.name.trim().length>=1&&row.name.length<=40&&row.comment.trim().length>=1&&row.comment.length<=600&&typeof row.created_at==="string"&&Number.isFinite(Date.parse(row.created_at));
let endpoint;
try{if(publicMode){const project=new URL(config.supabaseUrl);if(project.protocol!=="https:"||project.username||project.password)throw Error();endpoint=new URL("/rest/v1/comments",project);}}catch{status.textContent="Configuração pública inválida: use a URL HTTPS do projeto Supabase.";submit.disabled=true;return;}
mode.textContent=publicMode?"Mural público · Os comentários ficam visíveis para todos os visitantes.":"Modo local · Estes comentários aparecem apenas para você, neste navegador. Não são publicados.";
if(incomplete){status.textContent="Configuração incompleta: preencha a URL e a chave pública para ativar o mural.";submit.disabled=true;return;}
const headers={apikey:config.supabaseAnonKey,"Content-Type":"application/json"};
// Chaves publishable usam apikey. JWT anon legado também usa Authorization.
if(config.supabaseAnonKey?.split(".").length===3)headers.Authorization="Bearer "+config.supabaseAnonKey;
async function request(url,options={}){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch(url,{...options,headers:{...headers,...options.headers},signal:controller.signal});if(!response.ok)throw Error("HTTP "+response.status);return response;}finally{clearTimeout(timeout);}
}
function render(rows){list.replaceChildren();
 const safe=rows.filter(valid).sort((a,b)=>b.created_at.localeCompare(a.created_at));
 if(!safe.length){list.append(el("p","muted","O mural está tranquilo. Você pode começar a conversa."));return;}
 safe.forEach(row=>{const item=el("article","comment"),head=el("div","comment-header"),time=el("time","",new Date(row.created_at).toLocaleString("pt-BR",{dateStyle:"medium",timeStyle:"short"}));time.dateTime=row.created_at;
 // Nunca usar innerHTML: nomes e mensagens são texto, inclusive quando contêm tags.
 head.append(el("strong","",row.name),time);item.append(head,el("p","",row.comment));list.append(item);});
}
async function load(){
 if(!publicMode){const stored=storage.get("comments:"+slug,[]);render(Array.isArray(stored)?stored:[]);return;}
 const target=new URL(endpoint);target.searchParams.set("post_slug","eq."+slug);target.searchParams.set("select","name,comment,created_at");target.searchParams.set("order","created_at.desc");target.searchParams.set("limit","100");
 const response=await request(target);render(await response.json());
}
const counter=document.getElementById("comment-count");body.addEventListener("input",()=>counter.textContent=body.value.length+"/600");
form.addEventListener("submit",async event=>{
 event.preventDefault();if(form.elements.website.value)return;if(!form.reportValidity())return;
 const row={post_slug:slug,name:clean(name.value),comment:clean(body.value)};
 if(row.name.length<1||row.name.length>40||row.comment.length<1||row.comment.length>600){status.textContent="Use um nome de 1–40 caracteres e um comentário de 1–600 caracteres.";return;}
 submit.disabled=true;status.textContent="Registrando sua mensagem…";
 try{
 if(publicMode){
 await request(endpoint,{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(row)});
 // O servidor define a data. Não autorize created_at no grant INSERT.
 form.reset();counter.textContent="0/600";status.textContent="Comentário publicado.";
 try{await load();}catch{status.textContent="Comentário publicado. Recarregue para atualizar o mural.";}
 }else{
 const previous=storage.get("comments:"+slug,[]);const rows=Array.isArray(previous)?previous.filter(valid):[];
 rows.unshift({...row,created_at:new Date().toISOString()});if(!storage.set("comments:"+slug,rows.slice(0,100)))throw Error("storage");
 render(rows.slice(0,100));form.reset();counter.textContent="0/600";status.textContent="Comentário guardado somente neste navegador.";
 }
 }catch{status.textContent=publicMode?"Não foi possível publicar. Confira a conexão e a configuração do Supabase e tente novamente.":"O navegador não permitiu salvar. Verifique se o armazenamento local está disponível.";}
 finally{submit.disabled=false;}
});
load().catch(()=>{status.textContent="Não foi possível carregar o mural público. Você pode tentar recarregar a página.";});
})();