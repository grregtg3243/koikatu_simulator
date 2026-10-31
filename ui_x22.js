/* ===== 第22弾 新要素「今月の主役」「ハーレム度」+ ゴージャス演出(花びら)=====
   今月の主役 … 毎月、ランダムに1人。月の初めに好感度+3、ご奉仕ガチャで3倍出やすい(右パネルの先頭に表示)。
   ハーレム度 … ハーレム人数/全員 の割合ゲージ + 称号 + ファン人数。
   ゴージャス演出 … 背景の花びら・光のゆらぎ。スマホ「設定」でOFF可(CFG.luxOff)。 */
function pkInit(){if(!S)return null;if(!S.pk)S.pk={t:-1,id:'',n:0};return S.pk}
function pkId(){const p=pkInit();return p&&S&&!S.fin?p.id:''}
function pkTurn(){
 const p=pkInit();if(!p||S.fin||p.t===S.t)return;
 const gs=avail().filter(h=>h.id!==p.id);if(!gs.length)return;
 const h=gs[Math.floor(Math.random()*gs.length)];
 p.t=S.t;p.id=h.id;p.n++;
 add(h.id,3);cnt('pickup');
 NOTE=(NOTE?NOTE+'\n':'')+`【今月の主役】${h.n.split(' ').join('')}! 好感度+3。ご奉仕ガチャでも出やすい。`;
}
const _keyEventPk=keyEvent;
keyEvent=function(done){pkTurn();_keyEventPk(done)};
function xhudHtml(){
 const p=pkInit();if(!p)return '';
 const h=p.id&&H(p.id),all=avail().length||1,n=typeof haremN==='function'?haremN():0,pc=Math.min(100,Math.round(n/all*100));
 let x='<div class="xhud">';
 if(h)x+=`<div class="xt">✨ 今月の主役</div><div class="xp"><img src="img/${h.img}" alt="" onerror="this.style.display='none'"><div><b>${h.n.split(' ').join('')}</b><small>好感度 ${favOf(h)} ／ ご奉仕で3倍出やすい</small></div></div>`;
 x+=`<div class="xt" style="margin-top:8px">💗 学園の女子${all}人、全員が、あなたに注目中</div>`;
 x+=`<div class="xm"><span>ハーレム度</span><span>${n}人 / ${all}人(${pc}%)</span></div><div class="xg"><i style="width:${pc}%"></i></div>`;
 try{const m=S.mx;if(m){x+=`<div class="xm" style="margin-top:6px"><span>📜 憲章 ${m.ch||0}条 ／ 🏛 専用 ${Object.keys(m.sp||{}).length}か所</span><span>🚃 他校・街 ${m.out?m.out.n:0}回</span></div>`}}catch(e){}
 if(typeof rankNow==='function'){try{x+=`<div class="xr">${rankNow().n}</div>`}catch(e){}}
 return x+'</div>';
}
/* side() は index.html の本体スクリプトで定義されるため、読み込みが終わってから包む */
function xhudWrap(){
 if(window.__xhud||typeof side!=='function')return;window.__xhud=1;
 const _s=side;
 side=function(){
  const r=_s.apply(this,arguments);
  try{if(S&&!S.fin){const el=document.getElementById('side');if(el&&el.insertAdjacentHTML)el.insertAdjacentHTML('afterbegin',xhudHtml())}}catch(e){}
  return r;
 };
 try{if(S)side()}catch(e){}
}
if(document.readyState==='complete')xhudWrap();else window.addEventListener('load',xhudWrap);
/* 花びら */
(function(){
 const on=()=>typeof CFG==='undefined'||!CFG.luxOff;
 function apply(){document.body&&document.body.classList.toggle('xplain',!on())}
 function mk(){
  if(!document.body||document.getElementById('xpetals'))return;
  const d=document.createElement('div');d.id='xpetals';
  for(let i=0;i<14;i++){const e=document.createElement('i');e.style.left=(Math.random()*100)+'vw';e.style.setProperty('--dx',(Math.random()*120-30)+'px');e.style.animationDuration=(12+Math.random()*14)+'s';e.style.animationDelay=(-Math.random()*20)+'s';const s=.7+Math.random()*.9;e.style.width=(12*s)+'px';e.style.height=(9*s)+'px';d.appendChild(e)}
  document.body.appendChild(d);apply();
 }
 if(document.readyState!=='loading')mk();else document.addEventListener('DOMContentLoaded',mk);
 const _f=typeof fxSetHtml==='function'?fxSetHtml:null;
 if(_f)fxSetHtml=function(){
  return _f().replace(/<\/div>$/,`<label class="rg"><span>背景の花びら・光のゆらぎ(ゴージャス演出)</span><input type="checkbox" data-fxset="luxOff" ${on()?'checked':''}></label></div>`);
 };
 document.addEventListener('change',e=>{if(e.target&&e.target.dataset&&e.target.dataset.fxset==='luxOff')setTimeout(apply,0)});
 setTimeout(apply,500);
})();
