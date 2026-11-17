'use strict';
/* Device-only storage. No backend, accounts, sync, or tracking. */
const KEY='dc.data.v1',THEME='dc.theme',VERSION='1.1';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'$'+(+n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const fmtDate=s=>{const [y,m,d]=String(s).split('-').map(Number);if(!y)return s;return new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})};
const safeUrl=u=>/^https?:\/\//i.test(String(u||''))?u:'';

let D;
try{const raw=localStorage.getItem(KEY);D=raw?JSON.parse(raw):seedData();if(!D||!Array.isArray(D.buy)||!Array.isArray(D.gear)||!Array.isArray(D.log))throw Error('bad data');if(!raw)save()}
catch(e){D=null;document.getElementById('app').innerHTML='<div class="card"><h3>Saved data could not be read</h3><p>Your data is still in this phone\'s storage. Open More → Restore with a backup, or reset.</p><button onclick="localStorage.removeItem(KEY);location.reload()" class="bad">Reset to camp data</button></div>'}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){toast('Could not save — phone storage full?')}}
function toast(t){const el=document.createElement('div');el.className='toast';el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}
function applyTheme(){const t=localStorage.getItem(THEME)||'auto';if(t==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',t)}
applyTheme();

const ICONS={
 camp:'<path d="M12 3 2 20h20L12 3Zm0 6 5 9H7l5-9Z" fill="currentColor"/>',
 gear:'<path d="M9 11.5 6.5 9 5 10.5l4 4 9-9L16.5 4 9 11.5ZM4 18h16v2H4z" fill="currentColor"/>',
 buy:'<path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2h3.3l.9 2H21l-3.6 8H8.1l-.9 2H19v2H4l2.4-4.4L3 4H1z" fill="currentColor"/>',
 log:'<path d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8zm0 4h8v2H8z" fill="currentColor"/>',
 more:'<circle cx="5" cy="12" r="2.2" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><circle cx="19" cy="12" r="2.2" fill="currentColor"/>',
 photos:'<path d="M4 5h3.2l1.6-1.8h6.4L16.8 5H20v14H4V5zm8 3.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Zm0 1.8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="currentColor"/>'
};
const TABS=[['camp','Camp'],['gear','Gear'],['buy','Buy'],['photos','Photos'],['log','Log'],['more','More']];
let tab=sessionStorage.getItem('dc.tab')||'camp',buyView='plan',photoAlbum=sessionStorage.getItem('dc.album')||'';
function goTab(t){tab=t;sessionStorage.setItem('dc.tab',t);if(t==='photos'){photoAlbum='';sessionStorage.removeItem('dc.album');sessionStorage.removeItem('dc.shot')}render();scrollTo(0,0)}
function goPhotos(album,shot){tab='photos';sessionStorage.setItem('dc.tab','photos');photoAlbum=album||'';if(album)sessionStorage.setItem('dc.album',album);else sessionStorage.removeItem('dc.album');if(shot)sessionStorage.setItem('dc.shot',shot);else sessionStorage.removeItem('dc.shot');render();scrollTo(0,0);if(shot)requestAnimationFrame(()=>document.getElementById('shot-'+shot)?.scrollIntoView({block:'start'}))}
function photoLink(name){const ps=typeof photosForName==='function'?photosForName(name):[];if(!ps.length)return '';const p=ps[0];return `<button class="edit" style="flex:0 0 auto" onclick="goPhotos('${p.albumId}','${p.id}')">Photo</button>`}
function renderNav(){$('#nav').innerHTML=TABS.map(([k,l])=>`<button class="${k===tab?'on':''}" onclick="goTab('${k}')" aria-label="${l}"${k===tab?' aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>${l}</button>`).join('')}

/* ---------- totals ---------- */
const lineTotal=b=>(+b.price||0)*(+b.qty||1);
function totals(){const plan=D.buy.filter(b=>b.pick);const planT=plan.reduce((s,b)=>s+lineTotal(b),0),bought=plan.filter(b=>b.bought).reduce((s,b)=>s+lineTotal(b),0);return{planT,bought,left:planT-bought,count:plan.length}}
const groupsOf=arr=>[...new Set(arr.map(x=>x.group||'Other'))];

/* ---------- pages ---------- */
function pageCamp(){
 const g=D.gear,done=g.filter(x=>x.done).length,t=totals(),c=D.camp;
 return `<div class="card hero"><div class="eyebrow" style="margin-top:0;color:#ffb07a">Firearm season · 2026</div><h2 style="margin:4px 0">Deer Camp 2026</h2><p>Brandon, Beans, and Shehan on public land near Kalkaska.</p></div>
 <div class="kpis"><div><span>Gear packed</span><b>${done} / ${g.length}</b><div class="bar"><i style="width:${g.length?done/g.length*100:0}%"></i></div></div>
 <div><span>Camp plan</span><b>${money(t.planT)}</b><span>${t.count} item${t.count===1?'':'s'} · ${money(t.left)} left</span></div></div>
 <div class="between"><div class="eyebrow">The camp</div><button class="sec sm" onclick="editCamp()">Edit</button></div>
 <div class="card props">
  <div><span>Where</span><b>${esc(c.where)}</b></div><div><span>Home base</span><b>${esc(c.base)}</b></div>
  <div><span>The spot</span><b>${esc(c.spot)}</b></div><div><span>Hunt days</span><b>${esc(c.days)}</b></div>
  <div><span>Next camp</span><b>${esc(c.next||'Not set yet')}</b></div></div>
 <div class="between"><div class="eyebrow">The crew</div><button class="sec sm" onclick="editCrew()">Add</button></div>
 <div class="card">${D.crew.map(p=>`<div class="item"><div class="txt"><b>${esc(p.name)}</b><span class="tag">${esc(p.role)}</span><div class="muted">${esc(p.note)}</div></div><button class="edit" onclick="editCrew('${p.id}')" aria-label="Edit ${esc(p.name)}">Edit</button></div>`).join('')||'<p class="muted">No crew yet.</p>'}</div>
 <div class="eyebrow">Tent decision: Kodiak 12x16</div>
 <div class="card"><p style="margin-top:0">Main sleeping tent is the <b>Kodiak 12x16 Cabin Lodge SR</b> with the <b>1672 front room</b>. Stove dropped for now — tents only, <b>$1,899.98</b> before tax at Canvas Camping Tents (in stock, free shipping, free ground tarp).</p><button class="wide" onclick="goTab('buy')">Open shopping list</button><button class="wide sec" onclick="goPhotos('kodiak')">See tent photos</button></div>
 <div class="eyebrow">Good to know</div>
 ${INFO.map(([h,p])=>`<details><summary>${esc(h)}</summary><div class="inner"><p style="margin-top:0">${esc(p)}</p></div></details>`).join('')}
 <p class="muted">Prices and stock were checked Nov 16, 2026, and can change. Data stays on this phone.</p>`}

function pageGear(){
 const g=D.gear,done=g.filter(x=>x.done).length;
 return `<h2>Gear checklist</h2><div class="card"><div class="between"><b>${done} of ${g.length} packed</b><span class="muted">${g.length?Math.round(done/g.length*100):0}%</span></div><div class="bar"><i style="width:${g.length?done/g.length*100:0}%"></i></div>
 <div class="row"><button onclick="editGear()">+ Add item</button><button class="sec" onclick="resetGear()">Uncheck all</button></div></div>
 ${groupsOf(g).map(gr=>`<h3>${esc(gr)}</h3><div class="card">${g.filter(x=>(x.group||'Other')===gr).map(x=>`<div class="item ${x.done?'done':''}"><button class="chk ${x.done?'on':''}" onclick="toggleGear('${x.id}')" aria-pressed="${x.done}" aria-label="Packed: ${esc(x.name)}">✓</button><div class="txt"><b>${esc(x.name)}</b>${x.note?`<div class="muted">${esc(x.note)}</div>`:''}</div>${photoLink(x.name)}<button class="edit" onclick="editGear('${x.id}')" aria-label="Edit ${esc(x.name)}">Edit</button></div>`).join('')}</div>`).join('')||'<div class="card muted">No gear yet. Add your first item.</div>'}`}

function pageBuy(){
 const t=totals(),list=buyView==='plan'?D.buy.filter(b=>b.pick):D.buy;
 const groups=groupsOf(list);
 return `<h2>Shopping list</h2>
 <div class="totals"><div class="kpis"><div><span>In plan</span><b>${money(t.planT)}</b></div><div><span>Bought</span><b>${money(t.bought)}</b></div><div><span>Still to buy</span><b>${money(t.left)}</b></div></div>
 <div class="chips"><button class="${buyView==='plan'?'':'sec'}" onclick="buyView='plan';render()">My plan (${t.count})</button><button class="${buyView==='all'?'':'sec'}" onclick="buyView='all';render()">All options (${D.buy.length})</button></div></div>
 <p class="muted">Tap <b>In plan</b> to add an option to your total; tap <b>Bought</b> once it's paid for. Before tax and shipping.</p>
 ${groups.map((gr,i)=>{const items=list.filter(b=>(b.group||'Other')===gr),sub=items.reduce((s,b)=>s+lineTotal(b),0);return `<details ${buyView==='plan'||i===0?'open':''}><summary><span>${esc(gr)}</span><span class="muted">${money(sub)}</span></summary><div class="inner">${items.map(buyRow).join('')}</div></details>`}).join('')||`<div class="card"><p class="muted">Nothing in your plan yet.</p><button class="wide" onclick="buyView='all';render()">Browse all options</button></div>`}
 <button class="wide" onclick="editBuy()">+ Add item</button>`}
function buyRow(b){const u=safeUrl(b.url);return `<div class="buy"><div class="between" style="align-items:flex-start"><div><div class="name">${esc(b.name)}</div><div class="muted">${esc(b.where)}${(+b.qty||1)>1?` · ${b.qty} × ${money(b.price)}`:''}</div></div><div class="price">${money(lineTotal(b))}</div></div>
 ${b.note?`<div class="muted" style="margin-top:6px">${esc(b.note)}</div>`:''}
 <div class="row" style="justify-content:space-between">${u?`<a class="store" href="${esc(u)}" target="_blank" rel="noopener">Store page ↗</a>`:'<span></span>'}<span class="row" style="flex:0 0 auto;gap:0">${photoLink(b.name)}<button class="edit" style="flex:0 0 auto" onclick="editBuy('${b.id}')">Edit</button></span></div>
 <div class="toggles"><button class="${b.pick?'on':'off'}" onclick="toggleBuy('${b.id}','pick')" aria-pressed="${b.pick}">${b.pick?'✓ In plan':'Add to plan'}</button><button class="${b.bought?'on':'off'}" onclick="toggleBuy('${b.id}','bought')" aria-pressed="${b.bought}">${b.bought?'✓ Bought':'Bought?'}</button></div></div>`}

function pageLog(){
 const sorted=[...D.log].sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0),days=[...new Set(sorted.map(e=>e.date))];
 return `<h2>Hunt log</h2><button class="wide" onclick="editLog()">+ New entry</button>
 ${days.map(d=>`<div class="eyebrow">${esc(fmtDate(d))}</div>${sorted.filter(e=>e.date===d).map(e=>`<div class="card log-entry"><div class="between"><h4>${esc(e.title)}</h4><button class="edit" onclick="editLog('${e.id}')">Edit</button></div><p>${esc(e.text)}</p></div>`).join('')}`).join('')||'<div class="card muted">No entries yet.</div>'}
 <div class="between"><div class="eyebrow">Final tally · 2026</div><button class="sec sm" onclick="editTally()">Edit</button></div>
 <div class="card">${D.tally.map(t=>`<div class="item"><div class="txt">${esc(t)}</div></div>`).join('')||'<p class="muted">Nothing yet.</p>'}</div>`}

function pageMore(){
 const th=localStorage.getItem(THEME)||'auto',dd=D.dream.filter(x=>x.done).length;
 return `<h2>More</h2>
 <div class="between"><div class="eyebrow">Dream camp goals (${dd}/${D.dream.length})</div><button class="sec sm" onclick="addDream()">Add</button></div>
 <div class="card">${D.dream.map(x=>`<div class="item ${x.done?'done':''}"><button class="chk ${x.done?'on':''}" onclick="toggleDream('${x.id}')" aria-pressed="${x.done}" aria-label="Done: ${esc(x.text)}">✓</button><div class="txt"><b>${esc(x.text)}</b></div><button class="edit" onclick="delDream('${x.id}')" aria-label="Delete">✕</button></div>`).join('')}</div>
 <div class="eyebrow">Notes</div><div class="card"><textarea id="notes" placeholder="Anything for next camp…" oninput="D.notes=this.value;save()">${esc(D.notes)}</textarea><span class="muted">Saves as you type.</span></div>
 <div class="eyebrow">Look</div><div class="card"><div class="chips">${['auto','light','dark'].map(t=>`<button class="${th===t?'':'sec'}" onclick="localStorage.setItem(THEME,'${t}');applyTheme();render()">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div></div>
 <div class="eyebrow">Backup</div><div class="card"><p style="margin-top:0">Everything lives only on this phone, including any photos you add. Save a backup file now and then (Files or iCloud Drive), especially before switching phones. Photos you add are included in that file.</p>
 <p class="muted">Last backup: ${D.lastBackup?esc(new Date(D.lastBackup).toLocaleString('en-US')):'never'}</p>
 <div class="row"><button onclick="backup()">Save backup</button><button class="sec" onclick="$('#restore').click()">Restore</button></div>
 <input type="file" id="restore" accept="application/json,.json" hidden onchange="restore(this.files[0])">
 <button class="bad wide" onclick="resetAll()">Reset to original camp data</button></div>
 <p class="muted">Deer Camp v${VERSION} · Free, no account, works offline. Add to Home Screen from Safari's Share menu.</p>`}


/* ---------- photos ---------- */
let photoUrls=[];
function revokePhotoUrls(){photoUrls.forEach(u=>URL.revokeObjectURL(u));photoUrls=[]}
function pagePhotos(){
 const albums=PHOTO_ALBUMS,album=albums.find(a=>a.id===photoAlbum);
 if(!album){
  return `<h2>Photos</h2><p class="muted" style="margin-top:0">Reference pictures of the tents and gear. Add your own inside an album — they stay on this phone only and are never uploaded.</p>
  ${albums.map(a=>{const cover=a.photos[0];return `<div class="card" role="button" tabindex="0" onclick="goPhotos('${a.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();goPhotos('${a.id}')}">
   ${cover?`<div class="cover"><img src="${esc(cover.src)}" alt="" width="900" height="600"></div>`:''}
   <b>${esc(a.title)}</b>
   <div class="muted">${a.photos.length} reference photo${a.photos.length===1?'':'s'}<span data-user-count="${a.id}"></span></div>
   <p class="muted" style="margin:8px 0 0">${esc(a.blurb)}</p>
  </div>`}).join('')}`}
 return `<button class="sec sm" onclick="goTab('photos')">← All albums</button>
  <h2>${esc(album.title)}</h2><p class="muted">${esc(album.blurb)}</p>
  ${album.photos.map(p=>shotHTML(p)).join('')||''}
  <div class="eyebrow">Your photos</div>
  <div data-user-album="${esc(album.id)}"></div>
  <button class="wide sec" onclick="$('#uph').click()">Add a photo</button>
  <input id="uph" type="file" accept="image/*" hidden onchange="addUserPhoto(this.files[0],'${album.id}')">
  <p class="muted">Saved on this phone only. Not uploaded anywhere. Included when you save a backup.</p>`
}
function shotHTML(p,user){
 const src=user?p.src:p.src,cap=p.caption||'Photo',link=user?'':safeUrl(p.source);
 const shop=(!user&&((p.buy&&p.buy[0])||(p.gear&&p.gear[0])))?`<button class="sec sm" onclick="goTab('buy')">Open shopping list</button>`:'';
 return `<div class="card shot" id="shot-${esc(p.id)}"><img src="${esc(src)}" alt="${esc(cap)}" width="900" loading="lazy">
  <div class="cap">${esc(cap)}</div>
  ${link?`<a class="src" href="${esc(link)}" target="_blank" rel="noopener">Source / product page ↗</a>`:''}
  ${user?`<button class="edit" onclick="delUserPhoto('${p.id}')">Delete</button><div class="muted">Saved on this phone only</div>`:shop}
 </div>`
}
function openPhotoDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open('dc.photos.v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('photos',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function listUserPhotos(albumId){try{const db=await openPhotoDB();return await new Promise((resolve,reject)=>{const q=db.transaction('photos').objectStore('photos').getAll();q.onsuccess=()=>{const all=q.result||[];resolve(albumId?all.filter(p=>p.album===albumId):all)};q.onerror=()=>reject(q.error)})}catch(e){return[]}}
async function fillUserPhotos(){
 revokePhotoUrls();
 try{
  const all=await listUserPhotos();
  document.querySelectorAll('[data-user-count]').forEach(el=>{const n=all.filter(p=>p.album===el.dataset.userCount).length;el.textContent=n?` · ${n} of yours`:''});
  const box=document.querySelector('[data-user-album]');
  if(!box)return;
  const mine=all.filter(p=>p.album===box.dataset.userAlbum);
  if(!mine.length){box.innerHTML='<p class="muted">None yet on this phone.</p>';return}
  box.innerHTML=mine.map(p=>{const url=URL.createObjectURL(p.blob);photoUrls.push(url);return shotHTML({id:p.id,src:url,caption:p.caption||'Your photo'},true)}).join('');
 }catch(e){const box=document.querySelector('[data-user-album]');if(box)box.innerHTML='<p class="muted">This browser could not open the on-phone photo storage.</p>'}
}
async function downscalePhoto(file){
 const bmp=await createImageBitmap(file);
 let w=bmp.width,h=bmp.height,max=900;
 if(Math.max(w,h)>max){const s=max/Math.max(w,h);w=Math.round(w*s);h=Math.round(h*s)}
 const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(bmp,0,0,w,h);
 const blob=await new Promise(res=>c.toBlob(res,'image/jpeg',0.8));
 return blob||file;
}
async function addUserPhoto(file,album){
 if(!file)return;if(!String(file.type||'').startsWith('image/'))return toast('Choose a photo');
 try{
  const blob=await downscalePhoto(file);
  const rec={id:uid(),album,caption:(file.name||'Photo').replace(/\.[^.]+$/,''),type:blob.type||'image/jpeg',blob,added:new Date().toISOString()};
  const db=await openPhotoDB();
  await new Promise((res,rej)=>{const r=db.transaction('photos','readwrite').objectStore('photos').put(rec);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)});
  toast('Photo saved on this phone only');render();
 }catch(e){toast('Could not save that photo')}
}
async function delUserPhoto(id){
 if(!confirm('Delete this photo from this phone?'))return;
 try{const db=await openPhotoDB();await new Promise((res,rej)=>{const r=db.transaction('photos','readwrite').objectStore('photos').delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)});render();toast('Photo deleted')}
 catch(e){toast('Could not delete that photo')}
}
function blobToB64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]||'');r.onerror=rej;r.readAsDataURL(blob)})}
function b64ToBlob(b64,type){const bin=atob(b64),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return new Blob([arr],{type:type||'image/jpeg'})}
async function exportUserPhotos(){try{const all=await listUserPhotos();const out=[];for(const p of all){out.push({id:p.id,album:p.album,caption:p.caption||'',type:p.type||'image/jpeg',added:p.added||null,data:await blobToB64(p.blob)})}return out}catch(e){return[]}}
async function importUserPhotos(list){
 const db=await openPhotoDB();
 const run=fn=>new Promise((res,rej)=>{const tx=db.transaction('photos','readwrite');tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);fn(tx.objectStore('photos'))});
 await run(store=>store.clear());
 for(const p of list){
  if(!p||!p.data||!p.id)continue;
  const rec={id:p.id,album:p.album||'kodiak',caption:p.caption||'',type:p.type||'image/jpeg',added:p.added||null,blob:b64ToBlob(p.data,p.type)};
  await run(store=>store.put(rec));
 }
}

