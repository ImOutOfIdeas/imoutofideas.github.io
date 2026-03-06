// ==============================
// PANEL NAVIGATION
// ==============================
const PANEL_IDS={home:'ph',eurorack:'pe',bios:'pb',scope:'ps',projects:'pp',skills:'psk',contact:'pc'};
let cur='home', transitioning=false;
function sw(id, el){
  if(transitioning||id===cur)return;
 transitioning=true;
  const ov=document.getElementById('ov');
  ov.classList.add('tr');
  setTimeout(()=>{
    document.getElementById(PANEL_IDS[cur]).classList.remove('active');
    document.getElementById(PANEL_IDS[id]).classList.add('active');
    cur=id;
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('at'));
    if(el)el.classList.add('at');
    if(id==='bios')initBios();
    if(id==='scope')initScope();
  },300);
  setTimeout(()=>{ov.classList.remove('tr');transitioning=false;},680);
}

// ==============================
// AUDIO ENGINE
// ==============================
let actx=null,filt=null,gain=null,lfo=null,lfog=null,lfofg=null,analyser=null;
let notes={},seqTimer=null,seqStep=0,playing=false,started=false;
const P={   freq:440, oct:1, det:0, wave:'sine',
            cut:2000, res:1, envAmt:.5, ftype:'lowpass',
            atk:.01, dec:.1, sus:.7, rel:.3,
            lrate:1, ldpth:0, lf:0, lwave:'sine',
            vol:.5, rvb:.1, bpm:120};

const NF={'C3':130.81,'D3':146.83,'E3':164.81,'F3':174.61,'G3':196,'A3':220,'B3':246.94,
  'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392,'A4':440,'B4':493.88,
  'C5':523.25,'D5':587.33,'E5':659.25,'F5':698.46,'G5':783.99,'A5':880,'B5':987.77};
const ALLNOTES=Object.keys(NF);

const SEQ=[
  {note:'C4',on:true},{note:'E4',on:false},{note:'G4',on:true},{note:'A4',on:false},
  {note:'C5',on:true},{note:'G4',on:false},{note:'E4',on:true},{note:'D4',on:false}
];

async function startAudio(){
  if(started)return;
  actx=new(window.AudioContext||window.webkitAudioContext)();
  filt=actx.createBiquadFilter();filt.type=P.ftype;filt.frequency.value=P.cut;filt.Q.value=P.res;
  gain=actx.createGain();gain.gain.value=P.vol;
  lfo=actx.createOscillator();lfo.type=P.lwave;lfo.frequency.value=P.lrate;
  lfog=actx.createGain();lfog.gain.value=P.ldpth;
  lfofg=actx.createGain();lfofg.gain.value=P.lf;
  analyser=actx.createAnalyser();analyser.fftSize=2048;
  lfo.connect(lfog);lfo.connect(lfofg);lfofg.connect(filt.frequency);
  filt.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
  lfo.start();
  started=true;
  document.getElementById('led').classList.add('on');
  document.getElementById('rstat').textContent='POWER ON — READY TO SYNTHESIZE';
  const sb=document.getElementById('startbtn');sb.textContent='RUNNING';sb.style.background='var(--green)';
  animVU();animVScope();
}

function playNote(freq,id){
  if(!actx)return;stopNote(id);
  const osc=actx.createOscillator();osc.type=P.wave;
  osc.frequency.value=freq*P.oct;osc.detune.value=P.det;
  lfog.connect(osc.frequency);
  const eg=actx.createGain();
  eg.gain.setValueAtTime(0,actx.currentTime);
  eg.gain.linearRampToValueAtTime(1,actx.currentTime+P.atk);
  eg.gain.linearRampToValueAtTime(P.sus,actx.currentTime+P.atk+P.dec);
  filt.frequency.setValueAtTime(P.cut,actx.currentTime);
  filt.frequency.linearRampToValueAtTime(P.cut+P.envAmt*7000,actx.currentTime+P.atk);
  filt.frequency.linearRampToValueAtTime(P.cut,actx.currentTime+P.atk+P.dec);
  osc.connect(eg);eg.connect(filt);osc.start();
  notes[id]={osc,eg};
}

