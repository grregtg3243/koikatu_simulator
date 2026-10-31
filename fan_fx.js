/* ===== 人気の演出(愛の通知・アイコンのあふれ)+ 女子の着せ替え =====
   ■ 愛のメッセージ通知
     魅力が FX_LOVE_MIN(30)を超えると、画面の右側に、女子から柏木くんへの「愛のメッセージ」の通知が流れます。
     魅力が高いほど、間隔が短くなります(30 で約14秒おき → 100 で約1.6秒おき=ひっきりなし)。クリックはそのまま通ります。
     メッセージを増やすときは LOVE_MSG に足してください({n}=女子の名前 {K}=柏木くん)。
   ■ モテアクションのアイコンあふれ
     「会いに行く」「デート」「号令」「自撮り」をすると、女子のアイコン(img/0001.jpg〜0170.jpg のうち、実在するもの)が、画面いっぱいにランダムにあふれます。魅力が高いほど、多くなります。
   ■ OFF
     スマホの【設定】で、「愛の通知」「アイコンあふれ」「ノベルの演出(ハート・地鳴りなど)」を、それぞれ OFF にできます(CFG.loveOff / CFG.floodOff / CFG.fxN===0。ブラウザに記憶されます)。
   ■ 着せ替え(スマホの【着せ替え】アプリ)
     「0001.jpg」の女子の別衣装は、同じフォルダに「0001-a.jpg」「0001-b.jpg」…と置くと、自動で見つかります(a〜h の8着まで)。
     好感度 COS_MIN(30)以上の女子に、着てほしい衣装をお願いできます。選ぶと、立ち絵・連絡先・自撮りなど、その子の画像が、ぜんぶ着替えます。選んだ衣装は S.cos に記録され、周回しても引き継がれます。
     衣装の名前は COS_NAMES(例: a=私服 b=水着 c=浴衣 d=パジャマ e=ドレス f=冬服 g=部活 h=特別)。ファイルの文字を、この意味に合わせておくと分かりやすいです。 */

const FX_LOVE_MIN=30,COS_MIN=30,COS_LETTERS='abcdefgh'.split('');
const COS_NAMES={a:'私服',b:'水着',c:'浴衣',d:'パジャマ',e:'ドレス',f:'冬服',g:'部活',h:'特別'};
const LOVE_MSG=[
 '{K}、だいすき♡','今日も、{K}のこと考えてた…','{K}に、会いたいな','{K}の笑顔、世界一♡','おはよう、{K}！ 今日も、大好き','{K}、今なにしてる？','{K}の隣が、わたしの特等席！','{K}のこと、ずっと見てるよ','今日の{K}、かっこよかった…！','{K}がいてくれて、よかった','{K}、おやすみ。…夢で、会おうね','{K}の声、聞きたいな','{K}、無理しないでね','{K}に、ぎゅってしてほしいな','{K}、好き。…って、送っちゃった！','{K}の待ち受け、変えたよ♡','{K}が笑うと、わたしも笑顔になる','明日も、{K}に会えますように','{K}、お昼、一緒に食べよ？','{K}って、ほんとにやさしいよね','{K}のこと、みんなで応援してるよ','{K}の名前を、ノートに書いちゃった','{K}、今日もおつかれさま！','{K}と同じクラスで、しあわせ','{K}、手、つなぎたいな…','{K}は、わたしのヒーローだよ','{K}、だーいすき！ (以下、百回くり返し)','{K}のこと考えたら、眠れなくなっちゃった','{K}、おはよう♡ 寝ぐせ、直した？','{K}の好きなお菓子、買っちゃった！','{K}、今度の休み、空いてる？','{K}と目が合った！ 今日は、いい日！','{K}の一番になりたいな…','{K}、困ったときは、いつでも呼んでね','{K}、きらきらして見えるの','{K}に会えない日は、さびしいよ','{K}の笑い声、録音したい…','{K}、風邪ひかないでね','{K}のこと、ほんとに大切なの','{K}、ずっと、そばにいさせてね'
];
const fxOn=k=>typeof CFG==='undefined'||!CFG[k];

