/* ===== エンディング強化(index.html の最後=インラインのスクリプトより後に読み込む) =====
   ■ 流れ(卒業式のあと、ここまで長くなりました)
       ① 卒業式の朝 ……… 3年間の思い出ダイジェスト(会いに行った回数・自撮り・手紙…が、実際の数字で語られる)
       ② 校門の見送り …… 結末ごとの別れの場面(ハーレムが大きいほど、人数と演出が派手に)
       ③ 第二ボタン ……… 従来どおり(daily.js の buttonScene)
       ④ 結末の本編 ……… 恋人 / 友だち / ひとり / ハーレム(従来どおり) + 新しい「完全究極ハーレムエンド」
       ⑤ エピローグ「それから」… 10年後の場面(結末ごとに3〜4種からランダム)
       ⑥ 結果画面 ………… 評価(S〜D・SS)・思い出の数字・称号・結末コレクション
   ■ 完全究極ハーレムエンド … ハーレムエンドの条件(好感度75以上が HAREM_END_N 人)に加えて、魅力が100以上。
   ■ 台詞を足すとき … GR_*(別れの場面)/ EP_*(エピローグ)に、場面を1つ足します。場面は {lines:[…]} で、話者は a〜c(その場にいる女子。恋人エンドは a が恋人)/ 'me'(柏木くん)/ ''(地の文)。{K}{P}{school}{N}(ハーレム人数){M}(ファン数) が使えます。★行の最後の「,」を忘れずに。 */

const END_ULTRA_CHARM=100;
const END_RANKS=[[6000,'S','学園の伝説'],[3600,'A','みんなの人気者'],[2200,'B','愛された3年間'],[1000,'C','ふつうに楽しい3年間'],[0,'D','これからの3年間']];

/* ---------- ① 卒業式の朝(思い出ダイジェスト) ---------- */
function recapLines(){
 const c=k=>(typeof cn==='function'?cn(k):0),L=[];
 const add=(n,t)=>{if(n>0)L.push(['',t.replace('{n}',n)])};
 L.push(['','三年間のことが、頭の中を、ゆっくりと、めぐっていく。']);
 add(c('meet'),'会いに行った回数、{n}回。');
 add(c('date'),'デートの回数、{n}回。');
 add(c('act_baito'),'バイトに励んだ回数、{n}回。');
 add((c('bigev')||0)+(c('keyev')||0),'ハーレムの名場面、{n}回。');
 add(c('selfie'),'撮った自撮り、{n}枚。');
 add(c('letter'),'読んだ手紙、{n}通。');
 add(c('mission'),'達成した月間ミッション、{n}回。');
 const fc=typeof fcCount==='function'?fcCount():0;
 if(fc>0)L.push(['',`ファンクラブの会員は、いつのまにか、${fc}人。`]);
 if(typeof rankNow==='function'&&rankIdx()>=2)L.push(['',`気づけば、「${rankNow().n}」と呼ばれるようになっていた。`]);
 if(L.length<3)L.push(['','派手なことは、あまりなかったけれど、毎日が、ちゃんと、ここにあった。']);
 return L;
}

