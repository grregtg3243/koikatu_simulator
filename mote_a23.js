/* ===== 第23弾A モテモテ強調 =====
   ① 歩くだけで注目される一言(毎週)  ② 学園新聞 + 好感度ランキング + SNSタイムライン(スマホ「新聞」)
   ③ 他校・街への拡張(魅力60/75/90/100で舞台が広がる)  ④ 女子のモノローグ集(スマホ「独白」)
   ⑤ 女子同士の取り合いイベント
   読込位置: index.html の最後(本体スクリプトの後)。 */
const MA_pk=a=>a[Math.floor(Math.random()*a.length)];
const MA_ex=()=>({N:typeof haremN==='function'?haremN():0,M:typeof fcCount==='function'?fcCount():0});
function MA_names(gs){const o={};'abcde'.split('').forEach((k,i)=>{if(gs[i])o[k]=gs[i].n.split(' ').join('')});if(gs[0])o.n=o.a;return o}
function MA_fmt(t,gs){return dailyFmt(t,MA_names(gs||[]),MA_ex())}
const MA_top=n=>avail().slice().sort((a,b)=>favOf(b)-favOf(a)).slice(0,n);
function MA_sc(){if(!S.xsc||S.xsc.t!==S.t)S.xsc={t:S.t,n:0};return S.xsc}

/* ① 歩くだけで注目される */
const WB_0=['廊下を歩いていたら、すれ違う女子が、全員、{K}のほうを振り向いた。','「あっ、{K}くんだ…！」と、ひそひそ声が、背中を追いかけてきた。','窓の外から、{n}が、{K}に気づいて、小さく手を振っていた。','靴箱を開けたら、ラブレターが三通、入っていた。','購買に行くと、いつの間にか、{K}の後ろに、列ができていた。','教室に入っただけで、空気が、ぱっと明るくなった。','落とした消しゴムを、四人が、同時に、拾おうとした。','階段の踊り場で、「おはよう！」の声が、上からも下からも、降ってきた。','ふと顔を上げると、どこかの窓で、女子たちが、手を振っている。','{n}が、{K}の机に、そっと、小さなお菓子を置いていった。'];
const WB_1=['校門から昇降口まで、{K}を見守る視線が、びっしり並んでいる。','通りかかるたび、「{K}、おはよう！」の声が、あちこちから、飛んできた。','女子たちの間で、「今日の{K}の目撃情報」が、共有されているらしい。','歩いているだけで、後ろから、くすくす笑い声と、拍手が追ってくる。','机の中は、手紙と、お菓子と、お守りで、ぎっしりだった。','{n}が、「今日は、わたしが、荷物持ちね」と、笑顔で、カバンを預かっていった。','廊下の角を曲がるたびに、誰かと、目が合う。みんな、嬉しそうに、微笑んだ。','昼休み、中庭に出ると、{K}を囲む輪が、自然と、できていた。','「ちょっと、{K}、こっち向いて！」と、写真をねだる声が、止まらない。','{n}と{b}が、{K}の左右を、そっと、確保した。'];
const WB_2=['歩くだけで、道が開く。女子たちが、自然と、両側に、並んでいた。','「{K}ー！」の歓声が、校舎じゅうに、こだました。','窓という窓から、手を振る女子たちの姿が、見える。','学園じゅうが、{K}のための、舞台のようだった。','誰も何も言わないのに、{K}の通り道に、花びらが、散らされていた。','「今日も、一日、お疲れさま！」と、全員が、声をそろえて、お見送り。','{n}が、「{K}の安全は、わたしたちが、守る！」と、胸を張った。','廊下の端から端まで、全員が、{K}のほうを向いて、手を振っている。','{K}が歩いた後には、ため息と、笑顔だけが、残った。','もはや、{K}が登場するだけで、全校が、お祭りになる。'];
function wbLine(){
 if(!S||S.fin||!S.t)return;
 const key=S.t*10+(S.ap||0);if(S.wbK===key||Math.random()>.55)return;S.wbK=key;
 const n=typeof haremN==='function'?haremN():0,pool=n>=15?WB_2:n>=3?WB_1:WB_0,gs=avail().slice().sort(()=>Math.random()-.5);
 if(!gs.length)return;
 NOTE=(NOTE?NOTE+'\n':'')+'💗 '+MA_fmt(MA_pk(pool),gs);
}
const _menuMA=menu;
menu=function(){try{wbLine()}catch(e){}return _menuMA.apply(this,arguments)};

