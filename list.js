/* ===== 女子の一覧(100人以上でも使えるUI) =====
   右の「女性一覧」と、スマホの「メッセージ」「連絡先」で共通して使う、検索・並べ替え・絞り込み・「もっと見る」の仕組みです。

   ■ 状態(LISTS)
     side(右の一覧)と phone(スマホ)で別々に、検索語 q / 並べ方 sort / 絞り込み flt / 表示件数 n を覚えています。
   ■ 並べ方・絞り込みを増やす
     SORTS と FLTS に1行足し、listFilter() に処理を足します。
   ■ 1回に表示する人数
     LIST_PAGE(30)。「もっと見る」を押すたびに、この人数ずつ増えます。
   ■ 1人ぶんの見た目
     rowSide(右の一覧)/ rowMsg(スマホのメッセージ)/ rowPpl(スマホの連絡先)。
   ■ 分類(生徒/教師/職員・関係者/その他)
     heroines.js の ROLES と、各ヒロインの role で決まります。一覧の「分類」で絞り込めます。生徒以外は名前の横にタグが出ます。
   ■ 画像
     顔画像は遅延読み込み(画面に出るまで読み込まない)なので、100人以上でも重くなりません。 */
const LIST_PAGE=30;
const LISTS={side:{q:'',sort:'fav',flt:'all',role:'all',n:LIST_PAGE},phone:{q:'',sort:'fav',flt:'all',role:'all',n:LIST_PAGE}};
const SORTS=[['fav','好感度順'],['new','新しい順'],['old','古い順'],['name','名前順']];
const FLTS=[['all','すべて'],['75','75以上'],['50','50以上'],['low','30未満'],['clear','エンド済']];
const ROWS={};
const escA=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const ordOf=h=>(S.mo&&S.mo[h.id])||0;

function listFilter(st){
 let a=avail();const q=st.q.replace(/\s/g,'');
 if(q)a=a.filter(h=>h.n.replace(/\s/g,'').includes(q));
 if(st.role&&st.role!=='all')a=a.filter(h=>roleOf(h)===st.role);
 if(st.flt==='75')a=a.filter(h=>S.a[h.id]>=75);
 else if(st.flt==='50')a=a.filter(h=>S.a[h.id]>=50);
 else if(st.flt==='low')a=a.filter(h=>S.a[h.id]<30);
 else if(st.flt==='clear')a=a.filter(h=>S.clear[h.id]);
 a=a.slice();
 if(st.sort==='fav')a.sort((x,y)=>S.a[y.id]-S.a[x.id]);
 else if(st.sort==='new')a.sort((x,y)=>ordOf(y)-ordOf(x));
 else if(st.sort==='old')a.sort((x,y)=>ordOf(x)-ordOf(y));
 else a.sort((x,y)=>x.n.localeCompare(y.n,'ja'));
 return a;
}
function listCtl(k){
 const st=LISTS[k],o=(arr,v)=>arr.map(([a,b])=>`<option value="${a}"${a===v?' selected':''}>${b}</option>`).join('');
 return `<div class="lctl"><input type="search" data-lq="${k}" placeholder="名前で探す" value="${escA(st.q)}" aria-label="名前で探す"><div class="lsel"><select data-ls="${k}" aria-label="並べ方">${o(SORTS,st.sort)}</select><select data-lf="${k}" aria-label="絞り込み">${o(FLTS,st.flt)}</select></div><select data-lr="${k}" aria-label="分類">${o([['all','分類:すべて']].concat(ROLES.map(r=>[r[0],'分類:'+r[1]])),st.role)}</select></div>`;
}
function listBody(k,row){
 const st=LISTS[k],a=listFilter(st);
 return (a.slice(0,st.n).map(row).join('')||'<p class="hint">該当する女子はいません。</p>')+(a.length>st.n?`<button type="button" class="more" data-lm="${k}">もっと見る（残り${a.length-st.n}人）</button>`:'');
}
function listRefresh(k){const c=document.querySelector('[data-lbody="'+k+'"]');if(c&&ROWS[k])c.innerHTML=listBody(k,ROWS[k])}

function rowSide(x){return `<button type="button" class="card" data-hd="${x.id}">${pic(x)}<div><div class="r2"><b>${x.n}${roleOf(x)!=='student'?`<em class="rtag">${roleName(x)}</em>`:''}</b><span>${S.a[x.id]}${S.clear[x.id]?' ★':''}</span></div>${bar(S.a[x.id],100)}<small class="rel">${relLabel(S.a[x.id])}</small><small>${x.intro}</small></div></button>`}
function rowMsg(x){return `<button class="ct" type="button" data-go="chat:${x.id}"><span class="th">${pic(x)}</span><span><b>${x.n}</b><small>${S.a[x.id]<15?'（緊張しているみたい…）':S.a[x.id]<40?'「今度、どこか行かない？」':'「ねえ、いつ会える？」'}</small></span></button>`}
function rowPpl(x){return `<div class="pp" role="button" tabindex="0" data-hd="${x.id}"><span class="th big">${pic(x)}</span><div><b>${x.n}</b>${S.clear[x.id]?`<em>${S.clear[x.id]==='love'?'恋人エンド達成':'友だちエンド達成'}</em>`:''}<small>${x.intro}\n得意：${ST[x.like]}</small><small>好感度 ${S.a[x.id]}</small><small class="rel">${relLabel(S.a[x.id])}</small>${bar(S.a[x.id],100)}</div></div>`}
ROWS.side=rowSide;

document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.lq;if(!k)return;LISTS[k].q=e.target.value;LISTS[k].n=LIST_PAGE;listRefresh(k)});
document.addEventListener('change',e=>{const d=e.target.dataset||{};
 if(d.ls){LISTS[d.ls].sort=e.target.value;LISTS[d.ls].n=LIST_PAGE;listRefresh(d.ls)}
 if(d.lr){LISTS[d.lr].role=e.target.value;LISTS[d.lr].n=LIST_PAGE;listRefresh(d.lr)}
 if(d.lf){LISTS[d.lf].flt=e.target.value;LISTS[d.lf].n=LIST_PAGE;listRefresh(d.lf)}});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-lm]');if(b){const k=b.dataset.lm,c=document.querySelector('[data-lbody="'+k+'"]'),y=c?c.scrollTop:0;LISTS[k].n+=LIST_PAGE;listRefresh(k);if(c)c.scrollTop=y}});

/* 女子から見た「柏木くん」(好感度の段階ラベル)。恋に恋する女子しかいない世界なので、最初から全員に注目されている */
const REL_TIERS=[[0,'💗 注目の的'],[15,'💗 憧れの人'],[30,'💞 恋の相手'],[45,'💞 恋い焦がれる人'],[60,'💘 離れられない人'],[75,'💘 依存の対象'],[90,'💖 生きがい'],[100,'💖 運命の人']];
function relLabel(a){let t=REL_TIERS[0][1];REL_TIERS.forEach(([m,l])=>{if((a||0)>=m)t=l});return t}