/* ---------- 愛の通知 ---------- */
let _lvT=null;
function loveBox(){
 let b=document.getElementById('lovebox');
 if(!b){
  const s=document.createElement('style');
  s.textContent=`#lovebox{position:fixed;right:8px;top:64px;width:min(250px,64vw);z-index:9990;pointer-events:none;display:flex;flex-direction:column;gap:6px;align-items:flex-end}
#lovebox .lv{display:flex;align-items:center;gap:8px;max-width:100%;padding:6px 10px 6px 6px;border-radius:999px;background:rgba(30,18,32,.88);border:1px solid rgba(255,140,190,.7);box-shadow:0 2px 12px rgba(255,90,150,.35);color:#fff;font:600 12px/1.35 sans-serif;animation:lvin .35s ease-out,lvout .5s ease-in 3.6s forwards}
#lovebox .lv i{flex:none;width:30px;height:30px;border-radius:50%;background:var(--bg,#ff9cc2) center/cover no-repeat;border:2px solid #fff;display:block}
#lovebox .lv b{display:block;font-size:10px;color:#ffb3d1}
@keyframes lvin{from{transform:translateX(120%);opacity:0}to{transform:none;opacity:1}}
@keyframes lvout{to{opacity:0;transform:translateX(30%)}}
@media (prefers-reduced-motion:reduce){#lovebox .lv{animation:lvout .5s ease-in 3.6s forwards}}`;
  document.head.append(s);
  b=document.createElement('div');b.id='lovebox';document.body.append(b);
 }
 return b;
}
function loveOne(){
 if(!S||S.fin||!fxOn('loveOff')||document.hidden)return;
 const gs=avail();if(!gs.length)return;
 const h=gs[Math.floor(Math.random()*gs.length)],b=loveBox();
 const ch0=S&&S.st?S.st.charm:0;if(b.childElementCount>=(ch0>=80?8:ch0>=60?6:5))return;
 const e=document.createElement('div');e.className='lv';
 const t=LOVE_MSG[Math.floor(Math.random()*LOVE_MSG.length)].replace(/\{K\}(?:くん)?/g,GAME.nick||GAME.player).replace(/\{n\}/g,h.n);
 e.innerHTML=`<i style="--bg:${h.c}"></i><span><b></b><em style="font-style:normal"></em></span>`;
 e.querySelector('b').textContent=h.n;e.querySelector('em').textContent=t;
 const im=new Image();im.onload=()=>{e.querySelector('i').style.backgroundImage='url("img/'+h.img+'.jpg")'};im.src='img/'+h.img+'.jpg';
 e.addEventListener('animationend',ev=>{if(ev.animationName==='lvout')e.remove()});
 b.appendChild(e);
}
function loveTick(){
 clearTimeout(_lvT);
 const ch=S&&S.st?S.st.charm:0;
 let wait=4000;
 if(ch>=FX_LOVE_MIN){
  loveOne();
  const k=Math.min(1,(ch-FX_LOVE_MIN)/(100-FX_LOVE_MIN));
  const hn=typeof haremN==='function'?haremN():0,hf=1/(1+hn/18);
  wait=(14000-12400*k)*(.6+Math.random()*.8)*(ch>=70?.6:1)*Math.max(.35,hf);
  if(ch>=70&&Math.random()<(ch-60)/80)setTimeout(loveOne,500+Math.random()*900);
  if(hn>=8)for(let i=0;i<Math.min(4,Math.floor(hn/12)+1);i++)if(Math.random()<.5)setTimeout(loveOne,300+Math.random()*2200);
 }
 _lvT=setTimeout(loveTick,wait);
}