/* ---------- ② 別れの場面 ---------- */
const GR_LOVE=[
 {lines:[['bg',''],['','卒業式。校歌の最後のフレーズが、体育館に、ゆっくりと消えていく。'],['cast','a,b,c'],['b','「{K}、卒業、おめでとう！」'],['c','「…ほら、{a}ちゃん。言いたいこと、あるんでしょ？」'],['a','「う、うん。…{K}くん、あの、ちょっと、校門まで、一緒に、いいかな」'],['','校門までの、短い道。{a}は、何度も、言葉を探しては、飲みこんだ。'],['a','「…三年間、ずっと、そばで、見てきたの。{K}くんの、毎日を」'],['me','「…ぼくも、{a}の笑顔に、何回、助けられたか、わからないよ」'],['','桜のつぼみが、ふくらみはじめた並木道。二人の歩幅は、いつのまにか、ぴったり重なっていた。']]},
 {lines:[['bg',''],['','式のあと、教室。黒板には、クラス全員のメッセージが書かれていた。'],['cast','a,b,c'],['b','「{K}、いままで、ありがとう。これ、みんなから」'],['','渡された寄せ書きの隅っこに、{a}の、小さな字があった。『ずっと、だいすき』'],['c','「…見ちゃった。ふふ」'],['a','「み、見ないでー！」'],['','顔を真っ赤にした{a}が、{K}の袖を、そっと、つまんだ。'],['a','「…一緒に、帰ろう？」']]},
 {lines:[['bg',''],['','卒業式の日の、雨上がり。校庭の水たまりに、青空が、映っていた。'],['cast','a,b,c'],['c','「じゃあ、わたしたちは、先に、行くね」'],['b','「{a}ちゃん、がんばって！」'],['','二人が、手を振って、去っていく。残されたのは、{K}と{a}、そして、静かな校庭。'],['a','「…あのね。わたし、今日、ちゃんと、言うって、決めてたの」'],['me','「うん。聞くよ」'],['a','「{K}くんのことが、すき。これからも、ずっと、隣に、いたい」'],['','雨上がりの風が、二人の間を、やさしく、通り抜けていった。']]}
];
const GR_FRIEND=[
 {lines:[['bg',''],['','卒業式。体育館の外に出ると、友だちたちが、そろって、待っていた。'],['cast','a,b,c'],['a','「{K}くーん！ こっち、こっち！」'],['b','「みんなで、写真、撮ろうよ！」'],['','集合写真。シャッターの瞬間、誰かが、{K}の肩に、手をのせた。'],['c','「卒業しても、友だちだからね！」'],['me','「当たり前だよ。ずっと、友だちだ」'],['','笑顔でいっぱいの、最後の一枚。この写真は、きっと、一生の宝物になる。']]},
 {lines:[['bg',''],['','最後のホームルーム。先生の話が終わると、教室が、わっと、にぎやかになった。'],['cast','a,b,c'],['a','「ねえ、卒業旅行、行こうよ！ みんなで！」'],['b','「いいね！ 温泉とか！」'],['c','「{K}くんも、来るでしょ？」'],['me','「もちろん。みんなと一緒なら、どこでも」'],['','計画の話は、夕暮れまで、続いた。三年間の終わりは、新しい約束のはじまりだった。']]},
 {lines:[['bg',''],['','校門の前。桜の枝に、つぼみがたくさんついていた。'],['cast','a,b,c'],['b','「もう、毎日、会えなくなるんだね」'],['a','「でも、連絡先は、ちゃんと、知ってるし！」'],['c','「…それでも、ちょっと、さびしいな」'],['me','「ぼくも。…でも、また、すぐ、会おう」'],['','手を振って、別れる。振り返ると、みんなも、まだ、手を振っていた。']]}
];
const GR_SOLO=[
 {lines:[['bg',''],['','卒業式。静かに、式は終わった。'],['','校門を出ようとしたとき、ふと、校舎を、振り返る。'],['','教室の窓、渡り廊下、中庭のベンチ。一つひとつに、三年間の、思い出が、あった。'],['me','（…ひとりの時間も、悪くなかった。でも、もう少し、誰かと、話せていたら）'],['','春の風が、制服の襟を、ふわりと揺らした。']]},
 {lines:[['bg',''],['','卒業式のあと。誰もいなくなった教室で、{K}は、自分の机を、そっとなでた。'],['','三年間、毎日、座った席。何も、刻まれてはいないけれど、確かに、ここにいた。'],['me','（…ありがとう。ぼくの、三年間）'],['','廊下から、遠くの笑い声が、聞こえてくる。新しい場所でも、きっと、出会いは、ある。']]},
 {lines:[['bg',''],['','校門の桜は、まだ、つぼみ。{K}は、一人、坂道を、下りはじめた。'],['','途中、振り返ると、校舎の屋上に、誰かの影が、見えた気がした。'],['me','（…手を、振ってくれた？）'],['','気のせいかもしれない。けれど、{K}は、大きく、手を振り返した。']]}
];
const GR_HAREM=[
 {lines:[['bg',''],['','卒業式の朝。校門の前には、昨日までなかった、巨大な、アーチが立っていた。'],['cast','a,b,c,*20'],['a','「{K}くん、卒業、おめでとう！」'],['b','「全校の女子で、作ったの！ 花のアーチだよ！」'],['fx','petals'],['','アーチの下を、{K}は、ゆっくりと、歩く。両側から、花びらと、拍手と、泣き声と、笑い声。'],['c','「ありがとう、{K}くん！ 大好きだよー！」'],['me','「ぼくこそ、ありがとう。{N}人もの、仲間に会えて、本当に、よかった」'],['','アーチの先で、{K}は、振り返って、深く、一礼した。']]},
 {lines:[['bg',''],['','最後の昼休み。屋上に呼び出された{K}の前に、女子たちが、ずらりと、並んでいた。'],['cast','a,b,c,*15'],['fx','confetti'],['a','「卒業式の、予行練習じゃなくて、わたしたちの、お別れ会、やるよ！」'],['b','「ひとりずつ、メッセージを、読みます！」'],['','代わる代わる、女子たちが、手紙を読み上げる。笑いあり、涙あり、ちょっと、赤面もの。'],['me','（…こんなに、愛されて、ぼくは、本当に、幸せ者だ）'],['c','「最後は、全員で！ せーの！」'],['','「「「ありがとう、{K}くん！」」」'],['fx','hearts']]},
 {lines:[['bg',''],['','式が終わった瞬間、体育館の照明が、落ちた。'],['cast','a,b,c,*25'],['','ステージに、スポットライトが、ひとつ。そこに立っていたのは、{a}だった。'],['a','「{K}くん。わたしたち、歌を、用意しました」'],['fx','petals'],['','女子たちの、合唱が、体育館に、響く。それは、三年間の、すべての季節を、歌った歌だった。'],['me','「…これ、ぼくのために？」'],['b','「ううん、みんなの、気持ちを、一曲にしたの」'],['','歌い終わったとき、{K}の目からは、もう、涙が、こぼれていた。']]}
];
const GR_ULTRA=[
 {lines:[['bg','harem_ultra_mikoshi'],['','卒業式の朝。校門の前に、あの、きらびやかな、神輿が、再び、置かれていた。'],['cast','a,b,c,*60'],['a','「{K}くん。最後のパレードです！」'],['fx','flood'],['','「「「わっしょい！ わっしょい！」」」'],['','数え切れない女子が、{K}を、神輿ごと、持ち上げた。校庭、校舎、そして、校門へ。'],['','道の両側には、街じゅうの人が、集まっていた。パン屋のおじさんも、通りすがりの子どもたちも、大きく手を振っている。'],['fx','confetti'],['b','「{K}くん、見て！ みんな、{K}くんに、ありがとうを、言いに来たの！」'],['me','「…こんなにも、たくさんの人が」'],['c','「{K}くんが、毎日、笑ってくれたからだよ」'],['','神輿の上から見た景色は、どこまでも、笑顔だった。']]},
 {lines:[['bg','harem_ultra_aerial'],['','卒業式のあと、屋上から、校庭を見下ろした。'],['cast','a,b,c'],['','校庭いっぱいに、赤いジャージの女子たちが、整列している。…そして、動き出す。'],['cast','a,b,c,*80'],['fx','ring'],['hide',''],['','赤い群れは、巨大な、ハートの形になった。その真ん中に、白い、文字。'],['','『{K}くん、卒業 おめでとう。そして、ありがとう』'],['fx','flood'],['me','「…ぼくの方こそ、ありがとう」'],['','空には、無数の、ドローンが、きらきらと、輝いていた。']]},
 {lines:[['bg','harem_ultra_finale'],['','日が暮れて、卒業式の夜。夜空に、最初の花火が、上がった。'],['cast','a,b,c,*60'],['fx','flood'],['a','「これが、わたしたちの、最後の、プレゼントです」'],['','ひゅるる…ドーン！ ドーン！ 夜空が、色とりどりの、花で、埋めつくされる。'],['b','「全部、{K}くんの、ために」'],['c','「これから、離ればなれになっても、同じ空を、見上げようね」'],['fx','petals'],['me','「…約束だよ。何年経っても、ここに、帰ってくる」'],['','女子たちの歓声と、花火の音が、いつまでも、夜空に、響いていた。']]}
];