function render(){if(!D)return;renderNav();const P={camp:pageCamp,gear:pageGear,buy:pageBuy,photos:pagePhotos,log:pageLog,more:pageMore};$('#app').innerHTML=(P[tab]||pageCamp)();$('#app').dataset.view=tab;if(tab==='photos')fillUserPhotos()}

/* ---------- modal ---------- */
function openModal(html){$('#mbody').innerHTML=html;$('#modal').classList.add('open');document.body.style.overflow='hidden'}
function closeModal(){$('#modal').classList.remove('open');document.body.style.overflow=''}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
const v=id=>document.getElementById(id).value.trim();
const field=(id,label,val='',type='text',extra='')=>`<label for="${id}">${label}</label><input id="${id}" type="${type}" value="${esc(val)}" ${extra}>`;
const actions=(saveFn,delFn)=>`<div class="row" style="margin-top:8px"><button onclick="${saveFn}">Save</button><button class="sec" onclick="closeModal()">Cancel</button></div>${delFn?`<button class="bad wide" onclick="${delFn}">Delete</button>`:''}`;
const groupList=(id,arr)=>`<datalist id="${id}">${groupsOf(arr).map(g=>`<option value="${esc(g)}">`).join('')}</datalist>`;

function toggleGear(id){const x=D.gear.find(x=>x.id===id);x.done=!x.done;save();render()}
function resetGear(){if(confirm('Uncheck every gear item for the next trip?')){D.gear.forEach(x=>x.done=false);save();render()}}
function editGear(id){const x=D.gear.find(x=>x.id===id)||{group:'',name:'',note:''};openModal(`<h3 style="margin-top:0">${id?'Edit':'Add'} gear</h3>${field('gn','Item',x.name)}${field('gg','Group',x.group,'text','list="gglist"')}${groupList('gglist',D.gear)}${field('gnote','Note',x.note)}${actions(`saveGear('${id||''}')`,id?`delItem('gear','${id}')`:'')}`)}
function saveGear(id){const name=v('gn');if(!name)return alert('Enter an item name.');const rec={group:v('gg')||'Other',name,note:v('gnote')};if(id)Object.assign(D.gear.find(x=>x.id===id),rec);else D.gear.push({id:uid(),done:false,...rec});save();closeModal();render()}
function delItem(list,id){if(!confirm('Delete this?'))return;D[list]=D[list].filter(x=>x.id!==id);save();closeModal();render()}

