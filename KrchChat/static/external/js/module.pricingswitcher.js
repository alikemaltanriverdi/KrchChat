const CanvasPricingSwitcher=(t,e,c,r,s)=>{e.querySelectorAll(".pts-left,.pts-right").forEach(e=>{s.split(" ").forEach(t=>e.classList.remove(t)),r.split(" ").forEach(t=>e.classList.add(t))}),c.querySelectorAll(".pts-switch-content-left,.pts-switch-content-right").forEach(t=>t.classList.add("d-none")),1==t.checked?(r.split(" ").forEach(t=>e.querySelector(".pts-right").classList.remove(t)),s.split(" ").forEach(t=>e.querySelector(".pts-right").classList.add(t)),c.querySelectorAll(".pts-switch-content-right").forEach(t=>t.classList.remove("d-none"))):(r.split(" ").forEach(t=>e.querySelector(".pts-left").classList.remove(t)),s.split(" ").forEach(t=>e.querySelector(".pts-left").classList.add(t)),c.querySelectorAll(".pts-switch-content-left").forEach(t=>t.classList.remove("d-none")))};export default function(t){var e=SEMICOLON.Core;if(e.initFunction({class:"has-plugin-pricing-switcher",event:"pluginPricingSwitcherReady"}),(t=e.getSelector(t,!1)).length<1)return!0;t.forEach(t=>{let e=t.querySelector('[type="checkbox"]'),c=t.closest(".pricing-tenure-switcher"),r=t.getAttribute("data-default-class")||"text-muted op-05",s=t.getAttribute("data-active-class")||"fw-bold",i=document.querySelector(c.getAttribute("data-container"));CanvasPricingSwitcher(e,c,i,r,s),e.addEventListener("change",()=>{CanvasPricingSwitcher(e,c,i,r,s)})})}