(function(){
  var $=function(s){return document.querySelector(s)},rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rig=$('#rig'),face=$('#face'),holo=$('#holo');

  /* build the volumetric head, neck and shoulders from stacked outlines */
  function slice(cls,z,sc,i){var d=document.createElement('div');d.className='sl '+cls;d.style.setProperty('--z',z+'px');d.style.setProperty('--sc',sc);d.style.setProperty('--d',(i*55)+'ms');d.style.opacity=(.3+.7*(1-Math.abs(z)/90)).toFixed(2);rig.insertBefore(d,face)}
  var i,z;
  for(i=0,z=-64;z<=64;z+=16,i++)slice('hd',z,1-Math.abs(z)/700,i);
  for(i=0,z=-20;z<=20;z+=20,i++)slice('nk',z,1,i+2);
  for(i=0,z=-60;z<=60;z+=20,i++)slice('sh',z,1-Math.abs(z)/900,i+4);

  /* orbiting skill chips */
  var names=['JS','PHP','SQL','Git','Node','Python'],orbs=names.map(function(n){var o=document.createElement('div');o.className='orb';o.textContent=n;rig.appendChild(o);return o});

  /* pointer + idle sway */
  var tx=0,ty=0,cx=0,cy=0,last=0,mx=-999,my=-999,glow=$('#glow');
  addEventListener('pointermove',function(e){last=performance.now();tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;mx=e.clientX;my=e.clientY;glow.style.transform='translate('+mx+'px,'+my+'px)'},{passive:true});

  /* particle network */
  var cv=$('#fx'),cg=cv.getContext('2d'),pts=[];
  function size(){var r=devicePixelRatio||1;cv.width=innerWidth*r;cv.height=innerHeight*r;cg.setTransform(r,0,0,r,0,0);var n=Math.min(90,Math.floor(innerWidth*innerHeight/16000));pts=[];for(var k=0;k<n;k++)pts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35})}
  size();addEventListener('resize',size);
  function css(v){return getComputedStyle(document.body).getPropertyValue(v).trim()}
  function net(){
    cg.clearRect(0,0,innerWidth,innerHeight);var c=css('--c')||'#ff758c',p=css('--pk')||'#ff2a85',a,b,d,k,j;
    for(k=0;k<pts.length;k++){a=pts[k];if(!rm){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>innerWidth)a.vx*=-1;if(a.y<0||a.y>innerHeight)a.vy*=-1}
      cg.fillStyle=c;cg.globalAlpha=.7;cg.fillRect(a.x,a.y,2,2);
      for(j=k+1;j<pts.length;j++){b=pts[j];d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){cg.globalAlpha=(1-d/120)*.28;cg.strokeStyle=c;cg.beginPath();cg.moveTo(a.x,a.y);cg.lineTo(b.x,b.y);cg.stroke()}}
      d=Math.hypot(a.x-mx,a.y-my);if(d<170){cg.globalAlpha=(1-d/170)*.7;cg.strokeStyle=p;cg.beginPath();cg.moveTo(a.x,a.y);cg.lineTo(mx,my);cg.stroke()}}
    cg.globalAlpha=1}

  /* animation loop */
  var T=0;
  function frame(t){
    if(t-last>2500){tx=Math.sin(t/1700)*.55;ty=Math.cos(t/2300)*.25}
    cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    rig.style.transform='rotateY('+(cx*28)+'deg) rotateX('+(-cy*18)+'deg)';
    face.style.setProperty('--px',cx.toFixed(3));face.style.setProperty('--py',cy.toFixed(3));
    T=t/1000;
    orbs.forEach(function(o,k){var a=k*Math.PI*2/orbs.length+T*.55,R=250,x=Math.cos(a)*R,zz=Math.sin(a)*R,y=Math.sin(a*2+T*.6)*46,dp=(zz+R)/(2*R);
      o.style.transform='translate3d('+x+'px,'+y+'px,'+zz+'px) translate(-50%,-50%) scale('+(.75+.35*dp)+')';o.style.opacity=(.3+.7*dp).toFixed(2)});
    net();
    if(!rm)requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
  if(rm){net()}

  /* hologram interactions */
  var gl=$('#gl');
  function blink(){gl.classList.add('blink');setTimeout(function(){gl.classList.remove('blink')},140)}
  if(!rm)(function loop(){setTimeout(function(){blink();loop()},2400+Math.random()*3200)})();
  var say=$('#say'),sayT;
  function hi(){blink();setTimeout(blink,260);say.classList.add('on');clearTimeout(sayT);sayT=setTimeout(function(){say.classList.remove('on')},2200)}
  holo.addEventListener('click',hi);
  holo.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();hi()}});
  document.querySelectorAll('[data-grin]').forEach(function(b){b.addEventListener('mouseenter',function(){face.classList.add('grin')});b.addEventListener('mouseleave',function(){face.classList.remove('grin')})});

  /* typewriter */
  var lines=['Cape Town-based developer.','Professional problem solver.','Occasional bug creator.'],tw=$('#tw'),nm=$('#name'),li=0,ci=0,del=false;
  if(rm){tw.textContent=lines.join(' ')}
  else(function type(){
    var s=lines[li],d;
    if(!del){ci++;face.classList.add('talk')}else{ci--;face.classList.remove('talk')}
    tw.textContent=s.slice(0,ci);d=del?26:60;
    if(!del&&ci===s.length){del=true;d=1700;face.classList.remove('talk');if(li===2){nm.classList.add('flash');setTimeout(function(){nm.classList.remove('flash')},700)}}
    else if(del&&ci===0){del=false;li=(li+1)%lines.length;d=350}
    setTimeout(type,d)})();

  /* Cape Town clock */
  function clock(){try{$('#clock').textContent='· '+new Intl.DateTimeFormat('en-ZA',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Johannesburg'}).format(new Date())}catch(e){}}
  clock();setInterval(clock,20000);

  /* mobile menu */
  var menu=$('#menu'),nav=$('#nav');
  menu.addEventListener('click',function(){var o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)});

  /* bug mode */
  var on=false,fixed=0,spawner,btn=$('#bugBtn');
  function label(){btn.textContent='🐛 Bug Mode: '+(on?'ON · fixed '+fixed:'OFF')}
  function spawn(){
    if(document.querySelectorAll('.crit').length>=6)return;
    var b=document.createElement('button'),r=Math.random()>.5;b.type='button';b.className='crit';b.textContent='🐛';b.setAttribute('aria-label','Squash the bug');
    b.style.top=(14+Math.random()*70)+'vh';b.style.setProperty('--from',r?'-60px':'calc(100vw + 60px)');b.style.setProperty('--to',r?'calc(100vw + 60px)':'-60px');
    b.style.animationDuration=(7+Math.random()*6)+'s,.35s';if(!r)b.style.scale='-1 1';
    b.addEventListener('animationend',function(e){if(e.animationName==='bugx')b.remove()});
    b.addEventListener('click',function(){
      var q=b.getBoundingClientRect();b.style.left=q.left+'px';b.classList.add('dead');
      var p=document.createElement('span');p.className='pop';p.textContent='fixed ✓';p.style.left=q.left+'px';p.style.top=q.top+'px';document.body.appendChild(p);
      setTimeout(function(){p.remove();b.remove()},900);fixed++;label()});
    document.body.appendChild(b)}
  btn.addEventListener('click',function(){
    on=!on;document.body.classList.toggle('bug-mode',on);face.classList.toggle('bug',on);btn.setAttribute('aria-pressed',on);label();
    if(on){spawn();spawner=setInterval(spawn,1500)}
    else{clearInterval(spawner);document.querySelectorAll('.crit,.pop').forEach(function(e){e.remove()})}});
})();

