/* ===== 第24弾 モテモテ・ハーレム感の総合強化 =====
   ① 歩くだけで注目される(行動のたびに一言)   ② 学園新聞(スマホ「報」): 見出し・好感度ランキング・SNSタイムライン
   ③ 女子同士の取り合いイベント(毎月)         ④ ハーレム憲章(嫉妬ゼロ宣言) 6段階
   ⑤ 柏木くん専用スペース(スマホ「専」)7か所  ⑥ 他校・街への遠征(魅力60〜)
   ⑦ 女子のモノローグ集(スマホ「独」)        ⑧ 専属係 +6役職
   ⑨ ハーレムエンドの後日談 4種                ⑩ 愛の通知の増量(fan_fx.js 側) */
/* 注: mote_a23.js / mote_b23.js(同じ機能の別実装)が読み込まれている間は、そちらを優先し、このファイルの重複機能は止まります(専属係+6 だけ有効)。 */
const X24_DUP=typeof npTurn==='function'&&typeof pcTurn==='function';
(function(){
const DUP=X24_DUP;
const pk=a=>a[Math.floor(Math.random()*a.length)];
const nm=h=>h.n.split(' ').join('');
const note=t=>{NOTE=(NOTE?NOTE+'\n':'')+t};
const F=(t,names,ex)=>dailyFmt(t,names||{},ex||{N:haremN(),M:fcCount()});
const girls=()=>avail().slice().sort((a,b)=>favOf(b)-favOf(a));
const rkTier=()=>{const i=typeof rankIdx==='function'?rankIdx():0;return i<=1?0:i<=3?1:i<=5?2:3};
function xInit(){if(!S.mx)S.mx={nw:{t:-1,rk:{},tl:[],hd:[]},ch:0,sp:{},out:{n:0,sch:{},fame:0},tug:0,t:{}};return S.mx}
const once=(k)=>{const m=xInit();if(m.t[k]===S.t)return false;m.t[k]=S.t;return true};

/* ===== ① 歩くだけで注目 ===== */
const STARE=[
 ['廊下を歩いていると、すれ違う女子が、ぱっと顔を赤くして、うつむいた。','窓際の席の{a}が、授業中なのに、ちらちら、こちらを見ている。','「あっ、{K}だ…！」という、ひそひそ声が、背後から聞こえた。','下駄箱を開けたら、ラブレターらしき手紙が、また一通、入っていた。','すれ違いざま、{a}が、小さな声で「おはよう」と言って、走り去っていった。','教室の窓の外から、名前を知らない女子が、手を振ってくれた。','購買のおばちゃんが、「あんた、モテるねえ」と、ニヤニヤしている。','ふと視線を感じて振り向くと、数人の女子が、慌てて目をそらした。'],
 ['廊下の向こうから、{a}たちが、「{K}ー！」と手を振りながら、駆け寄ってきた。','昇降口で、女子たちが、{K}の靴箱の前に、自然と、列を作っている。','「今日の{K}、髪型、いつもと違わない？」と、女子たちが、遠巻きに、盛り上がっている。','移動教室の廊下は、{K}が通る時だけ、なぜか、道ができる。','教室に入った瞬間、女子たちの視線が、いっせいに、{K}に集まった。','「{K}と、同じ班になれた！」と、どこかで、小さな悲鳴があがった。','お昼休み、気がつくと、{K}の机の周りは、女子の輪になっていた。','{a}が、「席、あけてあるよ」と、隣の椅子を、ぽんぽん叩いた。'],
 ['校門をくぐると、花道のように、女子たちが、両側に並んで、「おはよう！」と手を振った。','廊下を歩くたびに、あちこちの教室から、「きゃー！」という歓声が上がる。','「{K}、通ります！」と、誰かが先導して、人混みが、ささっと、割れていった。','{a}が、「荷物、持つよ！」と、鞄を取り合う女子たちの、輪の中心に、{K}はいた。','購買でパンを買おうとしたら、列の女子たちが、全員、順番を譲ってくれた。','教室のドアの前には、{K}の到着を待つ、女子たちの、行列ができていた。','ふと窓の外を見ると、校庭に、巨大な「{K}LOVE」の人文字が、描かれていた。','スマホが、愛のメッセージで、鳴りっぱなしだ。'],
 ['学園じゅうの女子が、{K}の一挙手一投足に、ため息をついている。','廊下を歩くだけで、拍手と、歓声と、花びらが降ってくる。','「{K}を見かけたら、一日、幸運」という都市伝説が、本当に、囁かれていた。','どこへ行っても、女子たちが、「{K}のこと、大好き」と、全力で、伝えてくる。','{a}が、「世界でいちばん、好き」と、通りすがりに、堂々と、言ってのけた。','{K}の通る道は、いつの間にか、「王道」と、呼ばれるようになっていた。','学園の女子全員が、{K}の方向を向いて、にっこり笑っている気がした。','校舎じゅうの窓から、手を振る女子たちの姿が、花畑のように、並んでいた。']];
const _na=noteAct;
if(!DUP)noteAct=function(){
 const r=_na.apply(this,arguments);
 try{if(S&&!S.fin&&S.st&&Math.random()<.5){const gs=avail();if(gs.length){const a=gs[Math.floor(Math.random()*gs.length)];note('💗 '+F(pk(STARE[rkTier()]),{a:nm(a)}))}}}catch(e){}
 return r;
};

/* ===== ② 学園新聞 ===== */
const HANDLE=['ゆいぴ','ひなっち','みるく','ももたん','さくら餅','ぽんぽん','れなれな','まこりん','ことぴ','はるっぺ','あおいろ','こころん','ゆめかわ','ぱんだ','きらり','のんたん','ひよこ','ちぃちゃん','みっくす','ゆず茶'];
const CLASSES=['1年A組','1年B組','2年A組','2年C組','3年B組','3年D組','美術部','吹奏楽部','陸上部','料理部','文芸部','生徒会'];
const TL_SCH=['{n}の子が、校門で{K}を待ってたらしい。うらやましすぎ。','他校の友だちから「{K}って人に会わせて！」ってDMが止まらない。','{K}の写真、他校の子が待ち受けにしてた。もう全国区だよ。','今日、電車で、知らない学校の女子に、「{K}さんのお友だちですか？」って聞かれた。','{n}の文化祭に、{K}が来るって噂。チケット争奪戦になるかも。'];
const TL_TOWN=['商店街のコロッケ屋さんが、「{K}くん割引」を始めたらしい。','駅前のお姉さんたちが、{K}の話で、盛り上がってた。','本屋さんに、{K}の特集コーナーができてた。なぜ！？','美容院で、「{K}くんみたいにして」って言ってる子がいた。','街のみんなが、{K}の噂をしている。ほんとに有名人だ。'];
const TL_GEN=['今日の{K}、廊下ですれ違った！ 一日ハッピー！','{K}と目が合った気がする…(気のせい？)','{K}のこと考えてたら、授業、ぜんぜん頭に入らなかった。','昼休みの{K}、ごはん食べてる横顔が尊い。','{K}ファンクラブの会員番号、一桁になった！','今日、{K}と話せた！ 一生の思い出！','{a}ちゃんだけ、{K}の隣で、ずるい！ …わたしも！','体育祭の{K}、かっこよかった…。','{K}の笑顔で、世界が平和になる。','明日、{K}に話しかけてみる。勇気、勇気…！','みんなで{K}を好きになれば、ケンカにならないよね。','{K}のこと、独り占めなんて、できないってわかってる。でも、好き。','{K}ってほんと、みんなに平等にやさしい…そこが好き。','{K}の隣を取り合ってたら、いつのまにか、女子全員が友だちになってた。','{K}の話をしてる時のみんなの顔、全員、恋する乙女だった。','「{K}はみんなのもの」って、新しい校訓にしよう。','朝から{K}の名前、100回は聞いた。','{K}ロス…。放課後まで、あと3時間。','{a}が、{K}を見てる時の顔、完全に恋してた。かわいい。','今日も{K}が元気で、よかった。'];
const HEAD=['【号外】{a}さん、{K}の隣を、毎朝キープか','【速報】{K}の靴箱、ラブレターで満杯に','【独占】「{K}のどこが好き？」女子100人アンケート','【調査】「{K}と目が合った」女子、全校の9割','【話題】{K}の机に、毎朝、花が飾られる謎','【特集】{K}と手をつなぎたい女子、行列は何メートル？','【速報】購買で「{K}セット」が発売、即日完売','【緊急】{K}ファンクラブ、会員が急増','【密着】{a}さんの「{K}日記」、100ページ突破','【注目】{K}の一言で、女子が全員、笑顔になる事件','【報道】女子同士のケンカがゼロに。理由は「みんなで{K}を好き」','【生活】{K}の待ち受け、女子の7割が採用','【コラム】なぜ{K}は、こんなにモテるのか','【独占】{K}の好きな食べ物、全校女子が研究中'];
function newsTurn(){
 const m=xInit(),nw=m.nw;if(S.fin||nw.t===S.t)return;nw.t=S.t;
 const g=girls();if(g.length<3)return;
 const rk={};g.slice(0,10).forEach((h,i)=>rk[h.id]=i+1);
 const first=g[0];
 let hd=[];
 if(nw.rk&&Object.keys(nw.rk).length){const old=Object.keys(nw.rk).find(id=>nw.rk[id]===1);if(old&&old!==first.id)hd.push(`【首位交代!】${nm(first)}さんが、ついに${nm(H(old)||first)}さんを抜いて、1位に`)}
 hd.push(F(pk(HEAD),{a:nm(first)}));hd.push(F(pk(HEAD),{a:nm(pk(g.slice(0,6)))}));
 nw.hd=hd.slice(0,3);nw.prev=nw.rk;nw.rk=rk;
 const n=3+Math.floor(Math.random()*3);
 for(let i=0;i<n;i++){
  let t;const r=Math.random();
  if(m.out.n>0&&r<.2)t=pk(TL_SCH).replace('{n}',pk(OUT_SCHOOLS).n);
  else if(m.out.n>0&&r<.35)t=pk(TL_TOWN);
  else t=pk(TL_GEN);
  nw.tl.unshift({u:pk(HANDLE)+'@'+pk(CLASSES),t:F(t,{a:nm(pk(g.slice(0,8)))})});
 }
 nw.tl=nw.tl.slice(0,40);cnt('newsissue');
 note('📰 学園新聞の今月号が出た。(スマホの「報」アプリで読めます)');
}
function newsHtml(){
 const m=xInit(),nw=m.nw,g=girls().slice(0,10);
 let h='<p class="hint">学園新聞。毎月、号が出ます。</p><h2 style="margin:6px 0 4px;font-size:13px">今月の見出し</h2>';
 h+=(nw.hd&&nw.hd.length?nw.hd:['(まだ号が出ていません)']).map(t=>`<div class="ev" style="display:block;border-left:3px solid #e11d74;padding:6px 10px;margin:5px 0"><b>${t}</b></div>`).join('');
 h+='<h2 style="margin:12px 0 4px;font-size:13px">柏木くん好感度ランキング TOP10</h2>';
 h+=g.map((x,i)=>{const p=nw.prev&&nw.prev[x.id],ar=p==null?'<span style="color:#e11d74">NEW</span>':p>i+1?`<span style="color:#16a34a">▲${p-i-1}</span>`:p<i+1?`<span style="color:#2563eb">▼${i+1-p}</span>`:'<span style="opacity:.5">→</span>';
  return `<div class="ev"><b>${i+1}位　${nm(x)}</b><span>${favOf(x)}　${ar}</span></div>`}).join('');
 h+='<h2 style="margin:12px 0 4px;font-size:13px">SNSタイムライン</h2>';
 h+=(nw.tl.length?nw.tl:[{u:'—',t:'(まだ投稿がありません)'}]).slice(0,30).map(p=>`<div class="ev" style="display:block;padding:6px 10px;margin:4px 0;background:rgba(124,140,255,.07)"><small style="opacity:.65">@${p.u}</small><br>${p.t}</div>`).join('');
 return h;
}

/* ===== ③ 取り合いイベント ===== */
const TUG_A=[['a','「今日は、わたしが、{K}と一緒に帰るの！」'],['b','「ずるい、昨日も、そうだったでしょ！」']];
const TUG_SIT=[
 ['放課後の昇降口。{a}と{b}が、{K}の左右の腕を、それぞれ、つかんで、にらみ合っていた。','「どっちが先に、誘ったか」で、盛り上がっている。'],
 ['お昼休みの屋上。{a}と{b}が、{K}の隣の席を、同時に、ぽんぽんと叩いた。','どちらも、譲る気配がない。'],
 ['図書室で。{a}と{b}が、同じ本を取ろうとして、{K}の手を、挟んで、ぶつかった。','気まずい沈黙が、流れる。'],
 ['調理実習の時間。{a}と{b}が、{K}の分の味見役を、取り合っていた。','「わたしの方が、上手に作れたもん！」'],
 ['体育館の隅。{a}と{b}が、{K}の応援席の場所で、小さな火花を散らしていた。','お互いの応援うちわが、ぶつかっている。'],
 ['帰り道の交差点。{a}と{b}が、{K}の左右を、がっちり、キープしていた。','信号が変わっても、どちらも、動かない。'],
 ['文化祭の準備で。{a}と{b}が、{K}を、自分の班に入れたがって、にらみ合っていた。','「わたしの班が、いちばん、楽しいよ！」'],
 ['日曜日の駅前。{a}と{b}が、{K}を、それぞれ、自分のお出かけに誘っていた。','予定は、ばっちり、ダブルブッキングだ。']];
const TUG_RES=[
 ['me','「ケンカしないで。二人とも、大事だから」','a','「…{K}が、そう言うなら」','b','「…ごめんね、{a}ちゃん」','両方の手を、ぎゅっと握ると、二人とも、ふにゃっと、頬をゆるめた。'],
 ['me','「じゃあ、三人で、一緒に行こう」','a','「それ、名案！」','b','「それなら、文句なし！」','結局、三人で、アイスを食べながら、帰ることになった。'],
 ['me','「今日は、{a}。明日は、{b}。…それで、どう？」','a','「やった！ 約束だよ！」','b','「…明日、絶対だからね！」','ささやかなローテーションが、ここに、成立した。'],
 ['me','「二人とも、かわいくて、選べないよ」','a','「も、もう…！ ずるい！」','b','「そ、そんなこと、言われたら…怒れない…」','真っ赤になった二人は、結局、仲良く、手をつないでいた。'],
 ['me','「じゃんけんで、決めよう」','a','「望むところ！」','b','「いくよ！ せーの！」','決着はあいこ。三回続いて、全員で、笑い出してしまった。'],
 ['me','「ぼくから、お願い。仲良くして、くれる？」','a','「…{b}ちゃん、ごめんね」','b','「ううん、わたしこそ！」','仲直りのハグを見届けて、{K}は、そっと、胸をなでおろした。']];
function tugTurn(done){
 if(S.fin||!once('tug')||Math.random()>.35||(S.keN&&(S.keN[S.t]||0)>=2))return done&&done();
 const g=girls().filter(h=>favOf(h)>=40);if(g.length<2)return done&&done();
 const i=Math.floor(Math.random()*g.length);let j=Math.floor(Math.random()*g.length);if(j===i)j=(i+1)%g.length;
 const A=g[i],B=g[j],s=pk(TUG_SIT),r=pk(TUG_RES);
 const L=[['bg','harem_tug'],['cast','a,b'],['',s[0]],TUG_A[0],TUG_A[1],['',s[1]],[r[0],r[1]],[r[2],r[3]],[r[4],r[5]],['',r[6]]];
 add(A.id,3);add(B.id,3);cnt('tug');xInit().tug++;
 Novel.play({lines:dailyApply({lines:L},[A,B],{N:haremN(),M:fcCount()})},{h:A.id},()=>{save();done&&done()});
}

/* ===== ④ ハーレム憲章 ===== */
const CHARTER=[
 {n:3,t:'第一条「みんなで、好きでいよう」',s:['3人が集まって、{K}を囲んだ。','a','「抜け駆けは、なし。でも、ケンカも、なし。…どう？」','b','「賛成！ みんなで{K}を好きでいよう！」','c','「じゃあ、これが、わたしたちの、最初の約束ね」']},
 {n:6,t:'第二条「順番こ当番制」',s:['6人になった。机の上には、手作りの当番表。','a','「{K}と過ごす時間は、ローテーションで！」','b','「ひとり一日ずつ、公平にね」','c','「みんなの笑顔が、いちばん大事だもん」']},
 {n:10,t:'第三条「嫉妬ゼロ宣言」',s:['10人の女子が、{K}を中心に、円になって座った。','a','「わたしたち、嫉妬は、しません！」','b','「だって、全員、{K}のことが好きなんだから！」','c','「{K}が笑っていれば、それが、いちばん！」']},
 {n:20,t:'第四条「ハーレム憲章」',s:['20人。講堂に、厳かな空気が漂った。','a','「ここに、ハーレム憲章を、制定します！」','b','「第一条、{K}は、みんなのもの！」','c','「第二条、みんなは、{K}のもの！」']},
 {n:35,t:'第五条「柏木くんは、みんなの人生」',s:['35人が、一堂に会した。','a','「わたしたちの、将来設計に、{K}は、欠かせません」','b','「だから、全員で、{K}を、幸せにします」','c','「それが、わたしたちの、いちばんの夢」']},
 {n:50,t:'終章「世界の中心で、愛を叫ぶ」',s:['50人を超える女子が、校庭に集まった。','a','「宣言します！」','b','「わたしたちは、{K}のために、生きる！」','c','「世界一、幸せな、ハーレムを、作る！」']}];
function charterTurn(done){
 const m=xInit(),n=haremN();
 if(S.fin||m.ch>=CHARTER.length||n<CHARTER[m.ch].n)return done&&done();
 const c=CHARTER[m.ch];m.ch++;cnt('charter');
 const g=girls().slice(0,5);
 const L=[['bg','harem_charter'],['cast','a,b,c'],['',c.s[0]],[c.s[1],c.s[2]],[c.s[3],c.s[4]],[c.s[5],c.s[6]],['fx','confetti'],['','こうして、憲章に、一条、加わった。']];
 note(`📜 ハーレム憲章「${c.t}」が制定された!(スマホの「専」アプリ)`);
 g.forEach(h=>add(h.id,3));S.money+=30000*m.ch;
 Novel.play({lines:dailyApply({lines:L},g,{N:n,M:fcCount()})},{h:g[0]&&g[0].id},()=>{save();done&&done()});
}
/* 憲章の毎月の恩恵 */
function charterMonthly(){const m=xInit();if(!m.ch||S.fin||!once('chm'))return;S.money+=6000*m.ch;if(m.ch>=3)avail().forEach(h=>add(h.id,1));if(m.ch>=5)gainSt('charm',0)}

/* ===== ⑤ 専用スペース ===== */
const SPACES=[
 {n:3,t:'専用ベンチ',d:'中庭の、{K}専用のベンチ。女子たちが、毎日、掃除している。'},
 {n:5,t:'専用部室',d:'{K}のためだけの部室。ソファと紅茶セット付き。'},
 {n:10,t:'玉座つきの教室の席',d:'{K}の席だけ、なぜか、ふかふかの玉座に。'},
 {n:15,t:'専用食堂席',d:'食堂の一番いい席に、「{K}専用」の札。'},
 {n:25,t:'専用エントランス(赤じゅうたん)',d:'校門から昇降口まで、赤じゅうたんが敷かれた。'},
 {n:40,t:'黄金の銅像',d:'校庭に、{K}の銅像が建立された。毎朝、女子が磨いている。'},
 {n:60,t:'{K}専用校舎',d:'ついに、{K}のためだけの校舎が、完成した。'}];
function spaceTurn(done){
 const m=xInit(),n=haremN(),k=Object.keys(m.sp).length;
 if(S.fin||k>=SPACES.length||n<SPACES[k].n)return done&&done();
 const sp=SPACES[k];m.sp[k]=S.t;cnt('space');
 const g=girls().slice(0,3);
 const L=[['bg','harem_space'+k],['',`学園に、変化が起きた。「${sp.t}」の、完成だ。`],['cast','a,b,c'],['a','「{K}のために、みんなで、作ったの！」'],['b','「ここなら、いつでも、{K}を囲めるね！」'],['me','「…すごい。ありがとう」'],['c','「これからも、もっと、増やすからね！」'],['',sp.d]];
 note(`🏛 専用スペース「${F(sp.t)}」が完成!(スマホの「専」アプリ)`);
 g.forEach(h=>add(h.id,2));
 Novel.play({lines:dailyApply({lines:L},g,{N:n,M:fcCount()})},{h:g[0]&&g[0].id},()=>{save();done&&done()});
}
function spaceMonthly(){const m=xInit();const k=Object.keys(m.sp).length;if(!k||S.fin||!once('spm'))return;const g=Math.min(300000,k*5000+haremN()*500);S.money+=g;if(k>=5)gainSt('charm',0)}
function spHtml(){
 const m=xInit(),n=haremN();
 let h=`<p class="hint">ハーレム人数 ${n}人。人数が増えると、学園が{K}仕様に変わっていきます。</p>`.replace('{K}',GAME.nick);
 h+='<h2 style="margin:6px 0 4px;font-size:13px">専用スペース</h2>';
 h+=SPACES.map((s,i)=>m.sp[i]!=null?`<div class="ev" style="display:block"><b>🏛 ${F(s.t)}</b><br><small>${F(s.d)}</small></div>`:`<div class="ev"><b>？？？</b><span>ハーレム${s.n}人以上で完成</span></div>`).join('');
 h+='<h2 style="margin:12px 0 4px;font-size:13px">ハーレム憲章</h2>';
 h+=CHARTER.map((c,i)=>i<m.ch?`<div class="ev"><b>📜 ${c.t}</b></div>`:`<div class="ev"><b>？？？</b><span>ハーレム${c.n}人以上で制定</span></div>`).join('');
 h+=`<p class="hint">専用スペースと憲章がある月は、毎月おこづかいが入ります。(現在 +¥${(Math.min(300000,Object.keys(m.sp).length*5000+n*500)+6000*m.ch).toLocaleString()}/月)</p>`;
 return h;
}

/* ===== ⑥ 他校・街への遠征 ===== */
const OUT_SCHOOLS=[{n:'桜花女子学院',c:'青いリボン'},{n:'白百合女学園',c:'白いセーラー服'},{n:'星蘭高校',c:'星のバッジ'},{n:'月ノ宮女子',c:'紺のブレザー'},{n:'青嵐学園',c:'ポニーテール'},{n:'聖ミリア女子',c:'十字のペンダント'}];
const OUT_SC=[
 ['校門の前に、{c}の女子たちが、ずらりと並んで、待っていた。','「{K}さんですよね！？ ようこそ、{sch}へ！」と、拍手が起きた。','「一目、お会いしたくて、全校で、待ってたんです！」'],
 ['{sch}の文化祭に招かれた。入口には、巨大な「{K}様、歓迎」の看板。','女子たちが、ぞろぞろと集まり、サインや握手を求めてくる。','気づけば、校内じゅうの女子が、{K}を取り囲んでいた。'],
 ['電車を降りると、{sch}の{c}の女子が、「あっ、{K}さんだ…！」と、固まった。','そのひと言で、ホームじゅうの女子が、いっせいに、こちらを振り向いた。','「あの、握手、お願いします！」「ずるい、わたしも！」'],
 ['{sch}の生徒会長から、「ぜひ、合同イベントを」と、直々に、招待状が届いた。','当日の体育館は、{K}を一目見ようとする、女子で、ぎっしり。','最後は、全員で、{K}コールの、大合唱になった。'],
 ['{sch}の女子たちが、{K}のために、手作りのお菓子を、持ち寄ってくれた。','テーブルの上は、色とりどりのお菓子で、あふれている。','「全部、食べてくださいね！」と、全員が、期待の目で見つめてきた。'],
 ['{sch}の部活見学に呼ばれた。部員の女子たちが、全員、{K}に、釘づけだった。','練習そっちのけで、{K}の周りに、わらわらと集まってくる。','先生が、「…今日は、見学会に、しましょうか」と、あきらめ顔で笑った。']];
const TOWN=[
 ['商店街のコロッケ屋さんで、おばちゃんが、「あっ、{K}くん！」と、目を輝かせた。','「うちの娘も、ファンなのよ。サイン、お願いできる？」','気づくと、店の前に、女性たちの行列ができていた。'],
 ['駅前の花屋さんの、お姉さんが、{K}を見つけて、手を振った。','「いつも、学校の女の子たちが、{K}くんの話ばかりしてるのよ」','お礼にと、小さな花束を、渡してくれた。'],
 ['本屋で参考書を探していると、店員のお姉さんが、そっと近づいてきた。','「あの、{K}さん、ですよね？ ファンです」','レジには、{K}特集の、ポップが飾られていた。'],
 ['公園のベンチで休んでいると、散歩中の大学生のお姉さんたちが、ひそひそ話しはじめた。','「あの子が、噂の、{K}くんでしょ？」','気づけば、全員で、記念撮影になっていた。'],
 ['図書館に行くと、司書のお姉さんが、ほほえんで、「{K}くん、お待ちしてました」と、言った。','「あなたの噂は、街じゅうに、広まってるのよ」','閲覧席は、ファンのお姉さんたちで、満席だった。']];
function outingTurn(done){
 const m=xInit();
 if(S.fin||S.st.charm<60||!once('out')||Math.random()>.35)return done&&done();
 const town=Math.random()<.35,L=[],g=girls().slice(0,3);
 let sch=null,sc;
 if(town)sc=pk(TOWN);else{sch=pk(OUT_SCHOOLS);sc=pk(OUT_SC)}
 const fm=t=>F(t.replace(/\{sch\}/g,sch?sch.n:'').replace(/\{c\}/g,sch?sch.c:''),{});
 L.push(['bg',town?'harem_town':'harem_out'],['cast','a,*'+(10+Math.floor(Math.random()*20))]);
 sc.forEach((t,i)=>{L.push(['',fm(t)]);if(i===1)L.push(['fx','flood'])});
 L.push(['me',pk(['「…ぼく、そんなに、有名なんだ」','「みんな、ありがとう。うれしいよ」','「照れるな…でも、うれしい」'])]);
 L.push(['a',pk(['「やっぱり、{K}は、世界一だよ！」','「ほらね、{K}は、どこへ行っても、人気者だよ！」','「わたしの{K}、どこでも、モテモテ！ …あ、みんなの、だよね」'])]);
 m.out.n++;m.out.fame+=R(30,200);if(sch)m.out.sch[sch.n]=(m.out.sch[sch.n]||0)+1;
 cnt('outing');if(sch&&Object.keys(m.out.sch).length>=6)cnt('outall');
 S.money+=20000;if(Math.random()<.3)gainSt('charm',1);
 note(`🚃 ${town?'街':sch.n}で、大歓迎を受けた。(他校・街のファン +${m.out.fame}人ぶん)`);
 Novel.play({lines:dailyApply({lines:L},g,{N:haremN(),M:fcCount()})},{h:g[0]&&g[0].id},()=>{save();done&&done()});
}

/* ===== ⑦ 女子のモノローグ ===== */
const MONO={
 low:['「{K}くんの席、今日も、ちょっとだけ、気になる」','「話しかけたいけど、どうしよう。…明日こそ」','「{K}くんの笑顔、反則だと思う」','「挨拶、返してもらえた。それだけで、一日、幸せ」','「みんなが、{K}くんのこと、好きなのも、わかる気がする」','「同じクラスで、よかった…」','「どうして、こんなに、目で追っちゃうんだろう」','「友だちに、からかわれた。…図星、だけど」'],
 mid:['「今日も、{K}のことばかり、考えていた」','「{K}の隣は、あったかいな。…ずっと、いたい」','「他の子と話してると、ちょっとだけ、もやもやする。…でも、ガマン」','「{K}に、会えない日は、世界の色が、うすい気がする」','「みんなが、{K}を好きなのは、当然。でも、わたしも、負けない」','「今日の{K}、かっこよかった。…って、誰かに、言いたい」','「{K}のことを考えると、胸が、ぎゅってなる」','「友だちより、ちょっと特別、って思ってもらえたら、いいな」'],
 high:['「{K}がいないと、息ができない気がする」','「{K}のいない世界なんて、考えられない。…重いかな」','「毎日、{K}のこと、考えて、眠って、夢でも会ってる」','「他の子も、{K}が大好き。でも、わたしの『好き』が、いちばん大きいって、信じてる」','「{K}のためなら、なんだってできる。…本当に、なんだって」','「{K}が笑っててくれれば、それだけで、わたしは、幸せ」','「{K}の隣は、わたしの居場所。…って、みんなが、思ってるんだよね」','「{K}、だいすき。だいすき。だいすき。何度でも、言いたい」','「{K}に必要とされたい。それが、わたしの、全部」','「{K}を、世界でいちばん、幸せにしてあげたい」']};
function monoHtml(){
 const g=girls().filter(h=>favOf(h)>=15).slice(0,30);
 let h='<p class="hint">女子たちの、心の声。毎月、変わります。(好感度が高いほど、気持ちが重くなります)</p>';
 if(!g.length)return h+'<p class="hint">(まだ、聞こえません)</p>';
 const seed=(id)=>{let x=S.t*131;for(let i=0;i<id.length;i++)x=(x*31+id.charCodeAt(i))|0;return Math.abs(x)};
 h+=g.map(x=>{const f=favOf(x),t=f>=70?'high':f>=40?'mid':'low',a=MONO[t];const txt=F(a[seed(x.id)%a.length],{});
  return `<div class="ev" style="display:block;padding:8px 10px;margin:6px 0;border-left:3px solid #f43f5e;background:rgba(244,63,94,.06)"><b style="display:flex;align-items:center;gap:8px"><img src="img/${x.img}" alt="" style="width:30px;height:30px;border-radius:50%;object-fit:cover" onerror="this.style.display='none'">${nm(x)}<small style="opacity:.6">${typeof relLabel==='function'?relLabel(f):''}</small></b><span style="display:block;margin-top:4px">${txt}</span></div>`}).join('');
 return h;
}
window.newsHtml=DUP?npHtml:newsHtml;window.spHtml=DUP?orgHtml:spHtml;window.monoHtml=DUP?mnHtml:monoHtml;

/* ===== ⑧ 専属係 +6 ===== */
[
 {id:'secretary',n:'秘書',d:'予定も、連絡も、ぜんぶ、任せられる',need:600,eff:{st:{study:1},f:-1},eft:'秘書のおかげで、一日が、スムーズだった。(学力+1・疲れ-1)',sc:[['{a}が、手帳を片手に、きびきびと、予定を読み上げた。','「本日の予定です。午前、授業。午後、{K}を囲む会。夜、おやすみメッセージ…最後、いちばん大事です」'],['{a}は、「スケジュール、完璧です」と、胸を張った。','「…ただし、{K}との、お昼休みの時間だけは、毎日、確保してあります」']]},
 {id:'guard',n:'ボディガード',d:'{K}を、全力で守ってくれる',need:650,eff:{st:{sport:1}},eft:'ボディガードに付き添われ、安心して過ごせた。(体力+1)',sc:[['{a}が、人混みの中で、そっと、{K}の前に出て、道をつくってくれた。','「{K}に、近づく人は、わたしを通してください！」'],['{a}は、こっそり、護身術を習ったらしい。','「{K}は、わたしが、守る。…絶対に」']]},
 {id:'pr',n:'広報',d:'{K}の魅力を、校内外に広めてくれる',need:700,eff:{st:{charm:1}},eft:'広報活動のおかげで、{K}の名が、さらに広まった。(魅力+1)',sc:[['{a}が、手作りのポスターを、校内じゅうに貼って回っていた。','「「{K}を、みんなで、応援しよう！」…って、書いたの。どうかな？」'],['{a}は、{K}の公式アカウントを、勝手に作って、フォロワーを、増やしている。','「だって、{K}の魅力を、全世界に、伝えたくて…！」']]},
 {id:'president',n:'ファンクラブ会長',d:'ファンクラブを、まとめあげてくれる',need:760,eff:{money:15000},eft:'ファンクラブの会費から、お小遣いが届いた。(+¥15,000)',sc:[['{a}が、会員証を、束にして持ってきた。','「会員、また、増えたよ！ ぜんぶ、{K}のおかげ！」'],['{a}は、会長として、壇上でスピーチをした。','「{K}は、みんなの、{K}です！ 独り占め、禁止！」']]},
 {id:'chef',n:'専属シェフ',d:'毎日、手作りの料理を、振る舞ってくれる',need:820,eff:{f:-2},eft:'専属シェフの料理で、すっかり、元気になった。(疲れ-2)',sc:[['{a}が、コック帽をかぶって、湯気の立つ、料理を運んできた。','「今日は、{K}のために、フルコースを、考えました！」'],['{a}は、毎日の献立を、栄養士さんと、相談しているらしい。','「{K}の好物は、全部、覚えたよ。…あ、食べすぎには、注意ね！」']]},
 {id:'stylist',n:'専属スタイリスト',d:'毎日の服と髪型を、コーディネートしてくれる',need:900,eff:{st:{charm:1}},eft:'スタイリストのおかげで、今日も、決まっている。(魅力+1)',sc:[['{a}が、ヘアワックスと、ヘアピンを、手に、{K}の前髪を、いじりはじめた。','「…うん、完璧。今日も、世界一、かっこいい」'],['{a}は、ハンガーラックに、たくさんの服を、並べていた。','「全部、{K}に、似合うのを、選んだの。さあ、試着タイム！」']]},
].forEach(r=>{if(typeof DUTY_ROLES!=='undefined'&&!DUTY_ROLES.find(x=>x.id===r.id))DUTY_ROLES.push({id:r.id,n:r.n,d:r.d,need:r.need,eff:r.eff,eft:r.eft,scenes:r.sc.map(s=>({min:1,lines:[['cast','a'],['',s[0]],['a',s[1].replace(/^「?/,'「').replace(/」?$/,'」')],['','{a}は、誇らしげに、にっこり笑った。']]}))})});

/* ===== ⑨ ハーレムエンドの後日談 ===== */
const EPI=[
 {n:20,t:'結婚式',l:[['bg','harem_epi_wedding'],['','数年後。白い教会に、ウェディングドレスの女子たちが、ずらりと並んでいた。'],['cast','a,b,c,d,e,*30'],['a','「{K}、みんなで、決めたの。結婚式は、全員、一緒に、やろうって！」'],['me','「…法律とか、どうなってるんだろう」'],['b','「そこは、愛の力で、なんとかなるよ！」'],['fx','petals'],['','祝福の鐘が、鳴り響き、花びらが、舞った。']]},
 {n:35,t:'世界旅行',l:[['bg','harem_epi_world'],['','卒業から、数年後。{K}と女子たちは、大きな、クルーズ船の甲板に、立っていた。'],['cast','a,b,c,d,e,*40'],['a','「次は、どこの国？」'],['b','「全部、行くんだよ！ 世界じゅう！」'],['me','「…みんなと一緒なら、どこでも、楽しいよ」'],['fx','confetti'],['','水平線の向こうまで、笑い声が、続いていった。']]},
 {n:50,t:'国づくり',l:[['bg','harem_epi_nation'],['','数年後。広大な土地に、新しい国が、生まれていた。国名は、「柏木」。'],['cast','a,b,c,d,e,*60'],['a','「国王、{K}。王妃、全員！」'],['me','「…王妃が、多すぎない？」'],['b','「愛があれば、国は、栄えるの！」'],['fx','flood'],['','国民は、全員、幸せそうに、笑っていた。']]},
 {n:75,t:'神話になる',l:[['bg','harem_epi_myth'],['','千年後。ひとつの物語が、語り継がれていた。'],['','「むかしむかし、ひとりの少年が、たくさんの少女たちに、愛された」'],['cast','a,b,c,d,e,*80'],['a','「その名は、柏木壮亮。みんなの、永遠の、王子さま」'],['fx','flash'],['','桜ヶ丘ストーリーは、いつまでも、いつまでも、語り継がれていった。']]}];
function epiPick(n){let r=null;EPI.forEach(e=>{if(n>=e.n)r=e});return r}
if(!DUP&&typeof creditsLines==='function'){
 const _cl=creditsLines;
 creditsLines=function(kind,k){
  const base=_cl(kind,k);
  if(kind!=='harem'&&kind!=='ultra')return base;
  const e=epiPick(haremN());if(!e)return base;
  const g=girls().slice(0,5);
  try{const v=JSON.parse(localStorage.getItem('sakuragaoka_epi')||'{}');v[e.t]=1;localStorage.setItem('sakuragaoka_epi',JSON.stringify(v))}catch(x){}
  const L=dailyApply({lines:[['',`── 後日談「${e.t}」 ──`]].concat(e.l)},g,{N:haremN(),M:fcCount()});
  return L.concat(base);
 };
}
if(!DUP&&typeof endHtml==='function'){
 const _eh=endHtml;
 endHtml=function(){
  let v={};try{v=JSON.parse(localStorage.getItem('sakuragaoka_epi')||'{}')||{}}catch(e){}
  return _eh()+`<h2 style="margin:14px 0 4px;font-size:13px">ハーレムエンドの後日談 ${EPI.filter(e=>v[e.t]).length} / ${EPI.length}</h2>`+EPI.map(e=>v[e.t]?`<div class="ev"><b>${e.t}</b><span>達成</span></div>`:`<div class="ev"><b>？？？</b><span>ハーレム${e.n}人以上でハーレム/究極エンド</span></div>`).join('');
 };
}

/* ===== 月ごとの処理 ===== */
const _k=keyEvent;
if(!DUP)keyEvent=function(done){
 try{newsTurn();charterMonthly();spaceMonthly()}catch(e){}
 _k(()=>spaceTurn(()=>charterTurn(()=>tugTurn(()=>outingTurn(done)))));
};
})();
