"use strict";
/* 青冥长卷 · 线性修仙主线
 * 这不是随机事件库。废祠的名册、南疆的雨、血月的祭、帝京的炉、天门的税，
 * 是同一条因果。你在前面留下的选择，会在后面变成刀、变成援手、变成结局。
 */
function qmDefault(){
  return {chapter:1,scene:0,clue:0,path:"",ally:"",oath:"",flame:"",cleared:false,ending:"",next:0,history:[],flags:{}};
}
function qmEnsure(){
  if(!S) return;
  if(!S.qingming || typeof S.qingming!=="object") S.qingming = qmDefault();
  const q=S.qingming;
  q.chapter=clamp(Math.round(Number(q.chapter)||1),1,9);
  q.scene=clamp(Math.round(Number(q.scene)||0),0,30);
  q.clue=clamp(Math.round(Number(q.clue)||0),0,9);
  q.path=String(q.path||"");
  q.ally=String(q.ally||"");
  q.oath=String(q.oath||"");
  q.flame=String(q.flame||"");
  q.ending=String(q.ending||"");
  q.next=clamp(Math.round(Number(q.next)||0),0,9);
  q.cleared=!!q.cleared;
  q.history=Array.isArray(q.history)?q.history.slice(-24):[];
  q.flags=q.flags&&typeof q.flags==="object"?q.flags:{};
}
function qmLog(title,text){
  log(title,text);
  if(S&&S.qingming){
    S.qingming.history.push(String(title)+"："+String(text).slice(0,90));
    S.qingming.history=S.qingming.history.slice(-24);
  }
}
function qmP(arr){return (arr||[]).filter(Boolean).join("<br><br>");}
function qmGiveSkill(n,elem,power,mp,xi){
  S.fashu=S.fashu||[];
  if(!S.fashu.find(f=>f.n===n)) S.fashu.push({n,elem,power,mp,"系":xi||elem});
}
function qmGiveGongfa(n,grade){
  S.gongfa=S.gongfa||[];
  if(!S.gongfa.find(g=>g.n===n)) S.gongfa.push({n,grade});
}
function qmFlag(k,v){
  qmEnsure();
  if(typeof v==="undefined") return !!S.qingming.flags[k];
  S.qingming.flags[k]=!!v;
  return S.qingming.flags[k];
}
function qmOnce(k){
  if(qmFlag(k)) return false;
  qmFlag(k,true);
  return true;
}
function qmTitle(){
  qmEnsure();
  const q=S.qingming;
  if(q.cleared) return "青冥长卷 · "+(q.ending||"已问鼎");
  return "青冥长卷 · 第"+q.chapter+"章";
}
function qmQuest(){
  qmEnsure();
  const q=S.qingming;
  const map={
    1:{t:"第一章 · 废祠夜雨",o:"后山废祠在烧名册。药庐、断崖、藏经阁三处都还留着今夜的温度——查得越全，越不容易把人认错。",p:q.clue>=3?"三处伏笔已齐，废祠里的人未必是凶手。":q.clue>=2?"线索已够入祠。若再查一处，真相会改写。":"线索 "+q.clue+"/2（查满三处会多一段真相）"},
    2:{t:"第二章 · 青冥旧人",o:"名册背后是一座被抹去的宗门。残碑问你：还想不想做人。你的路，会改写南疆、血月与天门。",p:q.path?("已择路："+q.path):"尚未择路"},
    3:{t:"第三章 · 南疆毒瘴",o:"名册上有个叫阿霜的人还活着。救人、夺卷、或把瘴母斩开——三种活法，三种后文。",p:q.ally?("同行者："+q.ally):"尚未结伴"},
    4:{t:"第四章 · 血月祭坛",o:"废祠烧掉的不是纸，是今夜要走上祭坛的人。你的一念，会变成侠义、寿元或永远洗不掉的旁观。",p:q.oath?("已立誓："+q.oath):"尚未立誓"},
    5:{t:"第五章 · 东海归墟",o:"古碑刻着你的名字，旁边却有一道被剜去的命格。碑下三焰，天门那一战会因此完全不同。",p:q.flame?("已得灵焰："+q.flame):"尚未取焰"},
    6:{t:"第六章 · 帝京棋局",o:"国师以万民养仙胎。天牢、暗巷、朝堂三处证据收齐之前，不要贸然掀桌。",p:q.clue>=3?"证据已齐，可闯祭坛。":"证据 "+q.clue+"/3"},
    7:{t:"第七章 · 天外问剑",o:"仙使把青冥叫作税。人间若无人应剑，天门便会永远压在九州头顶。",p:q.cleared?"天门已裂。":"尚未登天门"},
    8:{t:"第八章 · 青冥归位",o:"长卷并未结束。你要把道统还给人间，还是把残卷、灵焰和名册都收进自己气海。",p:q.ending?("终局："+q.ending):"尚未收束"},
    9:{t:"终章 · 问道长生",o:"长生不是寿元，是你留下的因果。可重温天门，可回顾伏笔，也可继续游历九州。",p:q.cleared?"已问鼎青冥。":"尚未问鼎"}
  };
  return map[q.chapter]||map[1];
}
function qmOpt(k,tag,c,tx,hint,f){return {k,tag,c,tx,hint,f};}
function qmEvent(title,text,opts){
  curEvent={kind:"青冥长卷",t:title,n:text,opts:opts||[]};
  renderPlay();
}
function qmFight(name,elem,atkMul,hpMul,spirit,tag){
  const atk=Math.max(12,Math.round((18+idxOf(S.realm)*4)*atkMul));
  const hp=Math.max(110,Math.round((S.hpMax||160)*hpMul));
  const e=mkEnemy(name,S.realm,S.sub==="圆满"?"后期":"圆满",elem,atk,hp,spirit,name);
  e.outlaw=true;
  startCombat(e,tag);
}
function qmAdvance(ch,scene,clue){
  qmEnsure();
  const q=S.qingming;
  if(typeof ch==="number") q.chapter=ch;
  if(typeof scene==="number") q.scene=scene;
  if(typeof clue==="number") q.clue=clue;
}
function qmYou(){return htmlEsc(S&&S.name?S.name:"无名");}
function qmPathLine(){
  const p=S.qingming.path;
  if(p==="护生剑道") return "你袖中那柄护生剑自己轻轻一颤，像在提醒你：先问人，再问敌。";
  if(p==="改命术道") return "改命篇在识海里翻了一页。它不劝你做圣人，只问你：这场不公，改不改。";
  if(p==="身为薪火") return "你的伤在风里反而暖起来。有些路不是赢，是把自己烧给还活着的人。";
  return "";
}
function qmToLove(nextChapter){
  qmEnsure();
  const q=S.qingming;
  q.next=clamp(Math.round(Number(nextChapter)|| (q.chapter+1)),1,9);
  q.scene=10;
}
function qmLoveDone(){
  qmEnsure();
  const q=S.qingming;
  const n=q.next||Math.min(9,q.chapter+1);
  q.next=0;
  qmAdvance(n,0, q.chapter===6?3:0);
}
function qmBondObj(n){
  if(typeof bondState==="function") return bondState(n);
  S.bonds=S.bonds||{};
  return S.bonds[n]||(S.bonds[n]={met:false,chapter:0,rescues:0});
}
function qmTryBond(n){
  const b=qmBondObj(n);
  const v=S.aff[n]||0;
  const needs=[20,40,60,80];
  while(b.chapter<4 && v>=needs[b.chapter]){
    b.chapter++;
    if(b.chapter===2){ S.hpMax=(S.hpMax||160)+10; S.hp=clamp((S.hp||0)+10,0,S.hpMax); }
    if(b.chapter===3){ S.mpMax=(S.mpMax||120)+10; S.mp=clamp((S.mp||0)+10,0,S.mpMax); }
    if(b.chapter===4){ S.reputation=(S.reputation||0)+2; }
  }
}
function qmMeet(n,gain,loc){
  ensureGameState();
  const b=qmBondObj(n);
  b.met=true;
  if(loc) S.loc=loc;
  const g=Math.max(0,Number(gain)||0);
  if(g){
    if(typeof affGain==="function") affGain(n,g);
    else S.aff[n]=(S.aff[n]||0)+g;
  }else{
    S.aff[n]=Math.max(S.aff[n]||0,12);
  }
  qmTryBond(n);
  return S.aff[n]||0;
}
function qmDao(n){
  ensureGameState();
  S.daoban=S.daoban||[];
  qmMeet(n,0);
  S.aff[n]=Math.max(S.aff[n]||0,82);
  const b=qmBondObj(n);
  b.met=true;
  if(b.chapter<4) b.chapter=4;
  if(!S.daoban.includes(n)) S.daoban.push(n);
  return n;
}
function qmTone(n,key){
  try{
    const tone=(typeof NPCS==="object" && NPCS[n] && NPCS[n].tone)||"";
    if(tone && typeof ROM==="object" && ROM[tone] && ROM[tone][key]) return ROM[tone][key];
  }catch(e){}
  return "";
}
function qmDualNow(n){
  qmDao(n);
  const bonus=(S.tizhi&&(String(S.tizhi).includes("玄阴")||String(S.tizhi).includes("纯阳")))?8:5;
  S.xiu=clamp((S.xiu||0)+bonus,0,100);
  S.hp=clamp((S.hp||0)+14,0,S.hpMax||200);
  S.mp=clamp((S.mp||0)+14,0,S.mpMax||160);
  return qmTone(n,"duet")||qmTone(n,"kiss")||"";
}
function qmLadies(){
  const names=["小满","苏沐","顾清玄","阿绾","云栖","沈墨卿","阿霜","洛浅浅","温若曦","谢无咎","红芍","苏晚晴","月姬","花千影","萧景行","洛青瑶","叶知秋","白凝霜","墨尘","姬无夜","玄机子"];
  return names.filter(n=>{
    if((S.daoban||[]).includes(n)) return true;
    if((S.aff[n]||0)>=12) return true;
    return !!(S.bonds && S.bonds[n] && S.bonds[n].met);
  });
}
function qmLadyLine(){
  const a=qmLadies();
  const db=S.daoban||[];
  if(!a.length) return "红颜尚未入卷。走下去，她们会自己来。";
  if(db.length) return "道侣："+db.join("、")+"。已入卷："+a.join("、")+"。";
  return "已入卷的红颜："+a.join("、")+"。好感会在长卷里自己涨，不必回情缘菜单逐个对话。";
}
function qmHaremOpt(k,n,kind){
  const map={
    close:["#D88FA5","靠近她","把这一夜写进缘线，好感大增"],
    dual:["#C4675C","双修结侣","灵肉同修，结为道侣。后宫可并存"],
    walk:["#6FA698","并肩赶路","好感仍会涨，只是今夜点到为止"]
  };
  const m=map[kind]||map.close;
  return qmOpt(k,kind==="dual"?"双修":kind==="walk"?"赶路":"情愫",m[0],n,m[1],null);
}

function showQingming(){
  ensureGameState(); qmEnsure();
  curEvent=null;
  const q=S.qingming;
  const quest=qmQuest();
  const hist=(q.history||[]).slice(-8).map(x=>"<div class=\"sm\">· "+htmlEsc(x)+"</div>").join("")||"<div class=\"sm\">尚未落笔。从废祠夜雨开始，这一卷会记住你。</div>";
  const needInv=(q.chapter===1&&q.clue<3)||(q.chapter===6&&q.clue<3);
  const canForce=(q.chapter===1&&q.clue>=2)||(q.chapter===6&&q.clue>=3)||(q.chapter!==1&&q.chapter!==6);
  const opts=[];
  if(!q.cleared || q.chapter<9){
    opts.push(opt("续","长卷","#C9A45C", canForce?"继续本章":"先把伏笔找齐再推进","qmStory","","线性剧情，选择会改写后文"));
  }
  if(needInv) opts.push(opt("查","铺垫","#7FA8C9",q.chapter===1?"调查今夜三处现场":"搜集帝京三证","qmInvestigate","","查得越全，后面的人越不会被认错"));
  opts.push(opt("忆","因果","#A98FD9","回顾已写下的选择","qmRecall","","看看哪些伏笔已经回收"));
  if(q.cleared) opts.push(opt("战","重温","#C9A45C","重温天门一战","qmReplay","","可反复挑战，灵石与修为"));
  const body=`<div class="questbox"><div class="chapter">${htmlEsc(quest.t)}</div><div>${quest.o}</div><div class="sm">${htmlEsc(quest.p)}　路：${htmlEsc(q.path||"未择")}　伴：${htmlEsc(q.ally||"无")}　誓：${htmlEsc(q.oath||"无")}　焰：${htmlEsc(q.flame||"无")}</div></div>
  <div class="row sm">青冥长卷是一条独立的线性修仙主线。废祠名册、南疆阿霜、血月祭坛、东海灵焰、帝京仙胎、天外之税，是同一条因果。情缘不必回菜单一个个点——她们会在卷中自己走来，好感、暧昧与道侣都会写进后文。</div>
  <div class="row sm">${htmlEsc(qmLadyLine())}</div>
  <div class="opts">${opts.join("")}</div>
  <hr class="sep"><div class="row em">已记下的因果</div>${hist}`;
  $("panel").innerHTML=panel("mystic",htmlEsc(qmTitle())+" · "+qmYou(),body)+statusCard();
}
function qmRecall(){
  qmEnsure();
  const q=S.qingming;
  const lines=[
    q.path?"你在残碑前择了「"+q.path+"」。":"你还没有在青冥残碑前回答“还想不想做人”。",
    q.ally==="阿霜"?"阿霜还走在你身侧。南疆那夜的雨，她没有白等。":q.ally==="失散"?"你取走了心法。阿霜的目光，会在后面的祭坛上回来。":"南疆的人尚未入卷。",
    q.oath?"血月之下你立誓「"+q.oath+"」。":"血月还没升起，或者你还没为那些名字做决定。",
    q.flame?"东海古碑把「"+q.flame+"」认给了你。":"归墟的焰还封着。",
    qmFlag("shenAlly")?"沈无咎不是今夜的凶手。你把这点看清了，后面许多刀都会偏一寸。":qmFlag("maskDead")?"青铜面具碎在你手里。有些真相，死人也说不清。":"废祠里的面具人，还只是一个影子。",
    qmFlag("silverAlly")?"苏晚晴与你交换过盟印。银面之后，是青冥没死透的外门。":"东海的银面尚未揭开。",
    q.ending?"终局已落笔："+q.ending+"。":"终局未写。天门前后，都还来得及改。",
    qmLadyLine()
  ];
  qmEvent("因果回廊", qmP(["你在青冥残卷的空白处看见自己的字。不是天书记的，是你一刀一念写下的。"].concat(lines)), [
    qmOpt("A","返回","#6FA698","合上残卷","回到长卷",()=>qmToHub())
  ]);
}
function qmReplay(){
  ensureGameState();
  qmFight("天外仙使残影","金",1.22,0.88,90,"qmReplay");
}
function qmToHub(){ S._qmHub = true; }
function qmGate(title, paras){
  const st=S.qingming;
  if(st.scene>0) return false;
  qmEvent(title, qmP(paras), [
    qmOpt("A","入卷","#C9A45C","走进这一章","铺垫已落下，接下来才是抉择",()=>{ st.scene=1; })
  ]);
  return true;
}
function qmContinue(){
  const st=S.qingming;
  if(!st) return showQingming();
  if(st.chapter===1 && !qmFlag("forcedEnter") && !(qmFlag("sawYaolu")&&qmFlag("sawCliff")&&qmFlag("sawGe"))){
    return qmChapter1Investigate();
  }
  if(st.chapter===6 && st.clue<3 && !(qmFlag("evTianlao")&&qmFlag("evAnxiang")&&qmFlag("evChaotang"))){
    return qmChapter6Investigate();
  }
  showQingmingStory();
}
function qmChoose(key){
  if(!curEvent||!curEvent.opts) return;
  const o=curEvent.opts.find(x=>x.k===key);
  S._qmHub=false;
  curEvent=null;
  if(o&&o.f) o.f();
  try{ if(typeof saveLocalAuto==="function") saveLocalAuto(); }catch(e){}
  if(CB) return;
  if(curEvent) return;
  if(phase!=="play") return;
  if(S._qmHub){ S._qmHub=false; showQingming(); return; }
  qmContinue();
}
function showQingmingStory(){
  ensureGameState(); qmEnsure();
  const q=S.qingming;
  const fn={1:qmChapter1,2:qmChapter2,3:qmChapter3,4:qmChapter4,5:qmChapter5,6:qmChapter6,7:qmChapter7,8:qmChapter8,9:qmChapter9}[q.chapter];
  if(fn) fn(); else showQingming();
}
function qmInvestigate(){
  ensureGameState(); qmEnsure();
  const q=S.qingming;
  if(q.chapter===1) return qmChapter1Investigate();
  if(q.chapter===6) return qmChapter6Investigate();
  qmLog("青冥长卷","本章没有更多现场可查，直接推进即可。");
  showQingmingStory();
}


