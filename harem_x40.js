/* ===== 第40弾 モテモテ演出 12種 =====
   読込位置: index.html の最後(harem_x39.js の後)。 ※baito.js には触れていません。
   ① 視界ジャック(囲まれ場面で女子が画面の四隅から寄ってくる)  ② 香りゲージ(囲まれた人数で上昇、満タンで照れセリフ)
   ③ 通知の洪水(スマホ「通知」)  ④ ハート圧(魅力が高いほど画面に花びら・もや)  ⑤ ファンの出待ち(先回り)
   ⑥ 今日の独占権くじ+外れた子のフォロー  ⑦ 笑顔ランキングバトル(褒め合い)  ⑧ お願い券(スマホ「お願い券」)
   ⑨ 周囲の評判(スマホ「評判」)  ⑩ 女子目線の章(スマホ「女子会」)  ⑪ 他校の女子が訪問  ⑫ 全員集合の日(毎年3月)
   状態は S.x40 に保存。週の終わり(weekEnd)に毎週1つまで抽選で発生します。 */
(function(){
const pk=a=>a[Math.floor(Math.random()*a.length)];
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const X=()=>S.x40||(S.x40={inbox:[],tk:{},tickets:[],rep:0,fol:[],gv:0,rv:0,all:{},lot:0,bt:0,amb:0,rd:0});
const nm=h=>h.n.split(' ').join('');
const shuf=a=>a.slice().sort(()=>Math.random()-.5);
const KS=['ちゅっ、と、頬に、キス。','おでこに、ちゅっ、と、やさしい、キス。','手の甲に、そっと、キス。','頬に、ちゅっ、ちゅっ、と、連続の、キス。'];
const LV=['「好き！ 大好き！」','「大好き…！ ほんとに、大好き！」','「好き好き好き！ 大好き！」','「柏木くんが、大好き！」'];
const SC=['ふわりと、シャンプーの香り。','甘い、柔軟剤の匂い。','いちごの、リップの香り。','ほんのり、ミルクの香り。'];
function play(lines,gs,sum,done){
 const L=dailyApply({lines},gs,{N:typeof haremN==='function'?haremN():gs.length,M:typeof fcCount==='function'?fcCount():0});
 Novel.play({lines:L},{h:gs[0].id},()=>show(gs[0].id,sum,[['つぎへ',done,'p']]));
}
const V=(k,l)=>{const v=window.X40V&&window.X40V[k];return(v&&v.length&&Math.random()<.75)?pk(v)():l};
function pick(n){const av=avail();if(!av||av.length<n)return null;return shuf(av).slice(0,n)}
const gain=(gs,d)=>gs.forEach((g,i)=>add(g.id,typeof d==='function'?d(i):d));
const ev=n=>{try{cnt('x40_'+n)}catch(e){}};

/* ===== ① 視界ジャック ② 香りゲージ(Novel.play を包む) ===== */
const css=document.createElement('style');
css.textContent=`
#x40o{position:fixed;inset:0;z-index:150;pointer-events:none;opacity:0;transition:opacity .6s}
#x40o.on{opacity:1}
#x40o .v{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 35%,rgba(255,120,170,.55) 100%);mix-blend-mode:screen;animation:x40v 6s ease-in-out infinite alternate}
@keyframes x40v{from{transform:scale(1.12)}to{transform:scale(1)}}
#x40o .f{position:absolute;font-size:44px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.3));animation:x40in 4.5s ease-in-out infinite alternate}
@keyframes x40in{from{transform:translate(var(--dx),var(--dy)) scale(.8);opacity:.5}to{transform:translate(0,0) scale(1.25);opacity:1}}
#x40o .g{position:absolute;left:12px;top:72px;min-width:150px;background:rgba(255,255,255,.85);border-radius:14px;padding:5px 12px;font-size:12px;color:#be185d;box-shadow:0 2px 10px rgba(225,29,116,.25)}
#x40o .g i{display:block;height:7px;border-radius:5px;background:#fde1ec;margin-top:3px;overflow:hidden}
#x40o .g b{display:block;height:100%;background:linear-gradient(90deg,#f9a8d4,#e11d74);transition:width 1.2s}
body[data-heart="2"]::after,body[data-heart="3"]::after,body[data-heart="4"]::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:5;background:radial-gradient(ellipse at center,transparent 60%,rgba(255,130,175,.18) 100%)}
body[data-heart="4"]::after{background:radial-gradient(ellipse at center,transparent 45%,rgba(255,110,165,.3) 100%)}
#x40h{position:fixed;inset:0;pointer-events:none;z-index:6;overflow:hidden}
#x40h span{position:absolute;top:-30px;opacity:.7;animation:x40fall linear infinite}
@keyframes x40fall{to{transform:translateY(110vh) rotate(360deg)}}
`;
document.head.appendChild(css);
let OV=null;
function ovShow(pct,faces){
 if(!OV){OV=document.createElement('div');OV.id='x40o';document.body.appendChild(OV)}
 OV.innerHTML='<div class="v"></div>'+`<div class="g">💗 香りゲージ<i><b style="width:0"></b></i></div>`;
 requestAnimationFrame(()=>{OV.classList.add('on');const b=OV.querySelector('b');if(b)setTimeout(()=>{b.style.width=pct+'%'},60)});
}
function ovHide(){if(OV)OV.classList.remove('on')}
function crowdOf(lines){let n=0,ring=false;lines.forEach(r=>{if(!Array.isArray(r))return;if(r[0]==='cast'){String(r[1]).split(',').forEach(t=>{t=t.trim();if(!t)return;const m=t.match(/^\*(\d+)$/);n+=m?+m[1]:1})}if(r[0]==='fx'&&r[1]==='ring')ring=true});return{n,ring}}
const _np=Novel.play;
Novel.play=function(key,c,done){
 try{
  if(key&&key.lines){
   const {n,ring}=crowdOf(key.lines);
   if(ring&&n>=6){
    const pct=Math.min(100,Math.round(n*3.4));
    let L=key.lines;
    if(pct>=100){L=L.concat([['','香りの、ゲージは、もう、満タンだった。甘くて、頭が、くらくらする。'],['me',pk(['「…ちょっと、のぼせそう。…でも、悪くない」','「…すごい香りだ。…みんな、近すぎて、照れるよ」','「…顔が、あつい。…でも、幸せだな」'])]])}
    else if(pct>=70){L=L.concat([['','甘い香りが、濃くなっていく。{K}は、そっと、息を、のんだ。']])}
    ovShow(pct,Math.min(8,2+Math.floor(n/4)));
    return _np.call(Novel,{lines:L},c,function(){ovHide();done&&done()});
   }
  }
 }catch(e){}
 return _np.call(Novel,key,c,done);
};

/* ===== ④ ハート圧 ===== */
function heartTier(){const ch=S&&S.st?S.st.charm:0;return ch>=100?4:ch>=80?3:ch>=60?2:ch>=40?1:0}
function heartApply(){
 try{
  const t=heartTier();document.body.dataset.heart=t;
  let h=document.getElementById('x40h');
  if(!h){h=document.createElement('div');h.id='x40h';document.body.appendChild(h)}
  const off=typeof CFG!=='undefined'&&CFG.luxOff;
  const n=off?0:(t>=3?(t-1)*5:0);
  if(h.childElementCount!==n){h.innerHTML=Array.from({length:n},(_, i)=>`<span style="left:${Math.random()*100}%;font-size:${12+Math.random()*12}px;animation-duration:${9+Math.random()*9}s;animation-delay:${-Math.random()*12}s">${pk(['🌸','💗','🌸','💕'])}</span>`).join('')}
 }catch(e){}
}

/* ===== ③ 通知の洪水 ===== */
const MSGP=['おはよう！ 今日も、大好き！','夢に、柏木くんが、出てきたよ。好き！','今日、会えるの、楽しみ！ 大好き！','返信、待ってるよ。好き。','おやすみ。好き。大好き。','さっきの、笑顔、思い出して、にやけてる。好き！','今日の、髪型、どうかな？ 感想、聞かせて！','宿題、一緒に、やろう？ …口実だけど、好き！','柏木くんの、声が、聞きたいな。好き。','好き好き好き。…それだけ、言いたくて！','お弁当、作りすぎちゃった。…食べて、くれる？ 大好き！','今、柏木くんの、こと、考えてた。大好き！','みんなには、内緒だよ。…って、みんな、知ってるか（笑）好き！','今日の、占い、「大好きな人と、いい日」だって。柏木くんの、こと！','写真、待ち受けに、しちゃった。好き！','靴箱、見た？ 手紙、入れておいたよ。大好き！'];
function genInbox(){
 const av=avail();if(!av.length){X().inbox=[];return}
 const n=Math.min(40,3+Math.floor((typeof haremN==='function'?haremN():av.length)*1.2));
 X().inbox=Array.from({length:n},()=>({id:pk(av).id,t:pk(MSGP)}));
}
window.x40InboxHtml=function(){
 const ib=X().inbox;
 let h=`<p class="hint">朝から、スマホが、鳴りやまない…。女子たちからの「好き」メッセージ ${ib.length}件。返信すると、好感度が少し上がります。</p>`;
 if(!ib.length)return h+'<p class="hint">いまは、届いていません。(週が進むと、また、たくさん届きます)</p>';
 h+=`<button class="opt" type="button" data-do="x40:ib:all">📩 全員にまとめて返信する(${ib.length}件)</button>`;
 h+=ib.slice(0,25).map((m,i)=>{const g=H(m.id);return `<div class="ev"><b>${nm(g)}</b><span>${m.t}</span><button class="opt" type="button" data-do="x40:ib:${i}" style="margin-top:4px">返信する</button></div>`}).join('');
 if(ib.length>25)h+=`<p class="hint">…ほか ${ib.length-25}件</p>`;
 return h;
};

/* ===== ⑧ お願い券 ===== */
const TK=[
 ['膝枕券','膝の上に、{K}の頭を、そっと、乗せた。ふわりと、スカートの、柔軟剤の香りと、あたたかい、体温。','「ひ、膝枕、させて…！ 頭、乗せて？」'],
 ['手つなぎ券','そっと、{K}の手を、握った。指先から、どきどきが、伝わってくる。','「手、つないで、いい…？ ずっと、つなぎたかったの」'],
 ['あーん券','スプーンに、乗せた、デザートを、{K}の、口もとに、運んだ。','「はい、あーん！ …どう？ おいしい？」'],
 ['ハグ券','ぎゅっと、{K}に、抱きついた。シャンプーの、甘い香りが、ふわっと、広がった。','「ぎゅって、していい…？ 少しだけ、でいいから」'],
 ['頬キス券','背伸びを、して、{K}の頬に、ちゅっ、と、キスを、した。','「ほっぺに、ちゅって、していい…？ 券、使うね！」'],
 ['腕組み券','{K}の、腕に、そっと、自分の腕を、からめた。やわらかい、体温が、伝わってくる。','「腕、組んでも、いい？ このまま、歩きたいな」']];
function awardTickets(){
 const x=X(),got=[];
 avail().forEach(g=>{
  const v=S.a[g.id]||0,lv=v>=90?3:v>=70?2:v>=50?1:0,have=x.tk[g.id]||0;
  if(lv>have){x.tk[g.id]=have+1;const t=rnd(0,TK.length-1);x.tickets.push({id:g.id,t});got.push(nm(g)+'の'+TK[t][0])}
 });
 if(x.tickets.length>40)x.tickets=x.tickets.slice(-40);
 return got;
}
window.x40TicketHtml=function(){
 const x=X();
 let h=`<p class="hint">好感度が上がると、女子から「お願い券」がもらえます(好感度50/70/90で1枚ずつ)。使うと、その場で、囲まれイベントが始まります。所持 ${x.tickets.length}枚</p>`;
 if(!x.tickets.length)return h+'<p class="hint">まだ券がありません。女子との好感度を上げてみよう。</p>';
 return h+x.tickets.map((t,i)=>{const g=H(t.id);return `<div class="ev"><b>🎟 ${TK[t.t][0]}</b><span>${nm(g)}より</span><button class="opt" type="button" data-do="x40:tk:${i}" style="margin-top:4px">使う</button></div>`}).join('');
};
function useTicket(i){
 const x=X(),t=x.tickets[i];if(!t)return;
 x.tickets.splice(i,1);
 const o=H(t.id),others=shuf(avail().filter(g=>g.id!==t.id)).slice(0,3);
 if(others.length<2){PN='ほかの女子が足りません。';return}
 const gs=[o].concat(others),T=TK[t.t];
 closePhone();ev('ticket');
 const lines=[['',nm(o)+'が、握りしめた「'+T[0]+'」を、そっと、差し出した。'],['cast','a,b,c,*10'],['fx','ring'],['a',T[2]],['',T[1]],['',pk(SC)],['b','「あっ、ずるい！ わたしも、して、ほしい！」'],['c','「わたしにも！ 次、わたしだからね！？」'],['fx','stop'],['me','「…うん。みんな、順番にね」'],['a',pk(LV)],['',pk(KS)],['b',pk(LV)],['',pk(KS)],['fx','hearts']];
 gain(gs,i=>i===0?6:2);
 play(lines,gs,`【${T[0]}】${nm(o)}との好感度が上がった！`,()=>menu());
}

/* ===== ⑨ 周囲の評判 ===== */
const REP=[[0,'羨望','「…あいつ、どうして、あんなに、モテるんだ」と、男子たちが、遠巻きに、見つめている。'],[25,'尊敬','「…すごいやつだ。尊敬するよ」と、男子たちが、一目置くようになった。'],[50,'ファン','男子や先生まで、「柏木くんを見守る会」に、入会しはじめた。'],[80,'伝説','街の人たちまで、「あの子は、伝説だ」と、噂している。']];
function repTier(){const r=X().rep;let t=REP[0];REP.forEach(x=>{if(r>=x[0])t=x});return t}
const RPL=['商店街の、おばさんが、「あら、あの子、また、女の子に、囲まれてるわ」と、にこにこ。','男子たちが、「…いや、もう、悔しくもならない」と、ため息をついた。','先生が、「お前が、いると、学校が、明るくなる」と、笑った。','他校の生徒が、「あの人が、噂の、柏木くんか」と、ささやいた。','近所の、おじさんが、「青春だな」と、目を、細めた。','コンビニの店員さんが、「毎回、女の子が、ついてくるね」と、笑った。','後輩の男子が、「先輩、尊敬します！」と、頭を、下げてきた。','地元の、小さな、新聞に、「学園の、人気者」と、載った。'];
window.x40RepHtml=function(){
 const x=X(),t=repTier();
 let h=`<p class="hint">周りの人たちの、見る目です。ハーレムが大きくなるほど、評判が、上がっていきます。</p>`;
 h+=`<div class="ev"><b>評判:${t[1]}</b><span>${x.rep}/100</span></div><div style="height:8px;border-radius:5px;background:#fde1ec;margin:4px 0 10px;overflow:hidden"><div style="height:100%;width:${x.rep}%;background:linear-gradient(90deg,#f9a8d4,#e11d74)"></div></div>`;
 h+=`<p class="hint">${t[2]}</p>`;
 h+=`<h2 style="margin:12px 0 4px;font-size:13px">これまでの記録</h2><div class="ev"><b>全員集合の日</b><span>${Object.keys(x.all).length}回</span></div><div class="ev"><b>他校の訪問</b><span>${x.rv}回</span></div><div class="ev"><b>独占権くじ</b><span>${x.lot}回</span></div><div class="ev"><b>笑顔バトル</b><span>${x.bt}回</span></div><div class="ev"><b>先回り(出待ち)</b><span>${x.amb}回</span></div>`;
 return h;
};

/* ===== ⑩ 女子目線の章 ===== */
const GV=[
 ['作戦会議「どうやって話しかける？」',[['','放課後の、空き教室。女子たちが、机を、くっつけて、小声で、作戦会議を、していた。'],['cast','a,b,c,d'],['a','「第一回、柏木くんに、話しかける、作戦会議を、始めます！」'],['b','「まず、挨拶。「おはよう」から！」'],['c','「でも、声が、裏返ったら、どうしよう…」'],['d','「みんなで、同時に、行けば、怖くない！」'],['a','「…それだ！ 明日、全員で、突撃！」'],['','翌朝、突撃した女子たちは、全員、緊張で、「お、おは、よう」しか、言えなかったという。']]],
 ['女子会「柏木くんの好きなところ」',[['','女子たちの、パジャマ・パーティー。話題は、もちろん、柏木くんのこと。'],['cast','a,b,c,d'],['a','「やさしいところ！ 困ってると、必ず、気づいてくれる！」'],['b','「笑った顔！ くしゃっ、って、なるの、かわいい！」'],['c','「…声。名前を、呼ばれると、心臓が、止まりそう」'],['d','「全部！ 全部、好き！」'],['fx','hearts'],['a','「結局、全部だよね…！ 大好き！」'],['','夜は、更けても、「好き」の、話は、尽きなかった。']]],
 ['こっそり、柏木くんの、席を、拭く',[['','朝、誰もいない教室。女子たちが、こっそり、{K}の、席を、拭いていた。'],['cast','a,b,c,d'],['a','「しーっ！ 見つかったら、恥ずかしい！」'],['b','「机の、上に、お花、置いても、いいかな？」'],['c','「…わたしは、ノート、整えておく」'],['d','「みんな、同じこと、考えてたんだね」'],['','ところが、そこへ、{K}が、ガラッと、入ってきた。女子たちは、真っ赤になって、固まった。'],['a','「ち、ちがうの！ これは、その…！」'],['','{K}は、にっこり、笑った。「…ありがとう」']]],
 ['ラブレターの、書き方講座',[['','女子たちが、ラブレターの、文面で、盛り上がっていた。'],['cast','a,b,c,d'],['a','「「好きです」だけだと、短いかな？」'],['b','「「大好きです」にしよう！ ハート、いっぱい！」'],['c','「…便箋、ピンクと、水色、どっちが、いいと思う？」'],['d','「全部、書いて、全部、渡す！」'],['a','「全部、同じ内容でも、いいよね。気持ちは、本物だから！」'],['','翌朝、{K}の、靴箱は、手紙で、あふれた。']]],
 ['嫉妬ゼロ同盟、結成',[['','空き教室。女子たちが、円になって、手を、重ねていた。'],['cast','a,b,c,d,*6'],['a','「わたしたちは、柏木くんの、ことが、大好き！」'],['b','「でも、取り合いは、しない！ みんなで、仲良し！」'],['c','「…誰かが、選ばれても、笑って、祝福する」'],['d','「だって、みんな、柏木くんの、幸せを、願ってるから！」'],['a','「嫉妬ゼロ同盟、結成！ えい、えい、おー！」'],['','小さな、同盟は、後に、学園中へと、広がっていった。']]],
 ['お弁当、全員で、研究会',[['','調理室。女子たちが、エプロン姿で、「柏木くん好みの、お弁当」を、研究していた。'],['cast','a,b,c,d'],['a','「卵焼きは、少し、甘め、だったよね！」'],['b','「唐揚げは、にんにく、控えめ！」'],['c','「…彩りは、大事。ミニトマト！」'],['d','「みんなで、一品ずつ、作って、持ち寄ろう！」'],['','焼きたての、甘い香りが、調理室に、満ちた。'],['a','「…喜んで、くれるかな。…大好き」']]],
 ['影から、見守り隊',[['','中庭の、植え込みの、陰。女子たちが、双眼鏡を、持って、{K}を、見守っていた。'],['cast','a,b,c,d'],['a','「あっ、今、笑った！ かわいい！」'],['b','「うっ、尊い…！ 息が、できない…」'],['c','「…これ、ストーカー、じゃない？」'],['d','「違うよ！ 見守り隊、です！」'],['','結局、見つかって、{K}に、手を、振られ、全員、悶絶した。']]],
 ['誕生日、サプライズ会議',[['','深夜の、グループ通話。女子たちが、{K}の、誕生日の、サプライズを、企んでいた。'],['cast','a,b,c,d,*8'],['a','「ケーキ、わたしが、焼く！」'],['b','「飾りつけは、任せて！」'],['c','「…プレゼント、被らないように、リスト、作ろう」'],['d','「当日、全員で、「おめでとう」って、叫ぼう！」'],['a','「絶対、喜んでくれるよね。…大好きって、伝えなきゃ」'],['','通話は、朝まで、続いた。']]]
];
window.x40GvHtml=function(){
 const x=X();
 let h=`<p class="hint">柏木くんの知らない、女子たちだけの、ひみつの会話です。出来事が起きるたびに、ひとつずつ、読めるようになります。(${x.gv}/${GV.length})</p>`;
 h+=GV.map((g,i)=>i<x.gv?`<button class="opt" type="button" data-do="x40:gv:${i}">${g[0]}</button>`:`<div class="ev" style="opacity:.4"><b>???</b><span>未解放</span></div>`).join('');
 return h;
};
function playGv(i,sum,done){
 const gs=pick(4)||pick(3);if(!gs)return false;
 const L=GV[i][1].slice();
 closePhone();
 const lines=dailyApply({lines:L},gs,{N:haremN(),M:fcCount()});
 Novel.play({lines:lines},{h:gs[0].id},()=>{if(done)done();else menu()});
 return true;
}

/* ===== 週の終わりの抽選 ===== */
function scAmbush(done){
 const gs=pick(4);if(!gs)return false;
 const OP=['出かけた先に、着くと、すでに、女子たちが、先回りして、待っていた。','目的地の、入口で、「あっ、来た来た！」と、女子たちの、声が、重なった。','いつの間にか、行く先々に、女子たちの、姿が、あった。'];
 const lines=[['',pk(OP)],['cast','a,b,c,d,*12'],['fx','ring'],['a','「やっぱり、ここに、来た！ 予想、的中！」'],['b','「柏木くんの、行きそうな場所、全部、チェックしてあるの！」'],['c','「…ストーカー、じゃないよ！ 大好きなだけ！」'],['d','「ねえ、せっかくだから、みんなで、一緒に、回ろう！」'],['fx','stop'],['',pk(SC)],['me','「…みんな、すごいな。僕の行動、全部、お見通しだ」'],['a',pk(LV)],['',pk(KS)],['fx','hearts']];
 X().amb++;ev('ambush');gain(gs,3);
 play(V('ambush',lines),gs,`【出待ち】${gs.map(nm).join('、')}との好感度が上がった！`,done);return true;
}
function scLottery(done){
 const gs=pick(4);if(!gs)return false;
 const lines=[['','放課後。女子たちが、割り箸を、握りしめて、{K}の、周りに、集まった。'],['cast','a,b,c,d,*10'],['fx','ring'],['a','「今日の、柏木くんの、隣の権利は、くじ引きで、決めます！」'],['b','「恨みっこ、なしね！ せーの！」'],['fx','stop'],['a','「あっ…赤い印…！ 当たった！！ わたし！？」'],['b','「うう…外れた…」'],['c','「残念…。でも、おめでとう！」'],['d','「いいなあ…。次は、わたしが、当てる！」'],['',pk(SC)],['me','「じゃあ、今日は、君と、一緒に、帰ろうか。みんなとも、また、今度ね」'],['a','「～～～っ！！ 好き！ 大好き！」'],['',pk(KS)],['fx','confetti']];
 const x=X();x.lot++;ev('lottery');x.fol=gs.slice(1).map(g=>g.id);
 gain(gs,i=>i===0?5:1);
 play(V('lottery',lines),gs,`【独占権くじ】${nm(gs[0])}が当たった！(外れた子は、あとで、フォローを…)`,done);return true;
}
function scFollow(done){
 const x=X(),gs=x.fol.map(id=>H(id)).filter(Boolean);x.fol=[];
 if(!gs.length)return false;
 const gs2=gs.concat(shuf(avail().filter(g=>!gs.includes(g))).slice(0,3-gs.length+1));
 const lines=[['','数日後。くじに、外れた、女子たちが、そわそわと、{K}の、前に、現れた。'],['cast','a,b,c,*8'],['a','「…あの、この前は、残念だったから、今日は、わたしたちの、番、ですよね…？」'],['b','「…いいって、言ってたよね？ 約束、したよね？」'],['me','「もちろん。この前の、お詫びに、今日は、たっぷり、一緒に、いるよ」'],['a','「～～～っ！！ うれしい！ 大好き！」'],['',pk(SC)],['b',pk(LV)],['',pk(KS)],['',pk(KS)],['fx','hearts']];
 ev('follow');gain(gs2,i=>i<gs.length?4:1);
 play(lines,gs2,`【フォロー】${gs.map(nm).join('、')}との好感度が上がった！`,done);return true;
}
function scBattle(done){
 const gs=pick(4);if(!gs)return false;
 const w=rnd(0,3);
 const lines=[['','女子たちが、「今日の、一番の、笑顔を、決めよう！」と、{K}の、前で、笑顔を、競い始めた。'],['cast','a,b,c,d,*8'],['fx','ring'],['a','「にこっ！ どう？ 笑顔、百点でしょ！」'],['b','「ふふっ。わたしの、笑顔は、天使級だよ！」'],['c','「…にっこり。…照れて、うまく、笑えない…」'],['d','「えへへ！ 全開スマイル！」'],['fx','stop'],['','それぞれの、笑顔を、見て、{K}は、笑った。'],['me','「…全員、百点だよ。ひとり、選べないくらい、素敵な、笑顔だ」'],['a','「～～～っ！ 褒められた！ 大好き！」'],['b','「全員、優勝！ みんな、かわいい！」'],['',pk(SC)],['',pk(KS)],['fx','confetti']];
 const x=X();x.bt++;ev('battle');gain(gs,i=>i===w?4:2);
 play(V('battle',lines),gs,`【笑顔バトル】今日の笑顔賞は、${nm(gs[w])}！ みんな大優勝！`,done);return true;
}
function scRival(done){
 const gs=pick(4);if(!gs)return false;
 const x=X();x.rv++;ev('rival');
 const OP=['校門の前に、他校の制服の、女子たちが、ぞろぞろと、集まってきた。','放課後。他校の、女子たちが、「柏木くんに、会いに来ました！」と、校庭に、並んだ。','見慣れない、制服の、女子たちが、「噂、本当だった！」と、{K}を、取り囲んだ。'];
 const lines=[['',pk(OP)],['cast','a,b,c,d,*30'],['fx','ring'],['a','「あ、あの、わたしたち、隣の学校の、者です！ 噂を、聞いて、来ました！」'],['b','「柏木くん、本当に、かっこいい…！ 連絡先、教えてください！！」'],['c','「…ずるい、うちの学校の、子たち、毎日、会えるんだ…！」'],['d','「あっ、あなたたち、柏木くんの、ファン？ なら、わたしたちと、同じだね！ 仲良く、しよう！」'],['fx','stop'],['','学園の、女子たちが、他校の、女子たちと、手を、取り合った。'],['','「共同ファンクラブ」が、その場で、結成された。'],['',pk(SC)],['me','「…みんな、仲良くなってくれて、うれしいよ。僕も、みんなが、大好きだよ」'],['a',pk(LV)],['',pk(KS)],['fx','confetti']];
 gain(gs,3);S.x40.rep=Math.min(100,S.x40.rep+3);
 play(V('rival',lines),gs,`【他校の訪問】他校の女子たちと、共同ファンクラブが、できた！`,done);return true;
}
function scAllDay(done){
 const gs=pick(4);if(!gs)return false;
 const x=X();x.all[yr()]=1;ev('allday');
 const lines=[['','三月。学園の、桜が、咲き始めた、朝。教室の、扉を、開けると、女子たちが、全員、そろっていた。'],['cast','a,b,c,d,*40'],['fx','ring'],['a','「今日は、「柏木くんと、全員集合の日」です！」'],['b','「一年間、ありがとう！ みんなで、感謝を、伝えに来ました！」'],['c','「…一人ずつ、手紙、書いたの。全員分、読んでね」'],['d','「せーの！ 柏木くん、いつも、ありがとう！ 大好き！！」'],['fx','flood'],['','教室中に、「大好き」の、声が、響きわたった。甘い香りと、桜の香りが、窓から、舞い込んでくる。'],['me','「…みんな、ありがとう。こんなに、愛されて、僕は、幸せ者だよ」'],['a','「～～～っ！ うわあああん！ 大好き！」'],['',pk(KS)],['',pk(KS)],['',pk(KS)],['fx','confetti'],['','一年に一度の、特別な日。女子たちの、笑顔は、一日中、絶えなかった。']];
 avail().forEach(g=>add(g.id,3));gain(gs,2);x.rep=Math.min(100,x.rep+5);
 play(V('allday',lines),gs,'【全員集合の日】全員との好感度が上がった！',done);return true;
}
function pickEvent(a){
 const x=X(),hn=typeof haremN==='function'?haremN():0,r=Math.random(),ch=S.st?S.st.charm:0;
 if(S.fin)return null;
 if(typeof mon==='function'&&mon()===3&&!x.all[yr()]&&hn>=8)return scAllDay;
 if(x.fol.length&&r<.6)return scFollow;
 const q=Math.random();
 if(hn>=6&&q<.06&&x.rv<12)return scRival;
 if(hn>=3&&q>=.06&&q<.16)return scLottery;
 if(hn>=4&&q>=.16&&q<.24)return scBattle;
 if(hn>=3&&q>=.24&&q<.34&&x.gv<GV.length)return function(done){const i=x.gv++;ev('gv');return playGv(i,'',done)};
 if(a!=='walk'&&q>=.34&&q<(.34+(ch>=80?.2:.12)))return scAmbush;
 return null;
}
function upkeep(){
 const x=X(),hn=typeof haremN==='function'?haremN():0;
 genInbox();
 x.rep=Math.min(100,x.rep+1+Math.floor(hn/3));
 const got=awardTickets();
 if(got.length){try{NOTE=(NOTE?NOTE+'\n':'')+'🎟 お願い券を、'+got.slice(0,3).join('、')+(got.length>3?' ほか':'')+'もらった！(スマホ→その他→お願い券)'}catch(e){}}
 if(x.inbox.length>=10){try{NOTE=(NOTE?NOTE+'\n':'')+'📩 「好き」のメッセージが、'+x.inbox.length+'件、届いている！'}catch(e){}}
 if(Math.random()<.35){try{NOTE=(NOTE?NOTE+'\n':'')+'👀 '+pk(RPL)}catch(e){}}
 heartApply();
}
const _w=weekEnd;
weekEnd=function(a){
 try{upkeep();const e=pickEvent(a);if(e&&e(()=>_w(a))!==false)return}catch(err){try{console.error(err)}catch(_){}}
 return _w(a);
};
/* ===== スマホ連携 ===== */
window.x40Do=function(a){
 const [,c,y]=a.split(':'),x=X();
 if(c==='ib'){
  if(y==='all'){const n=x.inbox.length;x.inbox.forEach(m=>add(m.id,1));x.inbox=[];ev('reply');PN=`${n}件、全員に返信した！ みんなの好感度が少し上がった。`}
  else{const m=x.inbox[+y];if(m){add(m.id,2);x.inbox.splice(+y,1);ev('reply');PN=`${nm(H(m.id))}に返信した！ 好感度が上がった。`}}
  save();return drawPhone();
 }
 if(c==='tk'){useTicket(+y);save();return}
 if(c==='gv'){const i=+y;if(i<x.gv)playGv(i,'',()=>{});return}
};
if(typeof TTL!=='undefined'){TTL.inbox='通知';TTL.tick='お願い券';TTL.rep='評判';TTL.gv='女子会'}
window.addEventListener('load',()=>setTimeout(heartApply,300));
window.X40P={MSGP,RPL,REP};
window.x40Test={scAmbush,scLottery,scFollow,scBattle,scRival,scAllDay,playGv,useTicket,upkeep,X,GV,TK};
})();
