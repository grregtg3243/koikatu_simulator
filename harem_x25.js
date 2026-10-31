/* ===== 第25弾 取り合いイベントに「ハーレム選択肢」/ 嫉妬ゼロ宣言システムの強化 =====
   読込位置: index.html の最後(mote_x24.js の後)。
   ① 取り合いイベント(tgTurn)を作り直し: 毎回、選択肢つき。「二人とも」「みんなで」のハーレム選択肢が必ず出る。
   ② 嫉妬ゼロ度(S.jz 0〜100): 取り合いのハーレム選択・宣言式・協定・毎月の自然増で上がる。5段階の称号と恩恵。
   ③ 宣言式(スマホ「誓」アプリ / 毎月自動): 女子たちが「嫉妬ゼロ宣言」を読み上げる。宣言文は20種のコレクション。 */
(function(){
const pk=a=>a[Math.floor(Math.random()*a.length)];
const nm=h=>h.n.split(' ').join('');
const note=t=>{NOTE=(NOTE?NOTE+'\n':'')+t};
const ex=()=>({N:haremN(),M:fcCount()});
const top=n=>avail().slice().sort((a,b)=>favOf(b)-favOf(a)).slice(0,n);
function jzInit(){if(!S.jz&&S.jz!==0)S.jz=0;if(!S.jd)S.jd={n:0,seen:{},t:-1};return S}
const JZ_RANKS=[[0,'ちょっとやきもち'],[25,'やきもち少なめ'],[50,'ほぼ嫉妬ゼロ'],[75,'嫉妬ゼロ'],[100,'完全無欠の嫉妬ゼロ💖']];
const JZ_FX=['(まだ恩恵なし)','毎月 全員の好感度+1','毎月 おこづかい+¥10,000 / 取り合いの結果が必ず円満に','3か月ごとに 魅力+1 / 毎月 おこづかい+¥20,000','宣言式のたび、全員の好感度+3 / 毎月 おこづかい+¥40,000'];
function jzIdx(){const j=jzInit().jz;let r=0;JZ_RANKS.forEach(([m],i)=>{if(j>=m)r=i});return r}
function jzAdd(d){jzInit();const o=jzIdx();S.jz=Math.max(0,Math.min(100,S.jz+d));const n=jzIdx();if(n>o){note(`💞 嫉妬ゼロ度が「${JZ_RANKS[n][1]}」になった!(${JZ_FX[n]})`);cnt('jzrank')}}
window.jzIdx=jzIdx;window.jzAdd=jzAdd;
const jzName=()=>JZ_RANKS[jzIdx()][1];

/* ===== ① 取り合いイベント(選択肢つき) ===== */
const TG_A=[
 ['a','「やった！ ありがとう、{K}！ …今日は、わたしが、{K}を独り占め！」','b','「…いいなあ。…でも、次は、わたしだからね！」','『ごめんね』と、{b}の頭を、そっと、なでた。{b}は、ちょっとだけ、頬をふくらませて、でも、笑ってくれた。'],
 ['a','「え、ほんとに！？ 夢みたい！」','b','「うぅ…負けちゃった。でも、約束だよ、次は、わたし！」','{b}は、涙目で、それでも、{a}に、「おめでとう」と言った。'],
 ['a','「ふふ、勝っちゃった♡」','b','「…今日だけだからね。明日は、わたしが、{K}と、帰るんだから！」','二人は、にらみ合い、そして、同時に、ぷっと吹き出した。']];
const TG_B=[
 ['b','「やった！ ありがとう、{K}！ …今日は、わたしが、{K}を独り占め！」','a','「…いいなあ。…でも、次は、わたしだからね！」','『ごめんね』と、{a}の頭を、そっと、なでた。{a}は、ちょっとだけ、頬をふくらませて、でも、笑ってくれた。'],
 ['b','「え、ほんとに！？ 夢みたい！」','a','「うぅ…負けちゃった。でも、約束だよ、次は、わたし！」','{a}は、涙目で、それでも、{b}に、「おめでとう」と言った。'],
 ['b','「ふふ、勝っちゃった♡」','a','「…今日だけだからね。明日は、わたしが、{K}と、帰るんだから！」','二人は、にらみ合い、そして、同時に、ぷっと吹き出した。']];
const TG_H=[
 [['me','「どっちも、大好きだよ。…だから、二人とも、ぼくの隣に来て？」'],['a','「えっ…！ い、いいの？」'],['b','「二人とも…？ そ、それなら…！」'],['','{K}は、右腕に{a}、左腕に{b}を抱き寄せた。二人は、真っ赤になって、でも、ぎゅっと、しがみついてきた。']],
 [['me','「選べないよ。ずっと、二人とも、ぼくのそばに、いてほしい」'],['a','「…ずるい。そんなこと、言われたら…怒れない」'],['b','「ふふ、そっか。じゃあ、二人とも、{K}のものだね」'],['','二人は、顔を見合わせて、くすくす、笑った。嫉妬の影は、どこにも、なかった。']],
 [['me','「どっちが先とか、ないよ。二人とも、一番。…それじゃ、だめかな？」'],['a','「だめじゃない！ 全然、だめじゃない！」'],['b','「一番が、ふたり…うれしい…！」'],['','両手に花。{K}は、少し照れながら、二人の手を、同時に握った。']],
 [['me','「じゃあ、三人で、帰ろう。ずっと、三人で」'],['a','「うん！ 三人で！」'],['b','「手、つないで、いい？」'],['','三つの影が、夕日の中で、ひとつに、重なって、のびていった。']],
 [['me','「二人のこと、どっちも、独り占めしたい。…って言ったら、欲張りかな」'],['a','「…欲張りで、いいよ」'],['b','「わたしたちも、{K}を、独り占めしたいもん」'],['','三人で、くすくす笑い合った。それは、嫉妬ゼロの、完璧な、三角形だった。']],
 [['me','「{a}も{b}も、世界で、いちばん大切。順番なんて、つけられない」'],['a','「…なんだか、涙が出てきた」'],['b','「わたしも…。{K}、だいすき」'],['','二人が、左右から、同時に、{K}の頬に、そっと、顔を寄せた。']],
 [['me','「ケンカするくらいなら、ぼくを、二人で、半分こして？」'],['a','「半分こ！？ …それ、いいかも！」'],['b','「じゃあ、わたしが、右半分ね！」'],['','結局、{K}は、二人に、挟まれたまま、教室を、あとにした。']],
 [['me','「ぼくは、二人のどっちも、手放したくない。…二人とも、ぼくの恋人でいてくれる？」'],['a','「…っ！ は、はい！」'],['b','「喜んで！」'],['','夕暮れの教室に、二人の、幸せそうな声が、いつまでも、響いていた。']]];
const TG_ALL=[
 [['me','「そうだ、みんなも呼ぼう。全員で、一緒に帰ろうよ」'],['cast','a,b,*10'],['','気がつくと、{K}の周りには、噂を聞きつけた女子たちが、わらわらと集まっていた。'],['a','「えっ、全員で！？」'],['b','「それ、すっごく楽しそう！」'],['fx','hearts'],['','全員で、肩を並べて帰る、にぎやかな帰り道。取り合いなんて、すっかり、忘れていた。']],
 [['me','「みんなで、放課後、遊びに行こう！」'],['cast','a,b,*14'],['','声をかけると、あちこちから、「行く！」「行きたい！」と、手が、挙がった。'],['a','「やった、{K}の、おごり？」'],['b','「ずるい、わたしも、おごられたい！」'],['fx','confetti'],['','ぞろぞろと、商店街を、練り歩く女子たちの先頭に、{K}は、立っていた。']],
 [['me','「ケンカより、みんなで、仲よく、パーティーしよう！」'],['cast','a,b,*20'],['','あっという間に、教室は、お菓子と、笑い声の、パーティー会場に、変わった。'],['a','「{K}って、ほんとに、すごい…」'],['b','「みんなを、笑顔に、しちゃうんだもん」'],['fx','flood'],['','その日、学園から、嫉妬という言葉が、一瞬、消えた気がした。']]];
function tgChoose(a,b,mode,done){
 const pc=typeof pcLv==='function'?pcLv():0,g2=[a,b],jr=jzIdx()>=2;
 let L,r='';
 if(mode==='a'){const s=pk(TG_A);L=[['bg','harem_tug'],['cast','a,b'],[s[0],s[1]],[s[2],s[3]],['',s[4]]];add(a.id,4);add(b.id,jr?3:1);jzAdd(jr?0:-3);r=`${nm(a)}と帰った。(${nm(a)}+4・${nm(b)}+${jr?3:1})`;cnt('tug_a')}
 else if(mode==='b'){const s=pk(TG_B);L=[['bg','harem_tug'],['cast','a,b'],[s[0],s[1]],[s[2],s[3]],['',s[4]]];add(b.id,4);add(a.id,jr?3:1);jzAdd(jr?0:-3);r=`${nm(b)}と帰った。(${nm(b)}+4・${nm(a)}+${jr?3:1})`;cnt('tug_a')}
 else if(mode==='h'){const s=pk(TG_H);L=[['bg','harem_tug2'],['cast','a,b']].concat(s).concat([['fx','hearts']]);add(a.id,5+pc);add(b.id,5+pc);jzAdd(6);if(Math.random()<.25)gainSt('charm',1);r=`二人とも、ぼくの隣に!(${nm(a)}・${nm(b)} +${5+pc}・嫉妬ゼロ度+6)`;cnt('tug_h')}
 else{const s=pk(TG_ALL);L=[['bg','harem_tug3']].concat(s);top(8).forEach(h=>add(h.id,2));add(a.id,3);add(b.id,3);jzAdd(8);gainSt('charm',1);r='みんなで!(上位8人+2・嫉妬ゼロ度+8・魅力+1)';cnt('tug_h');cnt('tug_all')}
 note('💞 '+r);
 Novel.play({lines:dailyApply({lines:L},g2.concat(top(5).filter(h=>h!==a&&h!==b)),ex())},{h:a.id},()=>{save();done&&done()});
}
if(typeof tgTurn==='function'&&typeof MA_sc==='function'&&typeof TG_SIT!=='undefined')tgTurn=function(done){
 if(!S||S.fin||!S.t)return done();const cap=MA_sc();
 if(cap.n>=2||haremN()<2||Math.random()>.5)return done();
 const pool=top(6);if(pool.length<2)return done();
 const gs=pool.slice().sort(()=>Math.random()-.5).slice(0,2),A=gs[0],B=gs[1],s=pk(TG_SIT);
 cap.n++;cnt('tug');jzInit();
 const L=[['bg','harem_tug'],['','放課後の教室。{a}と{b}が、{K}の前で、向かい合っていた。'],['cast','a,b'],['a','「'+s[0]+'」'],['b','「'+s[1]+'」'],['a','「'+s[2]+'」'],['','二人の視線が、{K}に、同時に、向けられた。どうする？']];
 const ask=()=>{
  const btns=[
   [`${nm(A)}を選ぶ\n${nm(A)}と一緒に帰る`,()=>tgChoose(A,B,'a',done),'act','💗'],
   [`${nm(B)}を選ぶ\n${nm(B)}と一緒に帰る`,()=>tgChoose(A,B,'b',done),'act','💗'],
   [`二人とも、ぼくの隣に!\n両方を抱き寄せる(ハーレム)`,()=>tgChoose(A,B,'h',done),'act p','💞'],
   [haremN()>=4?`みんなで、一緒に!\n他の子も呼んで全員で(ハーレム)`:`みんなで、一緒に!\n(ハーレム4人から)`,haremN()>=4?()=>tgChoose(A,B,'all',done):()=>{},haremN()>=4?'act p':'act off','👑']];
  show('',`${nm(A)}と${nm(B)}が、{K}を見つめている。\n（嫉妬ゼロ度 ${S.jz}／${jzName()}）`.replace(/\{K\}/g,GAME.nick),btns);
 };
 Novel.play({lines:dailyApply({lines:L},gs,ex())},{h:A.id},ask);
};

/* ===== ② / ③ 嫉妬ゼロ宣言 ===== */
const DECL=[
 '「わたしは、{K}を好きになる子を、ぜったいに、うらやましがりません」','「{K}が笑っていることが、わたしの、いちばんの幸せです」','「抜け駆けはしません。でも、遠慮もしません。みんなで、全力で、好きでいます」','「ほかの子が、{K}と仲良くしていたら、一緒に、喜びます」','「やきもちが出そうになったら、まず、深呼吸して、{K}の笑顔を思い出します」','「{K}の隣は、みんなの席。わたしの席は、その、ひとつ隣」','「{K}が誰を好きでも、わたしは、{K}を、好きなままでいます」','「ハーレムは、みんなの、家族です」','「{K}を想う気持ちに、順位はつけません」','「みんなで、{K}を、世界一、幸せにします」','「ライバルは、最高の、仲間です」','「{K}が悲しい顔をしたら、全員で、笑わせます」','「わたしの『好き』は、みんなの『好き』と、足し算になります」','「やきもちは、愛情の、おまけ。もう、いりません」','「{K}を独り占めしたくなったら、みんなで、{K}を囲みます」','「毎日、おはようの数だけ、大好きを、伝えます」','「{K}の幸せが、わたしたち全員の、幸せです」','「嫉妬の代わりに、おやつを、分け合います」','「{K}のそばにいられる奇跡に、毎日、感謝します」','「ずっと、ずっと、みんなで、{K}を、愛し続けます」'];
const DRET=['「…うん。みんなの気持ち、ちゃんと、受け取ったよ」','「ありがとう。ぼくも、全員を、大切にするよ」','「みんなの宣言、うれしくて、胸がいっぱいだ」','「ぼくも、約束する。誰も、さみしくさせない」','「…ずるいな、みんな。こんなの、泣いちゃうよ」'];
const DOPEN=[['校庭に、全員が集まった。壇上には、手作りの宣言書。'],['講堂の幕が上がると、そこには、ずらりと並んだ、女子たちの姿。'],['朝礼の時間。校長先生が、「今日は、特別な朝礼です」と、マイクを譲った。'],['放課後の屋上に、全員が、円になって集合した。'],['体育館に、「嫉妬ゼロ宣言式」の、横断幕が掲げられた。']];
const DEND=['宣言書に、全員の名前が、ひとりずつ、書き込まれていった。','最後に、全員で、手をつないで、輪になった。','拍手と、歓声と、笑顔。学園に、新しい、約束が、ひとつ、刻まれた。','「これからも、よろしくね！」と、全員の声が、そろった。'];
function jzCeremony(done,auto){
 jzInit();const g=top(5);if(g.length<3)return done&&done();
 const jd=S.jd,rk=jzIdx();
 const k=Math.floor(Math.random()*DECL.length),ids=[];
 const L=[['bg','harem_jz'],['',pk(DOPEN)[0]],['cast','a,b,c,d,e,*'+(8+rk*6)]];
 const picks=[];while(picks.length<Math.min(3,g.length)){const x=Math.floor(Math.random()*DECL.length);if(!picks.includes(x))picks.push(x)}
 picks.forEach((x,i)=>{L.push(['abcde'[i],DECL[x]]);jd.seen[x]=1});
 L.push(['me',pk(DRET)],['fx',rk>=3?'confetti':'hearts'],['',pk(DEND)]);
 if(rk>=4)L.push(['','学園じゅうが、ひとつになった。嫉妬という文字は、もう、誰の辞書にも、載っていなかった。']);
 jd.n++;jd.t=S.t;cnt('jzdecl');
 jzAdd(8);avail().forEach(h=>add(h.id,rk>=4?3:1));
 note(`💞 嫉妬ゼロ宣言式を開いた。(嫉妬ゼロ度 ${S.jz}・宣言文 ${Object.keys(jd.seen).length}/${DECL.length})`);
 Novel.play({lines:dailyApply({lines:L},g,ex())},{h:g[0].id},()=>{save();done&&done()});
}
window.jzCeremony=jzCeremony;window.jzMonthlyTest=function(){return jzMonthly()};
function jzMonthly(){
 if(!S||S.fin||!S.t)return;jzInit();if(S.jzT===S.t)return;S.jzT=S.t;
 const n=haremN();if(n<2)return;
 jzAdd(1+Math.floor(n/8)+(typeof pcLv==='function'?pcLv():0)); /* 自然に増える */
 const r=jzIdx();
 if(r>=1)avail().forEach(h=>add(h.id,1));
 if(r>=2)S.money+=10000;
 if(r>=3){S.money+=10000;if(S.t%3===0)gainSt('charm',1)}
 if(r>=4)S.money+=20000;
}
function jzHtml(){
 jzInit();const j=S.jz,r=jzIdx(),jd=S.jd;
 let h=`<p class="hint">嫉妬ゼロ度 ${j} / 100 ── <b>${JZ_RANKS[r][1]}</b></p><div class="xg" style="height:12px;margin:6px 0 10px"><i style="width:${j}%"></i></div>`;
 h+=`<p class="hint">嫉妬ゼロ度は、取り合いで「二人とも」「みんなで」を選ぶ、宣言式を開く、協定が進む、ハーレムが増える、で上がります。ひとりだけを選ぶと、少し下がります(ほぼ嫉妬ゼロ以上なら下がりません)。</p>`;
 h+=`<button class="opt" type="button" ${S.ap>=1&&haremN()>=3?'data-do="jzgo:1"':'disabled style="opacity:.45"'}>嫉妬ゼロ宣言式をひらく(行動力1・ハーレム3人から)</button>`;
 h+='<h2 style="margin:12px 0 4px;font-size:13px">恩恵</h2>'+JZ_RANKS.map(([m,t],i)=>`<div class="ev"><b>${i<=r?'💞':'🔒'} ${t}(${m}〜)</b><span style="font-size:.72rem">${JZ_FX[i]}</span></div>`).join('');
 h+=`<h2 style="margin:12px 0 4px;font-size:13px">集めた宣言文 ${Object.keys(jd.seen).length} / ${DECL.length}(宣言式 ${jd.n}回)</h2>`;
 h+=DECL.map((d,i)=>jd.seen[i]?`<div class="ev" style="display:block"><small>${dailyFmt(d,{},ex())}</small></div>`:'').join('')||'<p class="hint">まだ、宣言していません。</p>';
 return h;
}
window.jzHtml=jzHtml;
/* 毎月の流れ: 自然増 + 宣言式(ときどき自動) + 協定でも上がる */
const _k=keyEvent;
keyEvent=function(done){
 try{jzMonthly()}catch(e){}
 _k(()=>{
  const r=jzIdx();
  if(S&&!S.fin&&haremN()>=3&&S.jd&&S.jd.t!==S.t&&Math.random()<.12+r*.05&&(S.keN?(S.keN[S.t]||0)<2:true))return jzCeremony(done,true);
  done&&done();
 });
};
if(typeof pcTurn==='function'){const _pc=pcTurn;pcTurn=function(done){const b=pcLv();return _pc(()=>{if(pcLv()>b)jzAdd(10);done&&done()})}}
})();
