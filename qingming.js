"use strict";
/* 青冥长卷 · 线性修仙主线
 * 这不是随机事件库。废祠的名册、南疆的雨、血月的祭、帝京的炉、天门的税，
 * 是同一条因果。你在前面留下的选择，会在后面变成刀、变成援手、变成结局。
 */
function qmDefault(){
  return {chapter:1,scene:0,clue:0,path:"",ally:"",oath:"",flame:"",cleared:false,ending:"",history:[],flags:{}};
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
  <div class="row sm">青冥长卷是一条独立的线性修仙主线。废祠名册、南疆阿霜、血月祭坛、东海灵焰、帝京仙胎、天外之税，是同一条因果，不是随机抽卡。</div>
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
    q.ending?"终局已落笔："+q.ending+"。":"终局未写。天门前后，都还来得及改。"
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
        qmLog("药庐","药渣是禁药引魂散。有人要让失踪者“自己走”到某个地方，而不是被掳走。");
      }),
      qmOpt("B","人情","#D88FA5","安抚小满，请她说实话","线索+1，小满好感+8，听见面具人的名字",()=>{
        qmFlag("sawYaolu",true); q.clue++; S.aff["小满"]=(S.aff["小满"]||0)+8;
        qmFlag("heardShen",true);
        qmLog("药庐","小满说：戴青铜面具的人不是来投毒的。他低声问过‘阿霜还在不在南疆等雨’，取走的是解药，不是引魂散。");
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
        qmLog("断崖","失踪弟子是去接头的。灭口的人用的是血月逆剑，救人的那一剑却在拼命挡。");
      }),
      qmOpt("B","攀崖","#C4675C","沿血迹下崖","线索+1，气血-8，得半块青冥令",()=>{
        qmFlag("sawCliff",true); q.clue++; S.hp=clamp(S.hp-8,1,S.hpMax);
        giveItem("半块青冥令",1); qmFlag("hasLing",true);
        qmLog("断崖","你在崖缝摸到半块青令。令上只剩两个字：青冥。雨一冲，字就亮了一下，像认人。");
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
      qmAdvance(2,0,0);
    }),
    qmOpt("B","夺册","#C9A45C","先抢名册，再决定他的死活","得名册。他负伤遁走，后文仍可能出现",()=>{
      giveItem("抢出名册",1); qmFlag("shenFled",true); S.reputation+=4;
      qmLog("第一章","你夺下名册时，他没有还手。面具裂了一线，露出很年轻的眼睛：“南疆有雨。你若还想做人，就去找阿霜。”");
      qmAdvance(2,0,0);
    }),
    qmOpt("C","斩断","#C4675C","当作凶手，一剑了结","战斗。胜则名册入手，但会少一条后援",()=>{qmFight("青铜面具·沈无咎","金",1.05,0.62,76,"qmCh1");})
  ] : [
    qmOpt("A","开战","#C4675C","当他是焚册凶手","战斗。信息不足时，这一剑可能斩错人",()=>{qmFight("青铜面具人","金",1.08,0.66,78,"qmCh1");}),
    qmOpt("B","喝止","#7FA8C9","先问他名册是要烧给谁","他会留下半句真话后遁走",()=>{
      giveItem("烧焦名册",1); qmFlag("shenFled",true);
      qmLog("第一章","他没有摘面具。只丢下一句：“阿霜还在南疆等雨。名册不是粮，是税。”随后身形碎进纸灰里。");
      qmAdvance(2,0,0);
    }),
    qmOpt("C","旁观","#555","让他烧完，自己只记下祭纹","业力+2，后文帝京能更快看懂炉阵，但废祠会记住你的沉默",()=>{
      S.karma+=2; qmFlag("watchedFire",true); qmGiveSkill("残火记纹","火",18,10,"阵");
      qmLog("第一章","你看着名字变成灰。祭纹进了你眼里，也进了你以后所有的梦。有些债，不是打赢就能还。");
      qmAdvance(2,0,0);
    })
  ]);
}