/* ---------- モテアクションのアイコンあふれ ---------- */
const FX_ICON_MAX=170,_okIcons=new Set(),_badIcons=new Set();
function moteBurst(n){
 if(!fxOn('floodOff')||document.hidden)return;
 const ch=S&&S.st?S.st.charm:0;
 n=n||Math.round(10+ch/3.5);
 let box=document.getElementById('floodbox');
 if(!box){
  const s=document.createElement('style');
  s.textContent=`#floodbox{position:fixed;inset:0;z-index:9980;pointer-events:none;overflow:hidden}
#floodbox i{position:absolute;bottom:-110px;width:var(--s);height:var(--s);border-radius:50%;border:3px solid #fff;background:center/cover no-repeat;box-shadow:0 0 16px rgba(255,120,175,.9);opacity:0;animation:flup var(--d) ease-out var(--dl) forwards}
@keyframes flup{0%{transform:translateY(0) rotate(0) scale(.5);opacity:0}12%{opacity:1}100%{transform:translateY(-118vh) rotate(var(--r)) scale(1.25);opacity:.9}}`;
  document.head.append(s);
  box=document.createElement('div');box.id='floodbox';document.body.append(box);
 }
 const calm=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(calm)n=Math.min(n,8);
 let tries=0,made=0;
 const one=()=>{
  if(made>=n||tries>n*3)return;
  tries++;
  const no=1+Math.floor(Math.random()*FX_ICON_MAX),id=String(no).padStart(4,'0');
  if(_badIcons.has(id)){one();return}
  const put=()=>{
   made++;
   const e=document.createElement('i'),sz=36+Math.random()*70;
   e.style.cssText=`left:${Math.random()*100}%;--s:${sz.toFixed(0)}px;--d:${(2.2+Math.random()*2.2).toFixed(2)}s;--dl:${(made*0.05).toFixed(2)}s;--r:${Math.round(Math.random()*70-35)}deg;background-image:url("img/${id}.jpg")`;
   e.addEventListener('animationend',()=>e.remove());box.appendChild(e);
  };
  if(_okIcons.has(id)){put();one();return}
  const im=new Image();
  im.onload=()=>{_okIcons.add(id);put();one()};
  im.onerror=()=>{_badIcons.add(id);one()};
  im.src='img/'+id+'.jpg';
 };
 for(let k=0;k<4;k++)one();   /* 同時に4本ずつ取りにいく */
}
const _noteActFx=noteAct;
noteAct=function(k,nm){
 if(k==='meet'||k==='date'||k==='gather'||k==='selfie'){try{moteBurst()}catch(e){}}
 return _noteActFx(k,nm);
};

