/* Sessão musical estática: o conteúdo navega num frame; o embed mantém sua identidade.
   Sem autoplay, SDK, login próprio, token ou backend. Play/Pause são os do Spotify. */
(() => {
"use strict";
const root=new URL("../",document.currentScript.src);
const view=document.getElementById("realm-view"),panel=document.getElementById("music-panel");
const toggle=document.getElementById("music-toggle"),form=document.getElementById("music-form");
const input=document.getElementById("spotify-link"),embedSlot=document.getElementById("spotify-embed");
const status=document.getElementById("music-status"),external=document.getElementById("spotify-external");
const swap=document.getElementById("music-choice"),exit=document.getElementById("music-exit");
let frame,themeObserver;
const safePage=path=>{
 try {
  const url=new URL(path||"index.html",root);
  if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname)||!url.pathname.endsWith(".html")||url.pathname===new URL("ouvir.html",root).pathname)return new URL("index.html",root);
  return url;
 }catch{return new URL("index.html",root);}
};
function spotifyLink(value) {
 try {
  const url=new URL(value.trim());
  if(url.protocol!=="https:"||url.hostname!=="open.spotify.com"||url.port||url.username||url.password)return null;
  const match=url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?(?:embed\/)?(track|album|playlist)\/([a-zA-Z0-9]{10,64})\/?$/);
  if(!match)return null;
  return {url:"https://open.spotify.com/"+match[1]+"/"+match[2],embed:"https://open.spotify.com/embed/"+match[1]+"/"+match[2]+"?utm_source=generator&theme=0"};
 }catch{return null;}
}
function memoryRead(){try{return sessionStorage.getItem("pergaminhos:spotify")||"";}catch{return "";}}
function memoryWrite(value){try{sessionStorage.setItem("pergaminhos:spotify",value);}catch{}}
function setOpen(open,focus=false){
 panel.hidden=!open;toggle.setAttribute("aria-expanded",String(open));
 toggle.querySelector("span").textContent=open?"Recolher player":"Sala do Bardo";
 if(!open&&focus)toggle.focus();
}
toggle.addEventListener("click",()=>setOpen(panel.hidden));
document.getElementById("music-collapse").addEventListener("click",()=>setOpen(false,true));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)setOpen(false,true);});
function loadTrack(value){
 const chosen=spotifyLink(value);
 if(!chosen){status.textContent="Use o link completo de uma playlist, álbum ou música em open.spotify.com.";status.dataset.error="true";input.focus();return false;}
 // Só recriamos o iframe quando a trilha muda. Navegar ou recolher não altera o src.
 if(!frame||frame.src!==chosen.embed){
  const next=document.createElement("iframe");next.id="spotify-player";next.title="Spotify — tocar e pausar a trilha";next.src=chosen.embed;next.width="100%";next.height="152";next.allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";next.allowFullscreen=true;
  embedSlot.replaceChildren(next);frame=next;
 }
 external.href=chosen.url;external.hidden=false;input.value=chosen.url;memoryWrite(chosen.url);
 status.textContent="Aperte play no Spotify. Você pode pausar quando quiser.";delete status.dataset.error;
 swap.open=false;return true;
}
form.addEventListener("submit",e=>{e.preventDefault();if(form.reportValidity())loadTrack(input.value);});
const initial=safePage(new URLSearchParams(location.search).get("pagina"));
view.src=initial.href;exit.href=initial.href;
view.addEventListener("load",()=>{
 try {
  const current=safePage(view.contentWindow.location.href);
  const short=current.pathname.slice(root.pathname.length)+current.search+current.hash;
  const address=new URL(location.href);address.searchParams.set("pagina",short);history.replaceState(null,"",address);
  exit.href=current.href;document.title=view.contentDocument.title+" · Sala do Bardo";
  themeObserver?.disconnect();
  const syncTheme=()=>document.body.dataset.theme=view.contentDocument.body.dataset.theme||"day";
  syncTheme();themeObserver=new MutationObserver(syncTheme);themeObserver.observe(view.contentDocument.body,{attributes:true,attributeFilter:["data-theme"]});
 }catch{} // file:// pode impedir acesso entre frames; os links de fallback continuam válidos.
});
const initialTrack=memoryRead()||window.PERGAMINHOS_MUSIC_CONFIG?.spotifyUrl||"";
if(initialTrack)loadTrack(initialTrack);else swap.open=true;
})();