/* ---------- ④ 完全究極ハーレムエンド(本編) ---------- */
const ULTRA_END_LINES=[
 ['bg','harem_ultra_finale'],['','それは、学園の歴史に、いちばん大きく、刻まれた、卒業式だった。'],
 ['cast','a,b,c,*40'],['a','「{K}くん。三年間、ありがとうございました」'],['b','「わたしたち全員から、最後のお願いが、あります」'],['c','「…どうか、これからも、わたしたちの、{K}くんで、いてください」'],
 ['fx','flood'],['','全員が、いっせいに、{K}の周りに、集まった。それは、まるで、花束のようだった。'],
 ['me','「…ぼくは、最初、男子ひとりで、不安だった。でも、今は、{N}人の、かけがえのない仲間が、いる」'],['me','「これからも、ずっと、みんなと、一緒だよ」'],
 ['fx','confetti'],['','歓声が、爆発した。{P}の三年間は、{school}の、永遠の伝説に、なった。'],['hide','']
];

/* ---------- ⑤ エピローグ ---------- */
const EP_LOVE=[
 {lines:[['bg',''],['','——十年後。'],['','桜の季節。{K}は、ひさしぶりに、母校の、桜並木を、歩いていた。'],['cast','a'],['a','「ねえ、覚えてる？ ここで、はじめて、手をつないだよね」'],['me','「…覚えてるよ。{a}の手が、あったかかった」'],['a','「ふふ。…今も、あったかいよ」'],['','変わらない桜並木の下で、二人は、もう一度、手をつないだ。']]},
 {lines:[['bg',''],['','——五年後。同窓会の夜。'],['cast','a,b,c'],['b','「{K}、{a}ちゃんと、続いてるんだってね！」'],['c','「いいなあ、うらやましい！」'],['a','「えへへ。…ありがとう、みんな」'],['','二人の、薬指には、おそろいの、小さな指輪が、光っていた。'],['me','（…この幸せを、ずっと、守っていこう）']]},
 {lines:[['bg',''],['','——二十年後。'],['cast','a'],['a','「ねえ、{K}くん。あの日、屋上で、言ってくれたこと、覚えてる？」'],['me','「…『ずっと、そばに、いる』って？」'],['a','「うん。…ちゃんと、守ってくれて、ありがとう」'],['','窓の外には、あの日と同じ、桜の花びらが、舞っていた。']]}
];
const EP_FRIEND=[
 {lines:[['bg',''],['','——十年後。同窓会の夜。'],['cast','a,b,c'],['a','「{K}くん、ひさしぶり！ 全然、変わってないね」'],['b','「みんな、集まったよ！ 乾杯しよう！」'],['c','「…三年間、楽しかったなあ」'],['me','「ぼくもだよ。…また、すぐ、集まろう」'],['','グラスを合わせる音が、ひびいた。友だちは、いくつになっても、友だちだった。']]},
 {lines:[['bg',''],['','——五年後。旅先で、思いがけない再会。'],['cast','a,b'],['a','「あれ！？ {K}くん！？」'],['b','「うそ、こんなところで、会うなんて！」'],['me','「…すごい偶然だね」'],['','三人は、顔を見合わせて、笑った。それから、日が暮れるまで、昔話に、花が咲いた。']]},
 {lines:[['bg',''],['','——十年後。{K}のスマホに、一通のメッセージ。'],['cast','a'],['a','「{K}くん、元気？ 今度の連休、みんなで、キャンプ、行かない？」'],['me','「…もちろん。行く」'],['','三年間で、結んだ縁は、いまも、続いている。']]}
];
const EP_SOLO=[
 {lines:[['bg',''],['','——十年後。'],['','{K}は、新しい街で、新しい仲間と、笑っていた。'],['me','（…あの頃は、ひとりの時間が、多かったな）'],['','けれど、その時間が、いま、自分を、支えてくれている。'],['me','（これから、また、たくさん、出会おう）'],['','春の風が、あたたかく、吹いていた。']]},
 {lines:[['bg',''],['','——五年後。偶然、母校の前を、通りかかった。'],['','桜並木は、変わらず、そこにあった。'],['cast','~a'],['a','「…あれ、もしかして、{K}くん？」'],['me','「…{a}さん？ ひさしぶり」'],['','短い立ち話。けれど、少しだけ、胸が、あたたかくなった。'],['','また、いつか。そう言って、二人は、別れた。']]},
 {lines:[['bg',''],['','——十年後。机の引き出しの奥から、卒業アルバムが、出てきた。'],['','ページをめくると、小さく、写っている、誰かの笑顔。'],['me','（…今なら、あの頃より、もう少し、上手に、話せる気がする）'],['','アルバムを閉じて、{K}は、新しい一歩を、踏み出した。']]}
];
const EP_HAREM=[
 {lines:[['bg',''],['','——十年後。同窓会の会場は、ホテルの大宴会場でも、足りなかった。'],['cast','a,b,c,*30'],['a','「{K}くーん！ こっち、こっち！」'],['b','「全員、そろったよ！ 欠席ゼロ！」'],['me','「…{N}人、全員、集まったの！？」'],['c','「当たり前でしょ！ {K}くんが、呼んだんだから！」'],['fx','confetti'],['','乾杯の声が、会場を揺らした。あの三年間は、まだ、終わっていなかった。']]},
 {lines:[['bg',''],['','——五年後。母校の、校庭。'],['cast','a,b,c'],['a','「見て。後輩たちが、{K}くんの、話をしてるよ」'],['','校庭の隅で、制服姿の、女の子たちが、ひそひそと、話している。'],['','「あの人が、伝説の…」「ハーレムの、柏木くん」「実在したんだ…」'],['b','「すっかり、有名人だね」'],['me','「…恥ずかしいなあ」'],['c','「でも、誇らしいよ。わたしたちの、{K}くんだもん」']]},
 {lines:[['bg',''],['','——二十年後。{K}のもとに、一通の、大きな封筒が届いた。'],['','開けると、中には、{N}枚の、手紙と、写真。'],['','どの写真にも、あの日の、笑顔が、写っていた。'],['cast','a'],['a','「…みんなで、作ったの。二十周年の、お祝いに」'],['me','「…ありがとう。ぼくの、一生の、宝物だよ」'],['fx','petals'],['','何年経っても、色あせない、三年間だった。']]}
];
const EP_ULTRA=[
 {lines:[['bg','harem_ultra_town'],['','——十年後。街の駅前には、笑顔の、大きな銅像が、立っていた。'],['','台座には、{N}人の、名前。'],['cast','a,b,c'],['a','「毎年、この日になると、街じゅうが、お祭りになるんだよ」'],['b','「『{K}くんの日』は、いまや、全国の、祝日だよ」'],['me','「…どうして、こんなことに」'],['c','「みんなが、{K}くんを、好きになっちゃったからだよ」'],['fx','confetti'],['','空には、花火。街には、笑い声。伝説は、今日も、続いている。']]},
 {lines:[['bg','harem_ultra_finale'],['','——二十年後。母校の、校門の前。'],['','「{K}くんの像」には、毎朝、花が、絶えない。'],['cast','a,b,c,*20'],['a','「ねえ、見て。後輩たちが、あの日と、同じ、パレードを、してるよ」'],['','神輿に乗っているのは、新しい世代の、誰か。担いでいるのは、笑顔の、女子たち。'],['me','「…受け継がれてるんだね」'],['b','「うん。{K}くんが、残した、いちばんの、宝物だよ」'],['fx','flood']]},
 {lines:[['bg','harem_ultra_milkyway'],['','——五十年後。七夕の夜。'],['','おじいさんになった{K}は、ベランダで、夜空を見上げていた。'],['cast','a,b,c'],['a','「…おじいさん、風邪、ひきますよ」'],['me','「ありがとう。…懐かしい、声だ」'],['b','「みんな、集まってるよ。縁側で、星を見よう」'],['c','「短冊も、ちゃんと、用意してあるからね」'],['','短冊には、みんな、同じ言葉。『これからも、ずっと、{K}くんと、いられますように』'],['fx','petals'],['','天の川が、静かに、まばたきをした。']]}
];

