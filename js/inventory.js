/* Inventário: slots acessíveis e janelas nativas com foco e Escape. */
(() => {
"use strict";
const {el,image,dialog,storage}=window.Realm;
const grid=document.getElementById("inventory-grid");if(!grid)return;
const tabs=document.getElementById("inventory-filters"),count=document.getElementById("inventory-count");let selected="Todos";
const items=window.ROBB_INVENTORY,categories=["Todos",...new Set(items.map(i=>i.category))];
function render(){grid.replaceChildren();const visible=items.filter(i=>selected==="Todos"||i.category===selected);count.textContent=visible.length+" itens no inventário · nenhum pesa na mochila";
visible.forEach(item=>{const slot=el("button","inventory-slot");slot.type="button";slot.setAttribute("aria-label","Examinar "+item.name);const img=image(item.icon);img.loading="lazy";slot.append(el("span","rarity"),img,el("strong","",item.name),el("small","",item.category));slot.addEventListener("click",()=>{const modal=dialog(item.name,item.description,item.icon);if(item.image){const preview=el("img");preview.src=window.Realm.url(item.image);preview.alt=item.name;preview.loading="lazy";modal.append(preview);}modal.append(el("div","quest-category",item.category+" · "+item.rating),el("blockquote","",item.why));const inspected=new Set(storage.get("inspected",[]));inspected.add(item.name);storage.set("inspected",[...inspected]);});grid.append(slot);});}
categories.forEach(category=>{const button=el("button","",category);button.type="button";button.setAttribute("aria-pressed",String(category===selected));button.addEventListener("click",()=>{selected=category;tabs.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.textContent===selected)));render();});tabs.append(button);});render();
})();