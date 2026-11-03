/* Interactive learning experience for Mind Explorer.
   No dependencies, telemetry, accounts or network requests. */
window.MindLab=(function(){
"use strict";
var DATA=window.MindLabData;
var STORAGE_KEY="mind-explorer-learning-v1";
var ctx=null,loaded=false,storageIssue=false;
var view="paths",trackId="beginner",activeLesson="four-truths",quiz=null;
var mapMode="network",mapFocus="four-truths",mapFilter="All",chainIndex=0;
var progress={passed:{},best:{}};
var labNames={"four-truths":"Four Noble Truths","three-poisons":"Three Poisons","dependent":"Dependent Origination","impermanence":"Impermanence"};
function e(x){return ctx.esc(x)}
function concept(id){return ctx.getConcept(id)}
function details(id){return window.wisdomDetails&&window.wisdomDetails[id]}
function track(){return DATA.tracks.find(function(t){return t.id===trackId})||DATA.tracks[0]}
function allIds(){return DATA.tracks.reduce(function(a,t){return a.concat(t.ids)},[])}
function safeLoad(){
 var raw=ctx.store.get(STORAGE_KEY);
 try{
  var x=raw?JSON.parse(raw):null;
  if(x&&typeof x==="object"){
   if(x.passed&&typeof x.passed==="object"&&!Array.isArray(x.passed)){
    allIds().forEach(function(id){if(x.passed[id]===true)progress.passed[id]=true})
   }
   if(x.best&&typeof x.best==="object"&&!Array.isArray(x.best)){
    allIds().forEach(function(id){var n=x.best[id];if(Number.isInteger(n)&&n>=0&&n<=2)progress.best[id]=n})
   }
  }
 }catch(err){}
}
function persist(){var ok=ctx.store.set(STORAGE_KEY,JSON.stringify(progress));storageIssue=!ok;return ok}
function passed(id){return progress.passed[id]===true}
function countPassed(ids){return ids.filter(passed).length}
function nextUnfinished(t){return t.ids.find(function(id){return !passed(id)})||t.ids[0]}
function setTrack(id){var next=DATA.tracks.find(function(t){return t.id===id});if(!next)return;trackId=next.id;activeLesson=nextUnfinished(next);quiz=null;view="paths";draw()}
function setLesson(id){if(!concept(id))return;activeLesson=id;quiz=null;draw()}
function jumpToNext(){
 var t=track(),i=t.ids.indexOf(activeLesson);
 if(i<t.ids.length-1){activeLesson=t.ids[i+1];quiz=null;draw();return}
 var index=DATA.tracks.indexOf(t);
 if(index<DATA.tracks.length-1){setTrack(DATA.tracks[index+1].id);return}
 view="map";mapFocus=activeLesson;draw()
}
function shuffledOptions(){var items=[0,1,2,3];for(var i=items.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var temp=items[i];items[i]=items[j];items[j]=temp}return items}
function startQuiz(){quiz={id:activeLesson,pos:0,answers:[],order:DATA.questions[activeLesson].map(shuffledOptions),complete:false,score:0};draw();focusElement(".lab-question")}
function answer(n){
 if(!quiz||quiz.complete||quiz.answers[quiz.pos]!==undefined)return;
 if(!Number.isInteger(n)||n<0||n>3)return;
 quiz.answers[quiz.pos]=quiz.order[quiz.pos][n];draw();focusElement(".lab-feedback")
}
function advanceQuiz(){
 if(!quiz||quiz.complete||quiz.answers[quiz.pos]===undefined)return;
 var questions=DATA.questions[quiz.id];
 if(quiz.pos<questions.length-1){quiz.pos++;draw();focusElement(".lab-question");return}
 var score=quiz.answers.filter(function(a,i){return a===questions[i][2]}).length;
 quiz.score=score;quiz.complete=true;
 progress.best[quiz.id]=Math.max(progress.best[quiz.id]||0,score);
 if(score===questions.length)progress.passed[quiz.id]=true;
 persist();draw();focusElement(".lab-summary")
}
function focusElement(selector){var el=document.querySelector(selector);if(el&&typeof el.focus==="function")el.focus()}
function meter(done,total){return '<div class="lab-meter" role="progressbar" aria-label="Lessons mastered" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+(total?100*done/total:0)+'%"></span></div>'}
function renderTabs(){var tabs=[["paths","Learning paths"],["map","Concept maps"]];return '<div class="lab-tabs" role="group" aria-label="Learning Lab views">'+tabs.map(function(a){return '<button type="button" class="'+(view===a[0]?'active':'')+'" data-lab-view="'+a[0]+'" aria-pressed="'+(view===a[0])+'">'+a[1]+'</button>'}).join("")+'</div>'}
function overall(){
 var total=allIds().length,done=countPassed(allIds());
 return '<div class="lab-overview"><div><div class="eyebrow">GUIDED LEARNING</div><h1 class="heading">Learning Lab</h1><p class="sub">See how Buddhist teachings fit together, study in a suggested sequence, and check your understanding as you go.</p></div><div class="lab-stats"><strong>'+done+' <span>/ '+total+'</span></strong><small>Teachings mastered</small>'+meter(done,total)+'</div></div>'+renderTabs()+(storageIssue?'<p class="lab-warning" role="status">Your browser is blocking progress storage. Scores will work for this visit but may not persist.</p>':'');
}
function pathCards(){
 return '<div class="lab-track-grid">'+DATA.tracks.map(function(t,i){var done=countPassed(t.ids);return '<button type="button" class="lab-track '+(t.id===trackId?'selected':'')+'" data-lab-track="'+e(t.id)+'" aria-pressed="'+(t.id===trackId)+'"><span class="lab-track-level">'+e(t.level)+'</span><strong>'+e(t.label)+'</strong><span class="lab-track-description">'+e(t.description)+'</span>'+meter(done,t.ids.length)+'<span class="lab-progress-label">'+done+' / '+t.ids.length+' mastered</span></button>'}).join("")+'</div>'
}
function lessonNavigation(){
 return '<div class="lab-lesson-list" aria-label="Lessons in this path">'+track().ids.map(function(id,i){
  var c=concept(id);return '<button type="button" class="lab-lesson-item '+(id===activeLesson?'active':'')+'" data-lab-lesson="'+e(id)+'" aria-current="'+(id===activeLesson?'step':'false')+'"><span class="lab-lesson-number">'+(passed(id)?'✓':String(i+1).padStart(2,"0"))+'</span><span>'+e(c.name)+'</span>'+(passed(id)?'<span class="lab-lesson-status">Mastered</span>':'')+'</button>'
 }).join("")+'</div>'
}
function sourceHtml(d){if(!d||!d.source)return '';return '<a class="lab-source" target="_blank" rel="noopener noreferrer" href="'+e(d.source.url)+'">'+e(d.source.label)+' ↗</a>'}
function lessonContent(){
 var c=concept(activeLesson),d=details(activeLesson),t=track();if(!c)return '';
 var index=t.ids.indexOf(activeLesson),q=DATA.questions[activeLesson];
 return '<div class="lab-lesson-layout"><aside class="lab-outline"><div class="eyebrow">COURSE OUTLINE</div><h3>'+e(t.label)+'</h3>'+lessonNavigation()+'<p class="lab-small">Select any lesson. Mastery is earned by answering both knowledge checks correctly in one attempt.</p></aside><article class="lab-lesson-panel"><div class="lab-lesson-top"><span class="lab-kicker">LESSON '+(index+1)+' OF '+t.ids.length+'</span>'+(passed(c.id)?'<span class="lab-mastered">✓ Mastered</span>':'<span class="lab-notdone">Knowledge check available</span>')+'</div><h2>'+e(c.name)+'</h2><div class="lab-pali">'+e(c.pali)+' · '+e(c.domain)+'</div><p class="lab-lead">'+e(c.simple)+'</p><div class="lab-section-head">Understand</div><p>'+e(d?d.overview:c.deep)+'</p><div class="lab-section-head">Key insights</div><ul class="lab-read-list">'+(d?d.principles:[c.deep]).map(function(s){return '<li>'+e(s)+'</li>'}).join("")+'</ul><div class="lab-section-head">Try it in daily life</div><ol class="lab-read-list">'+(d?d.practice:[c.example]).map(function(s){return '<li>'+e(s)+'</li>'}).join("")+'</ol><div class="lab-lesson-callout"><span class="eyebrow">REFLECT</span><p>'+e(d?d.question:c.example)+'</p></div>'+(d?'<div class="lab-small"><strong>A useful distinction:</strong> '+e(d.misconception)+'</div>':'')+'<div class="lab-source-row">'+sourceHtml(d)+'<button class="btn outline" type="button" data-lab-open-library="'+e(c.id)+'">Read full Wisdom Library entry ↗</button></div><div class="lab-assessment">'+assessment(q)+'</div><div class="lab-lesson-footer"><button type="button" class="btn outline" data-lab-prev '+(index===0?'disabled':'')+'>← Previous lesson</button><button type="button" class="btn" data-lab-next>Next lesson →</button></div></article></div>'
}
function assessment(questions){
 if(!quiz||quiz.id!==activeLesson)return '<div class="eyebrow">KNOWLEDGE CHECK</div><h3>Recall, then apply</h3><p>Answer two questions without referring back to the notes. A perfect 2 / 2 earns mastery; answers appear in a different order each attempt, and you can retry as often as you like.</p><button type="button" class="btn" data-lab-start>Start 2-question check →</button>'+(progress.best[activeLesson]!==undefined?'<p class="lab-small">Best score: '+progress.best[activeLesson]+' / 2</p>':'');
 if(quiz.complete)return '<div class="lab-summary" tabindex="-1" role="status"><span class="eyebrow">ASSESSMENT COMPLETE</span><h3>'+quiz.score+' / '+questions.length+' correct</h3><p>'+(quiz.score===questions.length?'Excellent recall. This teaching is marked mastered.':'Review the explanation and try again to master this teaching. A perfect score is required.')+'</p><div class="lab-action-group"><button class="btn outline" type="button" data-lab-retry>Retake check</button>'+(quiz.score===questions.length?'<button class="btn" type="button" data-lab-next>Continue learning →</button>':'')+'</div></div>';
 var item=questions[quiz.pos],chosen=quiz.answers[quiz.pos],answered=chosen!==undefined,order=quiz.order[quiz.pos];
 return '<div class="lab-question" tabindex="-1"><div class="lab-question-head"><span class="eyebrow">QUESTION '+(quiz.pos+1)+' OF '+questions.length+'</span><span>Best '+(progress.best[activeLesson]||0)+' / 2</span></div><h3>'+e(item[0])+'</h3><div class="lab-choices" role="group" aria-label="Answer choices">'+order.map(function(originalIndex,i){
  var option=item[1][originalIndex],className=answered?(originalIndex===item[2]?'right':originalIndex===chosen?'wrong':''):'';
  return '<button type="button" class="lab-choice '+className+'" data-lab-answer="'+i+'" '+(answered?'disabled':'')+'><span class="lab-choice-letter">'+String.fromCharCode(65+i)+'</span>'+e(option)+'</button>'
 }).join("")+'</div>'+(answered?'<div class="lab-feedback '+(chosen===item[2]?'right':'wrong')+'" role="status" tabindex="-1"><strong>'+(chosen===item[2]?'That is correct.':'Not quite.')+'</strong><p>'+e(item[3])+'</p><p class="lab-small">Correct answer: '+e(item[1][item[2]])+'</p></div><button type="button" class="btn" data-lab-advance>'+(quiz.pos===questions.length-1?'See my result →':'Next question →')+'</button>':'<p class="lab-small">Choose one answer. You will receive feedback immediately.</p>')+'</div>'
}
function pathView(){return '<div class="lab-intro"><h2>Choose a pathway</h2><p class="muted">Follow a curriculum or move freely among the lessons. Correct knowledge checks record mastery on this device.</p></div>'+pathCards()+lessonContent()+'<div class="lab-bottom-note">Progress is saved only in this browser (when storage is permitted). This is an educational self-check, not a measure of spiritual attainment. <button type="button" class="lab-reset" data-lab-reset>Reset Learning Lab progress</button></div>'}
function networkSvg(){
 var focus=mapFocus,neighbors=new Set([focus]);
 DATA.edges.forEach(function(edge){if(edge[0]===focus)neighbors.add(edge[1]);if(edge[1]===focus)neighbors.add(edge[0])});
 var lines=DATA.edges.map(function(edge){
  var a=DATA.nodes[edge[0]],b=DATA.nodes[edge[1]],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;
  var start=76,end=88,sx=a[0]+dx*start/length,sy=a[1]+dy*start/length,ex=b[0]-dx*end/length,ey=b[1]-dy*end/length;
  var active=edge[0]===focus||edge[1]===focus;var opacity=mapFilter==="All"? (active?0.9:0.19):(active?0.7:0.10);
  return '<line x1="'+sx.toFixed(1)+'" y1="'+sy.toFixed(1)+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="'+(active?'#a68b56':'#9cafa4')+'" stroke-width="'+(active?2.7:1.8)+'" marker-end="url(#labArrow)" opacity="'+opacity+'"></line>';
 }).join("");
 var nodes=Object.keys(DATA.nodes).map(function(id){var c=concept(id),pos=DATA.nodes[id],on=id===focus,related=neighbors.has(id),matches=mapFilter==="All"||c.domain===mapFilter;var opacity=matches?(related?1:0.52):0.16;
 var label=c.name,words=label.split(" "),rows=[];if(label.length<=18)rows=[label];else {var mid=Math.ceil(words.length/2);rows=[words.slice(0,mid).join(" "),words.slice(mid).join(" ")]}
 var tspans=rows.map(function(s,i){return '<tspan x="0" dy="'+(i===0?(rows.length===1?5:-2):17)+'">'+e(s)+'</tspan>'}).join("");
 return '<g class="lab-node '+(on?'selected':'')+'" data-lab-node="'+e(id)+'" role="button" tabindex="0" aria-label="Inspect '+e(label)+'" aria-pressed="'+on+'" transform="translate('+pos[0]+','+pos[1]+')" opacity="'+opacity+'"><rect x="-84" y="-26" width="168" height="52" rx="13" fill="'+(on?'#24483b':matches?'#fffdf8':'#eff1ea')+'" stroke="'+(on?'#c3a360':'#becac1')+'" stroke-width="'+(on?2.4:1.3)+'"></rect><text text-anchor="middle" fill="'+(on?'#fff9eb':'#28463a')+'" font-size="13" font-weight="'+(on?'700':'550')+'">'+tspans+'</text></g>'
 }).join("");
 return '<div class="lab-network-scroll" tabindex="0" aria-label="Scrollable concept network"><svg class="lab-network" viewBox="0 0 1060 555" aria-label="Interactive network connecting fourteen Buddhist teachings"><defs><marker id="labArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#a4aa9b"></path></marker></defs>'+lines+nodes+'</svg></div>';
}
function domainSelect(){
 var domains=["All"].concat(Array.from(new Set(DATA.tracks.reduce(function(a,t){return a.concat(t.ids)},[]).map(function(id){return concept(id).domain}))));
 return '<label class="lab-filter-label" for="labDomain">Highlight domain</label><select id="labDomain" class="lab-select" aria-label="Highlight concept domain">'+domains.map(function(v){return '<option value="'+e(v)+'" '+(mapFilter===v?'selected':'')+'>'+e(v)+'</option>'}).join("")+'</select>'
}
function focusPanel(){
 var c=concept(mapFocus),d=details(mapFocus),links=DATA.edges.filter(function(edge){return edge[0]===mapFocus||edge[1]===mapFocus});
 return '<div class="lab-map-panel"><div class="eyebrow">SELECTED TEACHING</div><h3>'+e(c.name)+'</h3><p>'+e(c.simple)+'</p><div class="lab-section-head">Explore the connections</div><div class="lab-relations">'+links.map(function(x){var from=x[0]===mapFocus,other=concept(from?x[1]:x[0]);return '<button type="button" data-lab-focus="'+e(other.id)+'" class="lab-relation"><span>'+e(from?'→':'←')+'</span><strong>'+e(other.name)+'</strong><small>'+e(x[2])+'</small></button>'}).join("")+'</div><div class="lab-action-group"><button type="button" class="btn" data-lab-open-library="'+e(c.id)+'">Read teaching ↗</button><button type="button" class="btn outline" data-lab-study="'+e(c.id)+'">Study this lesson</button></div></div>'
}
function diagramChain(){
 var steps=DATA.chain;
 return '<div class="lab-note">This is a simplified <strong>illustrative reaction pattern</strong>, not a complete rendering of the twelve links of dependent origination. Not every experience follows it, and protective responses can be appropriate.</div><div class="lab-chain-flow">'+steps.map(function(x,i){return (i>0?'<span class="lab-arrow" aria-hidden="true">→</span>':'')+'<button type="button" class="lab-chain-step '+(i===chainIndex?'active':'')+' '+(i===5?'wise':'')+'" data-lab-chain="'+i+'" aria-pressed="'+(i===chainIndex)+'"><span class="lab-track-level">STEP '+(i+1)+'</span><strong>'+e(x.label)+'</strong></button>'}).join("")+'</div><div class="lab-chain-detail"><div class="eyebrow">EXPLAIN THE STEP</div><h3>'+e(steps[chainIndex].label)+'</h3><p>'+e(steps[chainIndex].description)+'</p><div class="lab-lesson-callout"><span class="eyebrow">ILLUSTRATION</span><p>'+e(steps[chainIndex].example)+'</p></div><button type="button" class="btn outline" data-lab-open-library="'+e(steps[chainIndex].related)+'">Explore related teaching ↗</button></div><p class="lab-small">Mindfulness and wise intention can influence how you respond at many points—not only after distress develops.</p>'
}
function mapView(){
 return '<div class="lab-intro"><h2>See the connections</h2><p class="muted">Select a node or connection to learn how a teaching relates to the others. Arrows indicate conceptual relationships, not proof of a universal causal sequence.</p></div><div class="lab-map-switch" role="group" aria-label="Diagram type"><button class="'+(mapMode==='network'?'active':'')+'" data-lab-mapmode="network" aria-pressed="'+(mapMode==='network')+'">Teaching network</button><button class="'+(mapMode==='chain'?'active':'')+'" data-lab-mapmode="chain" aria-pressed="'+(mapMode==='chain')+'">From reaction to response</button></div>'+(mapMode==="chain"?diagramChain():'<div class="lab-map-toolbar">'+domainSelect()+'<span class="lab-small">Tap a node to inspect it. Scroll horizontally on small screens.</span></div><div class="lab-map-layout">'+networkSvg()+focusPanel()+'</div><details class="lab-accessible-list"><summary>Browse all concepts as a list</summary><div class="lab-all-concepts">'+allIds().map(function(id){return '<button class="tag" data-lab-focus="'+e(id)+'">'+e(concept(id).name)+'</button>'}).join("")+'</div></details>')+'<div class="lab-bottom-note">Connections are simplified teaching relationships. Different Buddhist traditions and scholars may emphasize different interpretations.</div>'
}
function draw(){
 if(!ctx)return;
 ctx.$("main").innerHTML=overall()+(view==="paths"?pathView():mapView())+'<div class="footer">Mind Explorer · Educational learning experience. Wisdom traditions vary. Nothing here constitutes clinical diagnosis or treatment.</div>';
 attach();
}
function bindAll(selector,handler){document.querySelectorAll(selector).forEach(function(n){n.addEventListener("click",handler)})}
function attach(){
 bindAll("[data-lab-view]",function(){view=this.dataset.labView;quiz=null;draw()});
 bindAll("[data-lab-track]",function(){setTrack(this.dataset.labTrack)});
 bindAll("[data-lab-lesson]",function(){setLesson(this.dataset.labLesson)});
 bindAll("[data-lab-start]",function(){startQuiz()});
 bindAll("[data-lab-retry]",function(){startQuiz()});
 bindAll("[data-lab-answer]",function(){answer(Number(this.dataset.labAnswer))});
 bindAll("[data-lab-advance]",function(){advanceQuiz()});
 bindAll("[data-lab-next]",function(){jumpToNext()});
 bindAll("[data-lab-prev]",function(){var arr=track().ids,i=arr.indexOf(activeLesson);if(i>0){activeLesson=arr[i-1];quiz=null;draw()}});
 bindAll("[data-lab-open-library]",function(){ctx.openConcept(this.dataset.labOpenLibrary)});
 bindAll("[data-lab-study]",function(){var id=this.dataset.labStudy,t=DATA.tracks.find(function(x){return x.ids.includes(id)});if(t){trackId=t.id;activeLesson=id;quiz=null;view="paths";draw()}});
 bindAll("[data-lab-mapmode]",function(){mapMode=this.dataset.labMapmode;draw()});
 bindAll("[data-lab-focus]",function(){mapFocus=this.dataset.labFocus;draw()});
 bindAll("[data-lab-node]",function(){mapFocus=this.dataset.labNode;draw()});
 document.querySelectorAll("[data-lab-node]").forEach(function(node){node.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();mapFocus=this.dataset.labNode;draw();var selected=document.querySelector('[data-lab-node="'+mapFocus+'"]');if(selected)selected.focus()}})});
 bindAll("[data-lab-chain]",function(){chainIndex=Number(this.dataset.labChain);draw()});
 bindAll("[data-lab-reset]",function(){if(window.confirm("Reset all Learning Lab quiz scores and mastery on this device? Your Wisdom Library bookmarks and private reflections will remain unchanged.")){progress={passed:{},best:{}};quiz=null;activeLesson=track().ids[0];persist();draw()}});
 var domain=document.getElementById("labDomain");if(domain)domain.addEventListener("change",function(){mapFilter=this.value;draw()});
}
function render(c){
 ctx=c;
 if(!loaded){safeLoad();loaded=true;activeLesson=nextUnfinished(track())}
 draw();
}
function validate(){
 var ids=allIds(),unique=new Set(ids),errors=[];
 if(ids.length!==14||unique.size!==ids.length)errors.push("track coverage");
 ids.forEach(function(id){if(!DATA.nodes[id])errors.push("missing node "+id);var qs=DATA.questions[id];if(!qs||qs.length!==2)errors.push("missing checks "+id);else qs.forEach(function(q,i){if(q[1].length!==4||q[2]<0||q[2]>3||!q[3])errors.push("invalid check "+id+":"+i)})});
 DATA.edges.forEach(function(edge){if(!unique.has(edge[0])||!unique.has(edge[1]))errors.push("unknown relation")});
 return {ok:errors.length===0,errors:errors,topics:ids.length,questions:ids.reduce(function(s,id){return s+(DATA.questions[id]||[]).length},0)};
}
function selectConcept(id){var t=DATA.tracks.find(function(x){return x.ids.includes(id)});if(!t)return;trackId=t.id;activeLesson=id;quiz=null;view="paths";if(ctx)draw()}
return {render:render,validate:validate,selectConcept:selectConcept};
})();