/* ② 学園新聞 + ランキング + SNS */
const NP_HEAD=[
 ['【新聞部スクープ】転入生・{K}、早くも学園の話題の的に！','【特集】全女子が注目する男子、{K}の素顔に迫る','【今週の話題】{K}が歩くと、廊下が振り向く現象を調査','【取材】「{K}くんの隣、空いてますか？」女子の声'],
 ['【号外】{K}の周りに、女子の輪が！ 新聞部は見た','【特集】{K}を囲む「{N}人の仲間たち」とは','【調査】{K}と同じクラスになりたい女子、全校の9割','【独占】{n}さん語る「{K}くんと、毎日が楽しい」'],
 ['【特大号】{school}、いま「{K}時代」に突入','【特集】ハーレムは、{school}の新しい名物か？','【ランキング】好感度ベスト5、{n}さんが首位に','【潜入】{K}ファンクラブ、会員{M}人の熱気'],
 ['【歴史的】{school}生徒の約半数が{K}のファンに','【特集】{K}、他校でも話題 他校の女子、校門に集結','【号外】{N}人の女子が、{K}のために、一致団結','【緊急】「{K}様」呼びが、校内で定着しつつある'],
 ['【速報】{school}、「{K}仕様」に校則改定へ','【世界ニュース】{K}の噂、海を越える','【記念号】{N}人のハーレム、学園の誇りに','【特別号】{K}を知らない人が、もはや、世界に存在しない件'],
];
const NP_EXT=['','近隣の学校の女子たちが、{K}を一目見ようと、放課後の校門に集まっている。','市内の複数の高校で、「{K}ファンクラブ支部」が、次々と発足している。','全国ニュースで、{K}の特集が組まれ、学園には取材陣が殺到した。','海外の新聞でも、{K}が紹介され、「Kashiwagi」の名が世界に広まった。'];
const NP_SNS_U=['@sakura_girl','@ひなた推し','@柏木くん応援団','@放課後の恋愛家','@名もなきファン','@newsclub_公式','@他校のあの子','@街のお姉さん','@毎日{K}観測','@恋する乙女bot','@{K}と同じクラス希望','@学食のおばちゃん'];
const NP_SNS_T=['今日、{K}と目が合った…！ 今日は、もう、何も要らない。','{K}の隣の席、争奪戦が激しすぎて、抽選になった。','{n}ちゃんが、{K}と話してて、うらやましい…でも、二人とも、好き！','{K}のこと考えてたら、授業、ぜんぜん聞いてなかった。','#柏木くん最高 #今日も尊い #恋に恋する毎日','{K}の笑顔、国宝だと思う。','今日の{K}、髪型ちょっと違った。気づいたのは、わたしだけ…？','{K}に差し入れ、渡せた！ 手、震えた！','ファンクラブ、人数がすごいことに。会員番号、ぎりぎり二桁だった！','{K}、{n}ちゃんと一緒に歩いてた。絵になりすぎて、泣いた。','これが噂の{K}…？ 想像より、100倍、素敵だった。','今日も平和。{K}が、みんなの笑顔の理由。','他校だけど、{K}に会いに、また来ちゃった。','{K}のサイン、もらえた！ 家宝にします。','{K}の好きなお菓子、リサーチ完了。明日、作戦決行。','{K}の隣にいる{n}ちゃん、幸せそう。わたしも、がんばる。','今日、街で{K}を見かけた！ 心臓、止まるかと思った。','「{K}くんは、みんなのものだよ」って、友だちが言ってた。名言。','{K}の話題で、学年を超えて、みんな、友だちになれた。','{K}という存在に、感謝。毎朝、学校が、楽しい。'];
function npInit(){if(!S.np)S.np={is:[],prev:{}};return S.np}
function npTurn(){
 if(!S||S.fin||!S.t)return;const np=npInit();if(np.last===S.t)return;
 const all=avail();if(all.length<1)return;
 np.last=S.t;
 const n=typeof haremN==='function'?haremN():0,st=n>=30?4:n>=15?3:n>=6?2:n>=2?1:0;
 const top=MA_top(5),gs=top.length?top:all.slice(0,1);
 const rank=top.map((h,i)=>{const p=np.prev[h.id];return {id:h.id,f:favOf(h),d:p==null?0:p-i}});
 np.prev={};top.forEach((h,i)=>np.prev[h.id]=i);
 const head=MA_fmt(MA_pk(NP_HEAD[st]),gs).replace(/\{school\}/g,GAME.school||'');
 const sns=[];for(let i=0;i<7;i++){const g2=all.slice().sort(()=>Math.random()-.5);sns.push({u:MA_fmt(MA_pk(NP_SNS_U),g2),t:MA_fmt(MA_pk(NP_SNS_T),g2),l:R(3,120)+Math.floor(favOf(g2[0]||{})*3)})}
 const ex=(S.ex&&S.ex.lv)||0;
 np.is.unshift({t:S.t,head,rank,sns,ext:ex?MA_fmt(NP_EXT[ex],gs):''});
 if(np.is.length>24)np.is.length=24;
 cnt('news');
 NOTE=(NOTE?NOTE+'\n':'')+`【学園新聞】${head.replace(/^【[^】]*】/,'')}(スマホの「新聞」で読めます)`;
}
function npHtml(){
 const np=npInit();if(!np.is.length)return '<p class="hint">学園新聞は、毎月、発行されます。(まだ、第1号を準備中です)</p>';
 const one=(is,full)=>{
  let h=`<div class="ev" style="display:block;border:2px double var(--gold);margin:8px 0;padding:8px 10px;background:rgba(255,211,110,.08)"><div style="font:700 .7rem 'Shippori Mincho',serif;letter-spacing:.2em;color:var(--sub);text-align:center">桜ヶ丘タイムズ　${Math.floor((is.t-1)/12)+1}年目 ${((is.t-1)%12)+1}月号</div><div style="font:700 1.02rem 'Shippori Mincho',serif;margin:6px 0">${is.head}</div>`;
  if(is.ext)h+=`<div style="font-size:.8rem;color:var(--sub);margin-bottom:6px">🌏 ${is.ext}</div>`;
  if(full){
   h+=`<div style="font-weight:700;font-size:.8rem;margin:6px 0 2px">💗 好感度ランキング</div>`+is.rank.map((r,i)=>{const g=H(r.id);return g?`<div style="display:flex;align-items:center;gap:8px;font-size:.82rem;padding:2px 0"><b style="width:1.6em">${i+1}位</b><span style="flex:1">${g.n.split(' ').join('')}</span><span>${r.f}</span><span style="width:3em;text-align:right;color:${r.d>0?'#16a34a':r.d<0?'#dc2626':'var(--sub)'}">${r.d>0?'↑'+r.d:r.d<0?'↓'+(-r.d):'→'}</span></div>`:''}).join('');
   h+=`<div style="font-weight:700;font-size:.8rem;margin:8px 0 2px">📱 みんなの声(SNS)</div>`+is.sns.map(s=>`<div style="font-size:.78rem;padding:3px 0;border-top:1px dashed var(--line)"><b>${s.u}</b>　${s.t}<span style="color:var(--sub)">　♡${s.l}</span></div>`).join('');
  }
  return h+'</div>';
 };
 return `<p class="hint">学園新聞(${np.is.length}号)。好感度ランキングと、みんなのSNSの声が載っています。</p>`+one(np.is[0],true)+np.is.slice(1,9).map(i=>`<details><summary style="font-size:.82rem;cursor:pointer;padding:3px 0">${Math.floor((i.t-1)/12)+1}年目${((i.t-1)%12)+1}月号 ${i.head.replace(/^【[^】]*】/,'').slice(0,24)}…</summary>${one(i,true)}</details>`).join('');
}

