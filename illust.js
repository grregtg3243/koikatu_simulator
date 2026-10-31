/* ===== 挿絵の自動表示(illust.js) =====
   どの会話イベントでも、用意した挿絵が自動で背景に出ます。画像が無い・読み込めない場合は、背景なしで普通に進みます(止まりません)。
   ■ 使い方(3ステップ)
     1) 画像を img2 フォルダに入れる。名前は「ev_カテゴリ_番号」(jpg / png / webp のどれでも。拡張子は自動で探します)。
          例) ev_meet_melo_1.jpg  ev_meet_melo_2.jpg  ev_g3_1.png
        その子専用にしたいときは「ev_子のid_カテゴリ_番号」。 例) ev_hinata_meet_melo_1.jpg
     2) 下の ILLUST_COUNT に、そのカテゴリに何枚あるか(番号の最大)を書く。 例) meet_melo:2
        その子専用なら ILLUST_GIRL に 'hinata:meet_melo':1 のように書く。
     3) それだけ。0枚(初期値)のカテゴリは、何も出しません。
   ■ 選ばれ方(上から順に、枚数が1以上のものがあればそれを使う)
     その子専用+カテゴリ → カテゴリ → 人数別(g1=1人 / g2=2人 / g3=3人 / g4=4人 / crowd=5人以上) → any(どの場面でも)
     同じ絵が続けて出ないように、直近は避けます。
   ■ カテゴリ一覧
     meet_talk / meet_touch / meet_heart / meet_melo … 「会いに行く」の4段階(会話・ふれあい・本音・メロメロ)
     cameo1 / cameo2 / cameo3 ………………………… 他の女子が乱入する場面(1人 / 2人 / 3人以上)
     morning(朝の出迎え) / girltalk(女子会) / incident(ランダム事件) / hazard(体育・疲労のハプニング) / nurse(保健室) / intro(新しい女子の紹介)
     g1〜g4 / crowd(人数別) / any(どれにも当てはまらないとき)
   ■ 絵が出ないとき: ファイル名(半角英数字・大文字小文字)と、ILLUST_COUNT の数字を確認してください。
   ■ 場面の中で ['bg','名前'] を自分で書いてある場面(要所イベント、バイトなど)は、そちらが優先されます。 */

const ILLUST_COUNT={
 any:0,g1:0,g2:0,g3:0,g4:0,crowd:0,
 meet_talk:0,meet_touch:0,meet_heart:0,meet_melo:0,
 cameo1:0,cameo2:0,cameo3:0,
 morning:0,girltalk:0,incident:0,hazard:0,nurse:0,intro:0
};
const ILLUST_GIRL={ /* 例: 'hinata:meet_melo':1, */ };
const ILLUST_P=1; /* 絵が出る確率(1=必ず / .5=半分) */

/* カテゴリと子のidから、使う絵の名前を1つ選ぶ。無ければ '' */
function illustName(cat,gid){
 const bad=window.ILL_BAD||new Set(),mk=(pre,n)=>{const a=[];for(let i=1;i<=n;i++){const nm=pre+i;if(!bad.has(nm))a.push(nm)}return a};
 const tries=[];
 if(gid&&cat)tries.push(['g:'+gid+':'+cat,mk('ev_'+gid+'_'+cat+'_',ILLUST_GIRL[gid+':'+cat]||0)]);
 if(cat)tries.push([cat,mk('ev_'+cat+'_',ILLUST_COUNT[cat]||0)]);
 return tries;
}
function illustPickFrom(tries,extra){
 const all=tries.concat(extra||[]);
 for(const [k,a] of all){if(a.length)return pickNR('ill:'+k,a)}
 return '';
}
function illustPick(cat,gid,size,noAny){
 const t=illustName(cat,gid),bad=window.ILL_BAD||new Set();
 const ex=[];[size,noAny?'':'any'].forEach(c=>{if(!c)return;const a=[];for(let i=1;i<=(ILLUST_COUNT[c]||0);i++){const nm='ev_'+c+'_'+i;if(!bad.has(nm))a.push(nm)}ex.push([c,a])});
 return illustPickFrom(t,ex);
}
/* ノベルの行の中の女子の人数からカテゴリ(g1〜crowd)を決める */
function illustSize(L){
 const ids=new Set();let crowd=false;
 L.forEach(r=>{if(!Array.isArray(r))return;
  if(r[0]==='cast')String(r[1]).split(',').forEach(tk=>{tk=tk.trim().replace(/^~/,'');if(/^\*/.test(tk))crowd=true;else if(tk)ids.add(tk.replace(/^\*/,''))});
  else if(r[0]!=='bg'&&r[0]!=='hide'&&r[0]&&r[0]!=='me'&&typeof H==='function'&&H(r[0]))ids.add(r[0])});
 const n=crowd?5:ids.size;return n<=0?'':n>=5?'crowd':'g'+n;
}
/* Novel.play から呼ばれる。行の先頭に ['bg',名前] を足して返す(絵が無い・すでに bg があるときは、そのまま返す) */
function illustApply(L,ctx){
 try{
  if(!L||!L.length||L.some(r=>Array.isArray(r)&&r[0]==='bg'))return L;
  if(ILLUST_P<1&&Math.random()>=ILLUST_P)return L;
  const gid=(ctx&&ctx.h)||(()=>{for(const r of L)if(Array.isArray(r)&&r[0]&&r[0]!=='me'&&r[0]!=='cast'&&r[0]!=='hide'&&typeof H==='function'&&H(r[0]))return r[0];return ''})();
  const nm=illustPick(ctx&&ctx.ill||'',gid,illustSize(L));
  return nm?[['bg',nm]].concat(L):L;
 }catch(e){return L}
}