function toggleBuy(id,k){const b=D.buy.find(b=>b.id===id);b[k]=!b[k];if(k==='bought'&&b.bought)b.pick=true;save();render()}
function editBuy(id){const b=D.buy.find(b=>b.id===id)||{group:'Kodiak plan (current)',name:'',where:'',price:'',qty:1,url:'',note:''};openModal(`<h3 style="margin-top:0">${id?'Edit':'Add'} item</h3>${field('bn','Item',b.name)}${field('bw','Store',b.where)}<div class="row"><div>${field('bp','Price each ($)',b.price,'number','inputmode="decimal" step="0.01" min="0"')}</div><div>${field('bq','Qty',b.qty,'number','inputmode="numeric" min="1" step="1"')}</div></div>${field('bu','Store link',b.url,'url','placeholder="https://"')}${field('bg','Group',b.group,'text','list="bglist"')}${groupList('bglist',D.buy)}<label for="bnote">Note</label><textarea id="bnote">${esc(b.note)}</textarea>${actions(`saveBuy('${id||''}')`,id?`delItem('buy','${id}')`:'')}`)}
function saveBuy(id){const name=v('bn');if(!name)return alert('Enter an item name.');const price=parseFloat(v('bp'))||0,qty=Math.max(1,parseInt(v('bq'))||1),url=v('bu');if(url&&!safeUrl(url))return alert('Links need to start with https://');const rec={name,where:v('bw'),price,qty,url,group:v('bg')||'Other',note:v('bnote')};if(id)Object.assign(D.buy.find(b=>b.id===id),rec);else D.buy.push({id:uid(),pick:true,bought:false,...rec});save();closeModal();render()}

