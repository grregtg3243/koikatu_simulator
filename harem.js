/* ===== 号令をかける(女子を集めるイベント) =====
   メイン画面の【号令をかける】の中身です。ざっくり版なので、自由に書き換えてください。

   ■ 発動条件(下の2つの数字を変えるだけで調整できます)
     好感度 HAREM_MIN(75)以上の女子が HAREM_NEED(5)人以上いると使えます。足りないときはボタンを押しても説明が出るだけです。
   ■ 消費
     行動力 1(= 1週間ぶん)。
   ■ 流れ
     gather() → 好感度75以上の女子を全員集める → 集まった人数で出せるイベントを絞る(min / max)
       → HAREM_EVENTS から重みつきでランダムに1つ選ぶ(さっきと同じイベントは続けて出ない)
       → 効果を反映 → 「のぞき見」の判定(HAREM_CURIOUS)→ ハーレムの規模と称号を表示 → 週の終わりへ

   ■ 全員が{K}に興味がある、という設定
     集まった子のほかに、好感度が低い(HAREM_MIN 未満の)子も、興味津々でこっそりのぞきに来ることがあります(70%)。
     のぞきに来た子は、好感度が少し上がります(+2〜4)。人数が多いほど、のぞきに来る子も増えます(最大5人)。
     好感度が低くても、本当は全員{K}が気になっている、という見せ方です。台詞は HAREM_CURIOUS で増やせます。

   ■ ハーレムの規模と称号(HAREM_RANKS)
     好感度 HAREM_MIN 以上の人数で決まります。メニューのボタンと、号令の結果に出ます。実績(achieve.js)にもつながっています。

   ■ イベントと台詞のデータは harem_events.js に分けました(書き方もそちらの冒頭にあります)。
     このファイル(harem.js)は、発動条件・称号・特典・確率などの「しくみ」だけです。
   ■ 追加した仕組み
     ・季節のイベント … イベントに m:[月] を書くと、その月だけ出ます(出やすさ3倍)。
     ・選ぶイベント ……… イベントに ch:{…} を書くと、候補3人から{P}が1人を選びます。
     ・ハーレムの特典 …… 人数が増えると、好感度ボーナス・毎月のお小遣い・疲れ軽減がつきます(下の HAREM_PERKS / HAREM_STIPEND)。
     ・ちらり ……………… 好感度ごとに3段階(ちらり/さりげなく/待ちきれなくて)。
   ■ (旧)イベント1つの書き方 ※最新版は harem_events.js の冒頭
     {n:'イベント名',
      s:'場面の文。{all}=集まった子の名前 / {a}=ランダムな1人 / {b}={c}={a}とは別の子 / {k}=集まった人数
         / {P}=柏木壮亮(地の文) / {G}=壮亮(名だけ。ヒロインが親しく呼ぶとき) / {K}=柏木くん(女子のセリフ)',
      fav:全員の好感度の増減(省略可。プラスのときは、人数が10人増えるごとに+1されます),
      luck:{a}の好感度の追加増減(省略可),
      st:['study|sport|art|charm', 上昇量](省略可),
      f:疲れの増減(省略可),
      min:このイベントが出る最小人数(省略時 HAREM_NEED),
      max:このイベントが出る最大人数(省略可),
      like:'study|sport|art|charm'(省略可。指定すると、{a}にその得意分野の子が優先して選ばれます),
      w:出やすさの重み(省略時1。大きいほど出やすい)}
   ■ 追加したいこと
     ・イベントを増やす → HAREM_EVENTS の末尾に1行足すだけ(上限なし)。
     ・人数の多い(大きな)イベントを作る → min を大きくします(例: min:30)。
     ・もっと凝りたい → 1つのイベントに run:(g)=>{...} を書くと、効果の反映のあとに実行されます(g=集まった女子の配列)。
       その中で Novel.play('場面名',{},戻り先) を呼べば、novel.js のノベル場面も使えます。 */
const HAREM_MIN=75,HAREM_NEED=5;

/* ハーレムの規模(人数)と称号。小さい順に並べます */
const HAREM_RANKS=[[5,'ハーレム見習い'],[10,'ハーレムの主'],[20,'学園の王'],[50,'伝説のハーレム王'],[100,'百花繚乱の覇王']];

/* 人数の特典。5人以上: 号令の好感度+1 / 20人以上: 号令で疲れが1減る / 100人以上: さらに好感度+1 */
const HAREM_PERKS={favBonus:[[5,1],[100,1]],rest:[[20,1]]};
/* 毎月のお小遣い(ファンクラブの会費など)。人数に届いた一番大きいものが出ます */
const HAREM_STIPEND=[[10,3000],[50,10000],[100,20000]];
const HAREM_SEASON_W=3;
/* 好感度75以上がこの人数に届いたまま卒業すると、ハーレムエンドになります(index.html の ending) */
const HAREM_END_N=100;