/* Portfolio Modal & Filtering Functions */
function openPreview(url) {
  document.getElementById("previewFrame").src = url;
  document.getElementById("previewModal").classList.add("active");
}

function closePreview() {
  document.getElementById("previewModal").classList.remove("active");
  document.getElementById("previewFrame").src = "";
}

function filterProjects(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  let count=0;
  document.querySelectorAll('.project-card').forEach((card,i) => {
    const show=category==='all'||card.dataset.category===category;
    card.style.display=show?'flex':'none';
    card.classList.remove('filter-in');
    if(show){count++;card.style.animationDelay=(count-1)*85+'ms';void card.offsetWidth;card.classList.add('filter-in');}
  });
  document.getElementById('projectCount').textContent='SHOWING '+String(count).padStart(2,'0')+' PROJECT'+(count===1?'':'S');
}

(function initCinematicSections(){
 const targets=document.querySelectorAll('.about-section .section-header,.about-grid,.skills-container,.stats-grid,.resume-section .section-header,.resume-grid,.hire-cta-container,.portfolio-section .section-header');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced||!('IntersectionObserver' in window)){
   document.querySelector('.skills-container')?.classList.add('is-visible');
   return;
 }
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  });
 },{threshold:.09,rootMargin:'0px 0px -35px 0px'});
 targets.forEach(el=>{el.classList.add('cinematic-reveal');observer.observe(el);});
})();