function stopNote(id){
  if(!actx||!notes[id])return;
  const {osc,eg}=notes[id];const t=actx.currentTime;
  eg.gain.cancelScheduledValues(t);eg.gain.setValueAtTime(eg.gain.value,t);
  eg.gain.linearRampToValueAtTime(0,t+P.rel);
  osc.stop(t+P.rel+.01);delete notes[id];
}

function animVU(){
  if(!analyser)return;
  const vb=document.getElementById('vubar');
  const d=new Uint8Array(analyser.frequencyBinCount);
  (function loop(){
    analyser.getByteTimeDomainData(d);
    let s=0;for(let i=0;i<d.length;i++){const v=(d[i]-128)/128;s+=v*v;}
    const p=Math.min(100,Math.sqrt(s/d.length)*280);
    vb.style.height=p+'%';
    vb.style.background=p>70?'#f00':p>50?'#ff0':'var(--green)';
    requestAnimationFrame(loop);
  })();
}

function animVScope(){
  const c=document.getElementById('vscope');if(!c||!analyser)return;
  const ctx=c.getContext('2d');const W=c.width,H=c.height;
  (function loop(){
    requestAnimationFrame(loop);
    const d=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(d);
    ctx.fillStyle='#001100';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#00ff00';ctx.lineWidth=1;ctx.beginPath();
    const sl=W/64;for(let i=0;i<64;i++){
      const v=d[Math.floor(i*d.length/64)]/128-1;const y=(v+1)/2*H;
      if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i*sl,y);
    }ctx.stroke();
  })();
}

// SEQUENCER
(function(){
  const c=document.getElementById('ssteps');
  SEQ.forEach((s,i)=>{
    const d=document.createElement('div');d.className='sstep';
    d.innerHTML=`<div class="snote ${s.on?'on':''}" id="sn${i}" onclick="toggleSS(${i})">${s.note.replace(/\d/,'')}</div><div class="spm" id="sp${i}" data-i="${i}">${s.note}</div>`;
    c.appendChild(d);
  });
  document.querySelectorAll('.spm').forEach(el=>{
    let drag=false,sy=0,si=0;const idx=+el.dataset.i;
    el.addEventListener('mousedown',e=>{drag=true;sy=e.clientY;si=ALLNOTES.indexOf(SEQ[idx].note);e.preventDefault();});
    document.addEventListener('mousemove',e=>{if(!drag)return;const d=Math.round((sy-e.clientY)/10);const ni=Math.max(0,Math.min(ALLNOTES.length-1,si+d));SEQ[idx].note=ALLNOTES[ni];el.textContent=ALLNOTES[ni];});
    document.addEventListener('mouseup',()=>{drag=false;});
  });
})();

function toggleSS(i){SEQ[i].on=!SEQ[i].on;document.getElementById('sn'+i).classList.toggle('on',SEQ[i].on);}

document.getElementById('seqpl').addEventListener('click',function(){
  if(!started)startAudio().then(toggleSeq).catch(toggleSeq);else toggleSeq();
});

function toggleSeq(){
  playing=!playing;
  const btn=document.getElementById('seqpl');btn.textContent=playing?'⏸':'▶';btn.classList.toggle('pl',playing);
  if(playing){seqStep=0;runSeq();}
  else{clearTimeout(seqTimer);document.querySelectorAll('.snote').forEach(el=>el.classList.remove('as'));}
}

function runSeq(){
  if(!playing)return;
  document.querySelectorAll('.snote').forEach(el=>el.classList.remove('as'));
  document.getElementById('sn'+seqStep).classList.add('as');
  if(SEQ[seqStep].on&&actx){
    const fr=NF[SEQ[seqStep].note]||440;
    playNote(fr,'seq');
    setTimeout(()=>stopNote('seq'),(60000/P.bpm)*.75);
  }
  seqStep=(seqStep+1)%8;
  seqTimer=setTimeout(runSeq,60000/P.bpm);
}

