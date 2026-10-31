/* ===== モテモテ演出(朝の出迎え / 差し入れ / 女子会 / 学園新聞 / 見守る会チャット / ファンクラブ) =====
   ふだんの学園生活で「みんなが{K}に夢中(または興味津々)」だと感じられる演出のしくみです。
   台詞・場面のデータは daily_lines.js にあります。この daily.js は、起きる確率・条件・好感度の増減などの「しくみ」だけです。

   ■ 一覧(どこで呼ばれるか)
     ① 朝の出迎え ……… 毎月の最初の週(menu の頭)に、ノベル画面で再生。 dailyMorning()
        好感度の低い子(50未満)=遠目でちらちら見つめている / 50〜74=勇気を出して挨拶 / 75以上=出迎え(人数が多いほど華やか)
        さらに学園新聞(ファンクラブの節目は必ず、ふだんは60%)。 ※最初の月(導入のあと)は出ません
     ② 差し入れ ………… 毎週の終わりに GIFT_RATE の確率。送り主の好感度で内容が変わる。好感度アップ・疲れ回復など。 gift()
     ③ 女子会 …………… 毎週の終わりにまれに(TALK_RATE)。主人公のいないところで、女子たちが{K}の話で盛り上がる。 girltalk()
        ※ ちらり(harem.js)・差し入れ・女子会は、1週に最大1つだけ起きます(weekExtra)。
     ④ スマホの「見守る会」 … {K}が知らない女子たちのグループチャット。最初から30人以上、魅力が高いほど人数・会話が増える(90以上は大興奮)。
        {K}の最近の行動の報告も流れる(noteAct)。初めて開くと説明が出る。未読バッジが「99+」になる。 chatHtml() / chatUnread()
     ⑤ スマホの「ファンクラブ」 … 会員は魅力などで大量に増える(好感度は関係なし。上の fcCrowd 参照)。会員番号・会長・副会長・称号・次の目標。 fcHtml()

     ⑥ 通り名 …………… モテ度(魅力+好感度75以上の人数×2+ファン会の会員数)で変わる。メイン画面に表示。 moteTitle()
     ⑦ 学園の変化 ……… ファン会の会員数で、学園が{K}仕様に変わっていく(朝の出迎えで発表。ファン会アプリに一覧)。 SCHOOL_CHANGES
     ⑧ 行事で主役扱い … 5月 体育祭 / 8月 夏祭り / 10月 文化祭 / 12月 クリスマスの前に、ノベルで{K}が主役の場面。 starEvent()
     ⑨ 卒業式の第二ボタン争奪戦 + ハーレムエンド … ending() の前に再生。好感度75以上が100人(harem.js の HAREM_END_N)でハーレムエンド。
     ⑩ 画面演出 ………… 好感度が上がるとハートが舞う / メイン画面の縁から女子の顔アイコンがのぞく。 peekHtml() / heartHtml()

   ■ 調整できる数字(下の定数)
     MORNING_NEWS_P … 学園新聞が出る確率 / GIFT_RATE・GIFT_FAV … 差し入れ / TALK_RATE・TALK_FAV … 女子会
     FC_MIN … ファンクラブの会員になる好感度 / CHAT_BASE … 見守る会の最初の人数(魅力が上がるとこれに加算) / CHAT_WEEKS … チャットに表示する週数 / CHAT_SHOW … 表示する書き込みの最大数

   ■ 場面の増やし方
     daily_lines.js の MORNING_LOW / MORNING_MID / MORNING_HIGH / GIRLTALK に { min:人数, lines:[…] } を足すだけです(書き方は daily_lines.js の冒頭)。 */

const MORNING_NEWS_P=.6;
const GIFT_RATE=.2,GIFT_FAV=2;
const TALK_RATE=.08,TALK_FAV=1;
const PEEK_MAX=8;
let HB=0; /* ハートを舞わせる量(好感度が上がると index.html の add() が増やす) */
const FC_MIN=50,CHAT_WEEKS=3,CHAT_SHOW=60,CHAT_BASE=30;

