/* ===== ランダム事件 / 疲れのハプニング / 保健室 / 月替わりのモテ具合 =====
   台詞・場面のデータは incident_lines.js にあります(冒頭に書き方の説明あり)。この incident.js は、起きる確率や条件などの「しくみ」だけです。

   ■ 一覧(どこで呼ばれるか。weekExtra(daily.js)から、毎週の終わりに1つだけ)
     ① 保健室 ……… 疲れが 8 以上だと、確率で倒れて保健室に運ばれる(COLLAPSE_P)。魅力(low/mid/high/top)で場面が変わる(低くても廊下は人だかり。top=大パニックで50万〜500万円の貢ぎ物)。
                    今月の残りの行動力を使い切って疲れが回復し、お見舞いに来た女子の好感度が上がる。 hazard()
     ② 疲れのハプニング … 疲れが 6〜7 のとき MISHAP_P の確率。1人の女子が助けてくれる短い場面。好感度+MISHAP_FAV、疲れ-1。 hazard()
     ③ ランダム事件 … 毎週 INC_RATE の確率で、選択肢つきの事件(INCIDENTS)が起きる。 incident()
     ④ 月替わりのモテ具合 … 翌月に進むとき、モテ度の段階に応じた短文が出る(TREND)。会員が増えたら、増えた人数も出る。 trendNote()(index.html の advance から)

   ■ 調整できる数字(下の定数)
     INC_RATE=事件の確率 / COLLAPSE_P=疲れ別の倒れる確率 / MISHAP_P=ハプニングの確率 / NURSE_REST=保健室のあとの疲れ / TREND_LINES=月替わりの文の数(段階が高いほど増える) */
const INC_RATE=.16,MISHAP_P=.16,MISHAP_FAV=2,NURSE_REST=2;
const COLLAPSE_P={8:.25,9:.45,10:.7};
const NURSE_FAV={low:2,mid:3,high:3,top:3}; /* お見舞いに来た子の好感度 */
const NURSE_FAN={low:1,mid:0,high:1,top:2};
/* 魅力90以上で倒れたとき、貢がれるお金(円)の範囲。ファン会員が600人以上で上限に近づく */
const NURSE_MONEY={top:[500000,5000000]};  /* 好感度50以上の全員の好感度(高いほど学園じゅうが心配) */

/* 疲れ(S.f)を 0〜10 に収める */
const incF=d=>{S.f=Math.max(0,Math.min(10,(S.f||0)+d))};
/* 女子を n 人選ぶ(好感度が高い子ほど選ばれやすい) */
function incGirls(n){
 const pool=avail().slice(),out=[];
 while(out.length<n&&pool.length){
  const w=pool.map(h=>5+favOf(h)),sum=w.reduce((x,y)=>x+y,0);let t=Math.random()*sum,i=0;
  for(;i<pool.length-1;i++){t-=w[i];if(t<0)break}
  out.push(pool.splice(i,1)[0]);
 }
 return out;
}
const incNames=g=>{const o={};'abcde'.split('').forEach((k,i)=>{if(g[i])o[k]=g[i].n});return o};
const incTxt=(t,g)=>dailyFmt(t,incNames(g));
/* 効果を反映して、「好感度+3」などの報告文を返す */
function incApply(e,g){
 const r=[];
 if(e.fav&&g.length){g.forEach(h=>add(h.id,e.fav));}
 if(e.fan){const fs=avail().filter(h=>favOf(h)>=50);fs.forEach(h=>add(h.id,e.fan));}
 if(e.st)Object.keys(e.st).forEach(k=>{const b=S.st[k];S.st[k]=Math.min(cap(),Math.max(0,b+e.st[k]));const d=S.st[k]-b;if(d)r.push(`${ST[k]}が${d>0?'+':''}${d}`)});
 if(e.money){S.money=Math.max(0,S.money+e.money);r.push(`所持金が${e.money>0?'+':''}${yen(Math.abs(e.money)).replace(/^/,e.money<0?'-':'')}`)}
 if(e.f){incF(e.f);r.push(`疲れが${e.f>0?'+':''}${e.f}`)}
 g.forEach(h=>met.add(h.id));
 return r.length?'（'+r.join(' / ')+'）':'';
}

/* ③ ランダム事件 */
function incident(done){
 if((S.t||0)<1||Math.random()>=INC_RATE)return false;
 const m=mon(),n=avail().length;
 const ok=INCIDENTS.filter(e=>(!e.mon||e.mon.includes(m))&&(e.g||0)<=n&&(!e.fcMin||fcCount()>=e.fcMin));if(!ok.length)return false;
 const e=pickNR('incident',ok),g=incGirls(e.g||0);
 const L=dailyApply({lines:e.lines},g,{});cnt('incident');noteAct('incident',g[0]?g[0].n:'');
 Novel.play({lines:L},{ill:'incident'},()=>{
  const k=g[0]?g[0].id:'';
  show(k,`【事件：${e.n}】どうする？`,e.ch.map(c=>[incTxt(c.l,g),()=>{
   const win=c.p==null||Math.random()<Math.min(.95,c.p+S.st.charm/500),r=(win?c.ok:c.ng||c.ok);
   show(k,incTxt(r.t||'',g)+'\n'+incApply(r,g),[['つぎへ',done,'p']]);
  },'act','💬']));
 });
 return true;
}

