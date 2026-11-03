/* Mind Explorer Studio · privacy, PWA installation, import/export */
(function(){
"use strict";
const S=window.MindStudio;
const LEGACY=["mind-explorer-bookmarks","mind-explorer-reflection","mind-explorer-learning-v1"];
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e});
function backup(s){let legacy={};for(let k of LEGACY){let v=s.context.store.get(k);if(v!==null)legacy[k]=v}return {format:"mind-explorer-backup",version:4,exportedAt:new Date().toISOString(),studio:s.db,legacy:legacy}}
function valid(x){return !!x&&typeof x==="object"&&!Array.isArray(x)}
function readFile(s,el){let file=el.files&&el.files[0];if(!file)return;if(file.size>2000000){s.ui.notice="Backup exceeds the 2 MB import limit.";s.draw();return}let reader=new FileReader();reader.onload=()=>{try{let x=JSON.parse(reader.result);if(!valid(x)||x.format!=="mind-explorer-backup"||x.version!==4||!valid(x.studio)||!valid(x.legacy))throw Error("Unsupported backup format");
 const r=x.studio;if(!valid(r.reviews)||!Array.isArray(r.journal)||!Array.isArray(r.reviewLog)||!Array.isArray(r.sessions)||!Array.isArray(r.assessments))throw Error("Missing Studio records");
 if(r.journal.length>500||r.reviewLog.length>4000||r.sessions.length>2000||r.assessments.length>2000)throw Error("Backup exceeds supported record counts");
 for(let j of r.journal){if(!valid(j)||typeof j.id!=="string"||typeof j.text!=="string"||j.text.length>10000||typeof j.title!=="string")throw Error("Invalid journal entry")}
 let legacy={};for(let k of LEGACY){if(Object.prototype.hasOwnProperty.call(x.legacy,k)){if(typeof x.legacy[k]!=="string"||x.legacy[k].length>180000)throw Error("Invalid saved progress");legacy[k]=x.legacy[k]}}
 if(legacy["mind-explorer-bookmarks"]){let v=JSON.parse(legacy["mind-explorer-bookmarks"]);if(!Array.isArray(v)||v.some(a=>typeof a!=="string")||v.length>100)throw Error("Invalid bookmarks")}
 if(legacy["mind-explorer-learning-v1"]){let v=JSON.parse(legacy["mind-explorer-learning-v1"]);if(!valid(v))throw Error("Invalid Learning Lab state")}
 if(!window.confirm("Replace Studio 4.0 data and any included older Mind Explorer progress with this backup? This cannot be undone without an earlier backup."))return;
 let fails=[];for(let k of LEGACY){if(Object.prototype.hasOwnProperty.call(legacy,k)&&!s.context.store.set(k,legacy[k]))fails.push(k)}
 s.db={version:4,reviews:r.reviews,reviewLog:r.reviewLog,journal:r.journal,sessions:r.sessions,assessments:r.assessments,scenarioLog:Array.isArray(r.scenarioLog)?r.scenarioLog.slice(-300):[],settings:{theme:r.settings&&r.settings.theme==="dark"?"dark":"light",duration:Math.max(1,Math.min(60,Number(r.settings&&r.settings.duration)||5)),bell:!!(r.settings&&r.settings.bell)}};
 if(!s.save())fails.push("Studio records");s.theme();s.ui.notice=fails.length?"Some records could not be imported: "+fails.join(", "):"Backup imported. Reload to refresh Learning Lab 3.0 progress if it is open.";s.draw();
 }catch(error){s.ui.notice="Import failed: "+error.message;s.draw()}};reader.onerror=()=>{s.ui.notice="Cannot read the selected backup.";s.draw()};reader.readAsText(file)}
S.modules.settings={
 render(s){let mode=s.db.settings.theme==="dark"?"dark":"light";
 return s.section("Settings, Offline Access & Backups","Maintain control of your personal learning data. Your journal and scores are stored locally; Mind Explorer does not offer account synchronization.")+
 '<div class="v4-grid v4-half">'+s.card("Appearance & installation",'<p>Current theme: <strong>'+mode+'</strong>. Dark mode is preserved on this device.</p>'+s.btn("Use "+(mode==="dark"?"light":"dark")+" mode","themeLocal",undefined,"btn outline")+s.btn("Install application (if available)","install",undefined,"btn outline")+'<p class="v4-small">After the first online visit, the app shell and bundled study content can be used offline where service workers are supported. External original texts still require a connection. Your browser may provide “Install app” or “Add to Home Screen”.</p>')+
 s.card("Export & restore",'<p>Export a JSON backup with Studio reviews, journal, practice history, and available prior Mind Explorer bookmarks and Learning Lab progress. Import replaces saved records after confirmation.</p>'+s.btn("Download complete backup","export",undefined,"btn")+s.btn("Import a backup","import",undefined,"btn outline")+'<input id="v4-import-file" type="file" accept=".json,application/json" hidden><p class="v4-small">Exports contain readable private notes. Store files securely, especially on shared devices.</p>')+'</div>'+
 s.card("Share a deep link",'<p>Bookmark a Studio section using the URL fragment, such as <code>#studio/diagrams/origin</code>. Link recipients will not see your private journal or progress.</p>'+s.btn("Copy link to this section","copy",undefined,"btn outline"))+
 s.card("Clear Studio-only data",'<p>Clears all Studio 4.0 records from this browser, but preserves the original Wisdom Library bookmarks, older single-note reflection, and Learning Lab 3.0 progress.</p>'+s.btn("Delete Studio 4.0 data","clear",undefined,"btn outline v4-danger"))+
 s.note("Browser-local storage is unencrypted and may be lost when site data is cleared. Repeated exported backups are the most reliable way to retain records across devices.");
 },
 action(s,a){if(a==="themeLocal"){s.db.settings.theme=s.db.settings.theme==="dark"?"light":"dark";s.theme();s.save();s.draw()}
 if(a==="install"){if(installPrompt){installPrompt.prompt();installPrompt=null}else{s.ui.notice="Installation prompt is not currently available. Use your browser's install or Add to Home Screen option after opening the site online.";s.draw()}}
 if(a==="export"){s.download("mind-explorer-backup-"+s.dateKey(Date.now())+".json",JSON.stringify(backup(s),null,2),"application/json")}
 if(a==="import"){let f=document.getElementById("v4-import-file");if(f)f.click()}
 if(a==="copy"){let path=location.origin+location.pathname+"#studio/"+s.ui.page;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(path).then(()=>{s.ui.notice="Section link copied.";s.draw()}).catch(()=>{s.ui.notice="Link: "+path;s.draw()})}else{s.ui.notice="Link: "+path;s.draw()}}
 if(a==="clear"&&window.confirm("Delete all Studio 4.0 data on this device? Older Mind Explorer bookmarks and Learning Lab progress will remain.")){s.db={version:4,reviews:{},reviewLog:[],journal:[],sessions:[],assessments:[],scenarioLog:[],settings:{theme:"light",duration:5,bell:false}};s.theme();s.save();s.ui.notice="Studio 4.0 records cleared.";s.draw()}
 },
 afterRender(s){let f=document.getElementById("v4-import-file");if(f)f.onchange=e=>readFile(s,e.target)}
};
})();