/* 好感度が HAREM_MIN 以上の女子 */
const haremList=()=>avail().filter(h=>S.a[h.id]>=HAREM_MIN);
const haremN=()=>haremList().length;
/* ハーレムの称号(HAREM_NEED 人に届いていなければ空) */
const haremRank=(n=haremN())=>{let r='';HAREM_RANKS.forEach(([m,t])=>{if(n>=m)r=t});return r};
const haremPerk=(tbl,n)=>tbl.reduce((s,[m,v])=>n>=m?s+v:s,0);
const haremStipend=(n=haremN())=>{let v=0;HAREM_STIPEND.forEach(([m,y])=>{if(n>=m)v=y});return v};
/* 毎月の頭に index.html の advance() から呼ばれます。お小遣いを足して、メッセージ(なければ空)を返します */
function haremMonthly(){
 const n=haremN(),y=haremStipend(n);if(!y)return '';
 S.money+=y;return `ハーレムのみんなから差し入れ ${yen(y)} が届いた。`;
}

const haremFmt=(t,v)=>t.replace(/\{all\}/g,v.all).replace(/\{a\}/g,v.a.n).replace(/\{b\}/g,v.b.n).replace(/\{c\}/g,v.c.n)
 .replace(/\{k\}/g,v.k).replace(/\{K\}(?:くん)?/g,GAME.nick||GAME.player).replace(/ぼく(?!ろ)/g,'僕').replace(/\{P\}/g,GAME.player).replace(/\{G\}/g,GAME.given).replace(/\{school\}/g,GAME.school);
let HAREM_LAST='';

function gather(){
 const g=haremList(),n=g.length;
 if(n<HAREM_NEED){
  show('',`号令をかけても、集まってくれる子が足りない…\n好感度${HAREM_MIN}以上の女子が${HAREM_NEED}人必要だ。（いま${n}人）`,[['もどる',menu,'p']]);
  return;
 }
 S.ap--;cnt('gather');noteAct('gather');
 /* 人数・月で出せるイベントを絞り、重みつきで選ぶ(直前と同じイベントは避ける。季節ものは出やすい) */
 const w=e=>(e.w||1)*(e.m?HAREM_SEASON_W:1);
 let ok=HAREM_EVENTS.filter(e=>(e.min||HAREM_NEED)<=n&&(!e.max||n<=e.max)&&(!e.m||e.m.includes(mon())));
 const nr=ok.filter(e=>e.n!==HAREM_LAST);if(nr.length)ok=nr;
 const tw=ok.reduce((s,e)=>s+w(e),0);let r=Math.random()*tw,ev=ok[ok.length-1];
 for(const e of ok){r-=w(e);if(r<0){ev=e;break}}
 HAREM_LAST=ev.n;
 const sh=g.slice().sort(()=>Math.random()-.5),lk=ev.like?sh.filter(x=>x.like===ev.like):[],a=lk[0]||sh[0],rest=sh.filter(x=>x!==a),b=rest[0]||a,c=rest[1]||b;
 const names=n>5?sh.slice(0,5).map(x=>x.n).join('、')+`、ほか${n-5}人`:sh.map(x=>x.n).join('、');
 const v={all:names,a,b,c,k:n};
 let t=`【${ev.n}】\n`+haremFmt(ev.s,v);
 let fav=ev.fav||0;if(fav>0)fav+=Math.floor(n/10)+haremPerk(HAREM_PERKS.favBonus,n);
 if(fav){g.forEach(x=>add(x.id,fav))}
 if(ev.luck){add(a.id,ev.luck)}
 if(ev.st){S.st[ev.st[0]]=Math.min(cap(),S.st[ev.st[0]]+ev.st[1]);t+=`\n${ST[ev.st[0]]}が${ev.st[1]}上がった。`}
 {const gc=gainSt('charm',1),ga=gainSt('art',1);if(gc)t+='\n魅力が1上がった。';if(ga)t+='\n直感が1上がった。'}
 const rl=haremPerk(HAREM_PERKS.rest,n);
 S.f=Math.max(0,Math.min(10,S.f+(ev.f||0)-rl));
 if(rl)t+=`\n（大勢に囲まれて、疲れが${rl}ほぐれた）`;
 g.forEach(x=>met.add(x.id));
 /* 選ぶイベント: 候補3人から1人を選ぶ */
 if(ev.ch){
  const cand=sh.slice(0,3);
  show('',t+'\n\n'+haremFmt(ev.ch.q,v),cand.map(x=>[x.n,()=>{
   cnt('choose');
   cand.forEach(y=>add(y.id,y===x?ev.ch.win:ev.ch.rest));
   gatherTail(g,v,ev,t0(ev,x),n);
  },'p']));
  return;
 }
 gatherTail(g,v,ev,t,n);
}
const t0=(ev,x)=>'【'+ev.n+'】\n'+ev.ch.t.replace(/\{x\}/g,x.n).replace(/\{P\}/g,GAME.player).replace(/\{G\}/g,GAME.given).replace(/\{school\}/g,GAME.school).replace(/\{K\}(?:くん)?/g,GAME.nick||GAME.player).replace(/ぼく(?!ろ)/g,'僕')
;
function gatherTail(g,v,ev,t,n){
 /* のぞき見: 好感度が低い子も、実は{K}が気になっている */
 const low=avail().filter(x=>S.a[x.id]<HAREM_MIN);
 if(low.length&&Math.random()<HAREM_CURIOUS_P){
  const k=Math.min(low.length,5,1+Math.floor(n/10)),pk=low.sort(()=>Math.random()-.5).slice(0,k),up=R(2,4);
  pk.forEach(x=>{add(x.id,up);met.add(x.id)});cnt('curious');
  t+='\n'+haremFmt(pickNR('curious',HAREM_CURIOUS),v).replace(/\{x\}/g,pk.map(x=>x.n).join('と'));
 }
 if(ev.run)ev.run(g);
 const rk=haremRank(n);
 t+=`\n\nハーレムの規模：${n}人${rk?'　称号「'+rk+'」':''}`;
 next('',t,'gather');
}
const HAREM_CURIOUS_P=.7;