function editLog(id){const e=D.log.find(e=>e.id===id)||{date:today(),title:'',text:''};openModal(`<h3 style="margin-top:0">${id?'Edit':'New'} log entry</h3>${field('ld','Date',e.date,'date')}${field('lt','Title',e.title,'text','placeholder="Opening morning"')}<label for="lx">What happened</label><textarea id="lx" style="min-height:220px">${esc(e.text)}</textarea>${actions(`saveLog('${id||''}')`,id?`delItem('log','${id}')`:'')}`)}
function saveLog(id){const rec={date:v('ld')||today(),title:v('lt')||'Untitled',text:document.getElementById('lx').value};if(id)Object.assign(D.log.find(e=>e.id===id),rec);else D.log.push({id:uid(),...rec});save();closeModal();render()}
function editTally(){openModal(`<h3 style="margin-top:0">Final tally</h3><label for="tx">One line per item</label><textarea id="tx" style="min-height:220px">${esc(D.tally.join('\n'))}</textarea>${actions('saveTally()')}`)}
function saveTally(){D.tally=document.getElementById('tx').value.split('\n').map(s=>s.trim()).filter(Boolean);save();closeModal();render()}

function editCamp(){const c=D.camp;openModal(`<h3 style="margin-top:0">The camp</h3>${field('cw','Where',c.where)}${field('cb','Home base',c.base)}${field('cs','The spot (name)',c.spot)}${field('cd','Hunt days',c.days)}${field('cn','Next camp dates',c.next,'text','placeholder="e.g. opener weekend 2027"')}${actions('saveCamp()')}`)}
function saveCamp(){Object.assign(D.camp,{where:v('cw'),base:v('cb'),spot:v('cs'),days:v('cd'),next:v('cn')});save();closeModal();render()}
function editCrew(id){const p=D.crew.find(p=>p.id===id)||{name:'',role:'',note:''};openModal(`<h3 style="margin-top:0">${id?'Edit':'Add'} crew</h3>${field('pn','Name',p.name)}${field('pr','Role',p.role)}<label for="pnote">Note</label><textarea id="pnote">${esc(p.note)}</textarea>${actions(`saveCrew('${id||''}')`,id?`delItem('crew','${id}')`:'')}`)}
function saveCrew(id){const name=v('pn');if(!name)return alert('Enter a name.');const rec={name,role:v('pr'),note:document.getElementById('pnote').value.trim()};if(id)Object.assign(D.crew.find(p=>p.id===id),rec);else D.crew.push({id:uid(),...rec});save();closeModal();render()}

