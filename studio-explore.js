/* Mind Explorer Studio · scenarios, Pali research and scientific comparisons */
(function(){
"use strict";
let S=window.MindStudio;
function pressure(v){return Math.max(0,Math.min(100,Math.round(12+.27*v[0]-.22*v[1]+.42*v[2]-.17*v[3])))}
S.modules.simulator={
 render(s){
 let u=s.ui,sc=s.data.scenarios.find(x=>x.id===u.scenario)||s.data.scenarios[0],step=sc.steps[u.scenarioStep],selected=u.scenarioChoices[u.scenarioStep],v=u.simFactors;
 let text=s.section("Interactive Mind Simulator","Choose a response to an everyday situation. These examples illustrate possible interpretations, not deterministic or clinically validated outcomes.")+'<div class="v4-pills">'+s.data.scenarios.map(x=>s.btn(s.esc(x.title),"scenario",x.id,"v4-pill "+(x.id===u.scenario?"active":""))).join("")+'</div><section class="v4-card"><div class="eyebrow">SCENARIO '+(u.scenarioStep+1)+' OF '+sc.steps.length+'</div><h3>'+s.esc(sc.title)+'</h3><p class="v4-lead">'+s.esc(sc.setup)+'</p><h4>'+s.esc(step.prompt)+'</h4><div class="v4-options">'+step.options.map((o,i)=>s.btn(s.esc(o[0]),"choose",i,"v4-option "+(i===selected?"selected":""))).join("")+'</div>';
 if(selected!==undefined){let o=step.options[selected];text+='<div class="v4-insight" role="status"><div class="eyebrow">A POSSIBLE RESPONSE PATTERN</div><p>'+s.esc(o[1])+'</p><small>Related concept: '+s.esc(o[2])+'</small></div>'+s.btn(u.scenarioStep===sc.steps.length-1?"Finish and save reflection →":"Continue →","continue",undefined,"btn")}
 text+='</section><section class="v4-card"><h3>Conceptual factor explorer</h3><p>Explore one <strong>invented educational model</strong>. The numbers, weighting, and combined score are illustrative only; they are not scientifically validated measures of distress.</p><div class="v4-model">'+["Unpleasant experience","Mindful awareness","Clinging","Compassion"].map((n,i)=>'<label>'+n+' <strong>'+v[i]+'</strong><input type="range" data-input="factor" data-index="'+i+'" min="0" max="100" step="5" value="'+v[i]+'"></label>').join("")+'</div><div class="v4-pressure"><span>Illustrative distress pressure</span><strong>'+pressure(v)+' / 100</strong><div class="v4-meter"><span style="width:'+pressure(v)+'%"></span></div></div>'+s.btn("Reset factors","resetFactors",undefined,"btn outline")+'</section>';
 return text;
 },
 action(s,a,id){let u=s.ui;
 if(a==="scenario"){u.scenario=id;u.scenarioStep=0;u.scenarioChoices=[];s.draw()}
 if(a==="choose"&&u.scenarioChoices[u.scenarioStep]===undefined){u.scenarioChoices[u.scenarioStep]=Number(id);s.draw()}
 if(a==="continue"){let sc=s.data.scenarios.find(x=>x.id===u.scenario);if(u.scenarioChoices[u.scenarioStep]===undefined)return;if(u.scenarioStep===sc.steps.length-1){s.db.scenarioLog.push({at:Date.now(),scenario:u.scenario,choices:u.scenarioChoices.slice()});s.db.scenarioLog=s.db.scenarioLog.slice(-300);s.save();u.scenarioChoices=[];u.scenarioStep=0;u.notice="Scenario completed and saved to local history."}else u.scenarioStep++;s.draw()}
 if(a==="resetFactors"){u.simFactors=[65,40,70,35];s.draw()}
 },
 input(s,type,el){if(type!=="factor")return;let i=Number(el.dataset.index),u=s.ui;u.simFactors[i]=Number(el.value);let bold=el.parentElement.querySelector("strong");if(bold)bold.textContent=el.value;let panel=s.context.$("main").querySelector(".v4-pressure");if(panel){panel.querySelector("strong").textContent=pressure(u.simFactors)+" / 100";panel.querySelector(".v4-meter span").style.width=pressure(u.simFactors)+"%"}}
};
S.modules.research={
 render(s){
 let u=s.ui,isTerms=u.researchTab==="terms",data=isTerms?s.data.terms:s.data.texts,q=u.researchSearch.toLowerCase(),found=data.filter(x=>x.join(" ").toLowerCase().includes(q));
 let content=s.section("Pali & Primary-Text Library","The summaries and glossary work offline after caching. Reading original translations or textual parallels opens external websites and generally requires internet.")+
 '<div class="v4-pills">'+s.btn("Pali glossary · "+s.data.terms.length,"tab","terms","v4-pill "+(isTerms?"active":""))+s.btn("Early discourses · "+s.data.texts.length,"tab","texts","v4-pill "+(!isTerms?"active":""))+'</div><section class="v4-card"><label class="v4-label" for="v4-search">Search Pali, English, themes or discourse IDs</label><input class="search" id="v4-search" data-input="search" value="'+s.esc(u.researchSearch)+'" placeholder="Search: anicca, mindfulness, SN 56.11"><div class="v4-grid v4-half">'+found.map(x=>isTerms?'<article class="v4-research-entry"><h4>'+s.esc(x[0])+' <small>'+s.esc(x[1])+'</small></h4><p>'+s.esc(x[2])+'</p><span class="v4-kicker">'+s.esc(x[3])+'</span></article>':'<article class="v4-research-entry"><span class="v4-kicker">'+s.esc(x[1])+' · '+s.esc(x[4])+'</span><h4>'+s.esc(x[2])+'</h4><p>'+s.esc(x[3])+'</p>'+s.link("https://suttacentral.net/"+encodeURIComponent(x[0]),"Read or compare translations")+'</article>').join("")+'</div>'+(found.length?"":'<p>No matching resources.</p>')+'</section>';
 content+=s.card("How to read the sources",'<p>Discourses were transmitted through oral traditions and collections in several languages. The Pali canon is central to Theravāda traditions, while other Buddhist traditions preserve related material and other philosophical frameworks. Translators can differ over technical terms such as <em>dukkha</em>, <em>saṅkhārā</em>, and <em>anattā</em>.</p><p>The summaries here are original educational paraphrases rather than reproductions of copyrighted translations. Consult different translations and parallel texts for deeper research.</p><div class="v4-actions">'+s.link("https://suttacentral.net","SuttaCentral")+s.link("https://www.dhammatalks.org/suttas/","Dhamma Talks")+'</div>');
 return content;
 },
 action(s,a,id){if(a==="tab"){s.ui.researchTab=id;s.ui.researchSearch="";s.draw()}},
 input(s,type,el){if(type==="search"){s.ui.researchSearch=el.value;let pos=el.selectionStart;s.draw();let field=document.getElementById("v4-search");if(field){field.focus();field.setSelectionRange(pos,pos)}}}
};
S.modules.compare={
 render(s){
 let c=s.data.comparisons.find(x=>x.id===s.ui.comparison)||s.data.comparisons[0];
 return s.section("Buddhist Psychology & Contemporary Science","Compare concepts carefully. Similarities do not imply identical definitions, goals, mechanisms, or clinical efficacy.")+
 '<div class="v4-pills">'+s.data.comparisons.map(x=>s.btn(s.esc(x.name),"pick",x.id,"v4-pill "+(x.id===c.id?"active":""))).join("")+'</div><div class="v4-grid v4-half">'+s.card('<span class="eyebrow">BUDDHIST PERSPECTIVE</span><br>Traditional framework','<p>'+s.esc(c.buddhist)+'</p>')+s.card('<span class="eyebrow">MODERN PERSPECTIVE</span><br>'+s.esc(c.name),'<p>'+s.esc(c.modern)+'</p>')+'</div>'+
 '<div class="v4-grid v4-half">'+s.card("Shared themes",'<p>'+s.esc(c.overlap)+'</p>')+s.card("Important differences",'<p>'+s.esc(c.difference)+'</p>')+'</div>'+
 s.card("Research interpretation & cautions",'<p>'+s.esc(c.evidence)+'</p>'+s.link(c.source,"Open supporting evidence"))+
 s.note("Research evidence for mindfulness and psychotherapy varies by method, setting, population, and outcome. This resource does not substitute for professional mental-health care.");
 },
 action(s,a,id){if(a==="pick"){s.ui.comparison=id;s.draw()}}
};
})();