/* ---------- ⑤' スタッフロール ---------- */
function creditsLines(kind,k){
 const all=avail().slice().sort((a,b)=>favOf(b)-favOf(a)),nm=h=>h.n.split(' ').join('');
 const L=[['bg',''],['fx','petals'],['','— {school}ストーリー —'],['','主演　{P}']];
 const lover=k&&H(k);
 if(kind==='love'&&lover)L.push(['',`ヒロイン　${nm(lover)}`]);
 const cast=all.filter(h=>!lover||h.id!==lover.id).slice(0,10);
 if(cast.length)L.push(['',`出演　${cast.map(nm).join('　')}`+(all.length>cast.length+(lover?1:0)?`　ほか ${all.length-cast.length-(lover?1:0)}名`:'')]);
 if(haremN()>=10)L.push(['',`友情出演　{N}人の仲間たち`]);
 L.push(['','特別出演　購買のおばちゃん　校長先生　通りすがりのファンのみなさん']);
 if(kind==='harem')L.push(['','総勢 {N}人 のハーレムで、お送りしました']);
 if(kind==='ultra'){L.push(['','Special Thanks　街じゅうの、{K}くんファンのみなさん']);L.push(['fx','confetti'])}
 if(kind==='solo')L.push(['','ひとりの時間も、きっと、{K}の物語の一部。']);
 L.push(['','そして、このゲームを遊んでくれた、あなた。'],['','THE END']);
 return dailyApply({lines:L},all.slice(0,5),{N:haremN(),M:fcCount()});
}