/* ---------- 着せ替え ---------- */
(function(){
 HEROINES.forEach(h=>{
  const base=h.img;
  Object.defineProperty(h,'img0',{value:base,enumerable:false});
  Object.defineProperty(h,'img',{enumerable:true,configurable:true,
   get(){const v=typeof S!=='undefined'&&S&&S.cos&&S.cos[h.id];return v?base+'-'+v:base},
   set(x){Object.defineProperty(h,'img',{value:x,writable:true,enumerable:true,configurable:true})}});
 });
})();
const COS_FOUND={};let COSG='';
function cosProbe(id){
 const h=H(id);if(!h||COS_FOUND[id])return;
 COS_FOUND[id]={wait:COS_LETTERS.length,ok:[]};
 COS_LETTERS.forEach(l=>{
  const im=new Image(),f=COS_FOUND[id];
  const fin=()=>{f.wait--;if(f.wait<=0){f.ok.sort();if(typeof PA!=='undefined'&&PA==='cos')drawPhone()}};
  im.onload=()=>{f.ok.push(l);fin()};im.onerror=fin;
  im.src='img/'+h.img0+'-'+l+'.jpg';
 });
}
function cosHtml(){
 S.cos=S.cos||{};
 const gs=avail().slice().sort((a,b)=>favOf(b)-favOf(a));
 let h=`<p class="hint">好感度${COS_MIN}以上の女子に、着てほしい衣装をお願いできます。衣装の画像は「0001-a.jpg」のように置くと見つかります。</p>`;
 if(!COSG||!H(COSG)){
  h+=gs.map(g=>`<button type="button" class="ev" data-do="cosg:${g.id}" style="background:none;border:0;border-bottom:1px solid var(--line);width:100%;color:inherit;font:inherit;cursor:pointer;text-align:left"><b>${g.n}</b><span>${S.cos[g.id]?COS_NAMES[S.cos[g.id]]:'ふだんの服'}${favOf(g)<COS_MIN?'　(好感度が足りません)':''}</span></button>`).join('');
  return h;
 }
 const g=H(COSG);
 h+=`<button type="button" class="opt" data-do="cosg:">‹ 一覧へ</button><h2 style="margin:10px 0 4px;font-size:14px">${g.n}</h2>`;
 if(favOf(g)<COS_MIN)return h+`<p class="hint">もう少し仲良くなると、お願いできるようになります。</p>`;
 cosProbe(g.id);const f=COS_FOUND[g.id];
 if(f.wait>0)return h+'<p class="hint">衣装をさがしています…</p>';
 const cur=S.cos[g.id]||'';
 const card=(l,name)=>`<button type="button" class="ev" data-do="cosset:${g.id}:${l||'0'}" style="background:none;border:0;border-bottom:1px solid var(--line);width:100%;color:inherit;font:inherit;cursor:pointer;text-align:left;display:flex;gap:10px;align-items:center"><img src="img/${g.img0}${l?'-'+l:''}.jpg" width="44" height="62" style="object-fit:cover;border-radius:6px;background:${g.c}" alt=""><b>${name}</b><span>${cur===(l||'')?'着ています':''}</span></button>`;
 h+=card('','ふだんの服')+f.ok.map(l=>card(l,COS_NAMES[l]||('衣装'+l.toUpperCase()))).join('');
 if(!f.ok.length)h+=`<p class="hint">この子の別衣装の画像(${g.img0}-a.jpg など)は、まだ見つかりません。</p>`;
 return h;
}
const COS_LINES=['「どう？ 似合ってる…かな？」','「{K}のために、選んだんだよ」','「えへへ、ちょっと、照れるね」','「見てくれて、ありがとう。…ずっと着てたいな」','「{K}が、喜んでくれたら、それでいいの」','「ねえ、写真、撮ってもいいよ？」'];
function cosSet(id,l){
 S.cos=S.cos||{};const h=H(id);if(!h||favOf(h)<COS_MIN)return '';
 const v=l==='0'?'':l,first=!(S.cosSeen&&S.cosSeen[id+v]);
 if(v)S.cos[id]=v;else delete S.cos[id];
 S.cosSeen=S.cosSeen||{};
 if(v&&first){S.cosSeen[id+v]=1;add(id,2);cnt('cosplay')}
 return `${h.n}が、${v?COS_NAMES[v]||'別の衣装':'ふだんの服'}に着替えた。\n`+(v?dailyFmt(COS_LINES[Math.floor(Math.random()*COS_LINES.length)],{},{}):'');
}

/* ---------- 設定画面の切りかえ(スマホ「設定」の先頭に差し込む) ---------- */
function fxSetHtml(){
 const row=(k,l,on)=>`<label class="rg"><span>${l}</span><input type="checkbox" data-fxset="${k}" ${on?'checked':''}></label>`;
 return `<div class="rg"><b>演出のON/OFF</b>${row('loveOff','画面右の「愛の通知」',fxOn('loveOff'))}${row('floodOff','モテアクションの「アイコンあふれ」',fxOn('floodOff'))}${row('fxNo','ノベルの演出(ハート・地鳴り・自撮りなど)',CFG.fxN!==0)}</div>`;
}
document.addEventListener('change',e=>{
 const k=e.target&&e.target.dataset&&e.target.dataset.fxset;if(!k)return;
 const on=e.target.checked;
 if(k==='fxNo')CFG.fxN=on?1:0;else CFG[k]=on?0:1;
 try{localStorage.setItem('sakuragaoka_cfg',JSON.stringify(CFG))}catch(x){}
 if(k==='loveOff'&&!on){const b=document.getElementById('lovebox');if(b)b.innerHTML=''}
});
setTimeout(loveTick,3000);