document.getElementById('seqrst').addEventListener('click',()=>{seqStep=0;document.querySelectorAll('.snote').forEach(el=>el.classList.remove('as'));});

// KNOBS
function initKnob(el){
  let drag=false,sy=0,sv=0;
  const min=parseFloat(el.dataset.min),max=parseFloat(el.dataset.max);
  let val=parseFloat(el.dataset.val);
  const line=el.querySelector('.kl');
  const ang=v=>-140+((v-min)/(max-min))*280;
  if(line)line.style.transform=`translateX(-50%) rotate(${ang(val)}deg)`;
  el.addEventListener('mousedown',e=>{drag=true;sy=e.clientY;sv=val;document.body.style.cursor='ns-resize';e.preventDefault();});
  el.addEventListener('wheel',e=>{val=Math.max(min,Math.min(max,val+(e.deltaY<0?1:-1)*(max-min)*.02));if(line)line.style.transform=`translateX(-50%) rotate(${ang(val)}deg)`;onKC(el.id,val);e.preventDefault();},{passive:false});
  document.addEventListener('mousemove',e=>{if(!drag)return;val=Math.max(min,Math.min(max,sv+(sy-e.clientY)/200*(max-min)));if(line)line.style.transform=`translateX(-50%) rotate(${ang(val)}deg)`;onKC(el.id,val);});
  document.addEventListener('mouseup',()=>{if(drag){drag=false;document.body.style.cursor='';}});
}

function onKC(id,v){
  const f=(n,d=1)=>n.toFixed(d);
  switch(id){
    case'kfreq':P.freq=v;document.getElementById('kvfreq').textContent=Math.round(v)+' Hz';break;
    case'koct':P.oct=[.5,1,2,4][Math.round(v)];document.getElementById('kvoct').textContent=['×0.5','×1','×2','×4'][Math.round(v)];break;
    case'kdet':P.det=v;document.getElementById('kvdet').textContent=Math.round(v)+'¢';break;
    case'kcut':P.cut=v;document.getElementById('kvcut').textContent=v>999?f(v/1000,1)+'kHz':Math.round(v)+' Hz';if(filt)filt.frequency.value=v;break;
    case'kres':P.res=v;document.getElementById('kvres').textContent=f(v)+' Q';if(filt)filt.Q.value=v;break;
    case'kenv':P.envAmt=v;document.getElementById('kvenv').textContent=Math.round(v*100)+'%';break;
    case'katk':P.atk=v;document.getElementById('kvatk').textContent=v<.1?Math.round(v*1000)+'ms':f(v)+'s';break;
    case'kdec':P.dec=v;document.getElementById('kvdec').textContent=v<.1?Math.round(v*1000)+'ms':f(v)+'s';break;
    case'ksus':P.sus=v;document.getElementById('kvsus').textContent=Math.round(v*100)+'%';break;
    case'krel':P.rel=v;document.getElementById('kvrel').textContent=v<.1?Math.round(v*1000)+'ms':f(v)+'s';break;
    case'klrate':P.lrate=v;document.getElementById('kvlrate').textContent=f(v)+' Hz';if(lfo)lfo.frequency.value=v;break;
    case'kldpth':P.ldpth=v;document.getElementById('kvldpth').textContent=Math.round(v);if(lfog)lfog.gain.value=v;break;
    case'klf':P.lf=v;document.getElementById('kvlf').textContent=Math.round(v)+' Hz';if(lfofg)lfofg.gain.value=v;break;
    case'kvol':P.vol=v;document.getElementById('kvvol').textContent=Math.round(v*100)+'%';if(gain)gain.gain.value=v;break;
    case'krvb':P.rvb=v;document.getElementById('kvrvb').textContent=Math.round(v*100)+'%';break;
    case'kbpm':P.bpm=Math.round(v);document.getElementById('bpmd').textContent=Math.round(v);break;
  }
}

document.querySelectorAll('.knob').forEach(initKnob);