/* ③ 他校・街への拡張 */
const EX_LV=[[60,'近隣校','harem_ext_near'],[75,'市内','harem_ext_city'],[90,'全国','harem_ext_nation'],[100,'世界','harem_ext_world']];
const EX_UP=[
 [['bg','harem_ext_near'],['','放課後。校門の外が、やけにざわついていた。'],['cast','a,b,c,*12'],['','見知らぬ制服の女子たちが、校門の前に、ずらり。手には、うちわと花束。'],['a','「あの子たち、他校の…！？」'],['b','「{K}を、一目見に来たんだって！」'],['fx','hearts'],['me','「…えっ、ぼくを？」'],['c','「{K}、もう、{school}だけの人じゃ、ないんだね」'],['','舞台は、校内から、近隣の学校へと、広がりはじめた。']],
 [['bg','harem_ext_city'],['','その日の朝刊の一面は、{K}だった。'],['cast','a,b,c,*20'],['a','「市内の高校の女子が、ほとんど、{K}のファンになってるって！」'],['b','「ファンクラブの支部が、あちこちに、できてるよ！」'],['fx','flood'],['me','「…街じゅうに、広がってるの？」'],['c','「うん。駅前の電光掲示板にも、{K}の名前が、出てた」'],['','街のあちこちで、{K}の名前が、笑顔と一緒に、語られていた。']],
 [['bg','harem_ext_nation'],['','朝、校門の前には、テレビ局の中継車が、何台も止まっていた。'],['cast','a,b,c,*30'],['a','「全国ニュースで、{K}の特集が、組まれたの！」'],['b','「取材、殺到してるよ！ どうする？」'],['fx','confetti'],['me','「…いつの間に、そんなことに」'],['c','「みんなが、{K}の魅力に、気づいちゃったんだよ」'],['','{K}の名前は、いまや、日本じゅうの、女子の間で、知られていた。']],
 [['bg','harem_ext_world'],['','空港の到着ロビーは、見たこともない、人の波だった。'],['cast','a,b,c,*50'],['a','「海外からも、ファンの女の子が、会いに来てるんだって！」'],['b','「Kashiwagi! Kashiwagi! って、叫んでる！」'],['fx','flash'],['me','「…世界規模？ ぼく、普通の高校生なのに」'],['c','「もう、{K}は、世界の{K}だよ」'],['fx','confetti'],['','{K}を取り巻く物語は、ついに、国境を、超えた。']],
];
const EX_EV=[
 // lv1 近隣校
 [[['bg','harem_ext_near'],['','他校の生徒会長が、お菓子の山を持って、{school}を訪れた。'],['cast','a,b'],['a','「…誰？ あの、きれいな人」'],['','「{K}さんに、ぜひ、お礼を言いたくて」と、深々と頭を下げる。'],['b','「{K}、また、新しい子を、虜にしちゃったね」'],['me','「ぼくは、何も、してないよ…」']],
  [['bg','harem_ext_near'],['','隣の学校の文化祭に、特別ゲストとして、{K}が招かれた。'],['cast','a,b,c,*15'],['','校門には、「ようこそ、{K}さん」の、横断幕。'],['a','「す、すごい歓迎…！」'],['me','「…緊張するな」'],['fx','hearts'],['b','「{K}なら、大丈夫！ わたしたちも、ついてるよ」']],
  [['bg','harem_ext_near'],['','登下校の途中、他校の女子たちが、{K}を待ち伏せしていた。'],['cast','a,b'],['','「あの、これ、受け取ってください！」「サインください！」'],['a','「ちょっと、順番に並んで！」'],['b','「わたしたちが、整理券、配ります！」'],['','気がつくと、親衛隊の整理券が、近所の名物に、なっていた。']],
  [['bg','harem_ext_near'],['','バス停で、見知らぬ他校の女子が、{K}に、こっそり、手紙を差し出した。'],['cast','a'],['','「あの、読んでください…！」と、走り去っていく。'],['a','「ふふ、また、新しいファンだね」'],['me','「…手紙、全部、ちゃんと、読むよ」']]],
 // lv2 市内
 [[['bg','harem_ext_city'],['','駅前の大型ビジョンに、{K}の写真が、映し出されていた。'],['cast','a,b,c,*20'],['a','「ファンクラブが、広告を、出したんだって！」'],['b','「通りかかる人、みんな、立ち止まってる！」'],['fx','flood'],['me','「…恥ずかしいから、消してほしい」'],['c','「だめー！ 街の名物だよ！」']],
  [['bg','harem_ext_city'],['','商店街の福引きの一等は、「{K}との、一日デート券」だった。'],['cast','a,b,c,*25'],['','行列は、商店街の端から、端まで、続いている。'],['a','「だ、誰が、そんな賞品を…！」'],['b','「わたしたちじゃ、ないよ！？」'],['me','「…当たった人、幸せだね」'],['c','「当たった人は、全員が、{K}の、お友だちです！」']],
  [['bg','harem_ext_city'],['','街を歩いていると、お姉さんたちが、次々と、振り向いた。'],['cast','a,b'],['','「あの子、噂の…！」「かっこいい…！」'],['a','「年上まで、虜に…！？」'],['b','「{K}、ガードしなきゃ！」'],['fx','hearts']],
  [['bg','harem_ext_city'],['','芸能事務所のスカウトが、名刺を持って、校門に現れた。'],['cast','a,b,c'],['','「ぜひ、うちの、事務所で…！」'],['a','「だめーっ！ {K}は、わたしたちの、{K}です！」'],['b','「スカウトは、お断りします！」'],['me','「あはは…ごめんなさい。ぼくは、ここがいいです」']]],
 // lv3 全国
 [[['bg','harem_ext_nation'],['','全国ネットの朝の番組に、{K}が、ゲスト出演することになった。'],['cast','a,b,c,*30'],['','スタジオの観覧席は、全員、{K}のファンだった。'],['a','「がんばって、{K}！」'],['fx','confetti'],['me','「…頭が、真っ白だ」'],['b','「大丈夫、みんな、画面の前で、応援してる！」']],
  [['bg','harem_ext_nation'],['','雑誌の表紙に、「全国の女子が選ぶ、理想の男子No.1」の文字。'],['cast','a,b,c'],['','表紙を飾っているのは、照れくさそうに、笑う{K}。'],['a','「わあ、{K}、すごい！」'],['b','「全国一位だよ！ 優勝だよ！」'],['me','「…学園のみんなが、一番だけど」']],
  [['bg','harem_ext_nation'],['','新幹線のホームに、{K}を見送る、各地のファンが、集まっていた。'],['cast','a,b,c,*40'],['','「ありがとう、{K}さーん！」の声が、ホームじゅうに、響く。'],['fx','petals'],['a','「全国ツアーみたいだね」'],['me','「…ぼく、何もしてないんだけどな」']],
  [['bg','harem_ext_nation'],['','県大会の応援席で、{K}は、他校の応援団に、囲まれていた。'],['cast','a,b,c,*25'],['','「{K}さん、うちの学校も、応援してください！」'],['a','「じゃあ、みんなで、応援団になろう！」'],['fx','hearts'],['b','「敵も味方も、全員、{K}のファンだね」']]],
 // lv4 世界
 [[['bg','harem_ext_world'],['','国連本部で、{K}が、「世界平和のために、ハーレムを」という、謎の演説をすることに。'],['cast','a,b,c,*40'],['','会場は、拍手の嵐だった。'],['fx','confetti'],['me','「…ぼく、何を言ってるんだろう」'],['a','「完璧な、スピーチだったよ！」']],
  [['bg','harem_ext_world'],['','パリの街角で、{K}は、現地の女の子たちに、囲まれていた。'],['cast','a,b,c,*30'],['','「ムッシュ、サイン、プリーズ！」'],['a','「世界中に、ファンが、いるんだね…」'],['b','「通訳は、わたしに、まかせて！」'],['fx','hearts']],
  [['bg','harem_ext_world'],['','ニューヨークの電光掲示板に、でかでかと、{K}の顔が。'],['cast','a,b,c'],['a','「ほんとに、世界中が、{K}で、いっぱい！」'],['b','「そろそろ、世界征服、できちゃうね」'],['me','「しないよ！？」']],
  [['bg','harem_ext_world'],['','どこかの国の王女様が、お忍びで、{school}を訪れた。'],['cast','a,b,c,*12'],['','「{K}さまに、お会いしたくて…」'],['a','「お、王女様まで…！？」'],['fx','flash'],['me','「…どうぞ、ごゆっくり」']]],
];
function exLv(){const ch=S&&S.st?S.st.charm:0;let l=0;EX_LV.forEach(([m],i)=>{if(ch>=m)l=i+1});return l}
function exTurn(done){
 if(!S||S.fin||!S.t)return done();
 if(!S.ex)S.ex={lv:0,seen:{}};const cap=MA_sc();if(cap.n>=2)return done();
 const L=exLv(),top=MA_top(5);if(top.length<2)return done();
 if(L>S.ex.lv){
  const lv=S.ex.lv;S.ex.lv=lv+1;cap.n++;cnt('exlv');
  NOTE=(NOTE?NOTE+'\n':'')+`【舞台拡大】{K}の人気は、「${EX_LV[lv][1]}」まで広がった!`.replace(/\{K\}/g,GAME.nick);
  top.forEach(h=>add(h.id,2));
  return Novel.play({lines:dailyApply({lines:EX_UP[lv]},top,MA_ex())},{h:top[0].id},()=>{save();done()});
 }
 if(L<1||Math.random()>.4)return done();
 const lv=MA_pk(Array.from({length:L},(_,i)=>i)),sc=MA_pk(EX_EV[lv]);
 cap.n++;cnt('exev');top.slice(0,3).forEach(h=>add(h.id,1));S.money+=15000*(lv+1);
 Novel.play({lines:dailyApply({lines:sc},top,MA_ex())},{h:top[0].id},()=>{save();done()});
}

