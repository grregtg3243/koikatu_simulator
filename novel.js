/* ===== ノベルパート(しくみ) =====
   画面表示・クリック送り・会話ログ・早送り・背景(bg)・立ち絵(hide / cast)の「しくみ」です。
   場面の中身(セリフ)は novel_scenes.js にあります。書き方・演出コマンドの説明も novel_scenes.js の冒頭にあります。
   ※ index.html では novel_scenes.js を、この novel.js より先に読み込みます。
   ※ Novel.play(場面名 または [場面名,…] または {lines:[…]}, {h:ヒロインid,loop:周回}, 終わったあとの処理)
   ※ 立ち絵の cast / hide / bg の命令は、この novel.js が知っています。古い novel.js だと、命令が文章として画面に出てしまいます。 */
/* ===== 書き間違いチェック(ゲームを開いたとき、F12のコンソールに表示されます。動作には影響しません) ===== */
(()=>{
 const cmd=['bg','hide','cast','fx'];
 Object.keys(NOVEL_SCENES).forEach(k=>{
  const L=NOVEL_SCENES[k];
  if(!Array.isArray(L)){console.warn(`[novel] 場面「${k}」が配列([ ])になっていません`);return}
  L.forEach((r,n)=>{
   const prev=L[n-1]&&L[n-1][1]?`(直前の行: ${String(L[n-1][1]).slice(0,16)}…)`:'';
   if(!Array.isArray(r))console.warn(`[novel] 場面「${k}」の${n+1}行目が壊れています。前の行の ] のあとに , が抜けている可能性が高いです。${prev}`);
   else if(!cmd.includes(r[0])&&(r.length!==2||typeof r[1]!=='string'))console.warn(`[novel] 場面「${k}」の${n+1}行目は ['話者','本文'] の形になっていません(, が余分/不足?)`,r);
  });
 });
})();

