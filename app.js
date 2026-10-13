const config = window.NAVIGATE_CONFIG;
const $ = id => document.getElementById(id);
const intro = $('introVideo'), tutorial = $('tutorialVideo'), viewer = $('viewer');
let current = null, returnFocus = null, watched = [];
try { const saved = JSON.parse(localStorage.getItem('navigate-watched-v1') || '[]'); if(Array.isArray(saved)) watched = saved.filter(x=>typeof x==='string'); } catch {}
function asset(id, src, onMissing) { const img=$(id); img.onload=()=>{img.hidden=false; if(id==='buddy') $('buddyMissing').hidden=true;}; img.onerror=()=>{img.hidden=true;onMissing?.();}; img.src=src; }
asset('navigateLogo',config.assets.logo);asset('prismindLogo',config.assets.prismind);asset('buddy',config.assets.buddy);
intro.src = config.intro;
function renderCards(){for(const group of ['student','teacher']){$(group+'Cards').replaceChildren();config.videos.filter(v=>v.group===group).forEach((v,i)=>{const b=document.createElement('button');b.className='card';b.dataset.video=v.id;const top=document.createElement('span');top.className='card-top';const play=document.createElement('span');play.className='play';play.textContent='▶';play.setAttribute('aria-hidden','true');const number=document.createElement('span');number.className='number';number.textContent='0'+(i+1);top.append(play,number);const title=document.createElement('span');title.className='card-title';title.textContent=v.title;b.append(top,title);if(watched.includes(v.id)){const badge=document.createElement('span');badge.className='watched';badge.textContent='✓ נצפה';b.append(badge);}b.onclick=()=>openVideo(v,b);$(group+'Cards').append(b);});}}
function showMenu(){intro.pause();$('intro').hidden=true;$('menu').hidden=false;$('start').hidden=true;$('menuTitle').focus();}
async function playIntro(){tutorial.pause();$('menu').hidden=true;$('intro').hidden=false;intro.muted=false;try{await intro.play();$('start').hidden=true;}catch{$('start').hidden=false;}}
function openVideo(v,button){intro.pause();tutorial.pause();current=v;returnFocus=button;$('viewerTitle').textContent=v.title;$('tutorialError').hidden=true;tutorial.removeAttribute('src');tutorial.load();tutorial.hidden=!v.src;$('comingSoon').hidden=!!v.src;viewer.showModal();if(v.src){tutorial.src=v.src;tutorial.play().catch(()=>{});}}
function stopTutorial(){tutorial.pause();tutorial.removeAttribute('src');tutorial.load();current=null;returnFocus?.focus();}
$('start').onclick=playIntro;$('skip').onclick=showMenu;intro.onended=showMenu;intro.onplay=()=>{$('start').hidden=true;};intro.onerror=()=>{$('introError').hidden=false;$('start').hidden=true;};
$('replay').onclick=()=>{intro.currentTime=0;playIntro();};$('back').onclick=()=>viewer.close();viewer.addEventListener('close',stopTutorial);
tutorial.addEventListener('error',()=>{if(current?.src)$('tutorialError').hidden=false;});
tutorial.onended=()=>{if(!current)return;if(!watched.includes(current.id)){watched.push(current.id);try{localStorage.setItem('navigate-watched-v1',JSON.stringify(watched));}catch{}const id=current.id;renderCards();returnFocus=document.querySelector(`[data-video="${id}"]`);}};
renderCards();playIntro();
