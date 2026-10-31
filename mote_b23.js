/* ===== 第23弾B モテモテ強調 =====
   ⑥ 嫉妬ゼロ協定(ハーレム人数で進化)  ⑦ 親衛隊の組織(役職の自動任命・毎月の効果)
   ⑧ 柏木くん専用スペース(学園が少しずつ「柏木くん仕様」に)  ⑨ ハーレムエンドの後日談バリエーション
   ⑩ ホーム画面のコラージュ(右パネル)  読込位置: index.html の最後(mote_a23.js の後)。 */
/* ---- ⑥ 協定 ---- */
const PC_LV=[
 {n:'こっそり協定',need:2,fx:'おたがい、抜け駆けは、しない(たぶん)。',sc:[['bg','harem_pact1'],['','放課後の空き教室。{a}と{b}が、顔を見合わせていた。'],['cast','a,b'],['a','「ねえ、わたしたち、{K}のこと、同じくらい、好きだよね」'],['b','「うん。…だから、こっそり、約束しない？」'],['a','「抜け駆けは、しない。{K}を、困らせない」'],['b','「その代わり、ちゃんと、順番を守る！」'],['','二人は、小指を絡めて、くすっと笑った。「こっそり協定」の、成立だった。']]},
 {n:'みんなで好きでいよう協定',need:4,fx:'嫉妬より、「みんなで好き」を選ぶ。',sc:[['bg','harem_pact2'],['','放課後の屋上。{a}、{b}、{c}、{d}が、円になって、座っていた。'],['cast','a,b,c,d'],['c','「誰かが、{K}と仲良くなるたび、胸が、ちくっとしてたの」'],['d','「わたしも。…でも、みんなが笑ってる方が、うれしいって、気づいた」'],['a','「だったら、決めよう。みんなで、{K}を、好きでいようって」'],['b','「賛成！ 嫉妬しそうになったら、みんなで、ぎゅってしよう！」'],['fx','hearts'],['','手と手が、重なる。「みんなで好きでいよう協定」が、結ばれた。']]},
 {n:'抜け駆けなし条約',need:8,fx:'週ごとの当番制で、全員が、平等に、{K}と過ごせる。',sc:[['bg','harem_pact3'],['','講堂のステージに、一枚の、大きな模造紙が、貼られていた。'],['cast','a,b,c,d,e,*8'],['','『抜け駆けなし条約』。その下に、びっしりと、署名が並んでいる。'],['a','「当番表も、作ったよ。毎日、誰かが、{K}と、お昼を食べる」'],['b','「全員、平等！ もめたら、じゃんけん！」'],['me','「…ぼくの予定、こんなに、埋まってるの？」'],['c','「だって、みんな、{K}と、過ごしたいんだもん」'],['fx','confetti'],['','拍手とともに、条約は、満場一致で、可決された。']]},
 {n:'柏木くん親衛隊、設立',need:12,fx:'親衛隊が、{K}の学園生活を、全力でサポートする。',sc:[['bg','harem_pact4'],['','朝の校庭に、揃いの腕章をつけた、女子たちが、整列していた。'],['cast','a,b,c,d,e,*20'],['a','「ただいまより、『{K}親衛隊』の、結成式を、行います！」'],['b','「隊員番号、一番！ わたしです！」'],['c','「任務は、{K}の護衛、秘書、広報、その他、全部！」'],['fx','flash'],['me','「…そこまで、しなくても…」'],['d','「だめ！ {K}は、わたしたちの、宝物だから！」'],['','拍手と、敬礼と、笑い声。親衛隊が、ここに、誕生した。']]},
 {n:'嫉妬ゼロ宣言',need:20,fx:'嫉妬という感情が、学園から、姿を消した。',sc:[['bg','harem_pact5'],['','全校集会。壇上で、{a}が、マイクを握っていた。'],['cast','a,b,c,d,e,*30'],['a','「えー、本日、みなさんに、宣言したいことがあります」'],['b','「わたしたちは、{K}のことを、全員で、好きです！」'],['c','「そして、誰も、嫉妬しません！」'],['d','「だって、みんなで好きになる方が、100倍、楽しいから！」'],['fx','confetti'],['e','「嫉妬ゼロ宣言、ここに、採択します！」'],['','体育館が、割れんばかりの、拍手に包まれた。']]},
 {n:'永久不変・ハーレム憲章',need:40,fx:'ハーレムは、{school}の、永遠の、憲法になった。',sc:[['bg','harem_pact6'],['','校長室に、新しい額縁が、掲げられた。『永久不変・ハーレム憲章』。'],['cast','a,b,c,d,e,*50'],['','第一条。{K}は、みんなのもの。第二条。みんなは、{K}のもの。'],['a','「第三条以降は、ぜんぶ、愛のルールです！」'],['b','「憲法記念日には、全員で、お祝いします！」'],['fx','flood'],['me','「…条文、全部、読ませて」'],['c','「だめー！ 恥ずかしいから！」'],['fx','petals'],['','学園の歴史に、新しい一ページが、刻まれた。']]},
];
function pcInit(){if(!S.pc)S.pc={lv:0};return S.pc}
function pcLv(){return S&&S.pc?S.pc.lv:0}
function pcTurn(done){
 if(!S||S.fin||!S.t)return done();const pc=pcInit(),cap=MA_sc(),n=haremN();
 const nx=PC_LV[pc.lv];if(!nx||n<nx.need||cap.n>=2)return done();
 const top=MA_top(5);if(top.length<2)return done();
 pc.lv++;cap.n++;cnt('pact_lv');
 const gs=avail();gs.forEach(h=>add(h.id,3));
 NOTE=(NOTE?NOTE+'\n':'')+`【協定】「${nx.n}」が結ばれた!`;
 Novel.play({lines:dailyApply({lines:nx.sc},top,MA_ex())},{h:top[0].id},()=>{save();done()});
}
/* ---- ⑦ 組織 ---- */
const OG_ROLES=[
 {id:'sec',n:'専属秘書',need:3,fx:'毎月 ¥20,000',line:'「スケジュール管理は、お任せください！」',m:s=>{S.money+=20000;return 20000}},
 {id:'chef',n:'専属シェフ',need:4,fx:'毎月 疲れが少し回復',line:'「栄養バランス、ばっちり考えてます！」',m:s=>{S.f=Math.max(0,S.f-1);return 0}},
 {id:'acc',n:'会計担当',need:6,fx:'毎月 ¥30,000',line:'「親衛隊のお金は、一円単位で、管理します！」',m:s=>{S.money+=30000;return 30000}},
 {id:'style',n:'スタイリスト',need:7,fx:'6か月ごとに 魅力+1',line:'「今日のコーデ、完璧に、決めてあげる！」',m:s=>{if(S.t%6===0)gainSt('charm',1);return 0}},
 {id:'pr',n:'広報担当',need:8,fx:'4か月ごとに 魅力+1',line:'「{K}の魅力、全校に、広めてきます！」',m:s=>{if(S.t%4===0)gainSt('charm',1);return 0}},
 {id:'photo',n:'専属カメラマン',need:9,fx:'毎月 ¥10,000(写真の売り上げ…？)',line:'「ベストショット、逃しません！」',m:s=>{S.money+=10000;return 10000}},
 {id:'fan',n:'ファンクラブ会長',need:10,fx:'毎月 ¥25,000',line:'「会員の皆さまの、熱い想いを、まとめます！」',m:s=>{S.money+=25000;return 25000}},
 {id:'sched',n:'スケジュール管理',need:12,fx:'毎月 ¥15,000',line:'「{K}の一日は、分刻みで、管理！」',m:s=>{S.money+=15000;return 15000}},
 {id:'guard',n:'ボディガード',need:5,fx:'本人の好感度が、毎月+1',line:'「{K}は、わたしが、守る！」',m:(s,g)=>{if(g)add(g.id,1);return 0}},
 {id:'chief',n:'親衛隊長',need:15,fx:'全員の好感度が、毎月+1',line:'「全隊員、{K}のために、敬礼！」',m:s=>{avail().forEach(h=>add(h.id,1));return 0}},
];
function ogInit(){if(!S.og)S.og={};return S.og}
function ogTurn(done){
 if(!S||S.fin||!S.t)return done();const og=ogInit(),n=haremN();
 Object.keys(og).forEach(r=>{if(!H(og[r])||favOf(H(og[r]))<40)delete og[r]});
 const used=new Set(Object.values(og)),top=MA_top(40).filter(h=>favOf(h)>=60&&!used.has(h.id)),nw=[];
 OG_ROLES.slice().sort((a,b)=>a.need-b.need).forEach(r=>{if(n>=r.need&&!og[r.id]&&top.length){const g=top.shift();og[r.id]=g.id;nw.push([r,g])}});
 let inc=0;OG_ROLES.forEach(r=>{if(og[r.id]){try{inc+=r.m(S,H(og[r.id]))||0}catch(e){}}});
 if(inc>0)NOTE=(NOTE?NOTE+'\n':'')+`【親衛隊】今月の活動収入 ¥${inc.toLocaleString()}`;
 if(nw.length&&MA_sc().n<3){
  MA_sc().n++;cnt('og_new',nw.length);
  const gs=nw.map(x=>x[1]),L=[['bg','harem_og'],['','朝礼の校庭。親衛隊の、任命式が、行われた。'],['cast','a,b,c,d,e']];
  nw.slice(0,5).forEach(([r,g],i)=>{L.push(['',`${'abcde'[i]==='a'?'':''}『${r.n}』に、{${'abcde'[i]}}が、任命された。`],['abcde'[i],r.line])});
  L.push(['fx','hearts'],['','拍手が、校庭に、響き渡った。']);
  NOTE=(NOTE?NOTE+'\n':'')+`【親衛隊】${nw.map(x=>x[0].n).join('・')} が任命された!`;
  const L2=dailyApply({lines:L},gs.slice(0,5),MA_ex());
  return Novel.play({lines:L2},{h:gs[0].id},()=>{save();done()});
 }
 done();
}
/* ---- ⑧ 専用スペース ---- */
const FAC=[
 {n:'専用ロッカー',need:2,t:'学園で唯一の、鍵つき・花柄の、専用ロッカー。中は、いつも、お菓子と手紙で、いっぱい。'},
 {n:'専用部室',need:3,t:'旧部室棟の一室が、「{K}の部屋」に、改装された。クッションと、ソファと、紅茶つき。'},
 {n:'玉座つきの教室',need:5,t:'教室の窓際に、ふかふかの、玉座が、設置された。「{K}の席」と、金のプレートつき。'},
 {n:'専用の食堂席',need:7,t:'学食の、いちばん日当たりのいい席が、「{K}専用」に。予約席の札が、常に、立っている。'},
 {n:'赤絨毯の昇降口',need:9,t:'昇降口から、教室まで、赤い絨毯が、敷かれた。毎朝、花びらが、舞う。'},
 {n:'専用ラウンジ',need:12,t:'校舎の一角に、「{K}ラウンジ」が、オープン。ドリンクバーと、マッサージチェアつき。'},
 {n:'屋上庭園',need:15,t:'屋上が、きれいな庭園に、生まれ変わった。ベンチには、「{K}と、みんな」の、プレート。'},
 {n:'専用プライベートプール',need:18,t:'体育館の裏に、小さな、専用プールが、完成した。「全員、水着、持参」と、掲示された。'},
 {n:'柏木くんの銅像',need:22,t:'校門の前に、{K}の、銅像が、建った。毎朝、女子たちが、拝んでいく。'},
 {n:'専用の校門',need:26,t:'校門の横に、もうひとつ、「{K}専用ゲート」が、できた。通れるのは、{K}と、同伴者だけ。'},
 {n:'柏木ホール',need:30,t:'新しい講堂に、「柏木ホール」の名が、つけられた。こけら落としは、全校で、{K}コール。'},
 {n:'柏木学園、改称',need:40,t:'ついに、校名が、「柏木学園」に、改称された。校旗には、{K}の、似顔絵つき。'},
];
function fcInit(){if(!S.fac)S.fac=0;return S.fac}
function facTurn(done){
 if(!S||S.fin||!S.t)return done();const lv=fcInit(),f=FAC[lv],cap=MA_sc(),n=haremN();
 if(lv>0)S.money+=lv*4000;
 if(!f||n<f.need||cap.n>=2)return done();
 const top=MA_top(5);if(top.length<2)return done();
 S.fac=lv+1;cap.n++;cnt('fac');top.forEach(h=>add(h.id,2));
 NOTE=(NOTE?NOTE+'\n':'')+`【専用スペース】「${f.n}」が完成した!(毎月 ¥${((lv+1)*4000).toLocaleString()} の収入)`;
 const L=[['bg','harem_fac'+(lv+1)],['','朝、登校すると、校内に、見慣れない、新しいものが、できていた。'],['cast','a,b,c,*10'],['',f.t],['a','「じゃーん！ 親衛隊からの、サプライズです！」'],['b','「{K}のために、みんなで、作ったんだよ！」'],['fx',lv>=8?'confetti':'hearts'],['me','「…学園が、どんどん、ぼく仕様に…」'],['c','「いいの。{K}が、いちばん、居心地よければ」'],['','学園は、また一歩、{K}のための場所になった。']];
 Novel.play({lines:dailyApply({lines:L},top,MA_ex())},{h:top[0].id},()=>{save();done()});
}
function orgHtml(){
 const pc=pcInit(),og=ogInit(),n=haremN(),nx=PC_LV[pc.lv];
 let h=`<p class="hint">ハーレムが大きくなるほど、親衛隊が整っていきます。(ハーレム ${n}人)</p>`;
 h+=`<h2 style="margin:8px 0 4px;font-size:13px">🤝 嫉妬ゼロ協定</h2>`;
 h+=pc.lv?`<div class="ev"><b>${PC_LV[pc.lv-1].n}</b><span>${PC_LV[pc.lv-1].fx.replace(/\{K\}/g,GAME.nick).replace(/\{school\}/g,GAME.school)}</span></div>`:'<p class="hint">まだ、結ばれていません。</p>';
 h+=nx?`<p class="hint">次の協定「${nx.n}」まで、ハーレム ${nx.need}人(あと ${Math.max(0,nx.need-n)}人)</p>`:'<p class="hint">すべての協定が、結ばれました。</p>';
 h+=`<h2 style="margin:12px 0 4px;font-size:13px">🎖️ 親衛隊の役職</h2>`;
 h+=OG_ROLES.slice().sort((a,b)=>a.need-b.need).map(r=>{const g=og[r.id]&&H(og[r.id]);return g?`<div class="ev" style="gap:8px"><img src="img/${g.img}.jpg" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover" onerror="this.style.display='none'"><b>${r.n}</b><span>${g.n.split(' ').join('')}　<small>${r.fx}</small></span></div>`:`<div class="ev" style="opacity:.55"><b>？？？(${r.n})</b><span>ハーレム ${r.need}人で任命</span></div>`}).join('');
 h+=`<h2 style="margin:12px 0 4px;font-size:13px">🏰 柏木くん専用スペース(${S.fac||0} / ${FAC.length})</h2>`;
 h+=FAC.map((f,i)=>i<(S.fac||0)?`<div class="ev"><b>${f.n}</b><span>完成</span></div>`:`<div class="ev" style="opacity:.55"><b>？？？</b><span>ハーレム ${f.need}人で完成</span></div>`).join('');
 return h;
}
/* ---- ⑨ ハーレムエンドの後日談 ---- */
const SUB_END={
 wedding:{n:'合同結婚式',ok:()=>true,only:'harem',sc:[['bg','harem_sub_wedding'],['','——卒業から、三年後。街の、いちばん大きな、チャペル。'],['cast','a,b,c,d,e,*30'],['','ウェディングドレスの、女子たちが、バージンロードに、ずらりと並んだ。'],['a','「…夢みたい。本当に、みんなで、結婚式を、挙げられるなんて」'],['b','「法律は、ちょっと、よくわからないけど、気持ちは、本物だよ！」'],['me','「…幸せにするって、約束、守るよ」'],['fx','petals'],['c','「誓いのキスは、順番にね。全員分、あるから！」'],['fx','confetti'],['','祝福の鐘が、鳴り響く。それは、世界でいちばん、にぎやかな、結婚式だった。']]},
 festival:{n:'毎日がお祭り',ok:()=>true,only:'ultra',sc:[['bg','harem_sub_festival'],['','——卒業から、五年後。街は、年中、「柏木祭り」。'],['cast','a,b,c,d,e,*60'],['','神輿、屋台、花火。どこを見ても、{K}の、名前と、笑顔。'],['a','「今日も、祭りの日だよ！ 毎日が！」'],['b','「街の人も、全員、ファンなの！」'],['fx','flood'],['me','「…いつまで、続くんだろう、このお祭り」'],['c','「ずーっと、だよ。{K}が、いる限り」'],['fx','confetti'],['','笑い声と、太鼓の音が、夜まで、止まなかった。']]},
 world:{n:'世界旅行',ok:()=>S.ex&&S.ex.lv>=3,sc:[['bg','harem_sub_world'],['','——卒業から、十年後。{K}は、飛行機の、窓から、雲海を見ていた。'],['cast','a,b,c,d,e'],['a','「次の国は、どこ？」'],['b','「ここは、地図にも、載ってないんだって！」'],['c','「どこに行っても、{K}の、ファンがいるね」'],['fx','hearts'],['me','「みんなと一緒なら、世界の果てでも、怖くないよ」'],['d','「わたしたち、世界でいちばん、幸せな旅行団だね」'],['','翼の下に、新しい大陸が、見えてきた。']]},
 nation:{n:'国づくり',ok:()=>pcLv()>=5&&(S.fac||0)>=8,sc:[['bg','harem_sub_nation'],['','——卒業から、十五年後。小さな島に、新しい国が、誕生した。'],['cast','a,b,c,d,e,*50'],['','国名は、「柏木」。国民は、全員、{K}のファン。'],['a','「首相は、わたし！」'],['b','「外務大臣は、わたし！」'],['c','「国歌は、わたしが、作詞したよ！」'],['fx','quake'],['me','「…ぼく、国王って、柄じゃないんだけど」'],['d','「大丈夫。民が、みんな、{K}を、愛してるから」'],['fx','confetti'],['','国旗には、ハートと、桜の花が、描かれていた。']]},
 academy:{n:'柏木学園、伝説',ok:()=>(S.fac||0)>=10,sc:[['bg','harem_sub_academy'],['','——卒業から、二十年後。「柏木学園」の、校門の前。'],['cast','a,b,c,*20'],['','校門の銅像は、今日も、磨かれて、ぴかぴかだった。'],['a','「新入生、今年も、全員、{K}ファンだって」'],['b','「校歌も、{K}への、ラブソングだもんね」'],['fx','petals'],['me','「…伝説に、なっちゃったな」'],['c','「いいじゃない。みんな、今日も、笑ってる」'],['','春風が、桜の花びらを、運んでいった。']]},
 space:{n:'宇宙ハーレム',ok:()=>S.ex&&S.ex.lv>=4&&S.st.charm>=100,only:'ultra',sc:[['bg','harem_sub_space'],['','——卒業から、五十年後。宇宙ステーションの、窓の外には、青い地球。'],['cast','a,b,c,d,e,*40'],['','その居住区の壁には、「{K}と、{N}人の仲間たち」の、巨大な、壁画。'],['a','「地球だけじゃ、ファンが、足りなかったから！」'],['b','「宇宙人も、会員に、なってるよ！」'],['fx','flash'],['me','「…ぼくの人気、どこまで、行くんだろう」'],['c','「どこまでも、だよ。星の、向こう側まで」'],['fx','confetti'],['','星々が、祝福するように、静かに、瞬いていた。']]},
};
function subPick(kind){
 const keys=['space','nation','academy','world','wedding','festival'];
 for(const k of keys){const s=SUB_END[k];if(s.only&&s.only!==kind)continue;try{if(s.ok())return k}catch(e){}}
 return null;
}
function subSeen(add){
 let d={};try{d=JSON.parse(localStorage.getItem('sakuragaoka_subs')||'{}')||{}}catch(e){}
 if(add&&!d[add]){d[add]=1;try{localStorage.setItem('sakuragaoka_subs',JSON.stringify(d))}catch(e){}}
 return d;
}
const _endSceneMB=endScene;
endScene=function(set,kind,k,done){
 if((kind==='harem'||kind==='ultra')&&(set===EP_HAREM||set===EP_ULTRA)){
  const key=subPick(kind);
  return _endSceneMB(set,kind,k,()=>{
   if(!key)return done();
   const g=endGirls(kind,k);subSeen(key);S.endSub=key;cnt('subend');
   Novel.play({lines:[['',`── もうひとつの未来「${SUB_END[key].n}」 ──`]].concat(dailyApply({lines:SUB_END[key].sc},g,MA_ex()))},{h:g[0]&&g[0].id},()=>{save();done()});
  });
 }
 return _endSceneMB(set,kind,k,done);
};
const _endHtmlMB=endHtml;
endHtml=function(){
 const d=subSeen();let h=_endHtmlMB();
 h+=`<h2 style="margin:14px 0 4px;font-size:13px">もうひとつの未来(ハーレムの後日談) ${Object.keys(d).length} / ${Object.keys(SUB_END).length}</h2>`;
 h+=Object.keys(SUB_END).map(k=>d[k]?`<div class="ev"><b>${SUB_END[k].n}</b><span>見た</span></div>`:`<div class="ev"><b>？？？</b><span>${{wedding:'ハーレムエンドで見られる',festival:'完全究極エンドで見られる',world:'他校・街への拡張が「全国」以上',nation:'嫉妬ゼロ宣言(協定5段階)+専用スペース8つ',academy:'専用スペースを10個',space:'完全究極エンド+世界まで拡張'}[k]}</span></div>`).join('');
 return h;
};
/* ---- ⑩ コラージュ + 協定表示(右パネル) ---- */
(function(){
 if(typeof xhudHtml!=='function')return;
 const _x=xhudHtml;
 xhudHtml=function(){
  let h=_x();if(!h||!S||S.fin)return h;
  const top=MA_top(8);
  const col=top.length?`<div style="display:flex;margin-top:10px;padding-left:8px">${top.map((g,i)=>`<img src="img/${g.img}.jpg" alt="" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid var(--solid);margin-left:-8px;box-shadow:0 2px 8px rgba(0,0,0,.25);z-index:${9-i}" onerror="this.style.display='none'">`).join('')}<span style="margin-left:6px;font-size:.7rem;color:var(--sub);align-self:center">${top.length<8?'':'…ほか、みんな'}</span></div>`:'';
  const pc=pcLv(),pn=pc?PC_LV[pc-1].n:'',pl=pn?`<div style="margin-top:6px;font-size:.72rem;color:var(--sub);text-align:center">🤝 ${pn}　🏰 ${S.fac||0}/${FAC.length}</div>`:'';
  return h.replace(/<\/div>$/,col+pl+'</div>');
 };
})();
/* ---- 月次の流れ ---- */
const _keyEventMB=keyEvent;
keyEvent=function(done){_keyEventMB(()=>MA_chain([pcTurn,ogTurn,facTurn],done))};