const FXCSS=`
#nv .fx{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden}
#nv .fxe{position:absolute;bottom:-120px;opacity:0;will-change:transform,opacity}
#nv .fxh{font-size:var(--s);line-height:1;color:var(--c);text-shadow:0 0 14px rgba(255,111,165,.8);animation:fxrise var(--d) ease-out forwards}
#nv .fxc,#nv .fxp,#nv .fxs{top:-30px;bottom:auto}
#nv .fxc{width:var(--s);height:calc(var(--s)*.5);background:var(--c);animation:fxfall var(--d) linear forwards}
#nv .fxp{width:var(--s);height:calc(var(--s)*.7);background:var(--c);border-radius:80% 0 80% 0;animation:fxfall var(--d) ease-in-out forwards}
#nv .fxs{width:var(--s);height:var(--s);background:var(--c);border-radius:50%;opacity:.85;animation:fxfall var(--d) linear forwards}
#nv .fxflash{position:absolute;inset:0;background:radial-gradient(circle,#fff 0,#ffe3ef 45%,rgba(255,200,225,0) 85%);opacity:0;animation:fxflash 1.8s ease-out forwards}
@keyframes fxflash{0%{opacity:0}18%{opacity:1}100%{opacity:0}}
@keyframes fxfall{0%{transform:translate(0,0) rotate(0);opacity:0}10%{opacity:1}100%{transform:translate(var(--x,0),112vh) rotate(var(--r));opacity:1}}
#nv .fxf{width:var(--s);height:var(--s);border-radius:50%;background:var(--bg,#ff9cc2) center/cover no-repeat;border:3px solid #fff;box-shadow:0 0 18px rgba(255,156,194,.9);animation:fxrise var(--d) ease-out forwards}
@keyframes fxrise{0%{transform:translateY(0) rotate(0) scale(.4);opacity:0}15%{opacity:1}100%{transform:translateY(-118vh) rotate(var(--r)) scale(1.35);opacity:.9}}
#nv .fxring{position:absolute;inset:0}
#nv .fxri{position:absolute;width:var(--z,56px);height:var(--z,56px);margin:calc(var(--z,56px)/-2) 0 0 calc(var(--z,56px)/-2);border-radius:50%;border:3px solid #fff;background:var(--bg,#ff9cc2) 50% 10%/cover no-repeat;box-shadow:0 0 14px rgba(255,111,165,.85);color:#fff;font:700 12px/1 sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,.65);opacity:0;transform:scale(.2);animation:fxpop .45s cubic-bezier(.2,1.6,.4,1) var(--dl,0s) forwards,fxbob 3.2s ease-in-out calc(var(--dl,0s) + .6s) infinite}
#nv .fxri.me{border-color:#ffd54a;box-shadow:0 0 22px rgba(255,213,74,.95);background:linear-gradient(135deg,#ffb347,#ff6fa5);z-index:2}
#nv .fxframe{position:absolute;inset:6% 5% 22%;border:9px solid #fff;border-radius:4px;box-shadow:0 0 28px rgba(0,0,0,.45),inset 0 0 40px rgba(255,200,225,.35);opacity:0;animation:fxpop .35s ease-out .25s forwards}
#nv .fxcap{position:absolute;left:0;right:0;bottom:6px;text-align:center;color:#fff;font:700 13px sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.8)}
@keyframes fxpop{to{transform:scale(1);opacity:1}}
@keyframes fxbob{0%,100%{translate:0 0}50%{translate:0 -5px}}
@media (prefers-reduced-motion:reduce){#nv .fxri{animation:fxpop .01s forwards}}
#nv .fxd{top:-30px;bottom:auto;width:var(--s);height:var(--s);background:var(--c);animation:fxfall var(--d) linear forwards}
#nv .fxd.confetti{height:calc(var(--s)*1.8);border-radius:1px}
#nv .fxd.petals{border-radius:80% 0 80% 0;opacity:.9}
#nv .fxd.snow{border-radius:50%;box-shadow:0 0 6px #fff}
@keyframes fxfall{0%{transform:translate(0,0) rotate(0);opacity:0}10%{opacity:1}100%{transform:translate(var(--x),112vh) rotate(var(--r));opacity:.9}}
#nv .fxflash{position:absolute;inset:0;background:radial-gradient(circle,#fff 0,#fff6fb 45%,rgba(255,200,230,.7) 100%);opacity:0;animation:fxfl 1.3s ease-out forwards}
@keyframes fxfl{0%{opacity:0}18%{opacity:1}100%{opacity:0}}
#nv.q1{animation:fxq1 .6s ease-in-out 2}
#nv.q2{animation:fxq2 .5s ease-in-out 3}
@keyframes fxq1{0%,100%{transform:translate(0,0)}50%{transform:translate(0,1.5px)}}
@keyframes fxq2{0%,100%{transform:translate(0,0)}50%{transform:translate(0,2.5px)}}
@media (prefers-reduced-motion:reduce){#nv.q1,#nv.q2{animation:none}}
`;
const Novel=(()=>{
 const css=`#nv{position:fixed;inset:0;z-index:80;display:none;flex-direction:column;justify-content:flex-end;background:linear-gradient(160deg,var(--s1,#1f2c46),#080c14 78%);color:#f1ebe0;cursor:pointer;user-select:none}
#nv.on{display:flex}
#nv .bg{position:absolute;inset:0;background:center/cover no-repeat;opacity:0;transition:opacity .45s}
#nv .bg.on{opacity:1}
#nv .ch{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:min(74vh,560px);padding-bottom:150px}
#nv .ch .pic{height:100%}
#nv .ch .cast{display:flex;align-items:flex-end;justify-content:center;height:100%;--sc:1}
#nv .ch .cm{height:calc(100% * var(--sc));margin:0 calc(var(--ov,0px) * -1);transition:filter .25s,opacity .25s;position:relative;z-index:2}
#nv .ch .cm.far{height:calc(100% * var(--sc) * .62);filter:brightness(.55) blur(1.1px);opacity:.88;z-index:1}
#nv .ch .cast.hasp .cm:not(.sp):not(.far){filter:brightness(.62)}
#nv .ch .cm.sp{z-index:3}
#nv .win{position:relative;margin:0 auto 16px;width:min(860px,94vw);padding:18px 22px 22px;min-height:132px;background:rgba(8,12,20,.82);backdrop-filter:blur(8px);border:1px solid rgba(255,156,194,.5);border-radius:6px;margin-bottom:calc(16px + env(safe-area-inset-bottom,0px))}
#nv .nm{display:block;min-height:1.6em;font:700 1.05rem "Shippori Mincho",serif;color:#ff9cc2;letter-spacing:.12em;margin-bottom:4px}
#nv .tx{margin:0;font-size:1.05rem;line-height:1.9;white-space:pre-line}
#nv .nx{position:absolute;right:16px;bottom:8px;color:#ff9cc2;font-size:.8rem}
#nv .lgb,#nv .ff{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));background:rgba(8,12,20,.6);color:#f1ebe0;border:1px solid rgba(255,156,194,.5);border-radius:999px;padding:6px 14px;font:inherit;font-size:.85rem;cursor:pointer}
#nv .lgb{right:112px}#nv .ff{right:176px}#nv .ff.on{background:#ff9cc2;color:#1a1020}
#nv .hint{position:absolute;left:14px;top:calc(18px + env(safe-area-inset-top,0px));font-size:.72rem;color:rgba(241,235,224,.55)}
#nv .lg{position:absolute;inset:0;z-index:5;display:none;flex-direction:column;background:rgba(8,12,20,.9);cursor:default}
#nv .lg.on{display:flex}
#nv .lgh{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;font-weight:700;color:#ff9cc2;border-bottom:1px solid rgba(255,156,194,.3)}
#nv .lgh button{background:none;border:0;color:#f1ebe0;font-size:1.5rem;cursor:pointer}
#nv .lgl{flex:1;overflow-y:auto;padding:12px 18px 24px;width:min(860px,100%);margin:0 auto;box-sizing:border-box}
#nv .lgl p{margin:0 0 14px;line-height:1.8;white-space:pre-line;font-size:.98rem}#nv .lgl b{display:block;color:#ff9cc2;font-size:.85rem}
#nv .sk{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));right:14px;background:rgba(8,12,20,.6);color:#f1ebe0;border:1px solid rgba(255,156,194,.5);border-radius:999px;padding:6px 16px;font:inherit;cursor:pointer}`;
 let el,L,i,cb,ctx,timer,typing,full,CAST=[],LOG=[],ctrl=false,ffOn=false,ffT=null;
 const q=s=>el.querySelector(s);
 function get(key){
  if(key&&typeof key==='object'&&key.lines)return key.lines;/* {lines:[…]} … 場面を直接渡す(会いに行く等) */
  if(NOVEL_SCENES[key])return NOVEL_SCENES[key];
  const [k,id]=key.split('_'),h=id&&H(id);
  if(!h)return [['','…']];
  return k==='meet'?[['',h.sc||'{P}は、新しい出会いを迎えた。'],[id,h.hi||'「はじめまして。よろしくね」'],['me','「はじめまして。これからよろしく」']]
   :k==='love'?[['','卒業式の日、'+h.n+'に呼び止められた。'],[id,'「この3年間、あなたといられてよかった。…好きです」'],['me','「俺もだよ。これからも、よろしく」']]
   :k==='friend'?[[id,'「卒業しても、ずっと友だちでいてね」'],['me','（また会おう。そう心に決めた）']]
   :[['','卒業の日、'+h.n+'と過ごした3年間が胸によみがえった。']];
 }
 function fmt(t){t=String(t==null?'':t);return t.replace(/\{P\}/g,GAME.player).replace(/\{G\}/g,GAME.given).replace(/\{K\}(?:くん)?/g,GAME.nick||GAME.player).replace(/ぼく(?!ろ)/g,'僕').replace(/\{school\}/g,GAME.school).replace(/\{L\}/g,(ctx.loop||0)+1)}
 function type(){
  clearInterval(timer);const tx=q('.tx');
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){tx.textContent=full;typing=false;return}
  let n=0;typing=true;tx.textContent='';
  timer=setInterval(()=>{tx.textContent=full.slice(0,++n);if(n>=full.length){clearInterval(timer);typing=false}},26);
 }
 /* 立ち絵を複数並べる(cast) */
 function castParse(v){
  const out=[],used=new Set();
  String(v||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(tok=>{
   const far=tok[0]==='~';if(far)tok=tok.slice(1);
   if(tok[0]==='*'){
    const n=parseInt(tok.slice(1))||1,pool=(typeof avail==='function'?avail():[]).filter(h=>!used.has(h.id)&&!String(v).includes(h.id)).sort(()=>Math.random()-.5).slice(0,n);
    pool.forEach(h=>{used.add(h.id);out.push({id:h.id,far})});
   }else if(typeof H==='function'&&H(tok)&&!used.has(tok)){used.add(tok);out.push({id:tok,far})}
  });
  return out;
 }
 function drawCast(sp){
  const n=CAST.length,sc=n<=1?1:n<=3?.9:n<=5?.78:n<=8?.66:.56,ov=n<=3?0:n<=5?18:n<=8?34:48;
  q('.ch').innerHTML=`<div class="cast${sp?' hasp':''}" style="--sc:${sc};--ov:${ov}px">`+CAST.map(c=>`<div class="cm${c.far?' far':''}${c.id===sp?' sp':''}">${pic(H(c.id))}</div>`).join('')+'</div>';
 }
 /* 挿絵を読み込んで出す。名前だけなら img2/名前.jpg → .png → .webp の順に探す。読み込めなかったら背景なしのまま進む(止まらない) */
 window.ILL_BAD=window.ILL_BAD||new Set();
 function setBg(v){
  const b=q('.bg');if(!b)return;
  if(!v){b._u='';b.classList.remove('on');return}
  const direct=/[\/.]/.test(v),us=direct?[v]:['jpg','png','webp'].map(e=>'img2/'+v+'.'+e);
  b._u=v;b.classList.remove('on');
  const tryN=k=>{
   if(k>=us.length){window.ILL_BAD.add(v);return}
   const im=new Image(),u=us[k].replace(/"/g,'');
   im.onload=()=>{if(b._u===v){b.style.backgroundImage='url("'+u+'")';b.classList.add('on')}};
   im.onerror=()=>tryN(k+1);
   im.src=u;
  };
  try{tryN(0)}catch(e){}
 }
 function line(){
  /* 演出コマンド(bg / hide)を先に処理する */
  /* 書き間違い(配列でない行・中身が空の行)は読み飛ばし、場面が止まらないようにする */
  while(i<L.length&&!Array.isArray(L[i])){console.warn('[novel] 行の形が正しくないので飛ばしました:',L[i]);i++}
  while(i<L.length&&(L[i][0]==='bg'||L[i][0]==='hide'||L[i][0]==='cast'||L[i][0]==='fx')){
   if(L[i][0]==='fx')fx(L[i][1]);
   else if(L[i][0]==='bg')setBg(L[i][1]);
   else if(L[i][0]==='cast'){CAST=castParse(L[i][1]);if(CAST.length)drawCast('');else q('.ch').innerHTML=''}
   else{CAST=[];q('.ch').innerHTML=''}
   i++;
   while(i<L.length&&!Array.isArray(L[i]))i++;
  }
  if(i>=L.length)return end();
  const [w,t]=L[i],h=w&&w!=='me'?H(w):null;
  full=fmt(t);
  LOG.push([w==='me'?GAME.player:h?h.n:'',full]);if(LOG.length>300)LOG.shift();
  if(h){if(CAST.some(c=>c.id===w))drawCast(w);else q('.ch').innerHTML=pic(h)}
  else if(CAST.length)drawCast('');
  q('.nm').textContent=w==='me'?GAME.player:h?h.n:'';
  type();
 }
 function end(){fx('stop');clearInterval(timer);ffOn=false;ffSync();closeLog();el.classList.remove('on');setBg('');const f=cb;cb=null;if(f)f()}
 function adv(){
  if(typing){clearInterval(timer);q('.tx').textContent=full;typing=false;return}
  if(++i>=L.length)return end();
  line();
 }
 /* ログ(これまでの会話)と早送り */
 function openLog(){
  const l=q('.lg'),b=q('.lgl');
  b.innerHTML=LOG.slice(0,-1).concat([LOG[LOG.length-1]||['','']]).filter(x=>x&&x[1]!=null).map(x=>`<p>${x[0]?'<b>'+x[0]+'</b>':''}${String(x[1]).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p>`).join('')||'<p>まだログはありません。</p>';
  l.classList.add('on');b.scrollTop=b.scrollHeight;ffSync();
 }
 function closeLog(){const l=q('.lg');if(l){l.classList.remove('on');ffSync()}}
 const logOn=()=>el&&q('.lg').classList.contains('on');
 function ffSync(){
  if(!el)return;
  const f=(ffOn||ctrl)&&el.classList.contains('on')&&!logOn();
  q('.ff').classList.toggle('on',ffOn);
  if(f&&!ffT)ffT=setInterval(()=>{if(typing){clearInterval(timer);q('.tx').textContent=full;typing=false}else adv()},70);
  if(!f&&ffT){clearInterval(ffT);ffT=null}
 }
 let wheelT=0;
 /* ===== 演出 ['fx', 種類] =====
    'flood'  … 地鳴りのように画面が揺れ、ハートと女子たちの顔が大量にあふれて収拾がつかなくなる(約6秒)
    'hearts' … ハートだけがふわふわ舞い上がる(軽め・約3秒)
    'quake'  … 画面が揺れるだけ(約2秒)
    'confetti' … 紙吹雪 / 'petals' … 桜の花びら / 'snow' … 雪 / 'flash' … 画面が光に包まれる(ホワイトアウト)
    'faces'  … 女子の顔だけが次々に浮かび上がる / 'confetti' … 紙吹雪 / 'petals' … 花びら / 'snow' … 雪 / 'flash' … 白い光に包まれる
    'ring'   … 直前の cast の女子たちが、顔アイコンになって柏木くんを丸く取り囲む(stop か場面の終わりまで残る。使うときは ['cast','a,b,c,*6'],['fx','ring'],['hide',''] の順)
    'selfie' … シャッターの光+写真の枠+アイコンの輪(自撮り)/ 'shutter' … 光と枠だけ(挿絵の上に重ねる用)
    'stop'   … すぐに止める(場面の終わりで自動的にも止まります)
    ※ 読み進めの邪魔にならないよう、クリックはそのまま通ります。端末の「動きを減らす」設定が有効なときは、揺れを省いて数を減らします。 */
 let fxT=null,fxEnd=null;
 /* 'ring' = 直前の cast の女子たちが、アイコンになって柏木くんを取り囲む(場面の終わり or stop まで残る) / 'selfie' = シャッターの光+写真の枠+アイコンの輪 / 'shutter' = 光と枠だけ(挿絵の自撮り用) */
 function ringDraw(kind,box){
  box.innerHTML='';el.classList.remove('q1','q2');
  const self=kind!=='ring',CAPS=['パシャッ！','はい、チーズ！','せーの、ハイチーズ！','もう一枚！','みんな、寄って寄って！'];
  if(self){const fl=document.createElement('div');fl.className='fxflash';fl.addEventListener('animationend',()=>fl.remove());box.appendChild(fl);
   const fr=document.createElement('div');fr.className='fxframe';fr.innerHTML='<span class="fxcap">📸 '+CAPS[Math.floor(Math.random()*CAPS.length)]+'</span>';box.appendChild(fr)}
  if(kind==='shutter')return;
  let ids=(CAST||[]).map(c=>c.id).filter(Boolean);
  if(ids.length<2&&typeof avail==='function')ids=avail().map(h=>h.id);
  ids=ids.slice(0,16);
  const n=ids.length,rx=self?31:38,ry=self?22:28,cx=50,cy=self?46:47,z=n>11?38:n>7?46:58,w=document.createElement('div');w.className='fxring';
  const mk=(txt,col,img,x,y,zz,dl,cls)=>{
   const e=document.createElement('div');e.className='fxri'+(cls?' '+cls:'');
   e.style.cssText=`left:${x}%;top:${y}%;--z:${zz}px;--dl:${dl}s;--bg:${col}`;e.textContent=txt;
   if(img){const im=new Image();im.onload=()=>{e.style.backgroundImage='url("'+img+'")';e.textContent=''};im.onerror=()=>{};im.src=img}
   w.appendChild(e)};
  mk(GAME.nick||GAME.player,'#ff9cc2',null,cx,cy,Math.round(z*1.35),0,'me');
  ids.forEach((id,i)=>{const h=H(id);if(!h)return;const a=-Math.PI/2+i*2*Math.PI/n;
   mk((h.n.split(' ')[1]||h.n).slice(0,3),h.c,'img/'+h.img+'.jpg',(cx+rx*Math.cos(a)).toFixed(1),(cy+ry*Math.sin(a)).toFixed(1),z,(.25+i*.12).toFixed(2))});
  box.appendChild(w);
 }
 function fx(kind){
  if(!el)return;
  const box=q('.fx');if(!box)return;
  if(typeof CFG!=='undefined'&&CFG.fxN===0&&kind!=='stop'&&kind&&kind!=='ring'&&kind!=='selfie'&&kind!=='shutter'){return}  /* スマホ「設定」で演出をOFFにしているとき */
  clearInterval(fxT);clearTimeout(fxEnd);fxT=null;
  if(kind==='stop'||!kind){box.innerHTML='';el.classList.remove('q1','q2');return}
  if(kind==='ring'||kind==='selfie'||kind==='shutter'){ringDraw(kind,box);return}
  const calm=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  const cfg={flood:{ms:6000,ramp:true,face:.45,max:150,quake:'q2',t:'h'},hearts:{ms:3000,ramp:false,face:0,max:50,quake:'',t:'h'},quake:{ms:2000,ramp:false,face:0,max:0,quake:'q1',t:'h'},
   faces:{ms:5000,ramp:true,face:1,max:90,quake:'',t:'h'},confetti:{ms:4500,ramp:true,face:0,max:140,quake:'',t:'c'},petals:{ms:6000,ramp:false,face:0,max:60,quake:'',t:'p'},
   snow:{ms:6000,ramp:false,face:0,max:70,quake:'',t:'s'},flash:{ms:1800,ramp:false,face:0,max:30,quake:'',t:'h',flash:true}}[kind];
  if(!cfg)return;
  box.innerHTML='';el.classList.remove('q1','q2');
  if(cfg.quake&&!calm)el.classList.add(cfg.quake);
  if(cfg.flash){const f=document.createElement('div');f.className='fxflash';f.addEventListener('animationend',()=>f.remove());box.appendChild(f);fxEnd=setTimeout(()=>{box.innerHTML=''},cfg.ms);return}
  const gs=(typeof avail==='function'?avail():[]),cols=['#ff6fa5','#ff9cc2','#ff4d88','#ffb3d1','#e11d74','#ffd6e7'],t0=Date.now();
  const add=()=>{
   if(box.childElementCount>=cfg.max)return;
   const e=document.createElement('div');
   if(cfg.t==='c'||cfg.t==='p'||cfg.t==='s'){
    const sz=cfg.t==='c'?8+Math.random()*10:cfg.t==='p'?14+Math.random()*14:5+Math.random()*9;
    e.className='fxe fx'+cfg.t;
    e.style.cssText=`left:${Math.random()*100}%;--s:${sz}px;--d:${(cfg.t==='s'?4+Math.random()*3:cfg.t==='p'?3.5+Math.random()*2.5:1.8+Math.random()*1.8).toFixed(2)}s;--r:${Math.round(Math.random()*720-360)}deg;--x:${Math.round(Math.random()*160-80)}px;--c:${cfg.t==='c'?['#ff6fa5','#ffd54a','#5ec8ff','#8be08b','#c58bff','#ffffff'][Math.floor(Math.random()*6)]:cfg.t==='p'?'#ffb7d0':'#ffffff'}`;
    e.addEventListener('animationend',()=>e.remove());box.appendChild(e);return;
   }
   const face=gs.length&&Math.random()<cfg.face,sz=face?40+Math.random()*80:14+Math.random()*(cfg.ramp?44:30);
   e.className='fxe '+(face?'fxf':'fxh');
   e.style.cssText=`left:${Math.random()*100}%;--s:${sz}px;--d:${(1.6+Math.random()*2.2).toFixed(2)}s;--r:${Math.round(Math.random()*80-40)}deg;--c:${cols[Math.floor(Math.random()*cols.length)]}`;
   if(face){const h=gs[Math.floor(Math.random()*gs.length)];e.style.setProperty('--bg',h.c);e.style.backgroundImage=`url("img/${h.img}.jpg")`;e.textContent='';}
   else e.textContent='♥';
   e.addEventListener('animationend',()=>e.remove());
   box.appendChild(e);
  };
  const per=calm?1:cfg.ramp?5:2;
  fxT=setInterval(()=>{
   const k=Date.now()-t0,r=cfg.ramp?Math.min(1,.25+k/2500):1,n=Math.max(1,Math.round(per*r*(calm?.5:1)));
   if(k<cfg.ms-900&&cfg.max)for(let j=0;j<n;j++)add();
   if(cfg.ramp&&!calm&&k>2200)el.classList.add('q2');
  },cfg.ramp?55:120);
  fxEnd=setTimeout(()=>{clearInterval(fxT);fxT=null;el.classList.remove('q1','q2');setTimeout(()=>{if(!fxT)box.innerHTML=''},3800)},cfg.ms);
 }
 function mk(){
  const s=document.createElement('style');s.textContent=css+FXCSS;document.head.append(s);
  el=document.createElement('div');el.id='nv';
  el.innerHTML='<div class="bg"></div><div class="ch"></div><div class="fx"></div><div class="win"><b class="nm"></b><p class="tx"></p><span class="nx">▼</span></div><span class="hint">ホイール上:ログ・下:次へ / Ctrl:早送り</span><button class="ff" type="button">早送り</button><button class="lgb" type="button">ログ</button><button class="sk" type="button">スキップ</button><div class="lg"><div class="lgh"><span>会話ログ</span><button type="button" class="lgx" aria-label="閉じる">×</button></div><div class="lgl"></div></div>';
  document.body.append(el);
  el.onclick=e=>{const c=e.target.classList;
   if(e.target.closest('.lg')){if(c.contains('lgx')||e.target.classList.contains('lg'))closeLog();return}
   if(c.contains('sk'))end();else if(c.contains('lgb'))openLog();else if(c.contains('ff')){ffOn=!ffOn;ffSync()}else adv()};
  el.addEventListener('wheel',e=>{if(!el.classList.contains('on'))return;if(logOn()){if(e.deltaY>0&&e.target.closest('.lgl')){const b=q('.lgl');if(b.scrollTop+b.clientHeight>=b.scrollHeight-2)closeLog()}return}if(e.deltaY<0)openLog();else if(e.deltaY>0){const n=Date.now();if(n-wheelT>260){wheelT=n;adv()}}},{passive:true}); /* ホイール下=次のメッセージへ / 上=ログ */
  addEventListener('keydown',e=>{if(!el.classList.contains('on'))return;if(e.key==='Control'){ctrl=true;ffSync()}else if(e.key==='Escape'&&logOn()){e.stopPropagation();closeLog()}},true);
  addEventListener('keyup',e=>{if(e.key==='Control'){ctrl=false;ffSync()}});
  addEventListener('blur',()=>{ctrl=false;ffSync()});
  addEventListener('keydown',e=>{if(el.classList.contains('on')&&!logOn()&&(e.key==='Enter'||e.key===' ')){e.preventDefault();adv()}});
 }
 return{play(key,c,done){
  if(!el)mk();
  ctx=c||{};LOG=[];L=[].concat(...[].concat(key).map(get));try{if(typeof illustApply==='function')L=illustApply(L,ctx)||L}catch(e){}i=0;cb=done;
  CAST=[];q('.ch').innerHTML='';setBg('');fx('stop');el.classList.add('on');line();
 }};
})();