function qmChapter2(){
  const q=S.qingming;
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
      qmAdvance(3,0,0);
    }),
    qmOpt("B","改命","#A98FD9","择术道改命","悟性+2，得地阶功法。后文可用规则换路，而非只靠杀伐",()=>{
      q.path="改命术道"; S.six.悟性=clamp(S.six.悟性+2,1,20);
      qmGiveGongfa("青冥改命篇","地阶");
      qmLog("第二章","你没有答应做圣人，只答应把不公平的命改一改。残碑把一页还没写完的术送给你。");
      qmAdvance(3,0,0);
    }),
    qmOpt("C","为薪","#C4675C","择身道为薪","气血上限+50。后文可把自己的寿与伤，换成别人的活路",()=>{
      q.path="身为薪火"; S.hpMax+=50; S.hp=S.hpMax; S.karma+=1;
      qmGiveSkill("薪火燃身","火",26,12,"体");
      qmLog("第二章","你把寿元当成柴。残碑在夜里轻轻裂开，像是答应了，又像是叹气。");
      qmAdvance(3,0,0);
    })
  ]);
}
function qmChapter3(){
  const q=S.qingming;
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
      qmFlag("ashuang",true); S.aff["阿霜"]=(S.aff["阿霜"]||0)+20;
      if(q.path==="身为薪火"){ S.hp=clamp(S.hp-15,1,S.hpMax); qmLog("第三章","你把她经脉里的毒引到自己身上。阿霜睁眼时只说：那以后你欠我的，就用命还。我也会还。"); }
      else qmLog("第三章","你把心法按回去，只问她还能不能走。阿霜笑得很浅：名册上的人第一次有人先问活，不问功法。");
      qmAdvance(4,0,0);
    }),
    qmOpt("B","夺卷","#C9A45C","先取心法，再视情况救人","得青冥心法。阿霜会活，却会在血月那天以另一种方式回来",()=>{
      q.ally="失散"; qmGiveGongfa("青冥心法残卷","玄阶"); S.xiu=clamp(S.xiu+8,0,100);
      qmFlag("tookScroll",true);
      qmLog("第三章","你取走心法时，阿霜看你的眼神像看一场即将应验的旧咒。她没有拦，只说：血月升起时，你会认得这些名字。");
      qmAdvance(4,0,0);
    }),
    qmOpt("C","破瘴","#A98FD9","强行破开瘴阵，两人一起走","战斗：南疆瘴母。胜则人与心法双全",()=>{qmFight("南疆瘴母","木",1.12,0.72,74,"qmCh3");})
  ]);
}
function qmChapter4(){
  const q=S.qingming;
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
      if(qmFlag("tookScroll") && !qmFlag("ashuang")){ q.ally="阿霜"; qmFlag("ashuang",true); S.aff["阿霜"]=(S.aff["阿霜"]||0)+15; qmLog("第四章","你把三年寿元投进血月时，阿霜的绳子自己断了。她没谢你夺卷，只谢你还肯把命放回来。"); }
      else qmLog("第四章","你把三年寿元投进血月。祭坛熄了，城中灯火却一盏盏亮起来。有个孩子问：侠士，我们是不是不用自己走到柱子上去了。");
      qmAdvance(5,0,0);
    }),
    qmOpt("C","记阵","#555","按兵不动，只记下阵法","业力+3，得血月记阵。后文帝京能拆炉，但有人会记得你当时没拔剑",()=>{
      q.oath="冷眼记阵"; S.karma+=3; qmGiveSkill("血月记阵","火",22,12,"阵"); qmFlag("recordedArray",true);
      if(qmFlag("ashuang")){ S.aff["阿霜"]=Math.max(0,(S.aff["阿霜"]||0)-20); qmLog("第四章","阿霜没有骂你。她只把剑收回鞘里，从此走路不再与你并肩。有些人能原谅杀错，不能原谅旁观。"); }
      else qmLog("第四章","你记住了阵法，也记住了那些人看你的眼睛。城还在，灯却少了很多。");
      qmAdvance(5,0,0);
    })
  ]);
}
function qmChapter5(){
  const q=S.qingming;
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
      qmFlag("silverAlly",true); S.aff["苏晚晴"]=(S.aff["苏晚晴"]||0)+12;
      qmLog("第五章","青焰入体时，苏晚晴摘下一角银面：外门苏晚晴。她说国师袖里有半块青冥令，帝京的炉，就是血月的放大。");
      qmAdvance(6,0,0);
    }),
    qmOpt("B","赤焰","#C4675C","取赤焰焚业","攻击大增，业力+2。可在帝京把炉连人带罪一起烧干净",()=>{
      q.flame="赤焰焚业"; S.karma+=2; S.xiu=clamp(S.xiu+12,0,100);
      qmGiveSkill("赤焰焚业","火",38,18,"焚");
      qmFlag("silverAlly",true);
      qmLog("第五章","赤焰认你时，海面像被点燃。苏晚晴没有拦，只说：你若用这焰去烧不该烧的人，青冥就又写成了税。");
      qmAdvance(6,0,0);
    }),
    qmOpt("C","玄焰","#A98FD9","取玄焰改命","悟性+2。天门可选择改写规则，而不只是斩仙使",()=>{
      q.flame="玄焰改命"; S.six.悟性=clamp(S.six.悟性+2,1,20);
      qmGiveSkill("玄焰改命","雷",30,20,"改");
      qmFlag("silverAlly",true);
      if(q.path!=="改命术道") qmLog("第五章","玄焰很挑人。它最终还是来了，像看你在残碑前没选改命，却仍不甘心把命交给上方。");
      else qmLog("第五章","改命篇与玄焰一碰即合。苏晚晴低声说：天门不是门，是税口。税口能拆，也能改成可以问的门。");
      qmAdvance(6,0,0);
    })
  ]);
}

