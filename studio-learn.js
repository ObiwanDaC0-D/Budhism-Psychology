/* Mind Explorer Studio · learning, diagrams, assessment and analytics */
(function(){
"use strict";
const S=window.MindStudio;
function master(s){try{let x=JSON.parse(s.context.store.get("mind-explorer-learning-v1")||"{}");return Object.values(x.passed||{}).filter(Boolean).length}catch(e){return 0}}
S.modules.home={
 render(s){let d=s.dueIds().length,mins=Math.round(s.db.sessions.reduce((a,x)=>a+(Number(x.minutes)||0),0));
 let cards=[["◇","Explore the Dhamma Atlas","Investigate six interactive Buddhist frameworks.","diagrams"],["◉","Mind Simulator","Work through branching scenarios of everyday experience.","simulator"],["☷","Canon & Pali Library","Find 38 Pali terms and 16 source texts.","research"],["⇄","Psychology Comparisons","See overlaps and meaningful differences.","compare"],["✎","Private Reflections","Record feeling tone, observations, and lessons.","journal"],["▥","Learning Analytics","Review your actual learning and practice history.","analytics"]];
 return s.section("An integrated learning practice","Choose a short review, explore an idea, or sit in contemplation. Progress shows learning activity, not spiritual attainment.")+'<div class="v4-stats">'+s.metric("Reviews due",d)+s.metric("Topics reviewed",Object.keys(s.db.reviews).length)+s.metric("Learning Lab mastery",master(s)) +s.metric("Meditation minutes",mins)+'</div><div class="v4-hero"><div><div class="eyebrow">TODAY’S PRACTICE</div><h3>Practice seeing more clearly.</h3><p>Recall a teaching, investigate a reaction, and apply one wise intention today.</p><div class="v4-actions"><button type="button" data-route="review" class="btn gold">Review '+d+' concepts →</button><button type="button" data-route="meditate" class="btn outline">Meditation studio</button></div></div><div class="v4-hero-art" aria-hidden="true">✺</div></div><div class="v4-grid v4-triple">'+cards.map(x=>'<article class="v4-card"><div class="v4-symbol">'+x[0]+'</div><h3>'+x[1]+'</h3><p>'+x[2]+'</p><button class="v4-text-btn" type="button" data-route="'+x[3]+'">Explore →</button></article>').join("")+'</div>'
 }
};
S.modules.review={
 render(s){
 let u=s.ui,ids=s.dueIds(),logs=s.db.reviewLog,body=s.section("Active Recall & Spaced Repetition","Review intervals adapt to recall and confidence. This simple scheduler is an educational heuristic, not a validated measure of memory.");
 body+='<div class="v4-stats">'+s.metric("Due now",ids.length)+s.metric("Review attempts",logs.length)+s.metric("Concepts practiced",Object.keys(s.db.reviews).length)+'</div>';
 if(u.reviewId){
 let c=s.getConcept(u.reviewId),q=window.MindLabData.questions[u.reviewId][u.reviewIndex],done=u.reviewDone;
 body+='<section class="v4-card v4-feature"><div class="eyebrow">'+s.esc(c.name)+' · ACTIVE RECALL</div><h3>'+s.esc(q[0])+'</h3><div class="v4-choices">'+q[1].map((o,i)=>s.btn('<span class="v4-letter">'+String.fromCharCode(i+65)+'</span>'+s.esc(o),"answer",i,"v4-choice "+(u.reviewChoice===i?"selected":"")+(done?(i===q[2]?" correct":u.reviewChoice===i?" incorrect":""):""))).join("")+'</div>';
 if(!done){body+='<label class="v4-slider-label" for="v4-confidence">Confidence <strong id="v4-confidence-value">'+u.reviewConfidence+' / 5</strong></label><input id="v4-confidence" data-input="confidence" type="range" min="1" max="5" value="'+u.reviewConfidence+'">'+s.btn("Submit answer","score",undefined,"btn")+'<p class="v4-small">Select an answer, then submit. Rate how sure you are before seeing feedback.</p>';}
 else{let r=s.db.reviews[u.reviewId];body+='<div class="v4-feedback" role="status"><strong>'+(u.reviewChoice===q[2]?"That is correct.":"Correct answer: "+s.esc(q[1][q[2]]))+'</strong><p>'+s.esc(q[3])+'</p><span>Next scheduled review: '+s.date(r.due)+' · interval '+r.interval+' day(s)</span></div>'+s.btn("Choose another topic →","clear",undefined,"btn")}
 body+='</section>';
 }
 body+='<section class="v4-card"><h3>All teachings</h3><div class="v4-topic-grid">'+s.context.concepts.map(c=>{let r=s.db.reviews[c.id];return '<div class="v4-topic"><span class="v4-kicker">'+(s.due(c.id)?"DUE":"SCHEDULED · "+s.date(r.due))+'</span><h4>'+s.esc(c.name)+'</h4><p>'+(r?"Last: "+(r.correct?"correct":"needs another look"):"Not yet reviewed")+'</p>'+s.btn("Review","start",c.id,"v4-text-btn")+'</div>'}).join("")+'</div></section>';
 return body;
 },
 action(s,a,id){let u=s.ui;
 if(a==="start"){u.reviewId=id;u.reviewIndex=Math.floor(Math.random()*2);u.reviewChoice=null;u.reviewDone=false;u.reviewConfidence=3;s.draw()}
 if(a==="answer"&&!u.reviewDone){u.reviewChoice=Number(id);s.draw()}
 if(a==="clear"){u.reviewId=null;s.draw()}
 if(a==="score"&&u.reviewChoice!==null&&!u.reviewDone){let id=u.reviewId,q=window.MindLabData.questions[id][u.reviewIndex],correct=u.reviewChoice===q[2],prev=s.db.reviews[id]||{},old=prev.interval||0,days=correct?(u.reviewConfidence<=2?1:old?Math.min(180,Math.round(old*(u.reviewConfidence>=4?2.2:1.5))):1):1,now=Date.now();days=Math.max(1,days);
 s.db.reviews[id]={at:now,due:now+days*86400000,interval:days,correct:correct,confidence:u.reviewConfidence,attempts:(prev.attempts||0)+1};s.db.reviewLog.push({at:now,id:id,question:u.reviewIndex,correct:correct,confidence:u.reviewConfidence,nextDays:days});s.db.reviewLog=s.db.reviewLog.slice(-4000);u.reviewDone=true;s.save();s.draw();}
 },
 input(s,type,el){if(type==="confidence"){s.ui.reviewConfidence=Number(el.value);let v=document.getElementById("v4-confidence-value");if(v)v.textContent=el.value+" / 5";}}
};
S.modules.diagrams={
 render(s){let f=s.data.frameworks.find(x=>x.id===s.ui.diagram)||s.data.frameworks[0],i=Math.min(s.ui.diagramIndex,f.items.length-1),v=f.items[i];
 return s.section("Dhamma Atlas","Six explorable diagrams preserve traditional categories. Linked concepts are pedagogical, not a literal laboratory model.")+'<div class="v4-pills">'+s.data.frameworks.map(x=>s.btn(s.esc(x.title),"framework",x.id,"v4-pill "+(f.id===x.id?"active":""))).join("")+'</div><section class="v4-card"><div class="eyebrow">'+s.esc(f.pali)+'</div><h3>'+s.esc(f.title)+'</h3><p>'+s.esc(f.intro)+'</p><div class="v4-flow" aria-label="'+s.esc(f.title)+'">'+f.items.map((x,j)=>'<div class="v4-flow-unit">'+(j?'<span class="v4-flow-arrow" aria-hidden="true">→</span>':'')+s.btn('<small>'+String(j+1).padStart(2,"0")+'</small><strong>'+s.esc(x[0])+'</strong><em>'+s.esc(x[1])+'</em>',"node",j,"v4-flow-node "+(i===j?"active":""))+'</div>').join("")+'</div><div class="v4-insight"><div class="eyebrow">COMPONENT '+(i+1)+' / '+f.items.length+'</div><h3>'+s.esc(v[0])+' <span class="v4-pali">'+s.esc(v[1])+'</span></h3><p>'+s.esc(v[2])+'</p><p><strong>Illustration:</strong> '+s.esc(v[3])+'</p><div class="v4-actions">'+s.btn("← Previous","prev",undefined,"btn outline")+s.btn("Next →","next",undefined,"btn outline")+s.btn("Copy element link","copyNode",undefined,"btn outline")+s.link(f.source,"Primary text")+'</div></div></section>'+s.note("For the twelve links, traditional interpretations involve conditionality across existence and rebirth; the everyday illustrations are not a substitute for the original teaching.")
 },
 action(s,a,id){let u=s.ui,f=s.data.frameworks.find(x=>x.id===u.diagram);
 if(a==="framework"){u.diagram=id;u.diagramIndex=0;s.navigate("diagrams",id)}
 if(a==="node"){u.diagramIndex=Number(id);s.draw()}
 if(a==="prev"){u.diagramIndex=Math.max(0,u.diagramIndex-1);s.draw()}
 if(a==="next"){u.diagramIndex=Math.min(f.items.length-1,u.diagramIndex+1);s.draw()}
 if(["node","prev","next"].includes(a)){try{history.replaceState(null,"","#studio/diagrams/"+u.diagram+"/"+u.diagramIndex)}catch(e){}}
 if(a==="copyNode"){let href=location.origin+location.pathname+"#studio/diagrams/"+u.diagram+"/"+u.diagramIndex;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(href).then(()=>{s.ui.notice="Element link copied.";s.draw()}).catch(()=>{s.ui.notice=href;s.draw()})}else{s.ui.notice=href;s.draw()}}
 }
};
function assessLog(s,kind,score,total){s.db.assessments.push({at:Date.now(),kind:kind,score:score,total:total});s.db.assessments=s.db.assessments.slice(-2000);s.save()}
S.modules.assess={
 render(s){let u=s.ui,choices=[["matching","Match concepts"],["ordering","Sequence builder"],["explain","Explain in your words"]],names=["Anicca","Karuṇā","Vedanā","Upekkhā"],answers=["Impermanence","Compassion","Feeling tone","Equanimity"],order=["Understand dukkha","Investigate craving","Realize cessation","Develop the path"];
 let b=s.section("Advanced Learning Challenges","Use matching, ordering, and self-assessed explanations. An open-ended answer is never marked correct by a simplistic word match.")+'<div class="v4-pills">'+choices.map(x=>s.btn(x[1],"tab",x[0],"v4-pill "+(u.assessment===x[0]?"active":""))).join("")+'</div><section class="v4-card">';
 if(u.assessment==="matching"){b+='<h3>Match the term to its meaning</h3><div class="v4-match">'+names.map((n,i)=>'<label><strong>'+n+'</strong><select data-change="match" data-index="'+i+'"><option value="">Choose a meaning</option>'+answers.map((d,j)=>'<option value="'+j+'" '+(u.match[i]===String(j)?"selected":"")+'>'+d+'</option>').join("")+'</select></label>').join("")+'</div>'+s.btn("Check matching","matchCheck",undefined,"btn")+(u.matchDone?'<p class="v4-feedback" role="status">'+names.filter((n,i)=>Number(u.match[i])===i).length+' / 4 matched. Review the glossary for explanations.</p>':"");}
 if(u.assessment==="ordering"){b+='<h3>Sequence the Four Noble Truths</h3><p>Reorder the statements using the arrow buttons.</p><div class="v4-order">'+u.sort.map((x,i)=>'<div class="v4-order-line"><strong>'+(i+1)+'. '+order[x]+'</strong><div>'+s.btn("↑","up",i,"v4-mini")+s.btn("↓","down",i,"v4-mini")+'</div></div>').join("")+'</div>'+s.btn("Check order","orderCheck",undefined,"btn")+(u.sortDone?'<p class="v4-feedback" role="status">'+(u.sort.every((x,i)=>x===i)?"Correct traditional sequence.":"Not quite. Review the four distinct tasks: understand, abandon, realize, develop.")+'</p>':"");}
 if(u.assessment==="explain"){b+='<h3>Recall through explanation</h3><p>How is basic feeling tone (vedanā) different from a complex emotion? Give one everyday example.</p><textarea data-input="explain" rows="5" maxlength="2000" placeholder="Type your own explanation...">'+s.esc(u.explanation)+'</textarea>'+s.btn("Reveal reference explanation","reveal",undefined,"btn")+(u.explanationShown?'<div class="v4-insight"><p>Vedanā is the pleasant, unpleasant, or neutral quality of an experience. Complex emotions also involve perception, bodily changes, memories, and intentions. An unpleasant feeling on hearing criticism may precede a story about injustice.</p><p>Assess your own answer; this app does not automatically grade free text.</p><div class="v4-actions">'+s.btn("Explained clearly","self","understood","btn outline")+s.btn("Needs review","self","review","btn outline")+'</div></div>':"")}
 return b+"</section>"+s.note("Assessment results reflect in-app tasks, not spiritual attainment or formal psychological testing.");
 },
 action(s,a,id){let u=s.ui;
 if(a==="tab"){u.assessment=id;s.draw()}
 if(a==="matchCheck"){u.matchDone=true;assessLog(s,"matching",[0,1,2,3].filter(i=>Number(u.match[i])===i).length,4);s.draw()}
 if(a==="up"||a==="down"){let i=Number(id),j=a==="up"?i-1:i+1;if(j>=0&&j<4){[u.sort[i],u.sort[j]]=[u.sort[j],u.sort[i]]}u.sortDone=false;s.draw()}
 if(a==="orderCheck"){u.sortDone=true;assessLog(s,"ordering",u.sort.every((x,i)=>x===i)?1:0,1);s.draw()}
 if(a==="reveal"){u.explanationShown=true;s.draw()}
 if(a==="self"){assessLog(s,"self-evaluation",id==="understood"?1:0,1);u.explanation="";u.explanationShown=false;u.notice="Your self-assessment was recorded.";s.draw()}
 },
 input(s,type,el){if(type==="explain")s.ui.explanation=el.value},
 change(s,type,el){if(type==="match"){s.ui.match[Number(el.dataset.index)]=el.value;s.ui.matchDone=false}}
};
S.modules.analytics={
 render(s){
 let logs=s.db.reviewLog,sessions=s.db.sessions,correct=logs.filter(x=>x.correct).length,confidence=logs.length?(logs.reduce((a,x)=>a+Number(x.confidence||0),0)/logs.length).toFixed(1):null,accuracy=logs.length?Math.round(correct/logs.length*100):null;
 let days=[];for(let i=13;i>=0;i--){let now=new Date(),date=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i),key=s.dateKey(date);days.push({date:key,label:(date.getMonth()+1)+"/"+date.getDate(),count:logs.filter(x=>s.dateKey(x.at)===key).length})}
 let max=Math.max(1,...days.map(x=>x.count));
 let chart='<svg viewBox="0 0 720 185" role="img" aria-label="Reviews completed over the past fourteen days" class="v4-chart"><line x1="22" y1="145" x2="707" y2="145" stroke="currentColor" opacity=".28"/>'+days.map((x,i)=>{let height=Math.round(x.count/max*115),left=28+i*48;return '<rect x="'+left+'" y="'+(145-height)+'" width="30" height="'+height+'" rx="4" fill="#aa9264"><title>'+x.date+': '+x.count+' reviews</title></rect><text x="'+(left+15)+'" y="165" fill="currentColor" font-size="11" text-anchor="middle">'+x.label+'</text>'}).join("")+'</svg>';
 let list=s.context.concepts.map(c=>{let items=logs.filter(x=>x.id===c.id),pct=items.length?Math.round(items.filter(x=>x.correct).length/items.length*100):0;return '<div class="v4-knowledge"><span>'+s.esc(c.name)+'</span><div class="v4-meter"><span style="width:'+pct+'%"></span></div><small>'+(items.length?pct+'% · '+items.length+' trials':'Unreviewed')+'</small></div>'}).join("");
 return s.section("Learning Analytics","Based on your actual stored activity. Accuracy is question performance, not a validated estimate of retention.")+'<div class="v4-stats">'+s.metric("Review attempts",logs.length)+s.metric("Answer accuracy",accuracy===null?"—":accuracy+"%")+s.metric("Average confidence",confidence===null?"—":confidence+" / 5")+s.metric("Meditation sessions",sessions.length)+'</div><div class="v4-grid v4-half">'+s.card("Review activity · 14 days",chart)+s.card("Recall by teaching",'<div class="v4-knowledge-list">'+list+'</div>')+'</div>'+s.card("Confidence calibration",logs.length?'<p>High-confidence correct answers: <strong>'+logs.filter(x=>x.correct&&x.confidence>=4).length+'</strong>. High-confidence errors: <strong>'+logs.filter(x=>!x.correct&&x.confidence>=4).length+'</strong>. These descriptive counts are not a clinical measure of metacognition.</p>':'<p>Review a teaching and rate confidence to build a useful history.</p>')+s.card("Export your activity",s.btn("Reviews CSV","reviewsCSV",undefined,"btn outline")+s.btn("Meditation CSV","meditationCSV",undefined,"btn outline")+s.btn("Assessments CSV","assessmentsCSV",undefined,"btn outline"))
 },
 action(s,a){let types={reviewsCSV:["reviewLog",["at","id","question","correct","confidence","nextDays"],"reviews"],meditationCSV:["sessions",["at","practice","minutes","completed"],"meditation"],assessmentsCSV:["assessments",["at","kind","score","total"],"assessments"]},x=types[a];if(x)s.download("mind-explorer-"+x[2]+".csv",s.csv(s.db[x[0]],x[1]),"text/csv")}
};
})();