/* ---------- 結末コレクション(スマホ「結末」アプリ) ---------- */
const END_HINT={love:'いちばん好感度の高い女子が70以上のまま卒業する',friend:'好感度の最高が45以上70未満のまま卒業する',solo:'誰とも、あまり仲良くならずに卒業する',harem:'好感度75以上の女子が HAREM_END_N 人以上',ultra:'ハーレムエンドの条件+魅力100以上'};
function endBest(kind,g){
 let d={};try{d=JSON.parse(localStorage.getItem('sakuragaoka_endbest')||'{}')||{}}catch(e){}
 const ord=['D','C','B','A','S','SS'];
 if(kind&&g&&(!d[kind]||ord.indexOf(g)>ord.indexOf(d[kind]))){d[kind]=g;try{localStorage.setItem('sakuragaoka_endbest',JSON.stringify(d))}catch(e){}}
 return d;
}
function endHtml(){
 const seen=endsSeen(),best=endBest();
 let h=`<p class="hint">結末コレクション ${Object.keys(seen).length} / ${Object.keys(END_NAMES).length}。周回しても記録は残ります。</p>`;
 h+=Object.keys(END_NAMES).map(k=>seen[k]?`<div class="ev"><b>${END_NAMES[k]}</b><span>最高評価 ${best[k]||'-'}</span></div>`:`<div class="ev"><b>？？？</b><span>${END_HINT[k].replace('HAREM_END_N',typeof HAREM_END_N==='number'?HAREM_END_N:100)}</span></div>`).join('');
 const lovers=HEROINES.filter(g=>S.clear&&S.clear[g.id]==='love');
 h+=`<h2 style="margin:14px 0 4px;font-size:13px">恋人エンドを迎えた女子 ${lovers.length}人</h2>`;
 h+=lovers.length?lovers.map(g=>`<div class="ev"><b>${g.n}</b><span>恋人エンド</span></div>`).join(''):'<p class="hint">まだ、いません。</p>';
 return h;
}

