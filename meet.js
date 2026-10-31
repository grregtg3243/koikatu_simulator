/* ===== 会いに行く(しくみ) =====
   「女性一覧」や「連絡先」から女子を選ぶと出る詳細画面の【会いに行く】ボタンの中身です。
   台詞そのものは別ファイルにあります。この meet.js は、段階の判定や好感度の計算などの「しくみ」だけです。
     ・ノベル形式のイベント(話者・背景・立ち絵つき) ……………………………… meet_scenes.js
     ・共通の台詞・得意分野別・断る台詞・季節・余韻・「はじめて」・節目 …… meet_lines.js
     ・女子ごとの専用台詞 ………………………………………………………………… meet_girl.js

   ■ 全体の流れ
     詳細画面の「会いに行く」(index.html の openDetail)→ meetGirl(id) → 好感度で段階を判定
       → 台詞(文章)または meet_scenes.js のノベル場面を1つ選ぶ(同じものは続けて出ません)
       → 季節の情景(60%)・余韻(50%)をつける → 好感度アップ
       → ノベル画面で表示(Novel.play。クリックで進む・ログ・早送りが使えます)→ 週の終わりへ(行動力-1)
     ※ meet_lines.js / meet_girl.js の文章は、改行ごとに自動でノベルの行になります
       (「で始まる行=その子のセリフ / （で始まる行=主人公の心の声 / それ以外=地の文)。
     ※ 立ち絵・背景・早送りなどのノベルの機能は、そのまま使えます。
     好感度30未満は「会えない」台詞が出るだけで、行動力は減りません。

   ■ 好感度の段階(下の MEET_TIERS。min が大きいものが優先されます)
     90以上 … メロメロ状態            (key:'melo')
     70以上 … 打ち明け話(本音を話す) (key:'heart')
     50以上 … 向こうからスキンシップ  (key:'touch')
     30以上 … 会話                    (key:'talk')
     30未満 … 会えない                (meet_lines.js の MEET_DENY)

   ■ ほかに起きること(数字は下の定数で変えられます)
     ・「はじめて」ボーナス … その女子と、その段階で初めて会うと、1行入って好感度が MEET_FIRST_FAV 増えます。
     ・節目のボーナス ………… その女子に会いに行った回数が 5/10/20/30 回目のとき、特別な場面と好感度ボーナス(meet_lines.js の MEET_MILESTONES)。
     ・好感度がすでに100のときは「上がった」ではなく「いっぱいだ」と表示します。
     ※ 会いに行った回数は S.mc[ヒロインid]、「はじめて」の記録は S.mt['id:段階'] に保存されます(実績にも使われます)。

   ■ 設定メモ(台詞を足すときは守ってください)
     ・{K}(柏木くん)は学校でただ一人の男子。女子たちは、好感度が低くても、実は全員{K}に興味があります。
       最初から{K}の前では緊張していて、うまく話せなかったり、目をそらしたりします。
     ・会えないとき(MEET_DENY)は、相手を傷つけない言い方にします。用事がある・周りの目が気になる・緊張する、のように、
       「会いたくない」ではなく「会いたいけど事情がある」と伝わる形にしてください。
       「親しくないから」「まだ好感度が足りないから」のように突き放す言い方は避けてください。
     ・台詞の中の呼び方: {n}=その女子の名前 / {K}=柏木くん / {P}=柏木壮亮(フルネーム) / {G}=壮亮(名だけ)
       ※ 「{K}」の呼び方は heroines.js の GAME.nick で変えられます。

   ■ どこを触ればいいか
     ・しきい値(30/50/70/90)・段階ごとの好感度アップ量 … 下の MEET_TIERS の min / fav
     ・段階を増やす(例: 60以上) ……… MEET_TIERS に1行足し、meet_lines.js の MEET_LINES に同じ key の台詞を足す(min が大きい順に並べる)
     ・季節の情景・余韻の出る確率 …… MEET_SCENE_P / MEET_AFTER_P
     ・専用台詞が選ばれやすい倍率 …… MEET_GIRL_W
     ・ノベル形式のイベントを書く …… meet_scenes.js(いちばん自由。話者・背景・立ち絵を行ごとに指定できます)
     ・短い台詞を増やす・直す ……… meet_lines.js / meet_girl.js
     ・ノベル場面が選ばれやすい倍率 … MEET_SCENE_W(共通) / MEET_SCENE_GIRL_W(その子専用)
     ・行動力の消費(いまは1) ………… meetGirl() 内の S.ap--

   ■ ノベル場面にしたいとき
     meetGirl() の最後で、next の代わりに Novel.play('meet_talk_ID',{h:id},戻り先) などを呼べば、novel.js の場面が使えます。 */