// Wave buttons
['wave','filter','lfo'].forEach(type=>{
  document.querySelectorAll(`.wb[data-${type}]`).forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.closest('.tg').querySelectorAll('.wb').forEach(b=>b.classList.remove('act'));
      btn.classList.add('act');
      if(type==='wave'){P.wave=btn.dataset.wave;}
      if(type==='filter'){P.ftype=btn.dataset.filter;if(filt)filt.type=P.ftype;}
      if(type==='lfo'){P.lwave=btn.dataset.lfo;if(lfo)lfo.type=P.lwave;}
    });
  });
});

// KEYBOARD
(function(){
  const kb=document.getElementById('kb');
  const wfreqs=[261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33,659.25];
  const wnames=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];
  wfreqs.forEach((f,i)=>{
    const k=document.createElement('div');k.className='kw2';k.dataset.freq=f;k.title=wnames[i];kb.appendChild(k);
  });
  const bdata=[[1,277.18],[2,311.13],[4,369.99],[5,415.3],[6,466.16],[8,622.25],[9,698.46]];
  bdata.forEach(([pos,f])=>{
    const k=document.createElement('div');k.className='kb2';k.dataset.freq=f;
    k.style.left=(pos*29-10)+'px';kb.appendChild(k);
  });
  kb.addEventListener('mousedown',e=>{
    const k=e.target.closest('.kw2,.kb2');if(!k||!k.dataset.freq)return;
    if(!started){startAudio();return;}
    k.classList.add('pr');playNote(parseFloat(k.dataset.freq),'kb_'+k.dataset.freq);
  });
  document.addEventListener('mouseup',()=>{
    document.querySelectorAll('.kw2.pr,.kb2.pr').forEach(k=>{
      k.classList.remove('pr');stopNote('kb_'+k.dataset.freq);
    });
  });
})();

const KM={'a':261.63,'w':277.18,'s':293.66,'e':311.13,'d':329.63,'f':349.23,'t':369.99,
  'g':392,'y':415.3,'h':440,'u':466.16,'j':493.88,'k':523.25,'o':554.37,'l':587.33};
document.addEventListener('keydown',e=>{if(e.repeat||!KM[e.key])return;if(!started)return;playNote(KM[e.key],'key_'+e.key);});
document.addEventListener('keyup',e=>{if(KM[e.key])stopNote('key_'+e.key);});

// ==============================
// OSCILLOSCOPE
// ==============================
let scopeInited=false,scopeMode='time';
function setSM(m){
  scopeMode=m;
  document.querySelectorAll('.sbtn').forEach(b=>b.classList.remove('sa'));
  document.getElementById('sm'+m).classList.add('sa');
}
function initScope(){
  if(scopeInited)return;scopeInited=true;
  const canvas=document.getElementById('sc');
  const ctx=canvas.getContext('2d');
  const resize=()=>{const w=canvas.parentElement;canvas.width=w.clientWidth;canvas.height=w.clientHeight;};
  resize();window.addEventListener('resize',resize);
  let t=0;
  (function draw(){
    requestAnimationFrame(draw);t+=.016;
    const W=canvas.width,H=canvas.height;
    ctx.fillStyle='rgba(0,16,0,.25)';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#00ff44';ctx.lineWidth=2;ctx.shadowBlur=10;ctx.shadowColor='#00ff44';
    if(analyser&&started){
      if(scopeMode==='time'){
        const d=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(d);
        ctx.beginPath();d.forEach((v,i)=>{const y=(v/255)*H;if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i*(W/d.length),y);});ctx.stroke();
      }else if(scopeMode==='fft'){
        const d=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(d);
        const bw=W/(d.length/4);ctx.fillStyle='#00ff44';
        for(let i=0;i<d.length/4;i++){const h=(d[i]/255)*H;ctx.fillRect(i*bw,H-h,bw-1,h);}
      }else{
        const d=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(d);
        ctx.beginPath();for(let i=0;i<d.length-1;i++){const x=(d[i]/255)*W;const y=(d[i+1]/255)*H;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
      }
    }else{
      ctx.beginPath();
      for(let x=0;x<W;x++){
        const y=H/2+Math.sin(x/W*Math.PI*6+t*3)*(H*.28)+Math.sin(x/W*Math.PI*12+t*7)*(H*.1)+Math.sin(x/W*Math.PI*2+t)*(H*.1);
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }ctx.stroke();
    }
  })();
}

