/* ===== ショップ =====
   メイン画面の【ショップに行く】の中身です。カテゴリ別に商品が並びます。自由に増やしてください。
   買い物は行動力を使いません。

   ■ 流れ
     メニューの「ショップに行く」→ shop() で商品一覧 → 買う(buyItem)
   ■ 商品の種類(ITEMS に1行ずつ)
     ・すぐ使うもの …… now:()=>{効果の処理; return '結果の文'}
     ・女子に使うもの … target:true と use:(h)=>{効果の処理; return '結果の文'}(h=相手の女子)
        買うと持ち物(S.items)に入り、使うときは「女性一覧/連絡先 → 女子の詳細画面 → アイテムを使う」から選びます。
        ※ 使えるのは、メイン画面で行動力が残っているときだけです。
   ■ 商品の書き方
     {id:'英数字', n:'名前', d:'説明', price:値段(円), cat:'カテゴリ', now か target+use, req:()=>条件, reqT:'条件の説明'}
     cat = sport(運動) / study(学習) / art(芸術) / beauty(美容・魅力) / gift(プレゼント) / life(休息・食事) / lux(高額・全員向け) / special(特別)
     req と reqT は省略可。ロックされた商品は、条件を満たすまで買えません(例 req:()=>fcCount()>=100, reqT:'ファン100人以上')。
   ■ 効果のヘルパー
     shSt(k,n) … 能力を n 上げる(study/sport/art/charm。上限あり)。結果の文を返す。
     allFav(lo,hi) … 全員の好感度を lo〜hi ランダムで上げる(画面には数字を出さない)。
   ■ 惚れ薬について
     好感度を一瞬で100にする救済用のアイテムです。値段を変えるなら price を変えるだけです。
   ■ 実績との関係
     買った回数は cnt('buy')、惚れ薬を使った回数は cnt('use_love') で数えています(achieve.js)。 */