/* ===== 愛のメッセージ追加(+60) ===== */
LOVE_MSG.push('{K}のこと、考えてたら、授業、聞き逃しちゃった','{K}、今日も、おつかれさま！','{K}の好きな曲、聞いてみたよ。…いい曲だね','{K}、ごはん、ちゃんと食べた？','{K}、風邪、ひかないでね','{K}に、早く会いたい！','{K}のおかげで、毎日、楽しいよ','{K}、いつもありがとう。だいすき','今日の空、きれいだよ。{K}にも、見せたいな','{K}、手、冷たくない？ あっためてあげたい','{K}の夢、見ちゃった。…内緒だよ？','{K}、返信、待ってるね','{K}と、同じクラスで、よかった','{K}の笑顔が、見られたら、もう、それだけで幸せ','今、{K}の席を、見てたの','{K}、今日、ちょっとだけ、お話しできる？','{K}の名前を、ノートの隅に書いちゃった','{K}が、そばにいると、安心するの','{K}、がんばりすぎないでね。わたしが、応援してるから','{K}が好き。…ただ、それだけ！','{K}の好きなもの、もっと知りたいな','{K}、今日の髪型、素敵だったよ','{K}、おなかすいてない？ お菓子、あるよ','{K}、今度の休み、空いてる？','{K}の隣を歩けて、うれしかった','{K}、いつも、やさしくしてくれて、ありがとう','{K}のこと、みんな、大好きなんだよ','{K}、会いたい、会いたい、会いたい！','{K}の笑い声、頭から、離れないの','{K}が元気だと、わたしも、元気になれる','わたし、{K}の味方だからね','{K}と過ごす時間が、いちばんの宝物','{K}に会える日は、朝から、ごきげんなの','{K}、今日の運勢、大吉だよ！ …たぶん','{K}が笑うと、世界が、明るくなるの','{K}、いつか、二人で、遠くへ行きたいね','{K}、いま、{n}のこと、思い出してくれた？','{K}、{n}です。…ただ、声が聞きたくて','{K}、{n}は、今日も、元気です！','{K}、{n}より。会いたいって、言っちゃった','{K}、{n}、いつでも、そばにいるよ','{K}、{n}は、ずっと、{K}の味方','{K}のスマホ、{n}の通知で、いっぱいだったらごめんね','{K}、今日も、{n}の一番は、{K}だよ','{K}、{n}の待ち受け、{K}にしてもいい？','{K}、次に会えるの、楽しみにしてるね','{K}、{n}と、デートしてくれる？','{K}、ねえねえ、{n}のこと、好き？ …なんてね','{K}、無理だけは、しないでね。{n}より','{K}、{n}が、ひとこと言うね。…だいすき！','{K}、今日、{n}と、目が合ったよね？ …気のせいじゃないよね','{K}、{n}です。おやすみなさい、いい夢を','{K}、{n}は、毎日、{K}を、思ってます','{K}、{n}の気持ち、受け取ってね♡','{K}が、歩くだけで、みんな、振り返るんだよ。知ってた？','{K}、モテすぎて、心配になっちゃう…でも、応援してる！','{K}のファン一号、{n}です！','{K}の行くところ、花が咲きそう','今日も、{K}の周りは、にぎやかだね。…わたしも、その一人だけど','{K}、ライバル多いけど、負けないよ','{K}、みんなの{K}だけど、ちょっとだけ、わたしの{K}でいてね');