const MEET_TIERS=[
 {key:'melo',min:90,label:'メロメロ',fav:4},
 {key:'heart',min:70,label:'打ち明け話',fav:3},
 {key:'touch',min:50,label:'スキンシップ',fav:3},
 {key:'talk',min:30,label:'会話',fav:2}
];
/* 会いに行くの演出: 段階ごとの確率 p と演出 k(['fx',…] の種類。配列ならランダム)。メロメロだとハートが舞い上がることがあります */
const MEET_FX={heart:{p:.12,k:'hearts'},touch:{p:.1,k:'hearts'},melo:{p:.45,k:['hearts','hearts','petals','flash']}};
const MEET_SCENE_P=.6,MEET_AFTER_P=.5,MEET_FIRST_FAV=2,MEET_GIRL_W=3;
/* meet_scenes.js(ノベル形式のイベント)が選ばれやすい倍率: 共通の場面 / その子専用の場面 */
const MEET_SCENE_W=2,MEET_SCENE_GIRL_W=6;

const meetTier=a=>MEET_TIERS.find(t=>a>=t.min)||null;
const meetFmt=(t,h)=>t.replace(/\{n\}/g,h.n).replace(/\{K\}(?:くん)?/g,GAME.nick||GAME.player).replace(/ぼく(?!ろ)/g,'僕').replace(/\{P\}/g,GAME.player).replace(/\{G\}/g,GAME.given).replace(/\{school\}/g,GAME.school);
const pickOf=a=>a[R(0,a.length-1)];
const meetSeason=()=>{const m=mon();return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'};
/* 同じ女子・同じ段階で、さっきと同じ台詞が続けて出ないようにする(セーブには残らない) */
const MEET_LAST={};
const NR_KEEP=6; /* 直近いくつ前までの台詞を避けるか(候補が多いときだけ。候補数の半分を超えない) */
function pickNR(key,arr){
 const h=MEET_LAST[key]||(MEET_LAST[key]=[]),keep=Math.min(NR_KEEP,Math.floor(arr.length/2));
 let t=arr[R(0,arr.length-1)];
 for(let i=0;i<20&&arr.length>1&&h.slice(-Math.max(keep,1)).includes(t);i++)t=arr[R(0,arr.length-1)];
 h.push(t);if(h.length>12)h.shift();return t;
}
/* 組み合わせ会話(meet_mix.js): 場面 + セリフ + 余韻 を別々に、直近を避けて選んで1つの文章にする */
function meetMix(id,key){
 const m=typeof MEET_MIX==='undefined'?null:MEET_MIX[key];if(!m||!m.open.length||!m.say.length)return null;
 /* 場面 = 共通 + 季節の場面(×2) / セリフ = 共通 + その子の得意分野のセリフ(×2) */
 const h=H(id),sn=meetSeason();let open=m.open,say=m.say;
 const so=typeof MIX_SEASON!=='undefined'&&MIX_SEASON[sn]&&MIX_SEASON[sn][key]||[],ts=typeof MIX_TYPE_SAY!=='undefined'&&MIX_TYPE_SAY[h.like]&&MIX_TYPE_SAY[h.like][key]||[];
 if(so.length)open=open.concat(so,so);if(ts.length)say=say.concat(ts,ts);
 const mo=typeof MIX_MONTH!=='undefined'&&MIX_MONTH[mon()]&&MIX_MONTH[mon()][key]||[];if(mo.length)say=say.concat(mo,mo,mo); /* その月の行事に触れるセリフ(×3) */
 let t=pickNR(id+':mo:'+key,open)+'\n'+pickNR(id+':ms:'+key,say);
 if(m.end&&m.end.length&&Math.random()<.75)t+='\n'+pickNR(key+':me',m.end);
 return t;
}
/* ハーレム乱入(meet_mix_more.js の CAMEO_*): 会話のあと、別の女子がひょっこり現れて、小さな修羅場ならぬ「甘い取り合い」になる。
   人数が多いほど乱入しやすく、3人以上の「輪」も出る。登場した子たちも、少しだけ好感度が上がる */
function meetCameo(id,h){
 if(typeof CAMEO_1==='undefined')return [];
 const N=typeof haremN==='function'?haremN():0,p=Math.min(CAMEO_MAX,CAMEO_BASE+N*CAMEO_PER);
 if(Math.random()>=p)return [];
 const oth=avail().filter(x=>x.id!==id),pri=oth.filter(x=>S.a[x.id]>=30),pool0=pri.length>=1?pri:oth;
 if(!pool0.length)return [];
 const sh=pool0.slice().sort(()=>Math.random()-.5),r=Math.random();
 let k=1,tab=CAMEO_1;
 if(r<.12&&N>=5&&sh.length>=3&&CAMEO_3.length){k=3;tab=CAMEO_3}
 else if(r<.45&&sh.length>=2&&CAMEO_2.length){k=2;tab=CAMEO_2}
 const who=sh.slice(0,k),m={g:id,a:who[0]&&who[0].id,b:who[1]&&who[1].id,c:who[2]&&who[2].id};
 const names={a:who[0]&&who[0].n,b:who[1]&&who[1].n,c:who[2]&&who[2].n};
 const sc=pickNR('cameo'+k,tab);
 who.forEach(x=>add(x.id,1));
 const fmt=t=>meetFmt(t,h).replace(/\{a\}/g,names.a||'').replace(/\{b\}/g,names.b||'').replace(/\{c\}/g,names.c||'');
 const bg=typeof illustPick==='function'?illustPick('cameo'+k,'',null,true):'';
 return (bg?[['bg',bg]]:[]).concat(sc.map(r=>[m[r[0]]||r[0],fmt(r[1])]));
}
/* デート中の会話(好感度で low/mid/high) */
function dateTalk(k){
 if(typeof DATE_TALK==='undefined'||Math.random()>=DATE_TALK_P)return '';
 const a=S.a[k],d=DATE_TALK[a>=70?'high':a>=50?'mid':'low'];
 return d&&d.length?meetFmt(pickNR('date:'+(a>=70?'h':a>=50?'m':'l'),d),H(k)):'';
}
/* その女子・その段階で選ばれる台詞の一覧(共通 + 得意分野別 + 専用×MEET_GIRL_W)。only:true なら専用だけ */
function meetPool(h,key){
 const base0=meetPool0(h,key),sc=typeof MEET_SCENES!=='undefined'?MEET_SCENES:{},mine=sc[h.id+':'+key]||[],gen=sc[':'+key]||[];
 let pool=base0.slice();
 for(let i=0;i<MEET_SCENE_W;i++)pool=pool.concat(gen);
 for(let i=0;i<MEET_SCENE_GIRL_W;i++)pool=pool.concat(mine);
 return pool;
}
function meetPool0(h,key){
 const own=(typeof MEET_GIRL!=='undefined'&&MEET_GIRL[h.id])||{},mine=own[key]||[];
 const base=key==='deny'?MEET_DENY:(MEET_LINES[key]||[]).concat((MEET_TYPE[h.like]||{})[key]||[]);
 if(own.only&&mine.length)return mine;
 let pool=base.slice();for(let i=0;i<MEET_GIRL_W;i++)pool=pool.concat(mine);
 return pool;
}

/* 文章(\n区切り)を、ノベルの行([話者,本文])に変えます。「で始まる行=その子のセリフ / （で始まる行=主人公の心の声 / それ以外=地の文 */
function meetTextLines(id,text,h){
 return meetFmt(text,h).split('\n').filter(Boolean).map(l=>/^「/.test(l)?[id,l]:/^（/.test(l)?['me',l]:['',l]);
}
/* プールから選ばれたもの(文章 または meet_scenes.js のノベル場面)を、ノベルの行の配列にそろえる。'girl' はその子のidに置き換わります */
function meetEntryLines(id,e,h){
 if(typeof e==='string')return meetTextLines(id,e,h);
 return e.map(r=>Array.isArray(r)?(r[0]==='bg'||r[0]==='hide'?r.slice():[r[0]==='girl'?id:r[0],meetFmt(r[1],h)]):r);
}
/* 会いに行く = ノベル画面で表示。lines を Novel.play に渡し、終わったら done を呼ぶ */
function meetPlay(id,lines,done,ill){Novel.play({lines},{h:id,ill:ill||''},done)}

function meetGirl(id){
 const h=H(id),a=S.a[id],tr=meetTier(a);
 if(!tr){
  meetPlay(id,meetEntryLines(id,pickNR(id+':deny',meetPool(h,'deny')),h),menu);
  return;
 }
 S.mc=S.mc||{};S.mt=S.mt||{};
 S.ap--;met.add(id);noteAct('meet',h.n);cnt('meet');if(tr.key==='melo')cnt('melo');
 const c=S.mc[id]=(S.mc[id]||0)+1,fk=id+':'+tr.key,first=!S.mt[fk],ms=MEET_MILESTONES[c];
 if(first){S.mt[fk]=1;cnt('first_'+tr.key)}
 const gc=gainSt('charm',1),before=S.a[id];add(id,tr.fav+(first?MEET_FIRST_FAV:0)+(ms?ms.fav:0));const up=S.a[id]-before;
 let L=[];
 if(Math.random()<MEET_SCENE_P)L.push(['',meetFmt(pickOf(MEET_SCENE[meetSeason()]),h)]);
 if(first)L.push(['',meetFmt(pickOf(MEET_FIRST[tr.key]),h)]);
 /* 前回のふり返り: 2か月以内に会っていれば、ときどき前回の話にふれる(meet_mix_more.js の MEET_CALLBACK) */
 {S.lm=S.lm||{};const lm=S.lm[id],d=lm?S.t-lm.t:-1;
  if(!first&&lm&&d>=0&&d<=2&&typeof MEET_CALLBACK!=='undefined'&&MEET_CALLBACK[lm.k]&&Math.random()<MEET_CALLBACK_P)L.push([id,meetFmt(pickNR(id+':cb',MEET_CALLBACK[lm.k]),h)]);
  S.lm[id]={k:tr.key,t:S.t}}
 {const mx=Math.random()<(typeof MEET_MIX_P!=='undefined'?MEET_MIX_P:0)?meetMix(id,tr.key):null;
  L=L.concat(meetEntryLines(id,mx||pickNR(id+':'+tr.key,meetPool(h,tr.key)),h))}
 if(Math.random()<MEET_AFTER_P)L=L.concat(meetTextLines(id,pickNR(tr.key+':after',MEET_AFTER[tr.key]),h));
 if(typeof illustApply==='function')L=illustApply(L,{h:id,ill:'meet_'+tr.key});
 {const f=typeof MEET_FX!=='undefined'&&MEET_FX[tr.key];if(f&&Math.random()<f.p)L.splice(L.length&&L[0][0]==='bg'?1:0,0,['fx',typeof f.k==='string'?f.k:pickOf(f.k)])} /* 会いに行くの演出(MEET_FX) */
 L=L.concat(meetCameo(id,h));
 if(ms)L.push(['','💞 '+meetFmt(ms.t,h)]);
 L.push(['',`【${tr.label}${first?'・★はじめて':''}】`+(gc?'魅力が1上がった。':'')]);
 meetPlay(id,L,()=>weekEnd('meet'),'meet_'+tr.key);
}
