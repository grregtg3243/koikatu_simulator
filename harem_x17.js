/* ===== 第17弾 「ご奉仕ガチャ」(スマホの「奉」アプリ) =====
   お金でひく → ランダムな女子が、ランダムな「ご奉仕」をしてくれる。レア度 N/R/SR/UR。
   24種類 × 4レア度 = 96枚のコレクション。毎月1回は無料。30連でSR以上確定(天井)。
   ご奉仕を足す … HS_TYPES に {n:'名前',a:'女子のセリフ',nar:'地の文'} を足すだけ(レア度は自動で作られます) */
const HS_COST=8000,HS_COST10=70000,HS_PITY=30;
const HS_RAR=['N','R','SR','UR'],HS_STAR=['★','★★','★★★','★★★★'],HS_P=[.55,.30,.12,.03];
const HS_TYPES=[
 {n:'モーニングコール',a:'「{K}、おはよう！ 朝だよ、起きて！」',nar:'スマホから、元気な声。目覚ましより、ずっと、気持ちのいい朝だった。'},
 {n:'手作りお弁当',a:'「今日は、{K}のために、がんばって作ったの！」',nar:'蓋を開けると、彩り豊かなおかず。たまご焼きは、ハート型だった。'},
 {n:'肩もみ',a:'「{K}、お疲れさま。肩、もんであげるね」',nar:'ぽんぽん、もみもみ。小さな手が、やさしく、疲れをほぐしていく。'},
 {n:'耳かき',a:'「じっとしててね。…痛かったら、言って？」',nar:'やわらかい膝の上。静かな教室に、かすかな、音だけが、響いた。'},
 {n:'膝枕',a:'「ここ、あいてるよ。ちょっとだけ、休んで？」',nar:'ふんわり、いい匂い。まぶたが、ゆっくり、重くなっていく。'},
 {n:'髪をとかす',a:'「寝ぐせ、ついてるよ。直してあげる」',nar:'丁寧に、ブラシが通る。鏡越しに、目が合って、二人とも、照れた。'},
 {n:'ネクタイ直し',a:'「曲がってる。…じっとして」',nar:'顔が、近い。細い指先が、きゅっ、とネクタイを結び直した。'},
 {n:'相合い傘',a:'「傘、入って！ 濡れちゃうよ」',nar:'ひとつの傘の中。肩が触れ合って、雨音しか、聞こえなかった。'},
 {n:'勉強を教える',a:'「ここは、こうだよ。ほら、わかった？」',nar:'ノートをのぞき込む距離が、近い。内容は、ぜんぜん、頭に入らなかった。'},
 {n:'絆創膏',a:'「ケガしてる！ じっとして、貼ってあげる」',nar:'ぺた、と、かわいい柄の絆創膏。心配そうな顔が、いちばん、効いた。'},
 {n:'差し入れ',a:'「部活おつかれさま！ これ、差し入れ！」',nar:'冷たいスポーツドリンクと、手作りのレモンの蜂蜜漬け。'},
 {n:'マフラー',a:'「寒そうだから、これ、貸してあげる」',nar:'ふわり、と巻かれたマフラーは、まだ、あたたかかった。'},
 {n:'手作りクッキー',a:'「ちょっと、焦げちゃったけど…食べて？」',nar:'さくっ。ほろ苦い。でも、いままで食べた中で、いちばんおいしかった。'},
 {n:'足湯',a:'「ほら、足、入れてみて。ぽかぽかだよ」',nar:'二人並んで、足湯。湯気の向こうで、彼女が、ほほえんでいた。'},
 {n:'なでなで',a:'「えらいえらい。今日も、がんばったね」',nar:'頭に、ぽん、と、手のひら。思わず、目を細めてしまった。'},
 {n:'手相占い',a:'「ふむふむ…あ、恋愛線が、すごいことに！」',nar:'手のひらを、くすぐったく、なぞられる。占い結果は、「大モテ」だった。'},
 {n:'星空観察',a:'「見て、流れ星！ お願いごと、した？」',nar:'屋上に寝転んで、夜空を見上げる。隣の体温が、ずっと、あたたかかった。'},
 {n:'髪飾り',a:'「これ、おそろいなの。{K}にも、似合うかも」',nar:'小さなヘアピンを、前髪に、ぱちん。鏡の中の自分が、ちょっと、照れていた。'},
 {n:'似顔絵',a:'「動かないでね。…できた！ どう？」',nar:'スケッチブックには、ふにゃっと笑う自分。下には、「だいすき」の文字。'},
 {n:'お見送り',a:'「気をつけて帰ってね。また、明日！」',nar:'校門で、見えなくなるまで、大きく手を振ってくれた。'},
 {n:'おかえりなさい',a:'「おかえりなさい、{K}！ ごはん、できてるよ」',nar:'玄関を開けると、エプロン姿。まるで、新婚みたいだと、思ってしまった。'},
 {n:'ひとつのイヤホン',a:'「この曲、聴いて。{K}に、聴いてほしかったの」',nar:'左右、ひとつずつのイヤホン。サビで、そっと、肩に、もたれかかってきた。'},
 {n:'あーん',a:'「はい、あーん！」',nar:'差し出されたスプーン。ためらいながら、ぱくり。味は、よく、わからなかった。'},
 {n:'おやすみのメッセージ',a:'「今日も、一日、ありがとう。おやすみなさい」',nar:'画面に、ハートのスタンプ。返信を打つ指が、少し、にやけていた。'},
];
const HS_ME=['「…ありがとう、うれしいよ」','「…なんだか、照れるな」','「毎日でも、お願いしたいくらいだよ」','「幸せすぎて、どうにかなりそう」'];
const HS_AFTER=['「えへへ…よかった」','「また、してあげるね」','「{K}が、喜んでくれると、わたしも、うれしい」','「…内緒だよ？ 特別なんだから」'];
const HS_B=['「あっ、{a}ちゃん、ずるい！ わたしも、やる！」','「わたしだって、{K}に、してあげたいの！」','「次は、わたしの番だからね！」'];
const HS_UR=['気がつくと、{K}の周りには、女子たちが、ぎっしり。全員が、同じことを、してくれていた。','「みんなで、同時に、ご奉仕！」という、とんでもない、サプライズだった。'];
function hsInit(){if(!S.hs)S.hs={c:{},p:0,n:0,free:0,ur:0};return S.hs}
function hsPick(){
 const hs=hsInit();let r=Math.random(),k=0,acc=0;
 for(k=0;k<4;k++){acc+=HS_P[k];if(r<acc)break}
 if(k>3)k=3;
 if(hs.p>=HS_PITY-1&&k<2)k=2+(Math.random()<.2?1:0);
 return k;
}
function hsScene(gi,ti,k){
 const t=HS_TYPES[ti],pk=a=>a[Math.floor(Math.random()*a.length)];
 const L=[['bg','harem_gacha_'+ti],['',`${HS_STAR[k]} ${HS_RAR[k]}　ご奉仕「${t.n}」`],['cast',k>=3?'a,b,c,*'+(14+Math.floor(Math.random()*10)):k>=2?'a,b,c':k>=1?'a,b':'a'],['a',t.a]];
 if(k>=1)L.push(['b',pk(HS_B)]);
 if(k>=2)L.push(['fx','hearts']);
 if(k>=3){L.push(['fx','confetti'],['fx','flood'],['',pk(HS_UR)])}
 L.push(['',t.nar],['me',pk(HS_ME)],['a',pk(HS_AFTER)]);
 return L;
}
function hsOne(manual){
 const hs=hsInit(),gs=avail();if(!gs.length)return null;
 const w=gs.map(h=>(1+Math.max(0,favOf(h))/25)*(typeof pkId==='function'&&pkId()===h.id?3:1)),tot=w.reduce((a,b)=>a+b,0);
 let r=Math.random()*tot,gi=0;for(;gi<gs.length-1;gi++){r-=w[gi];if(r<0)break}
 const g=gs[gi],ti=Math.floor(Math.random()*HS_TYPES.length),k=hsPick();
 hs.n++;if(k>=2)hs.p=0;else hs.p++;
 const key=ti+'|'+k;hs.c[key]=(hs.c[key]||0)+1;if(k===3)hs.ur++;
 add(g.id,[1,2,4,8][k]);
 if(k===1&&Math.random()<.1||k===2&&Math.random()<.3||k===3)gainSt('charm',1);
 if(k===3){gs.forEach(h=>add(h.id,2));S.money+=50000}
 cnt('hspull');if(k===3)cnt('hsur');
 return {g,ti,k};
}
function hsPull(n,free){
 const hs=hsInit();
 if(free){if(hs.free===S.t)return menu();hs.free=S.t;n=1}
 else{const c=n===10?HS_COST10:HS_COST;if(S.money<c)return menu();S.money-=c}
 const res=[];for(let i=0;i<n;i++){const o=hsOne();if(o)res.push(o)}
 if(!res.length)return menu();
 const best=res.slice().sort((a,b)=>b.k-a.k)[0],th=res.filter(o=>o!==best&&o.k>=2);
 const sum=res.length>1?`【ご奉仕】${res.length}連の結果: `+HS_RAR.map((r,k)=>res.filter(o=>o.k===k).length?r+'×'+res.filter(o=>o.k===k).length:'').filter(x=>x).join(' '):'';
 if(sum)NOTE=(NOTE?NOTE+'\n':'')+sum;
 const lines=[];
 [best].concat(th.slice(0,2)).forEach(o=>{
  const g3=[o.g].concat(avail().filter(h=>h.id!==o.g.id).sort(()=>Math.random()-.5).slice(0,4));
  dailyApply({lines:hsScene(0,o.ti,o.k)},g3,{N:haremN(),M:fcCount()}).forEach(l=>lines.push(l));
 });
 const ac=checkAch();save();
 Novel.play({lines},{h:best.g.id},()=>{save();menu()});
}
function hsHtml(){
 const hs=hsInit(),sv=S.hs.free!==S.t;
 let h=`<p class="hint">女子がランダムに「ご奉仕」してくれます。(ひいた回数 ${hs.n}回 / 天井まであと ${Math.max(0,HS_PITY-hs.p)}連 / 所持金 ¥${S.money.toLocaleString()})</p>`;
 h+=`<button class="opt" type="button" ${sv?'data-do="hspull:f"':'disabled style="opacity:.45"'}>今月の無料ご奉仕(月1回)</button>`;
 h+=`<button class="opt" type="button" ${S.money>=HS_COST?'data-do="hspull:1"':'disabled style="opacity:.45"'}>ご奉仕を1回(¥${HS_COST.toLocaleString()})</button>`;
 h+=`<button class="opt" type="button" ${S.money>=HS_COST10?'data-do="hspull:10"':'disabled style="opacity:.45"'}>10連(¥${HS_COST10.toLocaleString()})</button>`;
 const got=HS_TYPES.reduce((a,t,i)=>a+[0,1,2,3].filter(k=>hs.c[i+'|'+k]).length,0);
 h+=`<h2 style="margin:12px 0 4px;font-size:13px">コレクション ${got} / ${HS_TYPES.length*4}(UR ${hs.ur}回)</h2>`;
 h+=HS_TYPES.map((t,i)=>`<div class="ev"><b>${t.n}</b><span>`+[0,1,2,3].map(k=>hs.c[i+'|'+k]?`<span style="color:${['#6b7280','#2563eb','#d97706','#e11d74'][k]}">${HS_RAR[k]}×${hs.c[i+'|'+k]}</span>`:'<span style="opacity:.3">'+HS_RAR[k]+'</span>').join(' ')+'</span></div>').join('');
 return h;
}