const SHOP_ST={study:'学力',sport:'体力',art:'直感',charm:'魅力'};
const shSt=(k,n)=>{const g=gainSt(k,n);return g>0?`${SHOP_ST[k]}が${g}上がった。`:`${SHOP_ST[k]}は、もう伸びしろが見えないほど高い。`};
const allFav=(lo,hi)=>{avail().forEach(h=>add(h.id,R(lo,hi)))};
const SHOP_CATS=[['sport','🏃','スポーツ用品'],['study','📚','勉強道具'],['art','🎨','芸術・音楽'],['beauty','💄','美容・ファッション'],['life','🍙','休息・食事'],['gift','🎁','プレゼント'],['lux','💎','高額・全員向け'],['special','🧪','特別']];
const ITEMS=[
 /* ---- スポーツ(体力) ---- */
 {id:'protein',n:'プロテイン',d:'体力+2（すぐ使う）',price:2500,cat:'sport',now:()=>'プロテインを飲んだ。'+shSt('sport',2)},
 {id:'wear',n:'トレーニングウェア',d:'体力+8（すぐ使う）',price:12000,cat:'sport',now:()=>'新しいウェアで気合いが入った。'+shSt('sport',8)},
 {id:'shoes',n:'運動靴（高性能）',d:'体力+20（すぐ使う）',price:38000,cat:'sport',now:()=>'足にぴったりの運動靴で走ったら、見違えるように体が軽い。'+shSt('sport',20)},
 {id:'proshoes',n:'プロ仕様のランニングシューズ',d:'体力+35（すぐ使う）',price:120000,cat:'sport',req:()=>yr()>=2,reqT:'2年生から',now:()=>'プロ仕様の一足は、まるで翼が生えたようだった。'+shSt('sport',35)},
 /* ---- 勉強(学力) ---- */
 {id:'guide',n:'参考書',d:'学力+3（すぐ使う）',price:1500,cat:'study',now:()=>'参考書を買って読みこんだ。'+shSt('study',3)},
 {id:'dict',n:'電子辞書',d:'学力+15（すぐ使う）',price:28000,cat:'study',now:()=>'電子辞書のおかげで、調べものが驚くほどはかどった。'+shSt('study',15)},
 {id:'hard',n:'難関大の過去問集',d:'学力+25（すぐ使う）',price:65000,cat:'study',req:()=>yr()>=2,reqT:'2年生から',now:()=>'一週間かけて、過去問を解き切った。'+shSt('study',25)},
 {id:'tutor',n:'有名講師の特別講義',d:'学力+40（すぐ使う）',price:180000,cat:'study',req:()=>yr()>=3,reqT:'3年生から',now:()=>'有名講師の講義に、思わず鳥肌が立った。'+shSt('study',40)},
 /* ---- 芸術(直感) ---- */
 {id:'paint',n:'画材セット',d:'直感+15（すぐ使う）',price:26000,cat:'art',now:()=>'新しい画材で、思いのままに描いた。'+shSt('art',15)},
 {id:'guitar',n:'アコースティックギター',d:'直感+25（すぐ使う）',price:85000,cat:'art',now:()=>'ギターを爪弾くと、心が不思議と軽くなった。'+shSt('art',25)},
 {id:'camera',n:'ミラーレスカメラ',d:'直感+20・魅力+5（すぐ使う）',price:140000,cat:'art',now:()=>'カメラを構えて街を歩くと、世界が違って見えた。'+shSt('art',20)+shSt('charm',5)},
 /* ---- 美容・ファッション(魅力) ---- */
 {id:'perfume',n:'香水',d:'魅力+10（すぐ使う）',price:18000,cat:'beauty',now:()=>'ほのかに甘い香水を、手首にひとふき。'+shSt('charm',10)},
 {id:'salon',n:'美容院でカット',d:'魅力+15（すぐ使う）',price:32000,cat:'beauty',now:()=>'美容師さんに任せたら、驚くほど垢抜けた。'+shSt('charm',15)},
 {id:'watch',n:'ブランドの腕時計',d:'魅力+20（すぐ使う）',price:150000,cat:'beauty',req:()=>yr()>=2,reqT:'2年生から',now:()=>'手首に光る腕時計が、自信をくれた。'+shSt('charm',20)},
 {id:'suit',n:'オーダーメイドの制服',d:'魅力+30（すぐ使う）',price:420000,cat:'beauty',req:()=>fcCount()>=100,reqT:'ファン100人以上',now:()=>'体にぴったり合った制服で、背筋が自然と伸びた。'+shSt('charm',30)},
 /* ---- 休息・食事 ---- */
 {id:'drink',n:'エナジードリンク',d:'疲れ-3（すぐ使う）',price:300,cat:'life',now:()=>{S.f=Math.max(0,S.f-3);return 'エナジードリンクを一気に飲んだ。疲れが3減った。'}},
 {id:'massage',n:'高級マッサージ',d:'疲れが全回復（すぐ使う）',price:12000,cat:'life',now:()=>{S.f=0;return 'プロの手でほぐされて、体の芯から軽くなった。疲れが全部取れた。'}},
 {id:'onsen',n:'温泉の日帰りチケット',d:'疲れが全回復・魅力+3（すぐ使う）',price:45000,cat:'life',now:()=>{S.f=0;return '温泉でゆっくり湯につかり、心も体もほどけた。疲れが全部取れた。'+shSt('charm',3)}},
 /* ---- プレゼント(女子に使う) ---- */
 {id:'flower',n:'花束',d:'選んだ女子の好感度+10',price:3000,cat:'gift',target:true,
  use:h=>{add(h.id,10);return `${h.n}に花束を贈った。\n${h.n}は、はにかみながら、大切そうに受け取ってくれた。`}},
 {id:'choco',n:'高級チョコレート',d:'選んだ女子の好感度+15',price:9000,cat:'gift',target:true,
  use:h=>{add(h.id,15);return `${h.n}に、箱入りの高級チョコレートを贈った。\n${h.n}は、目を輝かせて、ひとつずつ大事そうに味わっていた。`}},
 {id:'bag',n:'ブランドのバッグ',d:'選んだ女子の好感度+20',price:120000,cat:'gift',target:true,
  use:h=>{add(h.id,20);return `${h.n}に、憧れのブランドのバッグを贈った。\n${h.n}は、言葉を失って、それから、ぎゅっと抱きしめてくれた。`}},
 {id:'ring',n:'指輪',d:'選んだ女子の好感度+30',price:300000,cat:'gift',target:true,req:()=>yr()>=2,reqT:'2年生から',
  use:h=>{add(h.id,30);return `${h.n}の指に、小さな指輪をそっとはめた。\n${h.n}は、涙をこらえて、「一生の宝物にするね」と笑った。`}},
 /* ---- 高額・全員向け(全員の好感度が5〜10上がる) ---- */
 {id:'sweets',n:'全員にスイーツの差し入れ',d:'全員の好感度+5〜10（すぐ使う）',price:150000,cat:'lux',now:()=>{allFav(5,10);return '学園の女子全員に、人気店のスイーツを配って回った。\nあちこちから歓声が上がり、笑顔の花が咲いた。'}},
 {id:'party',n:'貸切パーティー',d:'全員の好感度+5〜10（すぐ使う）',price:400000,cat:'lux',req:()=>fcCount()>=100,reqT:'ファン100人以上',now:()=>{allFav(5,10);return '貸切のパーティー会場に、女子全員を招待した。\nドレス姿の子たちが、かわるがわる、お礼を言いに来てくれた。'}},
 {id:'cruise',n:'豪華クルーズ貸切',d:'全員の好感度+7〜10・魅力+5（すぐ使う）',price:1200000,cat:'lux',req:()=>fcCount()>=300,reqT:'ファン300人以上',now:()=>{allFav(7,10);return '船を一隻貸し切って、全員で夜の海へ。\n満天の星の下、みんなの笑顔が、波の音に溶けていった。'+shSt('charm',5)}},
 /* ---- 特別 ---- */
 {id:'love',n:'惚れ薬',d:'選んだ女子の好感度を一瞬で100にする（救済用）',price:30000,cat:'special',target:true,
  use:h=>{S.a[h.id]=100;return `${h.n}に惚れ薬を飲ませた…。\n${h.n}の瞳が、とろんと潤んだ。もう{K}のことしか見えていないようだ…。`.replace('{K}',GAME.nick||GAME.player)}}
];
const itemOf=id=>ITEMS.find(i=>i.id===id);

