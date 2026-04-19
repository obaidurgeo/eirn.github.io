/* EIRN v3.0 — script.js */

/* ── NAV ── */
(function(){
  const nav = document.querySelector('nav');
  const tog = document.querySelector('.nav-tog');
  const menu = document.querySelector('.nav-menu');

  if(nav){
    const onScroll = () => nav.classList.toggle('elevated', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  if(tog && menu){
    tog.addEventListener('click', () => {
      tog.classList.toggle('open');
      menu.classList.toggle('open');
      tog.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
    menu.querySelectorAll('a:not(.has-dropdown)').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        tog.classList.remove('open');
      })
    );
  }

  // Active link
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const h = a.getAttribute('href') || '';
    if(h === pg || (pg === '' && h === 'index.html') || (pg === 'index.html' && h === 'index.html'))
      a.classList.add('active');
  });
})();

/* ── PARTICLE CANVAS ── */
function initParticles(canvas, opts){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const o = {
    count: opts.count || 60,
    speed: opts.speed || .35,
    color: opts.color || 'rgba(255,255,255,.6)',
    lineColor: opts.lineColor || 'rgba(255,255,255,.16)',
    maxDist: opts.maxDist || 140,
    fullWindow: opts.fullWindow || false,
    ...opts
  };
  let pts = [], W, H, raf;

  function resize(){
    if(o.fullWindow){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    else { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  }
  function make(){
    pts = [];
    for(let i=0; i<o.count; i++)
      pts.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*o.speed, vy:(Math.random()-.5)*o.speed, r:Math.random()*1.6+.7});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=o.color; ctx.fill();
    });
    for(let i=0; i<pts.length; i++) for(let j=i+1; j<pts.length; j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<o.maxDist){
        ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=o.lineColor; ctx.globalAlpha=1-d/o.maxDist; ctx.lineWidth=.7; ctx.stroke(); ctx.globalAlpha=1;
      }
    }
    raf = requestAnimationFrame(draw);
  }
  resize(); make(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); make(); draw(); }, {passive:true});
}

/* ── SCROLL REVEAL ── */
(function(){
  const els = document.querySelectorAll('.rv,.rv-l,.rv-r,.stag');
  if(!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
  }, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el => io.observe(el));
})();

/* ── ANIMATED COUNTERS ── */
function animateCounter(el){
  const target = parseFloat(el.dataset.target || el.textContent) || 0;
  const dur = 1800; const start = performance.now();
  const isInt = Number.isInteger(target);
  function tick(now){
    const p = Math.min((now-start)/dur, 1);
    const eased = 1 - Math.pow(1-p, 3);
    const val = target * eased;
    el.textContent = isInt ? Math.round(val) : val.toFixed(1) + (el.dataset.suffix||'');
    if(p<1) requestAnimationFrame(tick);
    else el.textContent = (isInt ? Math.round(target) : target) + (el.dataset.suffix||'');
  }
  requestAnimationFrame(tick);
}
(function(){
  const counters = document.querySelectorAll('.counter');
  if(!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ animateCounter(e.target); io.unobserve(e.target); } });
  }, {threshold:.5});
  counters.forEach(c => io.observe(c));
})();

/* ── CARD TILT ── */
(function(){
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width-.5)*10;
      const y = ((e.clientY-r.top)/r.height-.5)*-10;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
})();

/* ── TYPING ANIMATION ── */
function typeText(el, texts, speed=65, pause=2400){
  if(!el||!texts.length) return;
  let ti=0, ci=0, del=false;
  function tick(){
    const t = texts[ti];
    if(!del){ el.textContent=t.slice(0,++ci); if(ci>=t.length){del=true;setTimeout(tick,pause);return} }
    else { el.textContent=t.slice(0,--ci); if(ci<=0){del=false;ti=(ti+1)%texts.length} }
    setTimeout(tick, del?speed/2:speed);
  }
  tick();
}

/* ── CONTACT FORM ── */
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-btn');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'var(--g600)';
    btn.disabled = true;
    setTimeout(() => { btn.textContent=orig; btn.style.background=''; btn.disabled=false; form.reset(); }, 3500);
  });
})();

/* ── PROJECT FILTER ── */
(function(){
  const btns = document.querySelectorAll('.f-btn');
  const cards = document.querySelectorAll('.pj-card');
  const noRes = document.getElementById('no-results');
  if(!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      let shown = 0;
      cards.forEach(c => {
        const match = f==='all' || c.dataset.cat===f;
        c.setAttribute('data-hide', match?'0':'1');
        if(match){ c.style.animation='fadeIn .4s ease both'; shown++; }
      });
      if(noRes) noRes.style.display = shown===0 ? 'block' : 'none';
    });
  });
})();

/* ── SMOOTH PROGRESS BARS ── */
(function(){
  const bars = document.querySelectorAll('.prog-bar');
  if(!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.style.width=e.target.dataset.w+'%'; io.unobserve(e.target); } });
  }, {threshold:.3});
  bars.forEach(b => { b.style.width='0'; b.style.transition='width 1.2s cubic-bezier(.4,0,.2,1)'; io.observe(b); });
})();

/* keyframes */
const ks = document.createElement('style');
ks.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}} @keyframes fadeHero{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}';
document.head.appendChild(ks);