function toggleDream(id){const x=D.dream.find(x=>x.id===id);x.done=!x.done;save();render()}
function addDream(){const t=prompt('New dream camp goal');if(t&&t.trim()){D.dream.push({id:uid(),text:t.trim(),done:false});save();render()}}
function delDream(id){if(confirm('Delete this goal?')){D.dream=D.dream.filter(x=>x.id!==id);save();render()}}

/* ---------- backup ---------- */
async function backup(){const name='deer-camp-backup-'+today()+'.json',prev=D.lastBackup;D.lastBackup=new Date().toISOString();const payload=Object.assign({},D,{userPhotos:await exportUserPhotos()});const blob=new Blob([JSON.stringify(payload,null,1)],{type:'application/json'});const file=new File([blob],name,{type:'application/json'});
 try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Deer Camp backup'});save();render();toast('Backup saved');return}}catch(e){if(e.name==='AbortError'){D.lastBackup=prev;return}}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);save();render();toast('Backup downloaded')}
function restore(f){if(!f)return;const r=new FileReader();r.onload=async()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.buy)||!Array.isArray(d.gear)||!Array.isArray(d.log))throw 0;if(!confirm('Replace everything on this phone with this backup?'))return;const ups=d.userPhotos;delete d.userPhotos;D=d;save();if(Array.isArray(ups)){try{await importUserPhotos(ups)}catch(err){toast('Camp data restored, but photos could not be imported')}}render();toast('Backup restored')}catch(e){alert('That file isn\'t a Deer Camp backup.')}};r.readAsText(f)}
function resetAll(){if(confirm('Reset to the original camp data? Your list, log, and notes will be replaced. Photos saved on this phone are kept.')){D=seedData();save();render();toast('Reset done')}}

render();startAppUpdates();