/* 商品一覧: cat が無ければカテゴリの選択画面 */
function shop(msg,cat){
 const head=`${msg?msg+'\n':'「いらっしゃいませ！」\n'}所持金 ${yen(S.money)}`;
 if(!cat)return show('',head+'\nどのコーナーを見る？',[
  ...SHOP_CATS.filter(c=>ITEMS.some(i=>i.cat===c[0])).map(c=>[`${c[2]}\n${ITEMS.filter(i=>i.cat===c[0]).length}品`,()=>shop('',c[0]),'act',c[1]]),
  ['もどる',menu,'']]);
 const c=SHOP_CATS.find(x=>x[0]===cat);
 show('',head,[
  ...ITEMS.filter(it=>it.cat===cat).map(it=>{
   const lock=it.req&&!it.req();
   return [lock?`🔒 ${it.n}\n${it.reqT||'まだ買えません'}`:`${it.n}　${yen(it.price)}\n${it.d}${S.items[it.id]?`（所持${S.items[it.id]}）`:''}`,()=>lock?shop('まだ買えない商品だ。（'+(it.reqT||'条件あり')+'）',cat):buyItem(it,cat),!lock&&S.money>=it.price?'act':'act off','🛍️']}),
  ['コーナー一覧へ',()=>shop(),''],['もどる',menu,'']]);
}
function buyItem(it,cat){
 if(it.req&&!it.req())return shop('まだ買えない商品だ。',cat);
 if(S.money<it.price)return shop('お金が足りない…。バイトで稼ごう。',cat);
 S.money-=it.price;cnt('buy');
 if(it.cat==='lux'||it.price>=100000)cnt('buy_lux');
 if(it.now){const r=it.now();return shop(r,cat)}
 S.items[it.id]=(S.items[it.id]||0)+1;
 shop(`${it.n}を買った。（所持${S.items[it.id]}）\n女子の詳細画面から使えるよ。`,cat);
}
/* 女子の詳細画面に出す「アイテムを使う」ボタン(index.html の openDetail が呼ぶ) */
function itemBtns(id){
 if(!S||S.fin||S.ap<=0)return '';
 return ITEMS.filter(it=>it.target&&S.items[it.id]>0).map(it=>`<button type="button" class="meetb" data-use="${it.id}:${id}">${it.n}を使う（所持${S.items[it.id]}）</button>`).join('');
}
function useItem(iid,gid){
 const it=itemOf(iid),h=H(gid);
 if(!it||!h||!(S.items[iid]>0))return;
 S.items[iid]--;cnt('use_'+iid);met.add(gid);
 show(gid,it.use(h),[['つぎへ',menu,'p']]);
}