/* ④ 女子のモノローグ */
const MN_T=[
 ['最近、{K}のことを、目で追っちゃう。…見てるだけで、いいの。','今日、{K}と、ちょっとだけ、話せた。それだけで、一日が、きらきらした。','{K}の笑顔が、頭から、離れない。どうしよう。','話しかけたいのに、勇気が出ない。明日こそ、って、毎日、思ってる。','{K}の隣に、座れたらいいな。…ううん、近くにいるだけでも。','友だちが、{K}の話ばかりしてる。わたしも、同じ、気持ち。','廊下ですれ違った。いい匂いが、した。…変態じゃ、ないよ！','{K}のこと、もっと知りたい。好きな食べ物とか、好きな色とか。','夢に、{K}が出てきた。目が覚めて、ちょっと、泣きそうだった。','学園に来るのが、毎日、楽しみになった。理由は、ひとつだけ。'],
 ['今日も、{K}に会えた。それだけで、ごはんが、おいしい。','{K}が、他の子と話してると、胸が、ちくっとする。でも、それも含めて、{K}が好き。','「みんなで、{K}を、好きでいよう」って、決めた。それで、幸せだと思う。','{K}の隣にいると、世界が、やさしくなる。','毎晩、{K}のことを、考えて、眠る。朝起きると、また、会える。','{K}にもらった言葉を、ノートに書き留めてる。宝物だから。','{K}の声が、聞きたくて、電話番号を、何度も、見つめてた。','今日は、{K}と、手が触れた。…しばらく、手が洗えない。','{K}が笑うと、わたしまで、嬉しくなる。不思議だね。','わたし、{K}がいない毎日は、もう、想像できない。'],
 ['{K}のためなら、なんでも、できる。…たぶん、それは、もう、依存。でも、いいの。','朝起きて、最初に考えるのは、{K}。夜、最後に思うのも、{K}。','{K}の隣が、わたしの居場所。ここだけが、ほんとうの、わたし。','{K}に会えない日は、時計が止まったみたい。','他の誰かと笑ってても、{K}が幸せなら、それでいい。…でも、本当は、ちょっとだけ、さみしい。','{K}が、わたしの名前を、呼んでくれた。一生、忘れない。','「好き」って言葉じゃ、足りない。もっと、大きな言葉を、探してる。','{K}のいない世界なんて、いらない。…なんて、言ったら、重いかな。','{K}の幸せが、わたしの幸せ。それだけが、ほんとう。','来世でも、また、{K}に恋をするって、もう決めてる。'],
];
function mnTurn(){
 if(!S||S.fin||!S.t)return;if(!S.mn)S.mn=[];if(S.mnT===S.t)return;S.mnT=S.t;
 const gs=avail().filter(h=>favOf(h)>=30);if(!gs.length)return;
 const n=Math.min(5,1+Math.floor(gs.length/4));
 for(let i=0;i<n;i++){const h=MA_pk(gs),f=favOf(h),tier=f>=85?2:f>=60?1:0;S.mn.unshift({id:h.id,t:S.t,x:dailyFmt(MA_pk(MN_T[tier]),{},{})})}
 if(S.mn.length>80)S.mn.length=80;cnt('mono');
}
function mnHtml(){
 const l=S.mn||[];if(!l.length)return '<p class="hint">好感度30以上の女子の、心の声が、毎月、ここに、たまっていきます。</p>';
 return `<p class="hint">女子たちの、ひとりごと(${l.length}件)。好感度が高いほど、深くなっていきます。</p>`+l.slice(0,40).map(m=>{const g=H(m.id);return g?`<div class="ev" style="display:flex;gap:8px;align-items:flex-start;border-left:3px solid #f43f5e;margin:6px 0;padding:6px 10px;background:rgba(244,63,94,.06)"><img src="img/${g.img}.jpg" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover" onerror="this.style.display='none'"><div><b style="font-size:.8rem">${g.n.split(' ').join('')}</b><span style="color:var(--sub);font-size:.7rem">　${Math.floor((m.t-1)/12)+1}年目${((m.t-1)%12)+1}月</span><div style="font-size:.84rem;line-height:1.6">${m.x}</div></div></div>`:''}).join('');
}