(function initPortfolioAnimations(){
  const cards=[...document.querySelectorAll('.project-card')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}
    }),{threshold:.08});
    cards.forEach((card,i)=>{card.style.setProperty('--reveal-delay',(i%2)*120+'ms');card.classList.add('reveal-ready');observer.observe(card);});
  }
  if(!reduced && matchMedia('(hover:hover) and (pointer:fine)').matches){
    cards.forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        card.style.setProperty('--rx',((.5-y)*10)+'deg');
        card.style.setProperty('--ry',((x-.5)*12)+'deg');
        card.style.setProperty('--spotx',(x*100)+'%');
        card.style.setProperty('--spoty',(y*100)+'%');
      });
      card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
    });
  }
})();

(function(){
  const form=document.getElementById('contact-form');
  const status=document.getElementById('contact-status');
  const submit=document.getElementById('contact-submit');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panels=document.querySelectorAll('.contact-v2-left, .contact-v2-right');
  if(!reduced && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('contact-visible');io.unobserve(entry.target);}
    }),{threshold:.12});
    panels.forEach(panel=>{panel.classList.add('contact-reveal');io.observe(panel);});
  }
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    if(!form.reportValidity())return;
    status.className='contact-status full';
    if(!window.emailjs){
      status.textContent='The messaging service could not load. Please email me directly.';
      status.classList.add('error');
      return;
    }
    submit.disabled=true;
    submit.querySelector('span').textContent='Sending...';
    status.textContent='Sending your message...';
    try{
      emailjs.init({publicKey:'MTD9LWcZItCBhwkvG'});
      await emailjs.sendForm('service_220qmcz','template_c6iknho',form);
      status.textContent='Message sent successfully. Thank you for reaching out!';
      status.classList.add('success');
      form.reset();
    }catch(err){
      console.error('EmailJS send failed:',err);
      status.textContent='Something went wrong. Please try again or email me directly.';
      status.classList.add('error');
    }finally{
      submit.disabled=false;
      submit.querySelector('span').textContent='Send Message';
    }
  });
})();

/* HORIZONTAL PROJECT CAROUSEL */

(function initProjectCarousel() {
  const track = document.getElementById('projectsTrack');
  const prev = document.getElementById('projectsPrev');
  const next = document.getElementById('projectsNext');

  if (!track || !prev || !next) return;

  const motion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches ? 'auto' : 'smooth';

  function updateArrows() {
    prev.disabled = track.scrollLeft <= 3;
    next.disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 3;
  }

  function scrollProjects(direction) {
    const card = [...track.querySelectorAll('.project-card')]
      .find(el => getComputedStyle(el).display !== 'none');

    const distance = (card?.getBoundingClientRect().width || 290) + 16;

    track.scrollBy({
      left: distance * direction,
      behavior: motion
    });
  }

  prev.addEventListener('click', () => scrollProjects(-1));
  next.addEventListener('click', () => scrollProjects(1));

  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  document.querySelectorAll('.portfolio-section .filter-btn')
    .forEach(button => {
      button.addEventListener('click', () => {
        track.scrollLeft = 0;
        requestAnimationFrame(updateArrows);
      });
    });

  track.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    const canMove = event.deltaY > 0
      ? track.scrollLeft + track.clientWidth < track.scrollWidth - 2
      : track.scrollLeft > 2;

    if (canMove) {
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    }
  }, { passive: false });

  updateArrows();
})();