/* ---------- 結末の判定 ---------- */
function endKind(){
 const o=avail().map(h=>[h.id,S.a[h.id]]).sort((a,b)=>b[1]-a[1]),[k,v]=o[0]||['',0];
 let kind=haremN()>=HAREM_END_N?'harem':v>=70?'love':v>=45?'friend':'solo';
 if(kind==='harem'&&S.st.charm>=END_ULTRA_CHARM)kind='ultra';
 return {kind,k};
}
function endGirls(kind,k){
 const all=avail().slice().sort((a,b)=>favOf(b)-favOf(a));
 let g=all.slice();
 if(kind==='love'&&k){g=[H(k)].concat(all.filter(h=>h.id!==k))}
 return g.slice(0,5);
}
function sceneNeed(sc){
 let n=0;
 sc.lines.forEach(r=>{
  const i='abcde'.indexOf(r[0]);if(i>=0)n=Math.max(n,i+1);
  if(r[0]==='cast')String(r[1]).split(',').forEach(t=>{const j='abcde'.indexOf(t.replace('~',''));if(j>=0)n=Math.max(n,j+1)});
  const m=String(r[1]).match(/\{([a-e])\}/g);if(m)m.forEach(x=>{n=Math.max(n,'abcde'.indexOf(x[1])+1)});
 });
 return n;
}
function endScene(set,kind,k,done){
 const g=endGirls(kind,k),ok=set.filter(sc=>sceneNeed(sc)<=g.length);
 if(!ok.length)return done();
 const sc=pickNR('endscene:'+kind+set.length,ok);
 Novel.play({lines:dailyApply(sc,g,{N:haremN(),M:fcCount()})},{h:k||(g[0]&&g[0].id)},done);
}
function graduationPlay(kind,k,done){
 const g=endGirls(kind,k);
 const L=[['bg',''],['','——卒業式の朝。'],['','{school}の、桜のつぼみが、ほんの少し、ふくらんでいた。']].concat(recapLines());
 Novel.play({lines:dailyApply({lines:L},g,{N:haremN(),M:fcCount()})},{},()=>{
  const set={love:GR_LOVE,friend:GR_FRIEND,solo:GR_SOLO,harem:GR_HAREM,ultra:GR_ULTRA}[kind];
  endScene(set,kind,k,done);
 });
}
function ending(){
 const {kind,k}=endKind();
 graduationPlay(kind,k,()=>{
  buttonScene(kind==='ultra'?'harem':kind,()=>{
   const main=kind==='solo'?'solo':kind==='harem'?{lines:haremEndLines()}:kind==='ultra'?{lines:dailyApply({lines:ULTRA_END_LINES},endGirls('ultra',''),{N:haremN(),M:fcCount()})}:kind+'_'+k;
   Novel.play(main,{h:k},()=>{
    const ep={love:EP_LOVE,friend:EP_FRIEND,solo:EP_SOLO,harem:EP_HAREM,ultra:EP_ULTRA}[kind],g=endGirls(kind,k);
    const go=()=>Novel.play({lines:creditsLines(kind,k)},{},()=>fin(kind,kind==='solo'||kind==='harem'||kind==='ultra'?'':k));
    if(!ep)return go();
    endScene(ep,kind,k,go);
   });
  });
 });
}