/* ⑤ 女子同士の取り合い */
const TG_SIT=[
 ['今日は、どっちが、{K}と一緒に帰るの？','わたしが、先に、約束したもん！','…じゃあ、じゃんけん？'],
 ['{K}の隣の席、どっちが、座るの？','わたし、朝から、並んでたの！','わたしだって！ 昨日から、予約してた！'],
 ['{K}のお弁当、どっちが、食べさせるの？','今日は、わたしの、あーんの日！','そんなの、決まってないよ！'],
 ['{K}の腕、どっちが、組むの？','右は、わたしの！','じゃあ、左は、わたし！'],
 ['{K}の写真、どっちが、待ち受けにするの？','わたしの方が、よく撮れてる！','わたしのは、笑顔が、ばっちり！'],
 ['{K}への差し入れ、どっちが、先に渡すの？','わたしは、昨夜から、仕込んだの！','わたしなんて、三日前から！'],
 ['{K}の隣で、日直、どっちが、やるの？','わたし、ずっと、立候補してた！','日直表、見て！ 今日は、わたし！'],
 ['{K}と、どっちが、先に、手をつなぐの？','わたしが、先に、気づいた！','じゃあ、同時に、せーの！'],
 ['{K}の誕生日プレゼント、どっちが、豪華かな？','絶対、わたしの、が、一番！','わたしのは、心がこもってるもん！'],
 ['{K}の、一番の、理解者は、どっち？','わたしのほうが、付き合い、長いもん！','長さより、深さだよ！'],
 ['{K}の、膝枕、どっちが、先？','わたし、ずっと、順番待ち、してた！','わたしだって、並んでた！'],
 ['{K}と、写真、どっちが、真ん中に、写るの？','もちろん、わたし！','ずるい、わたし！'],
];
const TG_RES=['『じゃあ、三人で！』と、{K}が提案すると、二人は、ぱっと笑顔になった。','『順番にね』と、{K}が笑うと、「約束だよ！」と、二人は、小指を差し出した。','二人は、にらみ合ったまま、くすっと笑い出した。「結局、{K}が、好きなだけだね」','「…ごめん、ちょっと、熱くなっちゃった」「わたしも」と、二人は、肩を寄せ合った。','「じゃあ、今日は、半分こ！」と、二人は、{K}の両側に、ぴたりと並んだ。','「結局、みんなで、一緒がいちばん、だよね」と、{b}が、{a}に、笑いかけた。'];
function tgTurn(done){
 if(!S||S.fin||!S.t)return done();const cap=MA_sc();
 if(cap.n>=2||(typeof haremN==='function'&&haremN()<2)||Math.random()>.45)return done();
 const top=MA_top(6);if(top.length<2)return done();
 const gs=top.slice().sort(()=>Math.random()-.5).slice(0,2),s=MA_pk(TG_SIT);
 const L=[['bg','harem_tug'],['','放課後の教室。{a}と{b}が、{K}の前で、向かい合っていた。'],['cast','a,b'],['a','「'+s[0]+'」'],['b','「'+s[1]+'」'],['a','「'+s[2]+'」'],['','二人の視線が、{K}に、同時に、向けられた。'],['me',MA_pk(['「えっと…ぼくは、どっちも、大事だよ」','「け、けんかは、しないで」','「…どっちも、選べないよ」','「みんなで、仲よく、しよう」'])],['',MA_pk(TG_RES)],['fx','hearts']];
 cap.n++;cnt('tug');gs.forEach(h=>add(h.id,2));
 Novel.play({lines:dailyApply({lines:L},gs,MA_ex())},{h:gs[0].id},()=>{save();done()});
}