function qmChapter1(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  if(!qmFlag("opened")){
    qmFlag("opened",true);
    qmEvent("废祠夜雨", qmP([
      "后山的雨落在瓦上没有声，落在石阶上却把青苔洗成暗红。"+qmYou()+"站在废祠门口时，门神的脸已经被人刮去。",
      "香灰是冷的，烛泪却是新的。有人刚刚在这里烧过东西——烧的不是香，是名册。纸灰里还能辨出一半个“霜”字，像有人在火里把名字往外抢。",
      "<span class=\"sm\">药庐的空瓶、断崖的剑痕、藏经阁的夜影，三处都还留着今晚的温度。你查得越全，越不容易把人认错。</span>"
    ]), [
      qmOpt("A","铺垫","#7FA8C9","先去三处现场找齐伏笔","查满两处可入祠，查满三处会多一段真相",()=>{q.scene=1; qmLog("废祠夜雨","你没有立刻推门。雨还在下，痕迹还没被冲干净。");}),
      qmOpt("B","冒险","#C4675C","不管线索，直接闯祠","信息不足时，容易把救人的人当成凶手",()=>{qmFlag("forcedEnter",true); qmChapter1Confront();})
    ]);
    return;
  }
  if(q.clue<2 && !qmFlag("forcedEnter")){
    qmEvent("雨还没停", qmP([
      "废祠门缝里仍有纸灰往外涌。你若现在推门，只能看见一个戴青铜面具的人，和一场说不清的火。",
      "药庐、断崖、藏经阁还在夜里等你。有些铺垫不查，后面的转折就会变成误会。"
    ]), [
      qmOpt("A","调查","#7FA8C9","折返三处现场","去把伏笔找齐",()=>qmChapter1Investigate()),
      qmOpt("B","强闯","#C4675C","仍要现在入祠","可进，但你会少看见一层真相",()=>{qmFlag("forcedEnter",true); qmChapter1Confront();})
    ]);
    return;
  }
  qmChapter1Confront();
}
function qmChapter1Investigate(){
  const q=S.qingming;
  if(!qmFlag("sawYaolu")){
    qmEvent("药庐空瓶", qmP([
      "失踪弟子的床下滚出一只药瓶，瓶底残留血腥甜香。药童小满把袖口绞白，欲言又止。",
      "领药册上有人用极工整的字摹了长老的签。摹得越像，越不像临时起意。"
    ]), [
      qmOpt("A","物证","#7FA8C9","辨药渣、查领药册","线索+1，神识微涨",()=>{
        qmFlag("sawYaolu",true); q.clue++; S.six.神识=clamp(S.six.神识+0.4,1,20);
        qmFlag("knowYinhun",true);
        qmMeet("苏沐",10,"青云宗药庐");
        qmLog("药庐","药渣是禁药引魂散。苏沐闻了一下便沉下脸：这不是外门能配的方。她把你的袖口轻轻拉直，像怕你也被写成‘自己走’的人。");
      }),
      qmOpt("B","人情","#D88FA5","安抚小满，请她说实话","线索+1，小满好感+8，听见面具人的名字",()=>{
        qmFlag("sawYaolu",true); q.clue++; qmMeet("小满",12,"青云宗药庐");
        qmFlag("heardShen",true);
        qmLog("药庐","小满说：戴青铜面具的人不是来投毒的。他低声问过‘阿霜还在不在南疆等雨’，取走的是解药，不是引魂散。她说话时一直揪着你的衣角，像怕你下一秒也消失。");
      })
    ]);
    return;
  }
  if(!qmFlag("sawCliff")){
    qmEvent("断崖剑痕", qmP([
      "后山断崖留着两种剑痕。一道青云正剑，稳、直、不肯取性命；一道阴毒逆行，专挑经脉。",
      "崖下衣角绣着半截没人认得的青纹。不像血魔，也不像青云。像一种已经被史书挖掉的颜色。"
    ]), [
      qmOpt("A","剑道","#7FA8C9","以剑道复盘交手","线索+1，剑道+1。看清：失踪者不是被掳，是接头后遭灭口",()=>{
        qmFlag("sawCliff",true); q.clue++; S.wudao["剑道"]=(S.wudao["剑道"]||0)+1;
        qmFlag("knowMeet",true);
        qmMeet("顾清玄",8,"后山断崖");
        qmLog("断崖","失踪弟子是去接头的。灭口的人用的是血月逆剑，救人的那一剑却在拼命挡。崖上月白衣角一闪，顾清玄收剑时看了你一眼：这招，不是青云的杀招。是护生。");
      }),
      qmOpt("B","攀崖","#C4675C","沿血迹下崖","线索+1，气血-8，得半块青冥令",()=>{
        qmFlag("sawCliff",true); q.clue++; S.hp=clamp(S.hp-8,1,S.hpMax);
        giveItem("半块青冥令",1); qmFlag("hasLing",true);
        qmMeet("阿绾",12,"青岳灵谷");
        qmLog("断崖","你在崖缝摸到半块青令时，一群灵蝶围上来。阿绾赤着脚从藤上探出头，银铃叮叮当当：别掉下去呀。她把你的手拉得很紧，像拉住一只会飞走的糖。");
      })
    ]);
    return;
  }
  if(!qmFlag("sawGe")){
    qmEvent("藏经阁夜影", qmP([
      "子夜，一道黑影潜入禁层。值守长老尚未察觉。黑影没有翻功法，只翻名册——把要被勾掉的名字一张张抽走。",
      "火折子亮起时，你看见他怀里那叠纸：有的已烧焦，有的还写着村名。最上面一张，赫然是“阿霜”。"
    ]), [
      qmOpt("A","跟踪","#C4675C","独自跟上，看他落脚何处","线索+1，侠义+1。看见他进了废祠，却把名册护在心口",()=>{
        qmFlag("sawGe",true); q.clue++; S.jianghu.xia+=1; qmFlag("sawProtect",true);
        qmLog("藏经阁","黑影最终没把名册交给任何人。他进了废祠，把门反锁，像要把火压在自己身上。");
      }),
      qmOpt("B","合围","#6FA698","通知长老合围","线索+1，贡献+5。人遁了，留下烧焦名册残页",()=>{
        qmFlag("sawGe",true); q.clue++; S.contribution+=5; giveItem("烧焦名册残页",1);
        qmLog("藏经阁","黑影遁走。残页上除了阿霜，还有三个村名。这些村子，你会在血月那天再看见。");
      })
    ]);
    return;
  }
  qmLog("调查","三处现场都看过了。再入废祠，面具下的那张脸会不一样。");
  qmChapter1Confront();
}
function qmChapter1Confront(){
  const q=S.qingming;
  const full=qmFlag("sawYaolu")&&qmFlag("sawCliff")&&qmFlag("sawGe");
  const hint=full
    ? "你已经看见：他在抢名册，不是在送名册。药是解药，剑是挡剑，火是想把名单烧给自己。"
    : qmFlag("heardShen")
      ? "你只听见一个名字：沈无咎。以及一句没头没尾的话——阿霜还在南疆等雨。"
      : "你只看见青铜面具和一场火。火里有名字，名字里有人。";
  qmEvent("废祠地底", qmP([
    "推门的瞬间，纸灰像一群白鸟扑出来。戴青铜面具的人跪在丹井边，把名册往井里送。井不是井，是一座微型祭坛。",
    hint,
    "他抬头看你，声音很年轻：“走。或者帮我。第三种选择，是把我当成今夜的凶手。”"
  ]), full ? [
    qmOpt("A","辨认","#6FA698","按住他，先问名册去向","不打，先把伏笔问清楚。可结为暗线盟友",()=>{
      qmFlag("shenAlly",true); q.ally=q.ally||"沈无咎";
      giveItem("完整名册",1); S.jianghu.xia+=2; S.six.神识=clamp(S.six.神识+0.5,1,20);
      qmLog("第一章","沈无咎摘下面具。他说自己是青冥末代内门，今夜不是来杀人，是来把名册从血月手里抢回去。阿霜是他师妹，还在南疆等一场能把瘴气洗开的雨。");
      qmToLove(2);
    }),
    qmOpt("B","夺册","#C9A45C","先抢名册，再决定他的死活","得名册。他负伤遁走，后文仍可能出现",()=>{
      giveItem("抢出名册",1); qmFlag("shenFled",true); S.reputation+=4;
      qmLog("第一章","你夺下名册时，他没有还手。面具裂了一线，露出很年轻的眼睛：“南疆有雨。你若还想做人，就去找阿霜。”");
      qmToLove(2);
    }),
    qmOpt("C","斩断","#C4675C","当作凶手，一剑了结","战斗。胜则名册入手，但会少一条后援",()=>{qmFight("青铜面具·沈无咎","金",1.05,0.62,76,"qmCh1");})
  ] : [
    qmOpt("A","开战","#C4675C","当他是焚册凶手","战斗。信息不足时，这一剑可能斩错人",()=>{qmFight("青铜面具人","金",1.08,0.66,78,"qmCh1");}),
    qmOpt("B","喝止","#7FA8C9","先问他名册是要烧给谁","他会留下半句真话后遁走",()=>{
      giveItem("烧焦名册",1); qmFlag("shenFled",true);
      qmLog("第一章","他没有摘面具。只丢下一句：“阿霜还在南疆等雨。名册不是粮，是税。”随后身形碎进纸灰里。");
      qmToLove(2);
    }),
    qmOpt("C","旁观","#555","让他烧完，自己只记下祭纹","业力+2，后文帝京能更快看懂炉阵，但废祠会记住你的沉默",()=>{
      S.karma+=2; qmFlag("watchedFire",true); qmGiveSkill("残火记纹","火",18,10,"阵");
      qmLog("第一章","你看着名字变成灰。祭纹进了你眼里，也进了你以后所有的梦。有些债，不是打赢就能还。");
      qmToLove(2);
    })
  ]);
}