/* ---------- ⑥ 結果画面 ---------- */
function endScore(){
 const fav=avail().reduce((s,h)=>s+favOf(h),0),ach=S.ach?Object.keys(S.ach).length:0;
 return Math.round(fav+S.st.charm*5+haremN()*20+(typeof fcCount==='function'?fcCount():0)/5+ach*10+(S.st.study+S.st.sport+S.st.art));
}
function endRank(kind){
 const sc=endScore();let r=END_RANKS.find(x=>sc>=x[0])||END_RANKS[END_RANKS.length-1],g=r[1],t=r[2];
 if(kind==='ultra'&&g==='S'){g='SS';t='完全究極の伝説'}
 return {score:sc,g,t};
}
const END_NAMES={love:'恋人エンド',friend:'友だちエンド',solo:'ひとりエンド',harem:'ハーレムエンド',ultra:'完全究極ハーレムエンド'};
function endsSeen(kind){
 let d={};try{d=JSON.parse(localStorage.getItem('sakuragaoka_ends')||'{}')||{}}catch(e){}
 if(kind&&!d[kind]){d[kind]=1;try{localStorage.setItem('sakuragaoka_ends',JSON.stringify(d))}catch(e){}}
 return d;
}
function fin(kind,k){
 const first=!(S.fin&&S.fin.c);
 S.fin={kind,k,c:1};
 if(first){if(kind==='harem'||kind==='ultra'){S.hend=(S.hend||0)+1;cnt('harem_end')}if(kind==='ultra')cnt('ultra_end')}
 if(k){const o=S.clear[k];if(kind==='love'||!o)S.clear[k]=kind}
 const rk=endRank(kind);
 if(first){S.endRank=rk.g;if(rk.g==='S'||rk.g==='SS')cnt('end_s');if(rk.g==='SS')cnt('end_ss')}
 const seen=endsSeen(first?kind:null),sn=Object.keys(seen).length;if(first)endBest(kind,rk.g);
 const ac=checkAch();save();const h=k&&H(k);
 const c=x=>(typeof cn==='function'?cn(x):0);
 const dg=[`会いに行った ${c('meet')}回 / デート ${c('date')}回`,`ハーレム ${haremN()}人 / ファン ${typeof fcCount==='function'?fcCount():0}人`,`名場面 ${(c('bigev')||0)+(c('keyev')||0)}回 / 自撮り ${c('selfie')}枚 / 手紙 ${c('letter')}通`].join('\n');
 const title=typeof rankNow==='function'?`人気の称号「${rankNow().n}」`:'';
 show(k||'',`${S.loop+1}周目クリア\n${h?h.n+'　':''}${END_NAMES[kind]||''}\n\n卒業評価 ${rk.g}　「${rk.t}」(${rk.score}点)\n${title}\n${dg}\n学力${S.st.study}・体力${S.st.sport}・直感${S.st.art}・魅力${S.st.charm}\n見た結末 ${sn} / ${Object.keys(END_NAMES).length}`+(ac.length?'\n'+ac.join('\n'):''),
  [['強くてニューゲーム',perkPick,'act p','✦'],['最初からやり直す',start,'act','↺'],['タイトルへ',title_fn(),'act','⌂']]);
}
function title_fn(){return typeof title==='function'?title:()=>{}}