/* 月次の流れに差し込む */
function MA_chain(fs,done){const f=fs.shift();if(!f)return done();f(()=>MA_chain(fs,done))}
const _keyEventMA=keyEvent;
keyEvent=function(done){
 try{npTurn();mnTurn()}catch(e){}
 _keyEventMA(()=>MA_chain([exTurn,tgTurn],done));
};
/* 愛のメッセージ増量 */
if(typeof LOVE_MSG!=='undefined')['{K}、今日も大好き！','{K}のこと考えてたら、授業、終わってた！','{K}、今日の髪型、最高だった！','{K}の隣、取っちゃった♡','{K}の写真、待ち受けにしたよ！','{K}、お昼、一緒に食べよ？','{K}、今夜は、通話しよう？','{K}が、世界で、いちばん、かっこいい！','{K}、ぎゅってしていい？','{K}の声、ずっと、聞いていたいな。','{K}、わたしだけ見てて…なんて、うそ。みんなで、見てて！','{K}のおかげで、毎日が、虹色！','{K}、いつもありがとう！ 大好き！','{K}、今日も、尊い…。','{K}、会いたい。もう、会ってるけど、会いたい。','{K}、手、つなぎたいな。','{K}、わたしの名前、呼んで？','{K}のこと、一生、推します！','{K}、今日のお弁当、自信作だよ！','{K}、明日も、会えるよね？'].forEach(x=>LOVE_MSG.push(x));