const dShuffle=a=>a.slice().sort(()=>Math.random()-.5);
const dSeason=()=>{const m=mon();return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'};
const favOf=h=>S.a[h.id]||0;

/* 記号の置き換え。names={a:'名前',…} */
function dailyFmt(t,names,extra){
 names=names||{};extra=extra||{};
 return String(t==null?'':t)
  .replace(/\{([a-eno])\}/g,(m,k)=>names[k]!=null?names[k]:m)
  .replace(/\{N\}/g,extra.N!=null?extra.N:haremN())
  .replace(/\{M\}/g,extra.M!=null?extra.M:fcCount())
  .replace(/\{K\}(?:くん)?/g,GAME.nick||GAME.player).replace(/ぼく(?!ろ)/g,'僕').replace(/\{P\}/g,GAME.player).replace(/\{G\}/g,GAME.given).replace(/\{school\}/g,GAME.school);
}
/* 場面 { min, lines } を、選ばれた女子 girls(配列)に当てはめて、ノベルの行にする。話者 'a'〜'e' = girls[0]〜[4] */
function dailyApply(sc,girls,extra){
 const ids={},names={};'abcde'.split('').forEach((k,i)=>{if(girls[i]){ids[k]=girls[i].id;names[k]=girls[i].n}});
 return sc.lines.map(r=>{
  if(!Array.isArray(r))return r;
  if(r[0]==='cast')return['cast',String(r[1]).split(',').map(tk=>{tk=tk.trim();const m=tk.match(/^(~?)([a-e])$/);return m?m[1]+(ids[m[2]]||''):tk}).filter(Boolean).join(',')];
  if(r[0]==='bg'||r[0]==='hide')return r.slice();
  return[ids[r[0]]||r[0],dailyFmt(r[1],names,extra)];
 });
}
/* 条件に合う場面からひとつ選ぶ(直前と同じものは避ける) */
function dailyPick(key,list,count,hiN){
 const ok=list.filter(s=>s.min<=count&&(!s.hi||hiN>=s.hi));if(!ok.length)return null;
 const big=ok.filter(s=>s.hi);
 return pickNR('daily:'+key,big.length&&Math.random()<.7?big:ok);
}

/* ===== ファンクラブ ===== */
/* ファンクラブの会員数は、好感度ではなく【魅力】などで増えていきます(魅力が低くても、最初から少しずついます)。
   会員数 = 名前を知っている会員(fcMembers) + 名前をまだ知らない一般会員(fcCrowd)。上限は学園の人数 FC_CAP。
   ・一般会員 = FC_BASE + (魅力/100)^FC_POW × FC_FULL + 経過月数 × FC_PER_MONTH   (魅力が高いほど急に増える)
   ・名前を知っている子は、好感度が「FC_MIN − 魅力/2」以上で入会(魅力が高いと、好感度が低くても全員入会) */
const FC_BASE=5,FC_POW=1.8,FC_FULL=900,FC_PER_MONTH=2,FC_CAP=1000;
const fcThreshold=()=>S?Math.max(0,FC_MIN-Math.floor(S.st.charm/2)):FC_MIN;
const fcMembers=()=>avail().filter(h=>favOf(h)>=fcThreshold()).sort((a,b)=>favOf(b)-favOf(a));
const fcCrowd=()=>S?Math.round(FC_BASE+Math.pow(Math.min(1,S.st.charm/100),FC_POW)*FC_FULL+(S.t||0)*FC_PER_MONTH):0;
const fcCount=()=>S?Math.min(FC_CAP,fcCrowd()+fcMembers().length):0;
function fcRank(n=fcCount()){let r='';FC_RANKS.forEach(([m,t])=>{if(n>=m)r=t});return r}
function fcNext(n=fcCount()){return FC_RANKS.find(([m])=>m>n)||null}
/* 会員番号: 知り合った順(最初の3人→出会った順) */
function fcNo(id){
 const o=avail().slice().sort((x,y)=>(S.mo&&S.mo[x.id]||0)-(S.mo&&S.mo[y.id]||0)||HEROINES.indexOf(x)-HEROINES.indexOf(y));
 return o.findIndex(h=>h.id===id)+1;
}
function fcHtml(){
 const m=fcMembers(),n=fcCount(),lo=avail().length-m.length,nx=fcNext(n),rk=fcRank(n);
 let h=`<p class="hint">通り名「${chatEsc(moteTitle().name)}」</p><p class="hint">${GAME.nick}ファンクラブ${rk?'　称号「'+rk+'」':'　(会員はまだいません)'}</p>`
  +`<div class="st"><span>会員数</span><b>${n}人</b></div>`
  +`<div class="st"><span>名前を知る会員</span><b>${m.length}人</b></div>`+(lo>0?`<p class="hint">まだ入会していない、知り合いの子：${lo}人（好感度${fcThreshold()}で入会。魅力が上がるとこの数字は下がります）</p>`:'')
  +(nx?`<p class="hint">あと${nx[0]-n}人で「${nx[1]}」</p>`:'<p class="hint">最高ランクに到達しました！</p>');
 h+=m.slice(0,30).map((x,i)=>`<div class="ev"><span><b>№${fcNo(x.id)} ${x.n}</b>${i===0?' 👑会長':i===1?' ⭐副会長':''}</span><span>♥${favOf(x)}</span></div>`).join('');
 if(m.length>30)h+=`<p class="hint">…ほか名前を知っている子${m.length-30}人</p>`;
 h+=`<p class="hint">そのほか、名前をまだ知らない会員が${n-m.length}人います。</p>`;
 return h+fcVoices(n)+schoolHtml();
}

/* ===== 見守る会(グループチャット) =====
   ★設定: {K}が知らない女子たちのグループチャット。{K}の一挙手一投足を報告し合っている。
   メンバーは最初から CHAT_BASE(30)人以上。魅力が高いほど人数(CHAT_BASE+魅力)と書き込みの量が増え、
   魅力の段階(CHAT_TIERS)で会話が濃くなる。90以上はもはや大興奮した女子だらけ。
   知り合った女子は本名と顔アイコンで、まだ知らない子は「ハンドル名+色アイコン」で参加します。 */
const chatCharm=()=>S.st.charm||0;
const chatTier=()=>{const c=chatCharm();return c>=90?3:c>=70?2:c>=40?1:0};
const chatTotal=()=>Math.max(CHAT_BASE+chatCharm(),avail().length);
const chatPerWeek=()=>Math.round(6+chatCharm()*.5);
const chatWeek=()=>S.t*4+(4-Math.max(0,Math.min(4,S.ap)));
function chatUnread(){const wk=chatWeek();if(S.gu==null)S.gu=wk;return Math.max(0,(wk-S.gu)*chatPerWeek())}
const chatBadge=()=>{const u=chatUnread();return u<=0?'':u>99?'99+':String(u)};
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* メンバー名簿: 知り合った女子(本名・顔) + 本人が知らないメンバー(ハンドル名) */
function chatRoster(){
 const known=avail().map(h=>({id:h.id,h,name:h.n,real:true})),L=CHAT_STEMS.length,out=known.slice();
 for(let i=0;out.length<chatTotal();i++){
  const stem=CHAT_STEMS[i%L],suf=CHAT_SUFFIX[Math.floor(i/L)%CHAT_SUFFIX.length];
  out.push({id:'m'+i,name:stem+suf,real:false,hue:(i*47)%360});
 }
 return out;
}
const chatEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function chatIcon(m){
 return m.real?`<span class="cav">${pic(m.h)}</span>`:`<span class="cav mob" style="background:hsl(${m.hue} 55% 48%)">${chatEsc(m.name[0])}</span>`;
}
function chatHtml(){
 const K=chatEsc(GAME.nick);
 if(!S.gi)return `<div class="cintro"><h3>「${K}を見守る会」</h3>${CHAT_INTRO.map(t=>`<p>${chatEsc(dailyFmt(t))}</p>`).join('')}<button class="opt" type="button" data-do="gi">グループをのぞく</button></div>`;
 const wk=chatWeek();S.gu=wk;
 const ros=chatRoster(),n=ros.length,real=ros.filter(m=>m.real),tier=chatTier(),per=chatPerWeek(),posts=[];
 for(let w=Math.max(0,wk-CHAT_WEEKS+1);w<=wk;w++){
  const rnd=mulberry(w*1013+(S.loop||0)*77+n),pk=a=>a[Math.floor(rnd()*a.length)];
  /* 最近の{K}の行動の報告(今週のぶん) */
  if(w===wk&&S.la)S.la.forEach(a=>{
   const g=a.n?real.find(m=>m.name===a.n):null,w2=pk(ros);
   posts.push({m:w2,t:dailyFmt(pk(CHAT_ACT[a.k]||CHAT_ACT.walk),{n:a.n||pk(real).name})});
  });
  const wt=ros.map(m=>m.real?2+favOf(m.h)/20:1),sum=wt.reduce((x,y)=>x+y,0);
  for(let k=0;k<per;k++){
   let t=rnd()*sum,m=ros[ros.length-1];for(let i=0;i<ros.length;i++){t-=wt[i];if(t<0){m=ros[i];break}}
   const o=pk(ros);let pool;
   if(m.real){const f=favOf(m.h);pool=tier===3&&rnd()<.5?CHAT_MOB[3]:f>=75?CHAT_HIGH:f>=50?CHAT_MID:CHAT_LOW}
   else pool=CHAT_MOB[tier];
   posts.push({m,t:dailyFmt(pk(pool),{o:o.name})});
  }
 }
 const hot=['','盛り上がっています','かなり熱いです','大興奮です！！'][tier];
 return `<p class="hint">${K}を見守る会（メンバー${n}人）${hot?'<br>'+hot:''}</p><p class="hint2">※ ${K}は、このグループを知りません。</p>`
  +posts.slice(-CHAT_SHOW).map(p=>`<div class="crow">${chatIcon(p.m)}<div><b>${chatEsc(p.m.name)}</b><p class="bub${tier>=3?' hot':''}">${chatEsc(p.t)}</p></div></div>`).join('');
}
/* {K}の行動を覚えておく(見守る会の「一挙手一投足」の報告に使う)。直近4件 */
function noteAct(k,name){S.la=(S.la||[]).filter(a=>a.k!==k).concat([{k,n:name||''}]).slice(-4)}

/* ===== ① 朝の出迎え ===== */
function dailyMorning(){
 const all=avail(),T={lo:[],mid:[],hi:[]};
 dShuffle(all).forEach(h=>{const f=favOf(h);(f>=75?T.hi:f>=50?T.mid:T.lo).push(h)});
 const N=T.hi.length,M=fcCount(),ex={N,M},L=[];
 L.push(['',dailyFmt(pickNR('daily:intro',MORNING_INTRO[dSeason()]),{},ex)]);
 const seg=(key,list,girls)=>{
  const sc=dailyPick(key,list,girls.length,N);if(!sc)return;
  L.push(['hide','']);L.push(...dailyApply(sc,girls.slice(0,sc.min),ex));
 };
 seg('low',MORNING_LOW,T.lo);seg('mid',MORNING_MID,T.mid);seg('hi',MORNING_HIGH,T.hi);
 L.push(...lifeMorning(N));
 /* 学園新聞: ファンクラブの節目(必ず) → ふだんの見出し(確率) */
 S.fcm=S.fcm||0;
 const ms=Object.keys(NEWS_FC).map(Number).filter(t=>t<=M&&t>S.fcm).pop();
 let news=null;
 if(ms){S.fcm=ms;news=NEWS_FC[ms]}else if(Math.random()<MORNING_NEWS_P)news=pickNR('daily:news',NEWS_RANDOM);
 L.push(['hide','']);
 /* 通り名が上がった / 学園が{K}仕様に変わった */
 {const t=moteTitle();S.ti=S.ti||0;if(t.i>S.ti){S.ti=t.i;L.push(['','📰 '+dailyFmt(pickNR('daily:ntitle',NEWS_TITLE),{},ex).replace(/\{T\}/g,t.name)])}
  S.scx=S.scx||0;schoolChanges(M).filter(c=>c[0]>S.scx).forEach(c=>{S.scx=c[0];L.push(['','🏫 学園に、新しい変化があった。']);L.push(['',dailyFmt(c[1],{},ex)])})}
 if(news){L.push(['','廊下の掲示板に、学園新聞が貼り出されていた。']);L.push(['','📰 '+dailyFmt(news,{},ex)])}
 L.push(['',dailyFmt(pickNR('daily:end',MORNING_END),{},ex)]);
 cnt('morning');if(N>=10)cnt('morning10');
 return L;
}
/* menu() から呼ばれる。月の最初の週に1回だけ、朝の出迎えを再生して done(=menu)へ戻す。再生したら true */
function morningMaybe(done){
 if(!S||S.fin||S.t<=0||S.ap!==4||S.mg===S.t)return false;
 S.mg=S.t;
 Novel.play({lines:dailyMorning()},{ill:'morning'},done);
 return true;
}

/* ===== ② 差し入れ ===== */
function gift(done){
 if(Math.random()>=GIFT_RATE)return false;
 const all=avail();if(!all.length)return false;
 const g=pickOf(all),f=favOf(g),pool=f>=75?GIFTS.high:f>=50?GIFTS.mid:GIFTS.low,it=pickNR('gift:'+(f>=75?'h':f>=50?'m':'l'),pool),up=it.fav||GIFT_FAV;
 add(g.id,up);met.add(g.id);cnt('gift');
 let r='';
 if(it.f){const b=S.f;S.f=Math.max(0,S.f-it.f);if(S.f<b)r+=`疲れが${b-S.f}ほぐれた。`}
 if(it.money){S.money+=it.money;r+=(r?'\n':'')+`${yen(it.money)}を受け取った。`}
 show(g.id,'【届け物】\n'+dailyFmt(it.t,{n:g.n})+(r?'\n'+r:''),[['つぎへ',done,'p']]);
 return true;
}

/* ===== ③ 女子会 ===== */
function girltalk(done){
 if(Math.random()>=TALK_RATE)return false;
 const all=avail();if(all.length<3)return false;
 const sc=pickNR('daily:talk',GIRLTALK.filter(s=>s.min<=all.length));if(!sc)return false;
 /* まだ素直になれていない子(好感度が低い子)を優先して集める */
 const g=dShuffle(all).sort((a,b)=>(favOf(a)>=75?1:0)-(favOf(b)>=75?1:0)).slice(0,sc.min);
 g.forEach(x=>{add(x.id,TALK_FAV);met.add(x.id)});cnt('girltalk');
 const L=dailyApply(sc,g);
 L.push(['hide','']);L.push(['',`（…{P}は、そんな会話があったことを、まだ知らない）`.replace('{P}',GAME.player)]);
 Novel.play({lines:L},{ill:'girltalk'},done);
 return true;
}

/* ===== 1週に最大1つだけ、ちらり / 差し入れ / 女子会 のどれかが起きる(index.html の weekEnd から呼ばれます) ===== */
function weekExtra(done){
 if(hazard(done))return;
 if(incident(done))return;
 if(lifeWeekly(done))return;
 if(glance(done))return;
 if(gift(done))return;
 if(girltalk(done))return;
 done();
}

/* ===== ⑥ 通り名 ===== */
const moteScore=()=>S.st.charm+haremN()*2+Math.floor(fcCount()/10);
function moteTitle(){
 const sc=moteScore();let i=0;STAR_TITLES.forEach(([m],k)=>{if(sc>=m)i=k});
 return{i,name:dailyFmt(STAR_TITLES[i][1])};
}

/* ===== ⑦ 学園の変化 ===== */
const schoolChanges=(n=fcCount())=>SCHOOL_CHANGES.filter(c=>c[0]<=n);
function schoolHtml(){
 const n=fcCount(),got=schoolChanges(n),nx=SCHOOL_CHANGES.find(c=>c[0]>n);
 return `<h3 class="sch">学園の変化(${got.length}/${SCHOOL_CHANGES.length})</h3>`
  +got.map(c=>`<div class="ev"><span>${chatEsc(dailyFmt(c[1]))}</span></div>`).join('')
  +(nx?`<p class="hint">次の変化は、会員数${nx[0]}人で…</p>`:'<p class="hint">学園は、すっかり変わりました。</p>');
}

/* ===== ⑧ 行事で主役扱い ===== */
function starEvent(m,done){
 const list=STAR_EVENTS[m];if(!list||!avail().length)return done();
 const all=avail().slice().sort((a,b)=>favOf(b)-favOf(a)),top=dShuffle(all.slice(0,Math.max(5,Math.ceil(all.length/2)))),N=haremN(),ex={N,M:fcCount()};
 const ok=list.filter(s=>s.min<=top.length&&(!s.hi||N>=s.hi)),big=ok.filter(s=>s.hi),sc=ok.length?pickNR('star:'+m,big.length?big:ok):null;
 if(!sc)return done();
 const fan=all.filter(h=>favOf(h)>=50);fan.forEach(h=>{add(h.id,STAR_FAV);met.add(h.id)});
 const gc=gainSt('charm',1),ga=gainSt('art',1);cnt('star');
 const L=dailyApply(sc,top.slice(0,sc.min),ex);
 L.push(['hide','']);L.push(['',`【主役扱い】`+(gc?'魅力+1。':'')+(ga?'直感+1。':'')]);
 Novel.play({lines:L},{},done);
}

/* ===== ⑨ 卒業式の第二ボタン争奪戦 / ハーレムエンド ===== */
function buttonScene(kind,done){
 const all=avail();if(!all.length)return done();
 const strong=all.filter(h=>favOf(h)>=50),solo=kind==='solo'||!strong.length,pool=dShuffle(solo?all:strong),N=haremN(),ex={N,M:fcCount()};
 const list=solo?BUTTON_LOW:BUTTON_SCENES,ok=list.filter(s=>s.min<=pool.length&&(!s.hi||N>=s.hi)),big=ok.filter(s=>s.hi),sc=ok.length?pickNR('button',big.length?big:ok):null;
 if(!sc)return done();
 cnt('button');
 Novel.play({lines:dailyApply(sc,pool.slice(0,sc.min),ex)},{},done);
}
function haremEndLines(){
 const top=dShuffle(avail().filter(h=>favOf(h)>=75)),N=haremN();
 return dailyApply({lines:HAREM_END_LINES},top.slice(0,3),{N,M:fcCount()});
}

/* ===== ⑩ 画面演出 ===== */
/* メイン画面の縁から、女子の顔アイコンがのぞく(知り合いが増えるほど数が増える) */
const PEEK_POS=[['l',58,-9],['r',44,8],['l',30,7],['r',68,-7],['l',80,9],['r',16,-8],['l',8,-6],['r',86,7]];
function peekHtml(){
 const all=avail();if(!all.length)return '';
 const n=Math.min(PEEK_MAX,1+Math.floor(all.length/3)),pk=dShuffle(all).slice(0,n);
 return '<div class="peek">'+pk.map((h,i)=>{const [s,y,r]=PEEK_POS[i];return `<span class="pk" style="${s==='l'?'left':'right'}:-6px;top:${y}%;--r:${r}deg;animation-delay:${-i*.9}s">${pic(h)}</span>`}).join('')+'</div>';
}
/* 好感度が上がった直後の画面で、ハートを舞わせる */
/* 行事の「全員と過ごす」: 女子の小さな顔アイコンを画面にずらりと並べる(index.html の festAll) */
function crowdHtml(g){
 const n=g.length,sz=n<=12?58:n<=30?46:n<=60?36:28;
 return `<div class="crowd" style="--sz:${sz}px">`+g.map((h,i)=>`<span class="cw" style="animation-delay:${-(i%7)*.23}s;--r:${(i*37%11)-5}deg">${pic(h)}</span>`).join('')+'</div>';
}
function heartHtml(){
 const n=Math.min(HB,36);HB=0;if(n<=0)return '';
 return Array.from({length:n},(_,i)=>`<i class="hrt" style="left:${8+Math.floor(Math.random()*84)}%;animation-delay:${(i*.12).toFixed(2)}s;font-size:${14+Math.floor(Math.random()*14)}px">♥</i>`).join('');
}