/* ===== ちらり(ふだんの週でも、女子が{K}を気にしている様子が見えるイベント) =====
   毎週の終わりに GLANCE_RATE の確率で起きます(index.html の weekEnd から呼ばれます)。
   好感度が GLANCE_MAX 未満の子から1人が選ばれ、好感度が上がります。
   好感度で台詞が変わります: 50未満=GLANCES(ちらり) / 50〜74=GLANCES_MID(さりげなく) / 75〜=GLANCES_HIGH(待ちきれなくて)
   ・起きる確率 … GLANCE_RATE(0 にすると起きません) / 対象の上限 … GLANCE_MAX
   ・上がる量 … 75未満は GLANCE_FAV、それ以上は1
   ・台詞は harem_events.js で増やせます */
const GLANCE_RATE=.14,GLANCE_MAX=90,GLANCE_FAV=2;
/* 起きたら true を返します(その場合は「つぎへ」で done が呼ばれます)。起きなければ false */
function glance(done){
 if(!GLANCE_RATE||Math.random()>=GLANCE_RATE)return false;
 const p=avail().filter(x=>S.a[x.id]<GLANCE_MAX);if(!p.length)return false;
 const x=pickOf(p),a=S.a[x.id],i=a<50?0:a<75?1:2,pool=[GLANCES,GLANCES_MID,GLANCES_HIGH][i],up=i<2?GLANCE_FAV:1;
 add(x.id,up);met.add(x.id);cnt('glance');
 show(x.id,`【${GLANCE_TITLES[i]}】\n`+meetFmt(pickNR('glance'+i,pool),x),[['つぎへ',done,'p']]);
 return true;
}

/* ===== 散策中の紹介(場面と確率の説明は harem_events.js の HAREM_INTRO を見てください) =====
   index.html の weekEnd から、散策した週だけ呼ばれます。起きたら true(終わったら done が呼ばれます)。
   ※ 場面の組み立てには daily.js の dailyApply() を使います。 */
function introduce(done){
 if(Math.random()>=HAREM_INTRO_RATE)return false;
 const as=avail().filter(h=>S.a[h.id]>=HAREM_INTRO_MIN);if(!as.length)return false;
 const cand=HEROINES.filter(h=>h.rand&&!S.got[h.id]&&S.loop>=h.loop);if(!cand.length)return false;
 const a=as.sort(()=>Math.random()-.5).sort((x,y)=>(S.a[y.id]>75?1:0)-(S.a[x.id]>75?1:0))[0],b=pickOf(cand);
 const sc=pickNR('intro',HAREM_INTRO.filter(s=>!s.like||s.like===b.like).length?HAREM_INTRO.filter(s=>!s.like||s.like===b.like):HAREM_INTRO);
 const base=randFav(S.st.charm)+HAREM_INTRO_BONUS;S.a[b.id]=Math.min(100,base);
 S.got[b.id]=1;S.seen[b.id]=1;if(!S.mo[b.id])S.mo[b.id]=++S.moN;
 add(a.id,1);met.add(a.id);met.add(b.id);cnt('intro');
 const L=dailyApply(sc,[a,b]);L.push(['hide','']);
 if(b.hi)L.push([b.id,meetFmt(b.hi,b)]);
 Novel.play({lines:L},{h:b.id,ill:'intro'},()=>{
  const v=S.a[b.id];
  show(b.id,`${a.n}の紹介で、${b.n}と知り合った！\n第一印象：${v>=60?'とても好印象！':v>=40?'なかなか好印象':'ふつうの印象'}`,[['つぎへ',done,'p']]);
 });
 return true;
}
