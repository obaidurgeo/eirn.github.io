/* EIRN v2.0 — script.js */

/* ── CURSOR ── */
(function(){
  const c=document.getElementById('cur'),r=document.getElementById('cur-r');
  if(!c||!r)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;c.style.left=mx+'px';c.style.top=my+'px'});
  function tick(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;r.style.left=rx+'px';r.style.top=ry+'px';requestAnimationFrame(tick)}
  tick();
  document.querySelectorAll('a,button,.card,.pj-card,.sv-card,.tc,.pill').forEach(el=>{
    el.addEventListener('mouseenter',()=>{c.style.width='20px';c.style.height='20px';r.style.width='50px';r.style.height='50px';r.style.borderColor='rgba(90,150,48,.6)'});
    el.addEventListener('mouseleave',()=>{c.style.width='10px';c.style.height='10px';r.style.width='34px';r.style.height='34px';r.style.borderColor='rgba(90,150,48,.4)'});
  });
})();

/* ── NAV ── */
(function(){
  const nav=document.querySelector('nav');
  const tog=document.querySelector('.nav-tog');
  const links=document.querySelector('.nav-links');
  if(nav){
    window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>40)},{ passive:true });
    if(window.scrollY>40)nav.classList.add('scrolled');
  }
  if(tog&&links){
    tog.addEventListener('click',()=>{tog.classList.toggle('open');links.classList.toggle('open');tog.setAttribute('aria-expanded',links.classList.contains('open'))});
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');tog.classList.remove('open')}));
  }
  // active link
  const pg=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const h=a.getAttribute('href')||'';
    if(h===pg||(pg===''&&h==='index.html')||(pg==='index.html'&&h==='index.html'))a.classList.add('active');
  });
})();

/* ── PARTICLE CANVAS ── */
function initParticles(canvas,opts){
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const o={count:opts.count||55,speed:opts.speed||.4,color:opts.color||'rgba(90,150,48,.6)',lineColor:opts.lineColor||'rgba(90,150,48,.15)',maxDist:opts.maxDist||130,...opts};
  let pts=[],W,H,raf;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight}
  function make(){pts=[];for(let i=0;i<o.count;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*o.speed,vy:(Math.random()-.5)*o.speed,r:Math.random()*2+1})}
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=o.color;ctx.fill();
    });
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<o.maxDist){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=o.lineColor;ctx.globalAlpha=1-d/o.maxDist;ctx.lineWidth=.8;ctx.stroke();ctx.globalAlpha=1}
    }
    raf=requestAnimationFrame(draw);
  }
  resize();make();draw();
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();make();draw()},{passive:true});
}

/* ── SCROLL REVEAL ── */
(function(){
  const els=document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-sc,.stag');
  if(!els.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}});
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
})();

/* ── ANIMATED COUNTERS ── */
function animateCounter(el){
  const target=parseFloat(el.dataset.target||el.textContent)||0;
  const dur=1800;const start=performance.now();
  const isInt=Number.isInteger(target);
  function tick(now){
    const p=Math.min((now-start)/dur,1);
    const eased=1-Math.pow(1-p,3);
    const val=target*eased;
    el.textContent=isInt?Math.round(val):val.toFixed(1)+(el.dataset.suffix||'');
    if(p<1)requestAnimationFrame(tick);
    else el.textContent=(isInt?Math.round(target):target)+(el.dataset.suffix||'');
  }
  requestAnimationFrame(tick);
}
(function(){
  const counters=document.querySelectorAll('.counter');
  if(!counters.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target);io.unobserve(e.target)}});
  },{threshold:.5});
  counters.forEach(c=>io.observe(c));
})();

/* ── CARD TILT ── */
(function(){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*12;
      const y=((e.clientY-r.top)/r.height-.5)*-12;
      card.style.transform=`perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-5px)`;
      card.style.boxShadow=`${-x*.5}px ${y*.5+12}px 40px rgba(8,20,3,.16)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';card.style.boxShadow=''});
  });
})();

/* ── CONTACT FORM ── */
(function(){
  const form=document.getElementById('contact-form');
  if(!form)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=form.querySelector('.form-btn');
    const orig=btn.textContent;
    btn.textContent='✓ Message Sent!';
    btn.style.background='var(--g600)';
    btn.disabled=true;
    setTimeout(()=>{btn.textContent=orig;btn.style.background='';btn.disabled=false;form.reset()},3500);
  });
})();

/* ── PROJECT FILTER ── */
(function(){
  const btns=document.querySelectorAll('.f-btn');
  const cards=document.querySelectorAll('.pj-card');
  if(!btns.length)return;
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.f;
      cards.forEach(c=>{
        const show=f==='all'||c.dataset.cat===f;
        c.setAttribute('data-hide',show?'0':'1');
        c.style.animation=show?'fadeIn .4s ease both':'';
      });
    });
  });
})();

/* ── TYPING ANIMATION ── */
function typeText(el,texts,speed=65,pause=2200){
  if(!el||!texts.length)return;
  let ti=0,ci=0,del=false;
  function tick(){
    const t=texts[ti];
    if(!del){
      el.textContent=t.slice(0,++ci);
      if(ci>=t.length){del=true;setTimeout(tick,pause);return}
    } else {
      el.textContent=t.slice(0,--ci);
      if(ci<=0){del=false;ti=(ti+1)%texts.length}
    }
    setTimeout(tick,del?speed/2:speed);
  }
  tick();
}

/* ── SMOOTH PROGRESS BARS ── */
(function(){
  const bars=document.querySelectorAll('.prog-bar');
  if(!bars.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w+'%';io.unobserve(e.target)}});
  },{threshold:.3});
  bars.forEach(b=>{b.style.width='0';b.style.transition='width 1.2s cubic-bezier(.4,0,.2,1)';io.observe(b)});
})();

/* fade-in keyframe */
const ks=document.createElement('style');
ks.textContent='@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}';
document.head.appendChild(ks);