/* ①② 疲れ: 保健室 / ハプニング */
function hazard(done){
 const f=S.f||0,all=avail();if(!all.length||(S.t||0)<1)return false;
 if(f>=8&&Math.random()<(COLLAPSE_P[Math.min(10,f)]||0))return nurse(done);
 if(f>=6&&f<=7&&Math.random()<MISHAP_P){
  const g=incGirls(1);if(!g.length)return false;
  const sc=pickNR('mishap',FATIGUE_MISHAPS),L=dailyApply(sc,g,{});
  add(g[0].id,MISHAP_FAV);met.add(g[0].id);incF(-1);cnt('mishap');
  L.push(['hide','']);L.push(['',`【ハプニング】疲れが1減った。`]);
  Novel.play({lines:L},{ill:'hazard'},done);return true;
 }
 return false;
}
const nurseTier=()=>{const c=S.st.charm;return c>=90?'top':c>=60?'high':c>=30?'mid':'low'};
function nurse(done){
 const order=['top','high','mid','low'],all=avail().slice().sort((a,b)=>favOf(b)-favOf(a));
 /* 魅力の段階の場面から選ぶ。登場人数が足りないときは、ひとつ下の段階へ */
 let tier=nurseTier(),sc=null;
 for(let i=order.indexOf(tier);i<order.length&&!sc;i++){
  const ok=NURSE_SCENES[order[i]].filter(s=>s.min<=all.length);if(ok.length){tier=order[i];sc=pickNR('nurse:'+tier,ok)}
 }
 if(!sc)return false;
 const fans=all.filter(h=>favOf(h)>=50),g=tier==='low'?incGirls(1):(()=>{const pool=all.slice(0,Math.max(sc.min+2,Math.ceil(all.length/2)));return dShuffle(pool).slice(0,Math.max(sc.min,1))})();
 let L=dailyApply(sc,g,{N:haremN(),M:fcCount()}),yenGot=0;
 if(NURSE_MONEY[tier]){const [lo,hi]=NURSE_MONEY[tier],t=Math.min(1,fcCount()/600);yenGot=Math.max(lo,Math.min(hi,Math.round((lo+(hi-lo)*t)*(.7+Math.random()*.6)/10000)*10000));S.money+=yenGot;cnt('nurse_top');L=L.map(r=>Array.isArray(r)&&typeof r[1]==='string'?[r[0],r[1].replace(/\{Y\}/g,yen(yenGot))]:r)}
 g.forEach(h=>{add(h.id,NURSE_FAV[tier]);met.add(h.id)});
 const fs=NURSE_FAN[tier]?fans.filter(h=>!g.includes(h)):[];fs.forEach(h=>add(h.id,NURSE_FAN[tier]));
 S.f=NURSE_REST;S.ap=0;cnt('nurse');if(tier==='high'||tier==='top')cnt('nurse_hi');
 L.push(['hide','']);
 L.push(['',`【保健室】しっかり休んだ。疲れが回復したが、今月の残りの行動力は使い切った。`+(yenGot?`\n💴 貢ぎ物 ${yen(yenGot)} を受け取った。（所持金 ${yen(S.money)}）`:'')]);
 Novel.play({lines:L},{ill:'nurse'},done);
 return true;
}

/* ④ 月替わりのモテ具合 */
function trendNote(){
 const sc=moteScore();let t=0;TREND_TIERS.forEach((m,i)=>{if(sc>=m)t=i});
 const M=fcCount(),N=haremN(),ex={M,N},g=avail(),nm=g.length?g[R(0,g.length-1)].n:'',out=[];
 const nl=t>=5?3:t>=3?2:1;
 for(let i=0;i<nl;i++){
  const pool=TREND[t].filter(x=>!out.includes(x)),line=pickNR('trend'+t+':'+i,pool.length?pool:TREND[t]);
  if(!out.some(o=>o.src===line))out.push({src:line});
 }
 let d=S.fcl!=null?M-S.fcl:0;S.fcl=M;
 const L=out.map(o=>'📣 '+dailyFmt(o.src,{n:nm},ex).replace(/\{D\}/g,d));
 if(d>0&&t>=1)L.push('📈 '+dailyFmt(pickNR('trendup',TREND_UP),{n:nm},ex).replace(/\{D\}/g,d));
 return L.join('\n');
}