function qmChapter2(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  const fromShen = qmFlag("shenAlly")
    ? "沈无咎把半块令按进残碑。碑上的青纹像认出了自己人，裂开一道能走人的缝。"
    : qmFlag("maskDead")
      ? "你把碎掉的青铜面具放在碑前。碑没有喜，也没有怒，只把那只眼睛映得更年轻。"
      : "废祠地底比门内更静。残碑立在水里，水里沉着许多没有烧完的姓。";
  const extra = qmFlag("hasLing") ? "你袖中那半块青冥令自己发热，像要回家。" : "";
  if(qmGate("夜走出祠", [
    fromShen + extra,
    "你没有把这一夜立刻兑成灵石或突破。纸灰黏在袖口上，搓也搓不掉。真正的修仙，往往从这种搓不掉的东西开始。",
    "后山更深的地方，被铲掉的宗名自己浮出来：青冥。碑阳空着，像在等一个还肯做人的人落笔。"
  ])) return;
  qmEvent("青冥残碑", qmP([
    fromShen+" "+extra,
    "碑阳只剩半句：“青冥不问寿，只问你还想不想做人。”碑阴刻着三条没走完的路——以剑护生、以术改命、以身为薪。",
    "水下有人轻轻咳了一声。不是活人口气。青冥末代掌教的残念从碑缝里渗出来，看着你，像看一枚被他偷偷埋进人间的种子。",
    "<span class=\"sm\">他没有立刻传功。他要你先回答：若青冥被写成收命之阵，你是把人护住、把命改掉，还是把自己烧进去。</span>"
  ]), [
    qmOpt("A","护生","#6FA698","择剑道护生","剑道+2，后文偏侠义。南疆、血月、天门都会先问人",()=>{
      q.path="护生剑道"; S.wudao["剑道"]=(S.wudao["剑道"]||0)+2; S.jianghu.xia+=2;
      qmGiveSkill("青冥护生剑","金",28,14,"剑");
      qmLog("第二章","你把“做人”两个字按进心里。残碑答应把剑先给你。从此青冥剑出鞘，先护人，再问敌。");
      qmToLove(3);
    }),
    qmOpt("B","改命","#A98FD9","择术道改命","悟性+2，得地阶功法。后文可用规则换路，而非只靠杀伐",()=>{
      q.path="改命术道"; S.six.悟性=clamp(S.six.悟性+2,1,20);
      qmGiveGongfa("青冥改命篇","地阶");
      qmLog("第二章","你没有答应做圣人，只答应把不公平的命改一改。残碑把一页还没写完的术送给你。");
      qmToLove(3);
    }),
    qmOpt("C","为薪","#C4675C","择身道为薪","气血上限+50。后文可把自己的寿与伤，换成别人的活路",()=>{
      q.path="身为薪火"; S.hpMax+=50; S.hp=S.hpMax; S.karma+=1;
      qmGiveSkill("薪火燃身","火",26,12,"体");
      qmLog("第二章","你把寿元当成柴。残碑在夜里轻轻裂开，像是答应了，又像是叹气。");
      qmToLove(3);
    })
  ]);
}
function qmChapter3(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  const ashWait = (qmFlag("heardShen")||qmFlag("shenAlly")||qmFlag("shenFled"))
    ? "雾里有人喊你的名字，发音很轻，像在等一场答应过的雨。"
    : "雾里有人咳血。她并不认识你，却把半卷心法死死按在胸口，像按着自己还没死透的师门。";
  if(qmGate("南下寻雨", [
    qmPathLine()||"你把残碑那一问按进识海，动身向南。剑可以不出鞘，路却必须自己走。",
    (qmFlag("heardShen")||qmFlag("shenAlly")||qmFlag("shenFled")) ? "名册上那个霜字一夜比一夜清晰。有人说她还在南疆等雨。你要去看这场雨到底等的是谁。" : "名册残页里有个霜字。越往南，瘴气越像被人写反的护生阵。",
    "真正的铺垫往往很慢。你走了很久，久到开始怀疑：修仙若只是变强，何必要记得一个还活着的名字。"
  ])) return;
  qmEvent("南疆毒瘴", qmP([
    qmPathLine(),
    "万毒瘴林没有路。路是用前人的骨头垫出来的。"+ashWait,
    "女修名叫阿霜。名册上那一笔，原来还活着。她说这卷青冥心法能解瘴，也能把救命的人炼成下一炉药——因为有人早已把护生之术，写成了收命之阵。",
    "<span class=\"sm\">救人、夺卷、或者把瘴母斩开让两个人都活。你在废祠里对名册做过的事，她隐约都闻得见。</span>"
  ]), [
    qmOpt("A","救人","#D88FA5","先救阿霜，心法以后再说","结伴阿霜，功德+2。后文血月、帝京、天门她都会回来",()=>{
      q.ally="阿霜"; S.merit+=2; S.jianghu.xia+=2; S.mp=clamp(S.mp-12,0,S.mpMax);
      qmFlag("ashuang",true); qmMeet("阿霜",20,"南疆瘴林");
      if(q.path==="身为薪火"){ S.hp=clamp(S.hp-15,1,S.hpMax); qmLog("第三章","你把她经脉里的毒引到自己身上。阿霜睁眼时只说：那以后你欠我的，就用命还。我也会还。"); }
      else qmLog("第三章","你把心法按回去，只问她还能不能走。阿霜笑得很浅：名册上的人第一次有人先问活，不问功法。");
      qmToLove(4);
    }),
    qmOpt("B","夺卷","#C9A45C","先取心法，再视情况救人","得青冥心法。阿霜会活，却会在血月那天以另一种方式回来",()=>{
      q.ally="失散"; qmGiveGongfa("青冥心法残卷","玄阶"); S.xiu=clamp(S.xiu+8,0,100);
      qmFlag("tookScroll",true);
      qmLog("第三章","你取走心法时，阿霜看你的眼神像看一场即将应验的旧咒。她没有拦，只说：血月升起时，你会认得这些名字。");
      qmToLove(4);
    }),
    qmOpt("C","破瘴","#A98FD9","强行破开瘴阵，两人一起走","战斗：南疆瘴母。胜则人与心法双全",()=>{qmFight("南疆瘴母","木",1.12,0.72,74,"qmCh3");})
  ]);
}
function qmChapter4(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  const ash = qmFlag("ashuang")
    ? "阿霜把你往祭坛外拽：你若也跳下去，南疆那夜的雨就白下了。她认得阵眼——那是青冥护生剑的逆写。"
    : qmFlag("tookScroll")
      ? "祭坛下有人喊你的名字。阿霜被绑在第三根柱上，心法不在她怀里，目光却比刀还亮。"
      : "祭坛下有人喊那些你在废祠见过的村名。纸灰里没烧尽的字，今夜都站起来了。";
  const watched = qmFlag("watchedFire") ? "你在废祠旁观过一场火。今晚的祭纹与那夜一模一样，像专门等你来认。" : "";
  if(qmGate("血月将升", [
    q.ally==="阿霜" ? "阿霜不看月亮，只看你袖里的名册：这些名字，今夜都会自己走向柱子。" : q.ally==="失散" ? "你取走了心法。南疆的雨停了，阿霜的目光没有停。" : "南疆过后，天色发红。不是晚霞。是有人把一座城的命提前写成了祭文。",
    qmFlag("watchedFire") ? "废祠那夜你旁观过火。今夜风里的纸灰味道一模一样。有些转折，早在你沉默时就写好了。" : "废祠烧掉的不是纸，是今夜要走上祭坛的人。",
    "修仙到了这一步，比拼的不是法术品阶，是你还肯不肯为不相干的人出剑。"
  ])) return;
  qmEvent("血月祭坛", qmP([
    "血月升到正中时，祭师展开名册。册上的人自己走向柱子，步子稳得像回家。",
    ash+" "+watched,
    "祭师宣布：可用一名修士换一座城的长生。他称这是青冥遗术。残碑若还听得见，大概会把这六个字从世上刮掉。",
    "<span class=\"sm\">斩祭、以寿换命、或冷眼记下阵法。三种选择都会活到帝京与天门。</span>"
  ]), [
    qmOpt("A","斩祭","#C4675C","斩杀血月祭师，救下祭品","战斗。胜则立誓护生，侠义大增",()=>{qmFight("血月祭师","火",1.18,0.78,80,"qmCh4");}),
    qmOpt("B","换命","#8B6FA8","以自己三年寿元换下祭品","寿元减少，功德+6。东海古碑会认得你烧掉的年",()=>{
      q.oath="以寿换命"; S.age+=3; S.merit+=6; S.jianghu.xia+=3; qmFlag("tradedLife",true);
      if(qmFlag("tookScroll") && !qmFlag("ashuang")){ q.ally="阿霜"; qmFlag("ashuang",true); qmMeet("阿霜",15,"血月祭坛"); qmLog("第四章","你把三年寿元投进血月时，阿霜的绳子自己断了。她没谢你夺卷，只谢你还肯把命放回来。"); }
      else qmLog("第四章","你把三年寿元投进血月。祭坛熄了，城中灯火却一盏盏亮起来。有个孩子问：侠士，我们是不是不用自己走到柱子上去了。");
      qmToLove(5);
    }),
    qmOpt("C","记阵","#555","按兵不动，只记下阵法","业力+3，得血月记阵。后文帝京能拆炉，但有人会记得你当时没拔剑",()=>{
      q.oath="冷眼记阵"; S.karma+=3; qmGiveSkill("血月记阵","火",22,12,"阵"); qmFlag("recordedArray",true);
      if(qmFlag("ashuang")){ S.aff["阿霜"]=Math.max(0,(S.aff["阿霜"]||0)-20); qmLog("第四章","阿霜没有骂你。她只把剑收回鞘里，从此走路不再与你并肩。有些人能原谅杀错，不能原谅旁观。"); }
      else qmLog("第四章","你记住了阵法，也记住了那些人看你的眼睛。城还在，灯却少了很多。");
      qmToLove(5);
    })
  ]);
}
function qmChapter5(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  const oath = q.oath==="以寿换命"
    ? "古碑先问你还剩多少年。你没回答，碑却自己裂开一道缝，像认得你在血月里烧掉的寿。"
    : q.oath==="冷眼记阵"
      ? "古碑拒绝立刻亮起。它要的不是阵法，是你为什么活到现在。海风把你的沉默吹得很响。"
      : "古碑上的名字被血月洗过，又被海风重新刻深。";
  const seed = "碑阳刻着"+qmYou()+"的道号。旁边本该有另一个名字，被人用剑剜去，只剩一道空槽。空槽的宽度，刚好是“青冥子”三个字。";
  if(qmGate("东海潮生", [
    q.oath==="以寿换命" ? "你少了三年寿。海风一吹，腕上脉息便空一截。" : q.oath==="冷眼记阵" ? "你把阵法记下了，也把那些走向柱子的背影记下了。海面平得像一句还没问出口的责问。" : q.oath==="斩祭护生" ? "血月熄后你一路向东。剑上还留着祭师的火漆——那不是邪教的印，是上方收税的印。" : "潮声越来越像有人在碑下念你的名字。",
    "归墟不在地图上。它只在命格被剜过的人眼前涨潮。你每吐纳一次，空槽就亮一分。",
    "这一章不是给宝物的。是让你看清：所谓天选，多半是前人把道种塞进你身体时，没问过你愿不愿意。"
  ])) return;
  qmEvent("东海归墟", qmP([
    oath,
    seed,
    "潮水退去时，银面少女站在碑下。她把令牌抛来，声音清冷：“别急着认自己是天选。这颗道种是青冥子在覆灭那夜，塞进一个尚未出生的孩子身体里的——为的是让青冥还能问一次人。”",
    "碑下三道灵焰：青焰护心、赤焰焚业、玄焰改命。取哪一道，天门那一战会完全不同。"
  ]), [
    qmOpt("A","青焰","#6FA698","取青焰护心","气血上限+70、功德+3。天门之战偏守、可护住人",()=>{
      q.flame="青焰护心"; S.hpMax+=70; S.hp=S.hpMax; S.merit+=3;
      qmGiveSkill("青焰护心","木",32,16,"护");
      qmFlag("silverAlly",true); qmMeet("苏晚晴",12,"东海归墟");
      qmLog("第五章","青焰入体时，苏晚晴摘下一角银面：外门苏晚晴。她说国师袖里有半块青冥令，帝京的炉，就是血月的放大。");
      qmToLove(6);
    }),
    qmOpt("B","赤焰","#C4675C","取赤焰焚业","攻击大增，业力+2。可在帝京把炉连人带罪一起烧干净",()=>{
      q.flame="赤焰焚业"; S.karma+=2; S.xiu=clamp(S.xiu+12,0,100);
      qmGiveSkill("赤焰焚业","火",38,18,"焚");
      qmFlag("silverAlly",true);
      qmLog("第五章","赤焰认你时，海面像被点燃。苏晚晴没有拦，只说：你若用这焰去烧不该烧的人，青冥就又写成了税。");
      qmToLove(6);
    }),
    qmOpt("C","玄焰","#A98FD9","取玄焰改命","悟性+2。天门可选择改写规则，而不只是斩仙使",()=>{
      q.flame="玄焰改命"; S.six.悟性=clamp(S.six.悟性+2,1,20);
      qmGiveSkill("玄焰改命","雷",30,20,"改");
      qmFlag("silverAlly",true);
      if(q.path!=="改命术道") qmLog("第五章","玄焰很挑人。它最终还是来了，像看你在残碑前没选改命，却仍不甘心把命交给上方。");
      else qmLog("第五章","改命篇与玄焰一碰即合。苏晚晴低声说：天门不是门，是税口。税口能拆，也能改成可以问的门。");
      qmToLove(6);
    })
  ]);
}

