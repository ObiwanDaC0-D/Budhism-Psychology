/* Mind Explorer Studio 4.0 · shared shell */
(function(){
"use strict";
const KEY="mind-explorer-studio-v4";
const pages=[["home","⌂","Overview"],["review","◎","Recall"],["diagrams","◇","Diagrams"],["simulator","◉","Simulator"],["research","☷","Research"],["compare","⇄","Comparisons"],["journal","✎","Journal"],["assess","✓","Assessments"],["analytics","▥","Analytics"],["meditate","✧","Meditation"],["settings","⚙","Settings"]];
function fresh(){return {version:4,reviews:{},reviewLog:[],journal:[],sessions:[],assessments:[],scenarioLog:[],settings:{theme:"light",duration:5,pace:6,bell:false}}}
function obj(x){return x!==null&&typeof x==="object"&&!Array.isArray(x)}
function safe(d){let x=obj(d)?d:{},r=fresh();for(let k of ["reviewLog","journal","sessions","assessments","scenarioLog"]){if(Array.isArray(x[k]))r[k]=x[k].slice(-({"journal":500,"sessions":2000,"reviewLog":4000,"assessments":2000,"scenarioLog":300}[k])).filter(obj)}if(obj(x.reviews))r.reviews=x.reviews;
 if(obj(x.settings)){r.settings.theme=x.settings.theme==="dark"?"dark":"light";r.settings.duration=Math.max(1,Math.min(60,Number(x.settings.duration)||5));r.settings.pace=Math.max(4,Math.min(7,Math.round((Number(x.settings.pace)||6)*2)/2));r.settings.bell=!!x.settings.bell}return r}
const S={
 data:window.MindStudioContent,db:fresh(),modules:{},pages:pages,context:null,initialized:false,
 ui:{page:"home",notice:"",reviewId:null,reviewIndex:0,reviewChoice:null,reviewConfidence:3,reviewDone:false,diagram:"origin",diagramIndex:0,scenario:"criticism",scenarioStep:0,scenarioChoices:[],simFactors:[65,40,70,35],researchTab:"terms",researchSearch:"",comparison:"act",journalSearch:"",editJournal:null,assessment:"matching",match:{},matchDone:false,sort:[0,1,2,3],sortDone:false,explanation:"",explanationShown:false,practice:"breath",medRunning:false,medPaused:false,medRemaining:0,medEnd:0},
 esc(x){return String(x??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]))},
 btn(label,op,id,css){return '<button type="button" data-op="'+this.esc(op)+'"'+(id===undefined?'':' data-id="'+this.esc(id)+'"')+' class="'+this.esc(css||"")+'">'+label+'</button>'},
 link(url,label){return '<a href="'+this.esc(url)+'" target="_blank" rel="noopener noreferrer">'+this.esc(label)+' ↗</a>'},
 note(text){return '<div class="v4-note">'+this.esc(text)+'</div>'},
 section(title,desc){return '<div class="v4-heading"><h2>'+this.esc(title)+'</h2><p>'+this.esc(desc)+'</p></div>'},
 card(title,html){return '<section class="v4-card"><h3>'+title+'</h3>'+html+'</section>'},
 metric(label,value){return '<div class="v4-stat"><strong>'+this.esc(value)+'</strong><span>'+this.esc(label)+'</span></div>'},
 date(time){return new Date(time).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})},
 dateKey(time){let d=new Date(time);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")},
 getConcept(id){return this.context.concepts.find(x=>x.id===id)},
 due(id){let r=this.db.reviews[id];return !r||!(Number.isFinite(r.due))||r.due<=Date.now()},
 dueIds(){return this.context.concepts.filter(x=>this.due(x.id)).map(x=>x.id)},
 save(){let ok=this.context.store.set(KEY,JSON.stringify(this.db));if(!ok)this.ui.notice="Browser storage is blocked; recent changes may not persist.";return ok},
 theme(){document.body.classList.toggle("studio-dark",this.db.settings.theme==="dark")},
 download(filename,content,type){let blob=new Blob([content],{type:type||"application/octet-stream"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)},
 csv(rows,columns){let q=x=>'"'+String(x??"").replace(/"/g,'""')+'"';return columns.join(",")+"\n"+rows.map(r=>columns.map(k=>q(r[k])).join(",")).join("\n")},
 navigate(id,detail){if(!pages.some(x=>x[0]===id))id="home";this.ui.page=id;this.ui.notice="";if(detail&&id==="diagrams"&&this.data.frameworks.some(x=>x.id===detail)){this.ui.diagram=detail;this.ui.diagramIndex=0}try{history.replaceState(null,"","#studio/"+id+(detail?"/"+encodeURIComponent(detail):""))}catch(e){}this.draw();try{window.scrollTo(0,0)}catch(e){}},
 onExit(){if(this.modules.meditate&&this.modules.meditate.leave)this.modules.meditate.leave(this)},
 render(ctx){this.context=ctx;if(!this.initialized){this.initialized=true;try{let raw=ctx.store.get(KEY);if(raw)this.db=safe(JSON.parse(raw))}catch(e){this.ui.notice="Saved Studio data could not be opened."}this.theme()}let h;try{h=decodeURIComponent(location.hash||"")}catch(e){h=""}let parts=h.replace(/^#/,"").split("/");if(parts[0]==="studio"){if(pages.some(p=>p[0]===parts[1]))this.ui.page=parts[1];if(this.ui.page==="diagrams"&&this.data.frameworks.some(f=>f.id===parts[2])){this.ui.diagram=parts[2];let group=this.data.frameworks.find(f=>f.id===parts[2]);let n=Number(parts[3]);this.ui.diagramIndex=Number.isInteger(n)&&n>=0&&n<group.items.length?n:0}}this.draw()},
 draw(){if(!this.context)return;let root=this.context.$("main"),page=this.ui.page,mod=this.modules[page];let head='<div class="v4-wrap"><header class="v4-header"><div><div class="eyebrow">WISDOM & INSIGHT STUDIO · V4.0</div><h1 class="heading">Mind Explorer Studio</h1><p class="sub">Learn deeply, remember over time, and practice with discernment.</p></div>'+this.btn("◐ Change theme","theme",undefined,"btn outline")+'</header><nav class="v4-nav" aria-label="Studio sections">'+pages.map(p=>'<button type="button" data-route="'+p[0]+'" class="'+(page===p[0]?"active":"")+'" aria-current="'+(page===p[0]?"page":"false")+'"><span aria-hidden="true">'+p[1]+'</span> '+p[2]+'</button>').join("")+'</nav>'+(this.ui.notice?'<p class="v4-notice" role="status">'+this.esc(this.ui.notice)+'</p>':"");
 root.innerHTML=head+(mod?mod.render(this):'<p>Section unavailable.</p>')+'<footer class="footer">Mind Explorer 4.0 · Educational resource, not medical or psychological treatment. Buddhist interpretations vary. Local notes are not encrypted.</footer></div>';
 root.onclick=e=>{let route=e.target.closest("[data-route]");if(route){this.navigate(route.dataset.route);return}let b=e.target.closest("[data-op]");if(!b||!root.contains(b))return;if(b.dataset.op==="theme"){this.db.settings.theme=this.db.settings.theme==="dark"?"light":"dark";this.theme();this.save();this.draw();return}if(mod&&mod.action)mod.action(this,b.dataset.op,b.dataset.id,e)};
 root.oninput=e=>{if(mod&&mod.input)mod.input(this,e.target.dataset.input,e.target,e)};
 root.onchange=e=>{if(mod&&mod.change)mod.change(this,e.target.dataset.change,e.target,e)};
 root.onsubmit=e=>{e.preventDefault();if(mod&&mod.submit)mod.submit(this,e.target,e)};
 if(mod&&mod.afterRender)mod.afterRender(this);
 }
};
window.MindStudio=S;
if("serviceWorker" in navigator&&location.protocol==="https:")window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js",{scope:"./"}).catch(()=>{}),{once:true});
})();