// ==============================
// BIOS (INFO)
// ==============================
let biosInited=false;
function initBios(){
  if(biosInited)return;biosInited=true;
  document.getElementById('bascii').textContent = "BIOS — Engineering Subsystem";
  const bc=document.getElementById('bcontent');
  const lines=[
    [0,''],
    [80,'Initializing DOYLE BIOS v1.0.73...',''],
    [280,'CPU Check: Jonathan Doyle Processing Unit @ 3.6GHz  ........ PASS','ok'],
    [560,'Memory: 32GB DDR5-5600  ',''],
    [2200,'Memory: 32GB DDR5-5600  ................................................ OK','ok'],
    [2500,'Storage: 2TB NVMe (Skills Repository)  .......................... OK','ok'],
    [2800,'GPU: Hardware Accelerator v6.0  ..................................... OK','ok'],
    [3100,''],
    [3200,'══════════════════════════════════════════════════════',''],
    [3300,'  SYSTEM SUBJECT: JONATHAN DOYLE                    ','hi'],
    [3500,''],
    [3500,''],
    [3600,'[ PERSONAL INFO ]','ti'],
    [3750,'  Name         : Jonathan Doyle',''],
    [3850,'  Role         : Software Engineer',''],
    [3950,'  Experience   : 5+ Years',''],
    [4050,'  Status       : *** ACTIVELY SEEKING EMPLOYMENT ***','wn'],
    [4150,'  Location     : Columbus, OH (Open to Remote / In-person)',''],
    [4250,''],
    [4350,'[ CAPABILITIES ]','ti'],
    [4450,'  Languages    : C · C++ · JavaScript · TypeScript · Python · Go',''],
    [4550,'  Frontend     : React · WebGL · Three.js · CSS Animation',''],
    [4650,'  Backend      : Node.js · GraphQL · gRPC · REST',''],
    [4750,'  Databases    : PostgreSQL · Redis · MongoDB',''],
    [4850,'  DevOps       : Docker · Kubernetes',''],
    [4950,'  Specialties  : Low-level systems · Performence optimization',''],
    [5050,''],
    [5150,'[ WORK HISTORY ]','ti'],
    [5250,'  2022-2024  Senior Software Engineer @ TechCorp Inc.',''],
    [5350,'             Led team of 8 engineers. 3 major product launches.',''],
    [5450,'  2020-2022  Software Engineer @ StartupXYZ',''],
    [5550,'             Built full-stack from 0 → 50k users in 18 months.',''],
    [5850,''],
    [5950,'[ EDUCATION ]','ti'],
    [6050,'  A.A. Art & Sciences — The Ohio State University (2020)',''],
    [6150,'  Self-directed: Systems Programming · Web Developement',''],
    [6250,''],
    [6350,'[ BOOT STATUS ]','ti'],
    [6450,'  All systems nominal.','ok'],
    [6550,'  Jonathan Doyle is online and ready for employment.','ok'],
    [6650,''],
    [6750,'  > Awaiting your offer...   ','wn',true],
  ];
  lines.forEach(([delay,text,cls='',cursor=false])=>{
    setTimeout(()=>{
      const d=document.createElement('div');d.className='bl'+(cls?' '+cls:'');
      if(delay===560){
        d.innerHTML=text+'<span class="bprog"></span>';
      }else if(cursor){
        d.innerHTML=text+'<span class="bcur"></span>';
      }else{d.textContent=text;}
      bc.appendChild(d);bc.scrollTop=bc.scrollHeight;
    },delay);
  });
}

console.log('%cJONATHAN DOYLE — SWE','color:#E8620A;font-size:22px;font-weight:bold;font-family:serif;text-shadow:2px 2px 0 #6B3D1E');
console.log('%c  Available for hire! Reach out: jonathandoyle655321@gmail.com','color:#D4A017;font-size:13px');