function qmChapter6(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  if(q.clue<3){
    if(qmFlag("evTianlao")||qmFlag("evAnxiang")||qmFlag("evChaotang")) return qmChapter6Investigate();
    if(qmGate("入京之前", [
      q.flame==="玄焰改命" ? "玄焰在识海里翻。它不急着烧人，它在看这座城的规则还能不能改。" : q.flame==="赤焰焚业" ? "赤焰一路都在响。你得先分清：哪些是罪，哪些只是被写进税册的人。" : "青焰护着心口。帝京越近，护得越紧。像知道前面那一炉，专吃心。",
      qmFlag("silverAlly") ? "苏晚晴的银面在茶雾后一闪：三证不齐，不要去掀那张桌。裴衡曾经也是青冥的人。" : "茶馆里有人反复说三句话：天牢、暗巷、朝堂。像生怕你只带一把剑就去送死。",
      "修仙入了帝京，就不再是斩妖。是查清谁把护生写成了收命，谁把问道写成了纳税。"
    ])) return;
    qmEvent("帝京棋局", qmP([
      "皇城之上已升起第二轮血日。国师裴衡以万民气运豢养仙胎，炉阵的纹路，你在废祠和血月都见过。",
      qmFlag("silverAlly")?"苏晚晴在茶楼留下半块令：天牢有证人，暗巷有罪证，朝堂有不敢说的口。三证不齐，不要去掀那张桌。":"茶馆里有人反复说三句话：天牢、暗巷、朝堂。像生怕你只带一把剑就去送死。",
      "<span class=\"sm\">先把三处证据找齐。裴衡不是一个能靠气势吓退的人——他曾经是青冥的人。</span>"
    ]), [
      qmOpt("A","取证","#7FA8C9","先去三处取证","铺垫收齐之前，不贸然决战",()=>qmChapter6Investigate())
    ]);
    return;
  }
  qmChapter6Confront();
}
function qmChapter6Investigate(){
  const q=S.qingming;
  if(!qmFlag("evTianlao")){
    const help = qmFlag("ashuang")
      ? "阿霜换上狱卒的衣，把钥匙扔给你：南疆那夜你问过我能不能走。今晚换我问你——证人还能不能走。"
      : qmFlag("shenAlly")
        ? "沈无咎在狱门留下一道青纹：证人是当年开山的内应之一。他肯说，是因为名册上有他女儿。"
        : "天牢阴冷。证人被封了舌，你只能从他眼白里读出“裴衡”两个字。";
    qmEvent("天牢证人", qmP([
      help,
      "证人终于吐出一句完整的话：裴衡是青冥叛徒。覆灭那夜，是他打开山门，把护生剑谱交给上方，换自己多活五百年。"
    ]), [
      qmOpt("A","救人证","#6FA698","救出证人并记下供词","证据+1。后文朝堂可用人证",()=>{
        qmFlag("evTianlao",true); q.clue++; S.jianghu.xia+=2; qmFlag("hasWitness",true);
        qmLog("天牢","你把证人带出皇城。他跪在雨里说：裴衡不是为了长生才叛的。他是怕青冥把“人可以不交税”这件事教给全世界。");
      }),
      qmOpt("B","取供","#C9A45C","只取供词，人先留在牢里","证据+1，更安全，但证人可能被灭口",()=>{
        qmFlag("evTianlao",true); q.clue++; qmFlag("witnessLeft",true);
        qmLog("天牢","你记下供词。走出天牢时，听见锁响。有些证据能用，有些人你再也见不到。");
      })
    ]);
    return;
  }
  if(!qmFlag("evAnxiang")){
    const arr = (qmFlag("recordedArray")||qmFlag("watchedFire"))
      ? "暗巷墙上皮下的阵纹，与你记下的血月祭纹严丝合缝。你甚至能指出哪一笔是后来改过的——改的目的，是把一座城换成一炉仙胎。"
      : "暗巷堆着被弃的祭器。你看不懂全部，但认得名册的纸边。";
    qmEvent("暗巷罪证", qmP([
      arr,
      "罪证是一本反写的青冥心法，封面却贴着太一剑门的火漆。护生被改成收命，问道被改成纳税。"
    ]), [
      qmOpt("A","收证","#A98FD9","把逆谱带离暗巷","证据+1，神识+1",()=>{
        qmFlag("evAnxiang",true); q.clue++; S.six.神识=clamp(S.six.神识+0.6,1,20); giveItem("青冥逆谱抄本",1);
        qmMeet("花千影",10,"中州帝京");
        qmLog("暗巷","逆谱抄本入手。花千影坐在你对面喝酒，假面笑着：血月不是邪教，是朝廷的预演。她把一杯酒推过来，指尖在你手背上停了停。");
      }),
      qmOpt("B","毁证","#C4675C","烧掉逆谱，以免再害人","证据+1，功德+2，但朝堂会少一份物证",()=>{
        qmFlag("evAnxiang",true); q.clue++; S.merit+=2; qmFlag("burnedPu",true);
        qmLog("暗巷","纸灰再次升起。你这次是自己烧的。功德+2，可裴衡会笑你又把证据送进火里。");
      })
    ]);
    return;
  }
  if(!qmFlag("evChaotang")){
    const face = (S.jianghu.xia||0)>=8
      ? "有谏官敢为你让路。侠名在帝京不是虚的，至少能让人把殿门开一条缝。"
      : "没人愿为你引路。你只能用一件证物换一个开口的时机。";
    qmEvent("朝堂陈词", qmP([
      face,
      "你把废祠、血月、天牢串成一句：国师不是在养仙胎，是在提前把九州写成税册。殿上静了很久。静，有时比怒更危险。"
    ]), [
      qmOpt("A","当殿","#C9A45C","当殿揭开仙胎炉的来历","证据+1，声望+8",()=>{
        qmFlag("evChaotang",true); q.clue++; S.reputation+=8;
        qmMeet("萧景行",10,"中州帝京");
        qmLog("朝堂","你把因果说完。长公主萧景行没有退席。她看着你，像看着一柄可以共主山河的剑。裴衡在帘后鼓掌，像听一段他早就写好的戏。");
      }),
      qmOpt("B","暗通","#7FA8C9","不掀桌，只把证据交给尚能信的人","证据+1，后文少一场朝堂风波",()=>{
        qmFlag("evChaotang",true); q.clue++; S.six.道心=clamp(S.six.道心+0.5,1,20);
        qmMeet("萧景行",8,"中州帝京");
        qmLog("朝堂","你没有当众撕破脸。证据进了萧景行袖中。她低声说：孤记住你了。帝京的夜因此多了一点变数。");
      })
    ]);
    return;
  }
  qmChapter6Confront();
}
function qmChapter6Confront(){
  const q=S.qingming;
  const traitor = "裴衡站在仙胎炉前，老得像一截不肯倒下的木头。他说：青冥子把道种塞进你身体时，没问过你愿不愿意做人。我打开山门时，也没问过山愿不愿意活。";
  const flame = q.flame==="赤焰焚业" ? "赤焰在你掌心跳。这一炉，烧得掉。" : q.flame==="玄焰改命" ? "玄焰告诉你：炉可以改成门。人不必死，税也可以停。" : "青焰护着你的心口。你若救人，炉会反噬；你若护心，人会少一些。";
  qmEvent("仙胎炉前", qmP([
    traitor,
    flame,
    qmFlag("hasWitness")?"证人就在殿外。裴衡看见他，第一次把笑容收了收。":qmFlag("witnessLeft")?"证人没有出现。殿上只余你的口述，和裴衡那句：死无对证也是一种道。":"没有第三人。只有你、他，和一炉用万民点燃的长生。",
    "<span class=\"sm\">斩国师、毁炉留命、或夺炉自用。这一选择会走进天门，也会走进终章的那句评语。</span>"
  ]), [
    qmOpt("A","斩炉","#C4675C","斩裴衡，毁仙胎炉","最终战前的人祸。胜则人皇气运",()=>{qmFight("国师裴衡","土",1.26,0.92,86,"qmCh6");}),
    qmOpt("B","留命","#6FA698","毁炉，留下国师一条命","功德+4。他会把更狠的仙使引来，却也留下一句真话",()=>{
      S.merit+=4; S.reputation+=12; qmFlag("sparedKing",true);
      qmLog("第六章","你毁了炉，没取他性命。裴衡跪在残灯里笑：你比我更像青冥的人。也更像下一个被上方收税的人。");
      qmToLove(7);
    }),
    qmOpt("C","夺炉","#8B6FA8","把仙胎炉据为己用","战力暴涨，业力+5，终局将更孤",()=>{
      S.karma+=5; S.hpMax+=80; S.mpMax+=50; S.hp=S.hpMax; S.mp=S.mpMax;
      qmFlag("tookFurnace",true); q.oath=q.oath||"夺炉改命";
      qmGiveGongfa("仙胎残炉诀","天阶");
      qmLog("第六章","炉火入体的瞬间，你听见许多名字在喊。有的谢你，有的骂你。长生第一次变得很吵。");
      qmToLove(7);
    })
  ]);
}
function qmChapter7(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  if(qmGate("天门之前", [
    "你把废祠的名册、南疆的雨、血月的誓、东海的焰和帝京的炉，一页页叠进袖中。天门不是更高的地方，是把这些因果收税的地方。",
    qmFlag("ashuang")||qmFlag("silverAlly")||qmFlag("shenAlly") ? "有人还走在你身后。修仙到了问天这一步，最难得的不是孤身，是仍有人肯替你挡第一剑。" : "这一路你走得很干净，也走得很空。残碑那句还想不想做人，会在第一剑到来时变得很响。",
    qmFlag("tookFurnace") ? "仙胎炉在气海里低鸣。它很想替你交税。你若答应，天门会为你开；人间却会再少一批名字。" : qmFlag("sparedKing") ? "裴衡的笑还在耳边：你比我更像青冥的人，也更像下一个被收税的人。" : "裴衡已倒。可他说得对——斩得掉人，斩不掉税。除非你去问门。"
  ])) return;
  const help = [];
  if(qmFlag("ashuang")) help.push("阿霜替你挡了第一道仙光。南疆的雨，原来可以下到天门下。");
  if(qmFlag("silverAlly")) help.push("苏晚晴的银面碎了一半，仍把盟印按在你背上：别死在第一剑，青冥还没问完。");
  if(qmFlag("shenAlly")) help.push("沈无咎把最后半块令扔进门缝，门因此慢合了一息。一息，够你把剑抽出来。");
  if(!help.length) help.push("没有人替你挡第一剑。青冥残碑上那句“还想不想做人”，在这一刻变得很响。");
  const tax = "仙使太一垂眸，把你的灵焰、心法、名册和所有因你而活下来的人，都称作税。他说：你们叫它青冥，我们叫它税。人间若无人交，天门便压下来。";
  const opts = [
    qmOpt("A","应剑","#C4675C","以人间一剑应天门","最终战。前面救过的人会改变这一战的意味",()=>{qmFight("天外仙使·太一","金",1.36,1.05,92,"qmCh7");})
  ];
  if(q.flame==="玄焰改命" || q.path==="改命术道"){
    opts.push(qmOpt("B","改门","#A98FD9","用玄焰把天门改成可问之门","需玄焰改命，否则会被反噬。成功则不斩仙使，改写规则",()=>{
      if(q.flame!=="玄焰改命"){
        S.hp=clamp(S.hp-45,1,S.hpMax);
        qmLog("天门","没有玄焰，你强改规则，被天门反噬。税口还在，只是你吐了一口血。");
        return;
      }
      q.ending="改命不问天"; q.cleared=true; S.xiu=100; S.reputation+=40;
      S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("青冥改命")) S.fortunes.push("青冥改命");
      qmLog("第七章终","你没有斩仙使，只把天门改成了“可问”的门。太一第一次沉默。税，原来也可以停征。");
      qmToLove(8);
    }));
  }
  if(q.path==="身为薪火"){
    opts.push(qmOpt("C","燃己","#C4675C","以自身为薪，点燃天门","年龄+5，气血上限+60。你活着走下来，门会裂",()=>{
      S.age+=5; S.hpMax+=60; S.hp=S.hpMax; q.ending="薪火裂门"; q.cleared=true;
      S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("青冥薪火")) S.fortunes.push("青冥薪火");
      qmLog("第七章终","你把自己烧进门缝里。天门裂开时，有人看见的不是剑光，是一个人还肯为别人热一次。");
      qmToLove(8);
    }));
  }
  qmEvent("天外问剑", qmP(help.concat([tax,"<span class=\"sm\">应剑、改门或燃己。你在残碑前选的路，此刻才真正派上用场。</span>"])), opts);
}
function qmChapter8(){
  const q=S.qingming;
  if(q.scene>=10) return qmChapterLove();
  const recap = [
    q.path?"残碑前你择了"+q.path+"。":"",
    qmFlag("ashuang")?"阿霜还在。":qmFlag("tookScroll")?"心法在你这里，阿霜的目光也在。":"",
    q.oath?"血月下你做过："+q.oath+"。":"",
    q.flame?"东海的焰是"+q.flame+"。":"",
    qmFlag("tookFurnace")?"仙胎炉还在你气海里响。":qmFlag("sparedKing")?"裴衡还活着，他的笑也还活着。":"裴衡已成过去。",
    q.ending?"天门处你写下过："+q.ending+"。":"天门已裂，字还没落。"
  ].filter(Boolean);
  qmEvent("青冥归位", qmP([
    "天门已裂。九州的雨重新落下来，落在废祠、南疆、帝京和所有曾经被写成税册的地方。",
    recap.join(" "),
    "你可以把青冥道统还给九州，让后来者继续问；也可以把残卷、灵焰和名册都收进自己气海，成为下一位“上方来人”。",
    "<span class=\"sm\">归还或独掌。终章的评语，只认你这一步。</span>"
  ]), [
    qmOpt("A","归还","#6FA698","把青冥还给人间","功德与声望大增，人间至尊。废祠将重新有香火，却不再收税",()=>{
      q.ending="青冥归人"; q.cleared=true; S.merit+=10; S.reputation+=50; S.jianghu.xia+=8;
      giveItem("青冥本源",1);
      S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("青冥归人")) S.fortunes.push("青冥归人");
      qmLog("终章","你把残卷放回废祠。雨停了。有个孩子在门口问：以后还能修仙吗？你说能，而且不必拿别人的命去修。");
      qmToLove(9);
    }),
    qmOpt("B","独掌","#C4675C","独掌青冥，问鼎长生","战力极强，业力上升。九州安定很久，却再无人敢问“人该怎么活”",()=>{
      q.ending="独掌青冥"; q.cleared=true; S.karma+=4; S.hpMax+=120; S.mpMax+=80; S.hp=S.hpMax; S.mp=S.mpMax;
      qmGiveGongfa("青冥独尊经","仙阶");
      S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("独掌青冥")) S.fortunes.push("独掌青冥");
      qmLog("终章","你把青冥收进气海。九州安定了很久，却再也没有人敢在雨夜去废祠问一句人该怎么活。");
      qmToLove(9);
    })
  ]);
}
function qmChapter9(){
  const q=S.qingming;
  const end = q.ending||"未名";
  qmEvent("问道长生", qmP([
    "长卷合上时，你才发现这一路并不长：废祠一夜，南疆一雨，血月一坛，东海一碑，帝京一炉，天门一剑。中间那些雨夜、船舱、侧殿和营帐，才是人还肯活着的证据。",
    "真正长的是因果。"+qmYou()+"此刻的结局是「"+htmlEsc(end)+"」。它不是天书记的，是你一刀一念写下的。",
    "你可以重温天门旧战，可以再读一遍伏笔，也可以把这一卷放下，去九州继续做人。青冥已经问过你一次。以后的问，是你问自己。"
  ]), [
    qmOpt("A","重温","#C9A45C","再战天门残影","反复挑战，灵石与修为",()=>qmReplay()),
    qmOpt("B","回廊","#A98FD9","回顾全部因果","把铺垫和回收再看一遍",()=>qmRecall()),
    qmOpt("C","游历","#6FA698","合卷，继续九州","长卷仍可随时打开",()=>{ qmLog("终章","你合上青冥长卷。雨还在下，只是不再像税。"); qmToHub(); }),
    qmOpt("D","红颜","#D88FA5","与道侣共度今宵","不必回情缘菜单，长卷里就能双修",()=>qmHaremNight())
  ]);
}
function qmChapterLove(){
  const q=S.qingming;
  const fn={1:qmLove1,2:qmLove2,3:qmLove3,4:qmLove4,5:qmLove5,6:qmLove6,7:qmLove7,8:qmLove8}[q.chapter];
  if(fn) fn(); else qmLoveDone();
}
function qmLove1(){
  const q=S.qingming;
  if(q.scene<=10){
    qmEvent("洗剑台夜雨", qmP([
      "废祠的纸灰还黏在袖口，顾清玄已在洗剑台等你。暮雨洗过青石，她月白剑袍湿了一角，本命剑横在膝上，剑穗却是新系的。",
      "“失踪的人里，有我外门的师弟。”她并不抬头，“你今夜没有把名册交给执事堂。所以我来问你——你护的是人，还是自己的秘密。”",
      "雨变密时，她把外袍披到你肩上。指尖在你颈侧停了一息，像确认你还活着，又像舍不得立刻收回。"+qmTone("顾清玄","hold"),
      "<span class=\"sm\">情缘不必另寻。这一夜她已走进你的卷里。</span>"
    ]), [
      qmOpt("A","共伞","#D88FA5","把她拉到檐下，近身听雨","好感大增，缘线开启。后文剑冢她会回来",()=>{
        qmMeet("顾清玄",18,"青云宗洗剑台");
        qmLog("初遇 · 顾清玄","伞下只容两人。她把重新系好的剑穗塞进你掌心：这一夜你替我守的不是剑，是我在宗门里最后一点可以相信的东西。");
        q.scene=11;
      }),
      qmOpt("B","拥吻","#C4675C","雨里吻她，把未说完的话咬碎","双修结侣。清冷剑修今夜把锋芒收进你怀里",()=>{
        qmMeet("顾清玄",24,"青云宗洗剑台");
        const d=qmDualNow("顾清玄");
        qmLog("拥吻 · 顾清玄","她先落额间，再是眼睫，最后停在唇畔。剑意护着你的神识，像护一场初雪。"+(d?(" "+d):"")+" 从此青云洗剑台多了一个不肯走的人。");
        q.scene=11;
      }),
      qmOpt("C","对剑","#6FA698","不碰私情，只与她对一招护生剑","仍相识，好感+8。她会记你今夜的分寸",()=>{
        qmMeet("顾清玄",8,"青云宗洗剑台");
        S.wudao["剑道"]=(S.wudao["剑道"]||0)+1;
        qmLog("初遇 · 顾清玄","一招过后她点头：剑还可以。人，也还可以。雨停之前，她把热茶换成了更温的一盏。");
        q.scene=11;
      })
    ]);
    return;
  }
  qmEvent("药庐余温", qmP([
    "洗剑台的雨还没干，药庐灯却亮着。苏沐在炉边守夜，小满蜷在药柜后，手里攥着那只空瓶，像攥着一个不敢说的秘密。",
    "苏沐看见你，先把脉，再把一碗温药推进你手里：“师弟今夜过火了。”她解开发带时药香混着体温，耳根却红到颈下。",
    "小满从柜子后探出半张脸：“大、大哥若是冷……满儿可以把外衣分你一半。”说完就把脸埋进苏沐袖里。",
    qmLadyLine()
  ]), [
    qmOpt("A","同炉","#D88FA5","陪苏沐守完这炉，再哄小满入睡","两位红颜入卷，好感与疗伤",()=>{
      qmMeet("苏沐",16,"青云宗药庐");
      qmMeet("小满",14,"青云宗药庐");
      S.hp=clamp((S.hp||0)+20,0,S.hpMax);
      qmLog("药庐夜","苏沐把你的衣扣一粒粒解开，只为上药。小满睡着以后，她才低声说：师姐这身医术，今晚只医你一个。不许说出去。");
      qmLoveDone();
    }),
    qmOpt("B","共枕","#C4675C","留在药庐过夜，与苏沐同修，把小满当亲眷护着","苏沐结为道侣；小满好感大增",()=>{
      qmMeet("小满",18,"青云宗药庐");
      qmMeet("苏沐",22,"青云宗药庐");
      const d=qmDualNow("苏沐");
      S.hp=clamp((S.hp||0)+24,0,S.hpMax);
      qmLog("药庐双修","炉火把两个人的影子叠在墙上。苏沐吻你时笨拙又认真，灵机如春水。"+(d?(" "+d):"")+" 小满在外间均匀地呼吸，像整座药庐都肯为你留一盏灯。");
      qmLoveDone();
    }),
    qmOpt("C","谢药","#6FA698","喝完药便走，不打扰她们安歇","仍相识。后文重伤时药庐会记得你",()=>{
      qmMeet("苏沐",8,"青云宗药庐");
      qmMeet("小满",8,"青云宗药庐");
      S.hp=clamp((S.hp||0)+8,0,S.hpMax);
      qmLog("药庐","你把空碗洗干净。苏沐看着你的背影，把一枚还没炼好的安神丹悄悄放进你袖里。");
      qmLoveDone();
    })
  ]);
}
function qmLove2(){
  const q=S.qingming;
  if(q.scene<=10){
    qmEvent("天机坊市私账", qmP([
      "残碑那一问还热着，中州天机坊市却已打烊。云栖把你从后门拉进去，铜钱耳坠亮了一下：“青冥的人来买情报，这账不能走明面。”",
      "她把一张写着南疆雨季的纸条拍在你心口，指尖却不拿开。“血月客栈的祭坛要收人。你若去，我可以让路。代价是——今晚把私账算清楚。”",
      qmTone("云栖","emb")+" 账册堆成的榻很窄。她笑盈盈看你，像看一笔终于要收回来的利息。",
      "<span class=\"sm\">你在残碑前选的路，她已经标进了价码。可眼睛里那点真，标不成价。</span>"
    ]), [
      qmOpt("A","算私账","#D88FA5","由她把你按进账册堆里，把今夜写成暗账","云栖入卷，情报+好感。南疆路更清楚",()=>{
        qmMeet("云栖",18,"中州天机坊市");
        S.lingShi+=40;
        qmFlag("yunqiIntel",true);
        qmLog("初遇 · 云栖","她数着你心口跳动的次数，笑得又甜又算计：这一笔，我要用一辈子收。南疆的雨季、血月的缺口，她都写进了你袖里。");
        q.scene=11;
      }),
      qmOpt("B","以身抵债","#C4675C","今夜双修，把情报与人一并买断","结为道侣。后文坊市她会给你开后门",()=>{
        qmMeet("云栖",24,"中州天机坊市");
        qmFlag("yunqiIntel",true);
        const d=qmDualNow("云栖");
        S.lingShi+=80;
        qmLog("双修 · 云栖","烛火摇在账册上。她挑开你衣带时还在报数，报到后来声音却乱了。"+(d?(" "+d):"")+" 打烊的坊市第一次没有立刻锁门。");
        q.scene=11;
      }),
      qmOpt("C","只买情报","#6FA698","付灵石，不欠私情","仍相识。路会清楚些，夜里却冷一些",()=>{
        qmMeet("云栖",8,"中州天机坊市");
        S.lingShi=Math.max(0,(S.lingShi||0)-30);
        qmFlag("yunqiIntel",true);
        qmLog("天机坊市","云栖收了钱，却把那张南疆地图多折了一道最安全的印：算我赔你。以后有命回来，再算别的。");
        q.scene=11;
      })
    ]);
    return;
  }
  qmEvent("听雨楼残句", qmP([
    "出了坊市便入江南。听雨楼只剩最后一间房。沈墨卿把酒壶往你手心一磕，青衫落拓，墨香混着雨气：“对出我那句残诗，这房便分你半边。对不出——也分。雨太大了。”",
    "残句是：长生若有味，应似故人——。你若接“肩头的雨”，她会笑；你若接“枕边的人”，她会把酒停住。",
    "窗外船铃一声接一声。她解下湿透的外袍，露出锁骨上一点墨：“别装正人君子。今晚这雨，本来就该两个人听。”",
    qmTone("沈墨卿","kiss")
  ]), [
    qmOpt("A","对诗","#D88FA5","对‘枕边的人’，把她拉到窗边听雨","沈墨卿入卷。后文诗剑会为你合击",()=>{
      qmMeet("沈墨卿",18,"江南听雨楼");
      S.six.悟性=clamp((S.six.悟性||1)+0.4,1,20);
      qmLog("初遇 · 沈墨卿","她大笑入怀，把半个未写完的字按进你掌心。雨打一夜，谁也没有去要第二间房。");
      qmLoveDone();
    }),
    qmOpt("B","同醉","#C4675C","把酒喝完，把人留下，共枕到天明","双修结侣。疏狂女散修把后半生写成你的句子",()=>{
      qmMeet("沈墨卿",24,"江南听雨楼");
      const d=qmDualNow("沈墨卿");
      S.six.悟性=clamp((S.six.悟性||1)+0.6,1,20);
      qmLog("共枕 · 沈墨卿","她吻如落笔，酒气与墨香缠在一处。衣带不知何时散开，诗稿被雨打湿，字却更真。"+(d?(" "+d):""));
      qmLoveDone();
    }),
    qmOpt("C","邻房","#6FA698","把唯一的房间让给她，自己坐一夜廊","仍相识。她会记得你让房的那一夜",()=>{
      qmMeet("沈墨卿",8,"江南听雨楼");
      qmLog("听雨楼","天将亮时她把外袍盖在你肩上，骂你迂，又把新写的半句塞进你袖里：故人未走，雨先停了。");
      qmLoveDone();
    })
  ]);
}function qmLove3(){
  const q=S.qingming;
  if(q.scene<=10){
    const saved=qmFlag("ashuang")||q.ally==="阿霜";
    const lost=qmFlag("tookScroll")&&!saved;
    qmEvent(saved?"瘴雨共体温":"花月渡前", qmP([
      saved
        ? "瘴母散后，破庙只剩一盏还没灭的灯。阿霜把湿透的中衣绞干，却把自己的干外套扔给你。她坐到你背后，掌心贴上你的脊骨，一点一点把毒往外引。"
        : lost
          ? "你取走了心法。破庙里阿霜仍给你留了一碗热水，自己坐在门槛外咳。她说：心法你可以拿走，雨我还是要等。等的人若不够干净，这场雨会自己停。"
          : "南疆的夜比瘴还浓。阿霜把半卷心法重新按回胸口，看你的眼神像看一场尚未应验的咒。",
      saved
        ? "灯油将尽时，她把额头抵上你的。呼吸里有药苦，也有刚活过来的热：“名册上的人第一次有人先问活。那你……也允许我先问你暖不暖。”"
        : "门外花月渡的铃响了。有人在瘴外唱歌，唱得又软又危险。阿霜低声：那是合欢宗的渡口。你要是去，记得——她会把你的真心当成酒。",
      "<span class=\"sm\">南疆这一夜，决定阿霜以后是贴着你的体温走，还是隔着一场雨看你。</span>"
    ]), [
      qmOpt("A","暖她","#D88FA5","把她拉进怀里，用灵力渡她一夜","阿霜好感大增。后文血月、天门她都贴着你的背",()=>{
        qmMeet("阿霜",22,"南疆瘴林");
        q.ally="阿霜"; qmFlag("ashuang",true);
        S.mp=clamp((S.mp||0)-8,0,S.mpMax);
        S.hp=clamp((S.hp||0)+10,0,S.hpMax);
        qmLog("南疆夜","阿霜把脸埋进你颈窝，像确认这场雨没有白下。她说：下次换我渡你。名册上的字，第一次自己淡了一笔。");
        q.scene=11;
      }),
      qmOpt("B","双修渡毒","#C4675C","以双修把瘴毒从两人经脉里逼出","结为道侣。薪火与雨会在后面的祭坛上一起亮",()=>{
        qmMeet("阿霜",28,"南疆瘴林");
        q.ally="阿霜"; qmFlag("ashuang",true);
        const d=qmDualNow("阿霜");
        S.hpMax=(S.hpMax||160)+15; S.hp=S.hpMax;
        qmLog("双修 · 阿霜","破庙的灯灭了。她跨坐在你身前，把心法与体温一并渡过来，像把命重新写进你掌心。"+(d?(" "+d):"")+" 毒散的时候，她咬住你的唇不让你出声。");
        q.scene=11;
      }),
      qmOpt("C","守夜","#6FA698","分坐两侧，只把外衣盖给她","仍结伴。她会记你的克制，也会在血月看你一眼",()=>{
        qmMeet("阿霜",10,"南疆瘴林");
        qmLog("南疆夜","你守前半夜，她守后半夜。天亮时谁也没提那件被悄悄挪过去的外衣。");
        q.scene=11;
      })
    ]);
    return;
  }
  if(q.scene===11){
    qmEvent("花月渡幻夜", qmP([
      "出瘴的唯一渡口开在花里。洛浅浅坐在船头，轻纱被江风吹得几乎不剩，眼尾天生会勾人：“公子识破了幻境，却没有当众拆穿。合欢宗最吃这套。”",
      "船舱里是合欢花酿的甜香。她把你的手按在自己腰侧：“南疆的雨脏，我这里干净。你若只想问路，我送你过江；你若想学一招……倾囊相授。”",
      qmTone("洛浅浅","emb")+" 窗外阿霜的雨声还在。她看见了，只笑：“我不拦你养别的人。合欢宗的规矩是——今晚你得先看着我。”",
      "<span class=\"sm\">识破却不羞辱。这是她愿意把真心从媚术里抽出来的原因。</span>"
    ]), [
      qmOpt("A","过江","#D88FA5","受她一记魅术护身，把人留在身侧","洛浅浅入卷。后文可魅术控场，亦可变真心",()=>{
        qmMeet("洛浅浅",20,"南疆花月渡");
        qmGiveSkill("花月渡魅","火",24,12,"魅");
        qmLog("初遇 · 洛浅浅","她吻落你颈侧，一路向下，娇笑：这处，归我了。过江时她把幻境收了，江面只剩真实的月。");
        q.scene=12;
      }),
      qmOpt("B","同修花月","#C4675C","在船舱里把合欢秘法练完","双修结侣。媚是表象，她最怕被辜负",()=>{
        qmMeet("洛浅浅",26,"南疆花月渡");
        const d=qmDualNow("洛浅浅");
        qmGiveSkill("花月渡魅","火",26,12,"魅");
        qmLog("双修 · 洛浅浅","红绡帐暖。她引你灵肉交融，云鬓散乱时贴着你耳畔：这一式，你只许与我练——在船上这一夜。"+(d?(" "+d):"")+" 天将亮，她把一枚合欢铃系上你腕。");
        q.scene=12;
      }),
      qmOpt("C","只问路","#6FA698","谢过渡口，不入船舱","仍相识。她会在后面的乱局里给你留一条退路",()=>{
        qmMeet("洛浅浅",8,"南疆花月渡");
        qmLog("花月渡","洛浅浅啧了一声，把地图塞进你怀里：扫兴。可扫兴的人，我偏记住了。");
        q.scene=12;
      })
    ]);
    return;
  }
  qmEvent("药王谷雨声", qmP([
    "江对岸便是药王谷。温若曦在百草园等一场不该下在南疆的雨。她看见你袖上的瘴痕，二话不说把你按到石凳上把脉。",
    "指尖温软，药香却执拗。她按到你心口时耳尖红了：“毒已经散了七分。剩下三分……要慢慢捂。你若嫌我磨蹭，可把外衣解开些。”",
    "一株枯了千年的药王在她身后重新抽芽。她说你在南疆救人的那一念，比任何灵泉都有效。雨落在她杏白长裙上，像落在一帖不肯苦下去的药里。",
    qmTone("温若曦","hold")
  ]), [
    qmOpt("A","受诊","#D88FA5","解开衣襟让她把脉，把雨听完","温若曦入卷。后文濒死可药灵续命",()=>{
      qmMeet("温若曦",18,"药王谷百草园");
      S.hp=clamp((S.hp||0)+30,0,S.hpMax);
      S.merit=(S.merit||0)+1;
      qmLog("初遇 · 温若曦","她把一朵药花别进你衣领：这株药王是你救活的，也是我。雨停以前，她一直没有松开你的腕。");
      qmLoveDone();
    }),
    qmOpt("B","以体温作药引","#C4675C","留下过夜，以双修温养经脉","结为道侣。慈悲圣女把最软的一帖药给了你",()=>{
      qmMeet("温若曦",24,"药王谷百草园");
      const d=qmDualNow("温若曦");
      S.hpMax=(S.hpMax||160)+20; S.hp=S.hpMax;
      qmLog("双修 · 温若曦","百草园的夜极静。她解开发髻，把你的手按在自己心口：这里从没有人为我跳得这么乱。"+(d?(" "+d):"")+" 药香与雨声缠到天明。");
      qmLoveDone();
    }),
    qmOpt("C","谢药便走","#6FA698","留下一袋灵石作药钱","仍相识。她没收钱，却收了你袖里那点南疆的雨",()=>{
      qmMeet("温若曦",8,"药王谷百草园");
      S.hp=clamp((S.hp||0)+12,0,S.hpMax);
      qmLog("药王谷","温若曦把灵石推回来，只收下一滴你袖上的雨：药钱太贵。人情，我慢慢用。");
      qmLoveDone();
    })
  ]);
}
function qmLove4(){
  const q=S.qingming;
  if(q.scene<=10){
    qmEvent("血月客栈屋脊", qmP([
      q.oath==="斩祭护生"?"祭坛的火灭了。谢无咎却在客栈屋脊上等你，红衣被血月洗得更艳。":q.oath==="以寿换命"?"你少了三年寿。谢无咎嗅到了，弯刀在她指间转了一圈：“把命送给别人的人，今晚把命借我玩玩。”":"你记下了阵法。谢无咎蹲在屋脊上笑：正道君子最会旁观。今晚我不让你旁观。",
      "她把你按在瓦上，左眼尾那粒朱砂泪痣近得能数清。“血魔宗少主要看你是不是伪善。你若怕——现在就滚。你若不怕……”",
      qmTone("谢无咎","kiss")+" 弯刀搁在你喉结旁，吻却先落下来。血腥气里裹着灼烫的心跳。",
      "<span class=\"sm\">血月这一夜，她会成为你的刀，或成为你心里收不回的那道红。后宫里她不吃醋，只吃你的时间。</span>"
    ]), [
      qmOpt("A","接刀","#D88FA5","握住她的腕，把刀换成十指相扣","谢无咎入卷。后文血河破阵她会来",()=>{
        qmMeet("谢无咎",20,"血月客栈屋脊");
        S.jianghu.xia=(S.jianghu.xia||0)+1;
        qmLog("初遇 · 谢无咎","刀落地。她咬你耳垂低笑：正道君子做久了，今晚陪我当一回恶人。记好这滋味——往后你心口那寸地方，只有我能碰。");
        q.scene=11;
      }),
      qmOpt("B","以血为契","#C4675C","在屋脊上双修，把血河功缠进气海","结为道侣。危险又酣畅，她不许你走",()=>{
        qmMeet("谢无咎",26,"血月客栈屋脊");
        const d=qmDualNow("谢无咎");
        qmGiveSkill("血河私印","火",28,14,"血");
        qmLog("双修 · 谢无咎","红衣散在夜色里。她引血河功与你灵机纠缠，喘息里藏着一句极轻的不许走。"+(d?(" "+d):"")+" 月落时，她把弯刀放到你手边：刀可以借，人也可以。");
        q.scene=11;
      }),
      qmOpt("C","退开","#6FA698","不接这一吻，只与她约在下次战场","仍相识。她会骂你扫兴，仍会在刀光里出现",()=>{
        qmMeet("谢无咎",8,"血月客栈屋脊");
        qmLog("血月屋脊","谢无咎啐了一口，却把一块血玉塞进你袖里：扫兴。拿去挡一次死。下次再扫兴，我就真砍。");
        q.scene=11;
      })
    ]);
    return;
  }
  if(q.scene===11){
    qmEvent("青狼岭还人", qmP([
      "祭坛散场后，青狼岭的镖车还卡在官道上。红芍一刀劈开拦路的木栅，小麦色的脸上全是灰：“活的都给我上车！死的……也上车，带回家。”",
      "她看见你，把酒葫芦砸过来：“方才坛下那一剑是你吧？路见不平，喝一口。喝完——若还冷，就到我车里来。镖局的规矩，今夜不分男女，只分活人。”",
      "车厢狭小。她解了劲装外罩，刀横在膝上，却把你的手按在自己腰间止血的布上：“别躲。触一下又不会少块肉。少了，我再砍回来。”",
      qmTone("红芍","emb")
    ]), [
      qmOpt("A","同车","#D88FA5","坐进她的镖车，把酒和伤一起分了","红芍入卷。后文横刀援阵",()=>{
        qmMeet("红芍",18,"青狼岭镖道");
        S.hp=clamp((S.hp||0)+16,0,S.hpMax);
        qmLog("初遇 · 红芍","酒气混着刀油。她笑起来像放鞭炮，说到后来却把声音压下去：我送人回家，你若愿意，也把我送到你家里。");
        q.scene=12;
      }),
      qmOpt("B","枕刀而眠","#C4675C","在颠簸的镖车里把她拥住，过这一夜","结为道侣。飒爽女侠把刀鞘换成你的手臂",()=>{
        qmMeet("红芍",24,"青狼岭镖道");
        const d=qmDualNow("红芍");
        S.hp=clamp((S.hp||0)+20,0,S.hpMax);
        qmLog("共枕 · 红芍","车帘落下。她吻得干脆，像出刀，收势时却把脸埋进你肩窝。"+(d?(" "+d):"")+" 后半夜她睡着了，刀还醒着，横在你们外侧。");
        q.scene=12;
      }),
      qmOpt("C","护送","#6FA698","帮她把镖车送出官道，不入车厢","仍相识。侠名与酒都在",()=>{
        qmMeet("红芍",8,"青狼岭镖道");
        S.jianghu.xia=(S.jianghu.xia||0)+1;
        qmLog("青狼岭","红芍冲你扬刀：够义气。下次青狼岭见，酒我请。人——看你敢不敢要。");
        q.scene=12;
      })
    ]);
    return;
  }
  if(qmFlag("ashuang")){
    qmEvent("祭后还雨", qmP([
      "镖车走远，阿霜还站在祭坛废墟上。血月已褪，她的眼睛却比月亮更亮。",
      q.oath==="冷眼记阵"
        ? "她没有骂你。只把剑收回鞘里，走近两步，又停住：“旁观我可以忍一次。你若还想让我贴着你的背走路，今夜就把脸转过来。”"
        : "她把你拉进还没塌完的帷幕后面，手在抖，吻却很稳：“你把人都背出来了。那我呢。我能不能……也从你背上，爬进你怀里。”",
      "远处还有哭声。近处只有她的呼吸。这一夜若是错过，后面的天门她仍会来，只是不再把后背完全交给你。"
    ]), [
      qmOpt("A","转过来","#D88FA5","把她拥进废墟里，把未说完的话吻完","阿霜好感修复并加深",()=>{
        qmMeet("阿霜",16);
        qmLog("祭后","阿霜把名册的灰从你脸上擦掉。她说：南疆那夜的雨，原来可以下到血月底下。");
        qmLoveDone();
      }),
      qmOpt("B","当场结契","#C4675C","在熄灭的祭坛后结为道侣","生死相随。天门第一剑她会替你挡",()=>{
        const d=qmDualNow("阿霜");
        qmLog("结契 · 阿霜","帷幕落下时她把心法残页与自己的发带一并绕上你腕。"+(d?(" "+d):"")+" 她说：名册上的人，从今夜起，也包括你。");
        qmLoveDone();
      }),
      qmOpt("C","先走","#6FA698","答应她天亮再谈，先离开这处死人堆","好感仍在。有些话会在东海岸边补完",()=>{
        qmMeet("阿霜",6);
        qmLog("祭后","阿霜点头。她跟在你身侧三步远的地方，像把今夜的距离，留给海风去吹近。");
        qmLoveDone();
      })
    ]);
    return;
  }
  qmLoveDone();
}
function qmLove5(){
  const q=S.qingming;
  if(q.scene<=10){
    qmEvent("银面之下", qmP([
      "潮水把三焰送进你气海。苏晚晴站在碑下，把最后一角银面摘掉。眉眼比面具更冷，唇色却被海风吹红。",
      "“外门苏晚晴。青冥覆灭那夜，我还不够资格死在山门里。”她把令牌按进你掌心，指尖冰凉，“国师袖里有半块令。帝京的炉，就是血月的放大。你若去，我跟你。你若今夜只要焰、不要人——也行。把面还我。”",
      "海风把她的中衣吹开一线。锁骨下有一道旧疤，像被税册裁过。她没有躲：“看吧。银面后面不是仙，是一个没死透的外门。”",
      qmTone("苏晚晴","hold")
    ]), [
      qmOpt("A","还人","#D88FA5","把银面抛进海里，只留她","苏晚晴入卷为盟友。后文帝京、天门她都在",()=>{
        qmMeet("苏晚晴",20,"东海归墟");
        qmFlag("silverAlly",true);
        qmLog("初遇 · 苏晚晴","她怔了一下，笑意却浅：面可以不要。人，你得自己看着办。海风里她第一次把额头抵上你的肩。");
        q.scene=11;
      }),
      qmOpt("B","潮间双修","#C4675C","在古碑阴影里与她同修灵焰","结为道侣。青焰/赤焰/玄焰都会记得她的体温",()=>{
        qmMeet("苏晚晴",26,"东海归墟");
        qmFlag("silverAlly",true);
        const d=qmDualNow("苏晚晴");
        S.mpMax=(S.mpMax||160)+20; S.mp=S.mpMax;
        qmLog("双修 · 苏晚晴","她闭眼把唇交给你，冰的触感化开一缕甜。灵焰在两人气海里绕成同一圈。"+(d?(" "+d):"")+" 潮声盖过了一切不该被碑听见的喘息。");
        q.scene=11;
      }),
      qmOpt("C","只结盟","#6FA698","交换盟印，不碰私情","仍是盟友。银面可以摘，心可以慢一点",()=>{
        qmMeet("苏晚晴",10,"东海归墟");
        qmFlag("silverAlly",true);
        qmLog("东海盟","苏晚晴把盟印按在你背上：别死在第一剑，青冥还没问完。海风很大，她没有回头。");
        q.scene=11;
      })
    ]);
    return;
  }
  qmEvent("海上望月", qmP([
    "归墟的月升得很低，低到像能用手接住。月姬从光里走出来，赤足踏浪，纱裙被月华浸透，几乎透明。",
    "“我没有名字很久了。”她的声音像从很远的地方飘来，“你在血月下救过的那些人，有一缕魂喊过我。所以我来问你：愿不愿意把一个名字还给我——用你的嘴，贴着我的耳说。”",
    "她握住你的手，按上自己微凉的心口。月华顺着指尖涌进你的识海，温柔得近乎危险。“千年望月，只缺一个肯把我从光里拉下来的人。”",
    qmTone("月姬","kiss")
  ]), [
    qmOpt("A","还名","#D88FA5","在她耳边唤她月姬，把人从光里拉下来","月姬入卷。后文可月华回生",()=>{
      qmMeet("月姬",20,"南疆望月台");
      S.loc="东海归墟";
      S.mp=clamp((S.mp||0)+20,0,S.mpMax);
      qmLog("初遇 · 月姬","她在你怀里一点点凝成实体，泪落进海里却是光。她说：名字有了，归处也有了。");
      qmLoveDone();
    }),
    qmOpt("B","月下双修","#C4675C","以自身体温把月华炼进两人之间","结为道侣。幽柔月灵把清辉都给了你",()=>{
      qmMeet("月姬",26,"南疆望月台");
      const d=qmDualNow("月姬");
      S.mpMax=(S.mpMax||160)+24; S.mp=S.mpMax;
      qmLog("双修 · 月姬","纱裙落在潮上。她与你灵肉相融时几乎透明，又在高潮的灵机里一点点变得滚烫。"+(d?(" "+d):"")+" 此后海上的月，会先照你的窗。");
      qmLoveDone();
    }),
    qmOpt("C","一拜","#6FA698","为她吹响古箫，不拉她入红尘","仍相识。月华会在你重伤时回来一次",()=>{
      qmMeet("月姬",8,"南疆望月台");
      qmLog("望月","月姬向你一揖。光淡了，人却没有立刻消失：你若还想把我拉下来，天门之后，我仍在。");
      qmLoveDone();
    })
  ]);
}
function qmLove6(){
  const q=S.qingming;
  if(q.scene<=10){
    qmEvent("帝京侧殿", qmP([
      "仙胎炉的火熄了。萧景行把你从朝堂直接带进侧殿，金线蟒袍未解，门却反锁。",
      "“孤不需要一个只会斩国师的侠客。”她执剑的手骨节分明，把你按在龙椅的影里，“孤需要一个肯把长生分给这江山、也分给孤的人。今夜殿里没有第三人。你若想走，现在就走。”",
      "灯火把她的眉眼烧得英锐。她解玉带的动作干脆利落，吻却比圣旨更不容拒绝：“你是孤的。后宫可以有别人——朝堂上，你只能站在孤身边。”",
      qmTone("萧景行","duet")
    ]), [
      qmOpt("A","应旨","#D88FA5","留下，把龙气与私情一并接住","萧景行入卷。后文龙气镇敌",()=>{
        qmMeet("萧景行",20,"中州帝京");
        S.reputation=(S.reputation||0)+8;
        qmLog("初遇 · 萧景行","她把一枚私印塞进你衣襟最贴肉的位置：这不是赏。是孤把命交出去的方式。");
        q.scene=11;
      }),
      qmOpt("B","共主山河","#C4675C","与长公主双修，结为道侣","龙气入体。江山与人，她都要",()=>{
        qmMeet("萧景行",26,"中州帝京");
        const d=qmDualNow("萧景行");
        S.hpMax=(S.hpMax||160)+30; S.hp=S.hpMax;
        S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("龙气私盟")) S.fortunes.push("龙气私盟");
        qmLog("双修 · 萧景行","蟒袍半褪。她龙气勃发与你并修，气象万千，指尖描过你眉眼：你是孤的。"+(d?(" "+d):"")+" 殿外侍卫一夜未敢咳嗽。");
        q.scene=11;
      }),
      qmOpt("C","只论国事","#6FA698","谈完炉与税便退殿","仍相识。她会给你一道暗旨，不给你枕席",()=>{
        qmMeet("萧景行",8,"中州帝京");
        S.reputation=(S.reputation||0)+4;
        qmLog("侧殿","萧景行盯了你很久，终是把暗旨拍在桌上：扫兴。可扫兴的人，孤偏要用。");
        q.scene=11;
      })
    ]);
    return;
  }
  qmEvent("暗巷假面", qmP([
    qmFlag("evAnxiang")?"你在暗巷收过逆谱。花千影却说那夜她也在——坐在你对面喝酒的，有一张是她的假面。":"花千影在暗巷尽头摘下一张笑面，露出底下素净的眉眼。",
    "“幻月楼的人最会骗人。”她腕上铃铛轻响，薄纱被夜风掀起，“满座都是虚情。你若能在今夜认出哪一句是真的，我就把假面烧了。”",
    "她靠近时酒气与月色一起覆上来。手指沿着你衣扣往下：“公子何必急着做不该做的事。或者……今夜该做的事，正是不该被别人看见的事。”",
    qmTone("花千影","kiss")
  ]), [
    qmOpt("A","认真心","#D88FA5","说你认的是面具后那一瞬没藏住的疲倦","花千影入卷。后文幻术惑敌",()=>{
      qmMeet("花千影",20,"南疆幻月楼");
      S.loc="中州帝京";
      qmLog("初遇 · 花千影","她别过脸，难得没有还嘴。铃铛响了一夜，响到后来变成贴在你心口的一声轻叹。");
      qmLoveDone();
    }),
    qmOpt("B","摘面同修","#C4675C","把她的假面摘掉，把人留到天明","结为道侣。骗子也好，宗主也罢，只认这一夜的真",()=>{
      qmMeet("花千影",26,"南疆幻月楼");
      const d=qmDualNow("花千影");
      qmGiveSkill("幻月私语","水",26,13,"幻");
      qmLog("双修 · 花千影","假面碎在枕边。她不再用满座戏弄的虚情吻你，只剩下颤抖而郑重的真。"+(d?(" "+d):"")+" 她把月牙坠子放进你掌心：从前只信值不值得。你让我觉得，赌一次也值得。");
      qmLoveDone();
    }),
    qmOpt("C","不拆穿","#6FA698","由她戴着假面离开","仍相识。幻月楼会在你被困时布一场梦把你捞出来",()=>{
      qmMeet("花千影",8,"南疆幻月楼");
      qmLog("假面","花千影笑了笑，把一张备用的假面塞给你：戴上。帝京的人，不配看你的眼睛。");
      qmLoveDone();
    })
  ]);
}
function qmLove7(){
  const q=S.qingming;
  if(q.scene<=10){
    const after=q.cleared;
    qmEvent(after?"剑峰与问道":"剑峰与问道", qmP([
      after
        ? "天门裂开以后，雨落在营帐上。洛青瑶与叶知秋几乎同时掀帘进来——一个剑上还带着仙光，一个拂尘上还沾着云。她们没有先问胜负，先问你还活着没有。"
        : "天门将开的前一夜，青云剑峰与天衍问道崖同时来人。洛青瑶一袭雪白剑袍，叶知秋月白道袍未改，两人在你营帐外对视一眼，竟都没有先拔剑。",
      after
        ? "洛青瑶把还没入鞘的剑横过来，剑柄朝你：“我要的剑道，是从今天起，跟一个还活着的人并肩。”叶知秋散了高髻：“此劫已过。若下一劫仍是你，我仍甘愿应下。”"
        : "洛青瑶说：“我要的剑道，是从今天起，跟一个人并肩。”叶知秋说：“千年修道，未防此劫。此劫若是你，我甘愿应下。”",
      "帐中炭火很小。两个向来不近人情的人把外袍解了，把剑与拂尘都放在帐门口——意思很明白：今夜不是来论道的，是来把人留下的。",
      qmLadyLine()
    ]), [
      qmOpt("A","都留","#D88FA5","让她们都进帐，把剑意与玄门都接住","洛青瑶、叶知秋入卷。天门可剑意护主、一言定法",()=>{
        qmMeet("洛青瑶",18,"青云宗剑峰");
        qmMeet("叶知秋",18,"天衍宗问道崖");
        S.wudao["剑道"]=(S.wudao["剑道"]||0)+1;
        S.six.道心=clamp((S.six.道心||1)+0.5,1,20);
        qmLog("双至","洛青瑶把本命剑剑柄朝向你，叶知秋替你整理衣襟时把动作放到最轻。帐外天门嗡了一声，像在旁观一场它无法征税的私情。");
        q.scene=11;
      }),
      qmOpt("B","三修共契","#C4675C","今夜双修，把两人都结为道侣","后宫扩容。剑与道都枕在你左右",()=>{
        qmMeet("洛青瑶",22,"青云宗剑峰");
        qmMeet("叶知秋",22,"天衍宗问道崖");
        qmDualNow("洛青瑶");
        qmDualNow("叶知秋");
        S.xiu=clamp((S.xiu||0)+8,0,100);
        qmLog("共契","雪意与檀香缠在一处。洛青瑶吻你时眼睫上还沾着雪，叶知秋伏在你肩头轻喘：此劫，我甘愿应下。帐外无人敢传这则佳话，帐内却已写进长卷。");
        q.scene=11;
      }),
      qmOpt("C","各自一拜","#6FA698","受她们一拜为援手，不入枕席","仍是战友。天门下她们会来",()=>{
        qmMeet("洛青瑶",8,"青云宗剑峰");
        qmMeet("叶知秋",8,"天衍宗问道崖");
        qmLog("一拜","两人执剑而拜。洛青瑶耳尖微红，叶知秋道袍整理得一丝不苟。援手已定，私情留给活下来以后。");
        q.scene=11;
      })
    ]);
    return;
  }
  if(q.scene===11){
    qmEvent("雪与狐", qmP([
      "后帐掀开时，冷气先至。白凝霜一袭冰蓝纱衣，墨尘却光着脚踩进来，狐耳竖着，尾巴炸成一团。",
      "白凝霜说：“北原的雪听见天门要收人。我来看看，你的心口还够不够暖。”墨尘立刻抢话：“才、才不是报恩！古妖山不欠人类——只欠你一只烤灵果！”",
      "一个把微凉的手放进你掌心，一个把尾巴缠上你的腰。炭火被她们一冷一热逼得乱跳。天门在头顶压着，人间这一隅却忽然像后宫开了两扇窗。",
      qmTone("墨尘","emb")
    ]), [
      qmOpt("A","都暖着","#D88FA5","左拥冰雪，右揽白狐","白凝霜、墨尘入卷。后文可冰封强敌、妖身护主",()=>{
        qmMeet("白凝霜",18,"北原寒渊");
        qmMeet("墨尘",18,"古妖山猎场");
        S.hp=clamp((S.hp||0)+18,0,S.hpMax);
        qmLog("雪与狐","白凝霜把灯点在你枕边：这里从没有人暖过。墨尘别过脸，耳尖通红：再笑，就咬你。你没有笑，只把两个人都圈进被里。");
        q.scene=12;
      }),
      qmOpt("B","同衾","#C4675C","今夜把雪与狐都留在榻上双修","两人都结为道侣。寒渊与妖山从此有归处",()=>{
        qmMeet("白凝霜",22,"北原寒渊");
        qmMeet("墨尘",22,"古妖山猎场");
        qmDualNow("白凝霜");
        qmDualNow("墨尘");
        S.hpMax=(S.hpMax||160)+24; S.hp=S.hpMax;
        qmLog("同衾","冰纱与狐尾一起落在榻边。白凝霜吻你时像雪化，墨尘咬你锁骨时像撒娇。天门再高，也压不灭这一帐的热。");
        q.scene=12;
      }),
      qmOpt("C","分帐","#6FA698","为她们另设暖帐，自己清修待战","仍结盟。第一剑到来时她们会从左右来",()=>{
        qmMeet("白凝霜",8,"北原寒渊");
        qmMeet("墨尘",8,"古妖山猎场");
        qmLog("分帐","墨尘骂你木头，白凝霜只点头。木头有时也能当梁。天门之下，梁比枕头更急需。");
        q.scene=12;
      })
    ]);
    return;
  }
  const db=(S.daoban||[]).slice();
  const ladies=qmLadies();
  qmEvent("天门这一夜", qmP([
    "天门前后这一夜，剑可以放下片刻。营帐里不是一个人。",
    ladies.length?("今夜还在的人："+ladies.join("、")+"。"):"今夜帐中很静。静也是一种选择。",
    db.length?("已结为道侣："+db.join("、")+"。后宫不是玩笑，是她们自愿把命写进你这一剑里。"):"还没有道侣。若想在出剑前把人留下，今晚是最后的枕席。",
    "你可以把所有愿与你同修的人都留下，也可以只握紧剑。天门不问私情——可私情会问天门，你还想不想做人。"
  ]), [
    qmOpt("A","留人","#D88FA5","把在场红颜的好感再推深一层","众女好感+10。第一剑会有人替你挡",()=>{
      ladies.forEach(n=>qmMeet(n,10));
      S.hp=clamp((S.hp||0)+20,0,S.hpMax);
      S.mp=clamp((S.mp||0)+20,0,S.mpMax);
      qmLog("天门前夜","帐里灯火一直未灭。有人替你擦剑，有人替你渡灵，有人只是把额头抵在你背上。你没有孤身到这一步。");
      qmLoveDone();
    }),
    qmOpt("B","众女同修","#C4675C","凡好感已深者，今夜皆可结为道侣","开后宫。双修同契，天门下气机相缠",()=>{
      const pick=ladies.filter(n=>(S.aff[n]||0)>=40);
      (pick.length?pick:ladies).forEach(n=>qmDualNow(n));
      S.xiu=clamp((S.xiu||0)+10,0,100);
      qmLog("众女同修","灵机在帐中绕成许多圈，又都回到你气海里。有人吃味，有人笑，有人把你的手指按在自己心口：看着我。你都看了。这一夜之后，天门要收的税里，多了一句‘她们不许’。");
      qmLoveDone();
    }),
    qmOpt("C","独坐","#6FA698","请她们去睡，自己对剑到天明","好感不减。出剑会更冷，也更孤",()=>{
      qmLog("独坐","帐帘落下。外面有人低声骂木头，有人只是坐到天亮。你把剑磨亮。天亮以后，她们仍在。");
      qmLoveDone();
    })
  ]);
}
function qmLove8(){
  const q=S.qingming;
  if(q.scene<=10){
    qmEvent("王庭与棋亭", qmP([
      "天门已裂。雨重新落回九州。古妖山王庭与一座不在地图上的棋亭同时为你开门。",
      "姬无夜卸下十二旒冠，绯衣半褪：“孤许你近身，便是许了你的往后。万妖可以俯首，你不必。”玄机子托着一枚棋子，眸色极淡：“我算尽天下，唯独不愿算你的结局。所以把这步棋，亲手交给你。”",
      "一个把山河当背景，一个把天命当棋盘。她们看你的眼神却很像：都在问，你还要不要把人留下。",
      qmLadyLine()
    ]), [
      qmOpt("A","都见","#D88FA5","受妖王之拥，也受仙人一子","姬无夜、玄机子入卷",()=>{
        qmMeet("姬无夜",18,"古妖山王庭");
        qmMeet("玄机子",18,"无名棋亭");
        S.six.仙缘=clamp((S.six.仙缘||1)+1,1,20);
        S.jianghu.xia=(S.jianghu.xia||0)+1;
        qmLog("王庭棋亭","姬无夜的吻霸道得不容拒绝，尾音却轻颤。玄机子把棋子放进你掌心：落子无悔。人，更是。");
        q.scene=11;
      }),
      qmOpt("B","山河与棋","#C4675C","与二人双修，把王权与天机都枕在身侧","两位道侣。后宫至尊位也让给你一半",()=>{
        qmMeet("姬无夜",24,"古妖山王庭");
        qmMeet("玄机子",24,"无名棋亭");
        qmDualNow("姬无夜");
        qmDualNow("玄机子");
        S.hpMax=(S.hpMax||160)+40; S.mpMax=(S.mpMax||160)+30; S.hp=S.hpMax; S.mp=S.mpMax;
        qmLog("至尊私夜","绯衣与素白叠在一处。姬无夜拥你于王座之侧，玄机子散了发，第一次没有去算这一夜的后果。雨还在下。税已经停了。人还热着。");
        q.scene=11;
      }),
      qmOpt("C","一揖","#6FA698","受她们各一揖，把私情留在人间烟火里","仍相识。关键时落子与法相都会来",()=>{
        qmMeet("姬无夜",8,"古妖山王庭");
        qmMeet("玄机子",8,"无名棋亭");
        qmLog("一揖","姬无夜重新戴上冠，玄机子把棋盒合上。她们都说：去吧。人间的雨，比王庭和棋亭更需要你。");
        q.scene=11;
      })
    ]);
    return;
  }
  const ladies=qmLadies();
  const db=S.daoban||[];
  const canAll=ladies.filter(n=>(S.aff[n]||0)>=60);
  qmEvent("红颜归卷", qmP([
    "长卷将合。废祠、南疆、血月、东海、帝京、天门，都已有了名字。",
    ladies.length?("这一路走进你故事里的人："+ladies.join("、")+"。"):"这一路你走得很干净，也走得很空。",
    db.length?("已经结为道侣："+db.join("、")+"。"):"道侣栏还空着。空着也可以活，只是枕边会冷。",
    canAll.length?("好感已深、今夜可一并结契者："+canAll.join("、")+"。"):"还没有人走到可以一诺的那一步。你可以继续把长卷合上。",
    "<span class=\"sm\">开后宫不是强迫她们。是承认：修仙可以不问寿，却不必只问一个人的枕席。</span>"
  ]), [
    qmOpt("A","开后宫","#D88FA5","凡好感已深者，皆结为道侣","多人并存。情缘菜单里会看见她们都已是道侣",()=>{
      const pick=canAll.length?canAll:ladies.filter(n=>(S.aff[n]||0)>=40);
      pick.forEach(n=>qmDao(n));
      pick.forEach(n=>qmMeet(n,8));
      qmLog("红颜归卷",(pick.length?pick.join("、"):"诸女")+"与你两两交契。没有谁被写成唯一，也没有谁被写成备选。长生若有味，应似故人肩头的雨，和枕边许多种呼吸。");
      qmLoveDone();
    }),
    qmOpt("B","今夜长宴","#C4675C","摆一场红颜夜宴，再同修到天明","修为与气血大补。后宫日常从这一夜开始",()=>{
      const pick=db.length?db:(canAll.length?canAll:ladies);
      pick.forEach(n=>{ qmMeet(n,6); if((S.aff[n]||0)>=80) qmDualNow(n); else qmDao(n); });
      S.xiu=clamp((S.xiu||0)+12,0,100);
      S.hp=S.hpMax; S.mp=S.mpMax;
      qmLog("红颜夜宴","酒过三巡，灯火都不肯灭。有人闹，有人静，有人把你按回榻上不许再谈天门。你终于被允许，只做人。");
      qmLoveDone();
    }),
    qmOpt("C","合卷","#6FA698","把私情留给以后的日子慢慢写","长卷仍可随时打开，情缘不会消失",()=>{
      qmLog("合卷","你没有当夜结契。窗外的雨把所有名字都洗得很清楚。以后的枕席，可以在长卷里续，也可以在情缘里续——她们已经认得你。");
      qmLoveDone();
    })
  ]);
}
function qmHaremNight(){
  ensureGameState(); qmEnsure();
  const db=(S.daoban||[]).slice();
  const cand=db.length?db:qmLadies().filter(n=>(S.aff[n]||0)>=60);
  if(!cand.length){
    qmEvent("红颜未满", qmP(["枕边还空着。先把长卷里的人留下，再来谈今宵。"]), [
      qmOpt("A","返回","#6FA698","回到终章","去遇见她们",()=>qmToHub())
    ]);
    return;
  }
  const opts=cand.slice(0,6).map((n,i)=>qmOpt(String.fromCharCode(65+i),"今宵","#D88FA5","留"+n+"一宿","双修、恢复、好感",()=>{
    const d=qmDualNow(n);
    qmLog("今宵 · "+n, (d||(n+"把你按进被里。"))+" 这一夜之后，气血与灵力皆满，情意又深一层。");
  }));
  opts.push(qmOpt("Z","众修","#C4675C","众女同修","凡道侣皆可同契",()=>{
    cand.forEach(n=>qmDualNow(n));
    S.hp=S.hpMax; S.mp=S.mpMax;
    qmLog("众女同修","灯火把许多身影叠在墙上。你没有数有几个人。你只听见有人说：看着我。你都看了。");
  }));
  opts.push(qmOpt("X","返回","#555","合上红帐","回到终章",()=>qmToHub()));
  qmEvent("红颜今宵", qmP([
    "长卷已问过天。今夜只问人。",
    "可留之人："+cand.join("、")+"。",
    "选一个人，或让她们都留下。不必再回情缘菜单逐个对话。"
  ]), opts);
}
function finishQingmingBattle(tag){
  ensureGameState(); qmEnsure();
  const q=S.qingming;
  if(tag==="qmCh1"){
    S.jianghu.xia+=3; giveItem("烧焦名册",1); qmFlag("maskDead",true);
    qmLog("第一章终","名册从火里抢出来时，还带着体温。青铜面具碎了一半，露出的那只眼睛很年轻。他最后说的仍是：南疆有雨。");
    qmToLove(2);
  }else if(tag==="qmCh3"){
    q.ally="阿霜"; qmFlag("ashuang",true); qmGiveGongfa("青冥心法残卷","玄阶"); S.merit+=2; qmMeet("阿霜",18,"南疆瘴林");
    qmLog("第三章终","瘴母散去后，阿霜把心法塞回你手里：这次算你救我，下次我救你。名册上的字，第一次自己淡了一笔。");
    qmToLove(4);
  }else if(tag==="qmCh4"){
    q.oath="斩祭护生"; S.jianghu.xia+=5; S.merit+=4; S.reputation+=12;
    if(qmFlag("tookScroll") && !qmFlag("ashuang")){ q.ally="阿霜"; qmFlag("ashuang",true); qmMeet("阿霜",10); }
    qmLog("第四章终","血月熄了。你把祭品一个个背出坛场，背上全是别人的活气。祭师袖中滚出太一火漆——原来税，早就征到了人间。");
    qmToLove(5);
  }else if(tag==="qmCh6"){
    S.reputation+=25; S.jianghu.xia+=6;
    S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("人皇气运")) S.fortunes.push("人皇气运");
    qmLog("第六章终","仙胎炉炸开时，废祠名册上的名字化作星光回城。裴衡倒在炉前，仍在笑：你斩得掉我，斩不掉税。除非你去天门问。");
    qmToLove(7);
  }else if(tag==="qmCh7"){
    q.cleared=true; q.ending=q.ending||"一剑问天";
    S.reputation+=50; S.wudao["剑道"]=(S.wudao["剑道"]||0)+5; giveItem("仙使本源",1);
    S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("一剑断天门")) S.fortunes.push("一剑断天门");
    qmLog("第七章终","你这一剑没有飞升。剑光只把天门劈开一条缝，让人间的雨能重新落下来。太一散去前说：税停了。别让它再被写成别的名字。");
    qmToLove(8);
  }else if(tag==="qmReplay"){
    S.lingShi+=80; S.xiu=clamp(S.xiu+8,0,100);
    qmLog("重温","天门旧战再胜一场。灵石+80，修为+8。雨还是当年那一场。");
  }
  if(tag==="qmCh7") showQingmingStory();
  else if(tag==="qmReplay") showQingming();
  else showQingmingStory();
}