function qmChapter6(){
  const q=S.qingming;
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
        qmLog("暗巷","逆谱抄本入手。你第一次看清：血月不是邪教，是朝廷的预演。");
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
        qmLog("朝堂","你把因果说完。有人拍案，有人退席。裴衡在帘后鼓掌，像听一段他早就写好的戏。");
      }),
      qmOpt("B","暗通","#7FA8C9","不掀桌，只把证据交给尚能信的人","证据+1，后文少一场朝堂风波",()=>{
        qmFlag("evChaotang",true); q.clue++; S.six.道心=clamp(S.six.道心+0.5,1,20);
        qmLog("朝堂","你没有当众撕破脸。证据进了另一双手。帝京的夜因此多了一点变数。");
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
      qmAdvance(7,0,0);
    }),
    qmOpt("C","夺炉","#8B6FA8","把仙胎炉据为己用","战力暴涨，业力+5，终局将更孤",()=>{
      S.karma+=5; S.hpMax+=80; S.mpMax+=50; S.hp=S.hpMax; S.mp=S.mpMax;
      qmFlag("tookFurnace",true); q.oath=q.oath||"夺炉改命";
      qmGiveGongfa("仙胎残炉诀","天阶");
      qmLog("第六章","炉火入体的瞬间，你听见许多名字在喊。有的谢你，有的骂你。长生第一次变得很吵。");
      qmAdvance(7,0,0);
    })
  ]);
}
function qmChapter7(){
  const q=S.qingming;
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
      qmAdvance(8,0,0);
    }));
  }
  if(q.path==="身为薪火"){
    opts.push(qmOpt("C","燃己","#C4675C","以自身为薪，点燃天门","年龄+5，气血上限+60。你活着走下来，门会裂",()=>{
      S.age+=5; S.hpMax+=60; S.hp=S.hpMax; q.ending="薪火裂门"; q.cleared=true;
      S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("青冥薪火")) S.fortunes.push("青冥薪火");
      qmLog("第七章终","你把自己烧进门缝里。天门裂开时，有人看见的不是剑光，是一个人还肯为别人热一次。");
      qmAdvance(8,0,0);
    }));
  }
  qmEvent("天外问剑", qmP(help.concat([tax,"<span class=\"sm\">应剑、改门或燃己。你在残碑前选的路，此刻才真正派上用场。</span>"])), opts);
}
function qmChapter8(){
  const q=S.qingming;
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
      qmAdvance(9,0,0);
    }),
    qmOpt("B","独掌","#C4675C","独掌青冥，问鼎长生","战力极强，业力上升。九州安定很久，却再无人敢问“人该怎么活”",()=>{
      q.ending="独掌青冥"; q.cleared=true; S.karma+=4; S.hpMax+=120; S.mpMax+=80; S.hp=S.hpMax; S.mp=S.mpMax;
      qmGiveGongfa("青冥独尊经","仙阶");
      S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("独掌青冥")) S.fortunes.push("独掌青冥");
      qmLog("终章","你把青冥收进气海。九州安定了很久，却再也没有人敢在雨夜去废祠问一句人该怎么活。");
      qmAdvance(9,0,0);
    })
  ]);
}
function qmChapter9(){
  const q=S.qingming;
  const end = q.ending||"未名";
  qmEvent("问道长生", qmP([
    "长卷合上时，你才发现这一路并不长：废祠一夜，南疆一雨，血月一坛，东海一碑，帝京一炉，天门一剑。",
    "真正长的是因果。"+qmYou()+"此刻的结局是「"+htmlEsc(end)+"」。它不是天书记的，是你一刀一念写下的。",
    "你可以重温天门旧战，可以再读一遍伏笔，也可以把这一卷放下，去九州继续做人。青冥已经问过你一次。以后的问，是你问自己。"
  ]), [
    qmOpt("A","重温","#C9A45C","再战天门残影","反复挑战，灵石与修为",()=>qmReplay()),
    qmOpt("B","回廊","#A98FD9","回顾全部因果","把铺垫和回收再看一遍",()=>qmRecall()),
    qmOpt("C","游历","#6FA698","合卷，继续九州","长卷仍可随时打开",()=>{ qmLog("终章","你合上青冥长卷。雨还在下，只是不再像税。"); qmToHub(); })
  ]);
}
function finishQingmingBattle(tag){
  ensureGameState(); qmEnsure();
  const q=S.qingming;
  if(tag==="qmCh1"){
    S.jianghu.xia+=3; giveItem("烧焦名册",1); qmFlag("maskDead",true);
    qmLog("第一章终","名册从火里抢出来时，还带着体温。青铜面具碎了一半，露出的那只眼睛很年轻。他最后说的仍是：南疆有雨。");
    qmAdvance(2,0,0);
  }else if(tag==="qmCh3"){
    q.ally="阿霜"; qmFlag("ashuang",true); qmGiveGongfa("青冥心法残卷","玄阶"); S.merit+=2; S.aff["阿霜"]=(S.aff["阿霜"]||0)+18;
    qmLog("第三章终","瘴母散去后，阿霜把心法塞回你手里：这次算你救我，下次我救你。名册上的字，第一次自己淡了一笔。");
    qmAdvance(4,0,0);
  }else if(tag==="qmCh4"){
    q.oath="斩祭护生"; S.jianghu.xia+=5; S.merit+=4; S.reputation+=12;
    if(qmFlag("tookScroll") && !qmFlag("ashuang")){ q.ally="阿霜"; qmFlag("ashuang",true); S.aff["阿霜"]=(S.aff["阿霜"]||0)+10; }
    qmLog("第四章终","血月熄了。你把祭品一个个背出坛场，背上全是别人的活气。祭师袖中滚出太一火漆——原来税，早就征到了人间。");
    qmAdvance(5,0,0);
  }else if(tag==="qmCh6"){
    S.reputation+=25; S.jianghu.xia+=6;
    S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("人皇气运")) S.fortunes.push("人皇气运");
    qmLog("第六章终","仙胎炉炸开时，废祠名册上的名字化作星光回城。裴衡倒在炉前，仍在笑：你斩得掉我，斩不掉税。除非你去天门问。");
    qmAdvance(7,0,0);
  }else if(tag==="qmCh7"){
    q.cleared=true; q.ending=q.ending||"一剑问天";
    S.reputation+=50; S.wudao["剑道"]=(S.wudao["剑道"]||0)+5; giveItem("仙使本源",1);
    S.fortunes=S.fortunes||[]; if(!S.fortunes.includes("一剑断天门")) S.fortunes.push("一剑断天门");
    qmLog("第七章终","你这一剑没有飞升。剑光只把天门劈开一条缝，让人间的雨能重新落下来。太一散去前说：税停了。别让它再被写成别的名字。");
    qmAdvance(8,0,0);
  }else if(tag==="qmReplay"){
    S.lingShi+=80; S.xiu=clamp(S.xiu+8,0,100);
    qmLog("重温","天门旧战再胜一场。灵石+80，修为+8。雨还是当年那一场。");
  }
  if(tag==="qmCh7") showQingmingStory();
  else if(tag==="qmReplay") showQingming();
  else showQingmingStory();
}

(function patchQingmingHooks(){
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