(function patchQingmingHooks(){
  if(typeof NPCS==="object"){
    NPCS["阿霜"]=NPCS["阿霜"]||{desc:"青冥外门，在南疆等雨的女修，20",gender:"女",like:["雨","活","心法"],tone:"清润"};
    NPCS["苏晚晴"]=NPCS["苏晚晴"]||{desc:"青冥外门银面，东海归墟守碑人，23",gender:"女",like:["海","令","真相"],tone:"清冷"};
  }
  if(typeof BOND_ROUTES==="object"){
    BOND_ROUTES["阿霜"]=BOND_ROUTES["阿霜"]||{where:"南疆瘴林",needChapter:1,needRealm:0,realm:"金丹",elem:"木",role:"瘴雨护主",route:"青冥长卷第三章会遇见她。不必回情缘菜单逐个对话。"};
    BOND_ROUTES["苏晚晴"]=BOND_ROUTES["苏晚晴"]||{where:"东海归墟",needChapter:1,needRealm:0,realm:"金丹",elem:"水",role:"银面盟印",route:"青冥长卷第五章会遇见她。不必回情缘菜单逐个对话。"};
  }
  if(typeof PORTRAIT==="object"){
    PORTRAIT["阿霜"]=PORTRAIT["阿霜"]||"青布衣，发上常沾着南疆的雨，眉眼清润，腕间一圈被瘴气烫过的浅痕。笑起来很浅，却会把干外套扔给你。";
    PORTRAIT["苏晚晴"]=PORTRAIT["苏晚晴"]||"银面之下是冷白的眉眼，唇色被海风吹红，锁骨下一道旧疤。她说话清冷，靠近时却会把盟印按在你背上。";
  }
  if(typeof ensureGameState==="function"){
    const _ensure=ensureGameState;
    ensureGameState=function(){ _ensure.apply(this,arguments); qmEnsure(); };
  }
  if(typeof finishStoryBattle==="function"){
    const _fsb=finishStoryBattle;
    finishStoryBattle=function(tag){
      if(String(tag||"").indexOf("qm")===0){ finishQingmingBattle(tag); return; }
      return _fsb.apply(this,arguments);
    };
  }
  if(typeof renderEvent==="function"){
    const _re=renderEvent;
    renderEvent=function(){
      if(curEvent && curEvent.kind==="青冥长卷"){
        const o=(curEvent.opts||[]).map(x=>opt(x.k,x.tag,x.c,x.tx,"qmOpt",x.k,x.hint)).join("");
        return panel("mystic","青冥长卷 · "+htmlEsc(curEvent.t), "<div class=\"row\">"+curEvent.n+"</div><div class=\"opts\">"+o+"</div><div class=\"sm\" style=\"margin-top:6px\">这一卷是线性长卷：前面的选择会改写后文，伏笔会在后面的章节回收。</div>");
      }
      return _re.apply(this,arguments);
    };
  }
  if(typeof sanitizeSaveData==="function"){
    const _san=sanitizeSaveData;
    sanitizeSaveData=function(p){
      const q=_san(p);
      if(!q||!q.S) return q;
      const m=q.S.qingming&&typeof q.S.qingming==="object"?q.S.qingming:{};
      const flags=m.flags&&typeof m.flags==="object"?m.flags:{};
      const cleanFlags={};
      Object.keys(flags).slice(0,80).forEach(k=>{ cleanFlags[String(k).slice(0,40)]=!!flags[k]; });
      q.S.qingming={
        chapter:clamp(Math.round(Number(m.chapter)||1),1,9),
        scene:clamp(Math.round(Number(m.scene)||0),0,30),
        clue:clamp(Math.round(Number(m.clue)||0),0,9),
        path:String(m.path||"").slice(0,20),
        ally:String(m.ally||"").slice(0,20),
        oath:String(m.oath||"").slice(0,20),
        flame:String(m.flame||"").slice(0,20),
        ending:String(m.ending||"").slice(0,30),
        next:clamp(Math.round(Number(m.next)||0),0,9),
        cleared:!!m.cleared,
        history:Array.isArray(m.history)?m.history.slice(-24).map(x=>String(x).slice(0,120)):[],
        flags:cleanFlags
      };
      return q;
    };
  }
  if(typeof combatLose==="function"){
    const _lose=combatLose;
    combatLose=function(){
      const tag=CB&&CB.afterWin;
      if(tag && String(tag).indexOf("qm")===0){
        const name=(CB.enemy&&CB.enemy.name)||"强敌";
        CB=null;
        S.hp=Math.max(1, Math.round((S.hpMax||100)*0.3));
        S.status="重伤";
        qmLog("青冥长卷","你败在"+name+"手下，被人从生死线上拖了回来。伤可以养，因果不会因此中断。");
        showQingming();
        return;
      }
      return _lose.apply(this,arguments);
    };
  }
})();
