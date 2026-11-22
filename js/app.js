const $=s=>document.querySelector(s),d=()=>S.d,H=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
let me=JSON.parse(sessionStorage.getItem('me')||'null'),tmp=null;
const ST=['draft','submitted','verified','allotted','accepted','enrolled'],CAT=['GEN','OBC','SC'];
const toast=m=>{const t=$('#toast');t.textContent=m;t.className='show';setTimeout(()=>t.className='',3500)};
const myApp=()=>d().apps.find(a=>a.uid==me.id);
const left=(c,k)=>c.seats[k]-d().apps.filter(a=>a.alloc&&a.alloc.course==c.id&&a.alloc.cat==k&&['allotted','accepted','enrolled'].includes(a.status)).length;
const pay=(a,type,amt)=>d().pay.push({id:'PAY'+(d().nid++),app:a.id,name:a.name,type,amt,date:new Date().toLocaleDateString(),rec:false});
const done=m=>{S.save();toast(m);go()};
const calc=()=>d().apps.forEach(a=>{if(['verified','allotted','accepted','enrolled'].includes(a.status))a.merit=a.entrance==null?a.marks:+(a.marks*d().w.m/100+a.entrance*d().w.e/100).toFixed(2)});
const rank=c=>d().apps.filter(a=>a.merit!=null&&a.prefs.includes(c.id)&&a.marks>=c.min).sort((a,b)=>b.merit-a.merit);
const cof=id=>d().courses.find(c=>c.id==id),col=id=>d().colleges.find(c=>c.id==id),cn=id=>{const c=cof(id);return c?col(c.col).short+' – '+c.name:id},mono=k=>`<div class=mono>${H(k.short)}</div>`;
let Q='';
const flt=(q,t,c)=>d().colleges.filter(k=>(!t||k.type==t)&&(!c||k.city==c)&&(!q||(k.name+k.city+k.short+d().courses.filter(x=>x.col==k.id).map(x=>x.name).join(' ')).toLowerCase().includes(q.toLowerCase())));

const R={
home:homePage,colleges:collegesPage,college:collegePage,contact:contactPage,
login:()=>`<div class=card><h2>Login</h2><form onsubmit="return F.login(event)"><input id=e type=email placeholder=Email required><input id=p type=password placeholder=Password required><button>Login</button></form><p><a href="#login" onclick="return F.forgot()">Forgot password?</a></p><details><summary>Demo staff logins</summary><small>admin@admithub.edu / admin123 · officer@admithub.edu / officer123 · accounts@admithub.edu / acc123 · college heads (password hod123): hod.srm, hod.vit, hod.ceg, hod.psg, hod.ssn, hod.tce, hod.vec, hod.loyola, hod.mcc, hod.stella, hod.pres @admithub.edu</small></details></div>`,
register:()=>`<div class=card><h2>Register</h2><form onsubmit="return F.reg(event)"><input id=n placeholder="Full name" required><input id=e type=email placeholder=Email required><input id=m pattern="[0-9]{10}" placeholder="Mobile (10 digits)" required><input id=p type=password minlength=6 placeholder="Password (min 6)" required><button>Send OTP</button></form></div>`,
dash:()=>({applicant:applicantDash,officer:officerDash,hod:hodDash,accounts:accDash,admin:adminDash})[me.role](),
out(){me=null;sessionStorage.clear();location.hash='#home';return ''},
apply(){const a=myApp()||{prefs:[],docs:{}},ed=!a.status||a.status=='draft'||a.status=='rejected',dis=ed?'':'disabled';
 const opt=i=>`<select id=p${i} ${dis}><option value="">Choice ${i+1}</option>${d().colleges.map(k=>`<optgroup label="${H(k.name)}">${d().courses.filter(c=>c.col==k.id).map(c=>`<option value=${c.id} ${a.prefs[i]==c.id?'selected':''}>${H(c.name)}</option>`).join('')}</optgroup>`).join('')}</select>`;
 const doc=(k,l)=>`<label>${l} ${a.docs[k]?'✔ '+H(a.docs[k]):''}<input type=file id=f_${k} accept=".pdf,.jpg,.jpeg,.png" ${dis}></label>`;
 return `<div class=card><h2>Application ${a.id||''}</h2>${a.status=='rejected'?`<p class=bad>Discrepancy: ${H(a.remarks)} — fix and re-submit</p>`:''}
<div class=g><input id=n placeholder="Full name" value="${H(a.name||me.name)}" ${dis}><input id=dob type=date value="${a.dob||''}" ${dis}><select id=cat ${dis}>${CAT.map(k=>`<option ${a.cat==k?'selected':''}>${k}</option>`).join('')}</select><input id=mk type=number min=0 max=100 placeholder="12th %" value="${a.marks??''}" ${dis}><input id=en type=number min=0 max=100 placeholder="Entrance / TNEA score (blank for Arts & Science)" value="${a.entrance??''}" ${dis}></div>
<h4>Course preferences (ranked)</h4><div class=g>${opt(0)}${opt(1)}${opt(2)}</div>
<h4>Documents (PDF/JPG/PNG, max 2 MB)</h4><div class=g>${doc('marks','Marks sheet')}${doc('cert','Certificate')}${doc('photo','Photo ID')}</div>
${ed?`<p><button class=alt onclick="F.save(0)">Save draft</button> <button onclick="F.save(1)">Pay ₹${d().fee.app} & Submit</button></p>`:'<p class=m>Application locked (status: '+a.status+')</p>'}</div>`},
notes(){const n=d().notes.filter(x=>x.uid==me.id);return `<div class=card><h2>Notifications <small>(simulated email/SMS)</small></h2>${n.map(x=>`<p>📩 <small>${x.t}</small> ${H(x.m)}</p>`).join('')||'<p>None yet</p>'}</div>`},
letter(){const a=myApp();if(!a||a.status!='enrolled')return '<p>Not enrolled yet.</p>';const c=d().courses.find(c=>c.id==a.alloc.course);
 return `<div class="card"><h2>Admission Letter</h2><p>Dear ${H(a.name)},</p><p>You are admitted to <b>${H(c.name)}</b>, ${H(col(c.col).name)} (${a.alloc.cat} category) for ${d().cycle}. Please report with original documents for physical verification.</p><h3>Fee receipts</h3><table>${d().pay.filter(p=>p.app==a.id).map(p=>`<tr><td>${p.id}</td><td>${p.type}</td><td>₹${p.amt}</td><td>${p.date}</td></tr>`).join('')}</table><button class=noprint onclick=print()>Print / Save as PDF</button></div>`}
};

function applicantDash(){const a=myApp();
 if(!a)return `<div class=card><h2>Welcome ${H(me.name)}</h2><p>You have not started your application.</p><a class=btn href="#apply">Start application</a></div>${cards(d().colleges)}`;
 const i=ST.indexOf(a.status=='rejected'?'submitted':a.status=='declined'?'verified':a.status),al=a.alloc,co=al&&d().courses.find(c=>c.id==al.course);let box='';
 if(a.status=='rejected')box=`<p class=bad>Document issue: ${H(a.remarks)}</p><a class=btn href="#apply">Fix & re-upload</a>`;
 if(a.status=='allotted')box=al.ok?`<p>🎉 Seat allotted: <b>${H(cn(co.id))}</b> (${al.cat}) – Round ${al.round}</p><button onclick="F.acc(1)">Accept (final)</button> <button class=alt onclick="F.acc(0)">Accept & try upgrade</button> <button class=bad onclick="F.dec()">Decline</button>`:'<p>Allotment awaiting HOD approval…</p>';
 if(a.status=='accepted')box=`<p>Seat accepted: <b>${H(cn(co.id))}</b>.${a.up?' Upgrade requested for next round.':''}</p><button onclick="F.fee()">Pay admission fee ₹${co.fee}</button>`;
 if(a.status=='enrolled')box=`<p>✅ Enrolled in <b>${H(cn(co.id))}</b></p><a class=btn href="#letter">Admission letter & receipts</a>`;
 if(a.status=='declined')box='<p>You declined your seat.</p>';
 return `<div class=card><h2>${H(a.name)} · ${a.id}</h2><div class=steps>${ST.map((s,k)=>`<span class="${k<=i?'on':''}">${s}</span>`).join('')}</div>${box}${a.merit?`<p class=m>Merit score: ${a.merit}</p>`:''}</div>`}

function officerDash(){const A=d().apps.filter(a=>a.status!='draft');
 const rows=A.map(a=>`<tr><td>${a.id}</td><td>${H(a.name)}</td><td>${a.cat}</td><td>${a.marks}/${a.entrance??'–'}</td><td>${Object.values(a.docs).map(H).join(', ')}</td><td>${a.status}${a.merit?' · '+a.merit:''}</td><td>${a.status=='submitted'?`<button onclick="F.ver('${a.id}',1)">Verify</button> <button class=bad onclick="F.ver('${a.id}',0)">Reject</button>`:''}</td></tr>`).join('');
 return `<h2>Applications</h2><p><button onclick="F.merit()">Calculate merit</button> <button class=alt onclick="F.allot()">Run allotment round ${d().round+1}</button></p><div class=sc><table><tr><th>ID</th><th>Name</th><th>Cat</th><th>12th/Ent</th><th>Docs</th><th>Status</th><th></th></tr>${rows||'<tr><td colspan=7>No applications</td></tr>'}</table></div><h2>Rank lists</h2>`+
 d().courses.filter(c=>rank(c).length).map(c=>`<h4>${H(cn(c.id))}</h4><table><tr><th>Rank</th><th>Name</th><th>Cat</th><th>Merit</th><th>Seat</th></tr>${rank(c).map((a,i)=>`<tr><td>${i+1}</td><td>${H(a.name)}</td><td>${a.cat}</td><td>${a.merit}</td><td>${a.alloc&&a.alloc.course==c.id?a.alloc.cat+' (R'+a.alloc.round+')':''}</td></tr>`).join('')||'<tr><td colspan=5>—</td></tr>'}</table>`).join('')}

function hodDash(){const L=d().apps.filter(a=>a.status=='allotted'&&!a.alloc.ok&&cof(a.alloc.course).col==me.col);
 return `<h2>${H(col(me.col).name)} – allotments</h2>${L.length?`<button onclick="F.hod()">Approve all (${L.length})</button>`:''}<table><tr><th>Name</th><th>Programme</th><th>Cat</th><th>Merit</th><th>Round</th><th></th></tr>${L.map(a=>`<tr><td>${H(a.name)}</td><td>${H(cof(a.alloc.course).name)}</td><td>${a.alloc.cat}</td><td>${a.merit}</td><td>R${a.alloc.round}</td><td><button onclick="F.hod('${a.id}')">Approve</button></td></tr>`).join('')||'<tr><td colspan=6>Nothing pending</td></tr>'}</table>`}

function accDash(){const t=d().pay.reduce((s,p)=>s+p.amt,0);
 return `<h2>Payments</h2><p>Total collected: <b>₹${t}</b></p><div class=sc><table><tr><th>ID</th><th>Applicant</th><th>Type</th><th>₹</th><th>Date</th><th>Reconciled</th></tr>${d().pay.map(p=>`<tr><td>${p.id}</td><td>${H(p.name)}</td><td>${p.type}</td><td>${p.amt}</td><td>${p.date}</td><td><input type=checkbox ${p.rec?'checked':''} onchange="F.rec('${p.id}',this.checked)"></td></tr>`).join('')||'<tr><td colspan=6>No payments</td></tr>'}</table></div>`}

function adminDash(){const A=d().apps,cnt=s=>A.filter(a=>a.status==s).length,rev=d().pay.reduce((s,p)=>s+p.amt,0);
 return `<h2>Dashboard</h2><div class=g>${['submitted','verified','allotted','accepted','enrolled'].map(s=>`<div class=stat><b>${cnt(s)}</b>${s}</div>`).join('')}<div class=stat><b>₹${rev}</b>revenue</div></div>
<h3>Seat matrix</h3><table><tr><th>Course</th><th>GEN</th><th>OBC</th><th>SC</th></tr>${d().courses.map(c=>`<tr><td>${H(cn(c.id))}</td>${CAT.map(k=>`<td><input type=number min=0 value=${c.seats[k]} onchange="F.seat('${c.id}','${k}',this.value)"> <small>left ${left(c,k)}</small></td>`).join('')}</tr>`).join('')}</table>
<h3>Settings</h3><div class=g><label>Weight: 12th % <input id=wm type=number value=${d().w.m}></label><label>Weight: entrance <input id=we type=number value=${d().w.e}></label><label>Last date <input id=dl type=date value=${d().deadline}></label><label>Application fee ₹ <input id=af type=number value=${d().fee.app}></label></div><p><button onclick="F.set()">Save settings</button></p>
<h3>Tools</h3><p><button onclick="F.demo()">Load 60 demo applicants</button> <button class=alt onclick="F.csv()">Export enrolled (SIS CSV)</button> <button class=bad onclick="F.reset()">Reset all data</button></p>
<h3>Enquiries</h3><div class=sc>${d().enq.map(x=>`<p><small>${x.t}</small> <b>${H(x.n)}</b> (${H(x.e)}): ${H(x.m)}</p>`).join('')||'<p>None</p>'}</div><h3>Audit log</h3><div class=sc>${d().audit.slice(0,30).map(x=>`<p><small>${x.t}</small> ${H(x.m)}</p>`).join('')||'<p>Empty</p>'}</div>`}

const F={
filt(){$('#list').innerHTML=cards(flt($('#cq').value,$('#ct').value,$('#cc').value))},
hsearch(){Q=$('#hq').value;location.hash='#colleges'},
enq(e){e.preventDefault();d().enq.push({t:new Date().toLocaleString(),n:$('#qn').value,e:$('#qe').value,m:$('#qm').value});S.save();toast('Query submitted – we will reply by email');location.hash='#home';return false},
login(e){e.preventDefault();const u=d().users.find(u=>u.email==$('#e').value.trim().toLowerCase()&&u.pass==$('#p').value);
 if(!u){toast('Wrong email or password');return false}me=u;sessionStorage.setItem('me',JSON.stringify(u));location.hash='#dash';go();return false},
forgot(){const u=d().users.find(u=>u.email==(prompt('Registered email?')||'').toLowerCase());if(!u){toast('Email not found');return false}
 const p=prompt('New password (min 6)');if(p&&p.length>5){u.pass=p;S.save();toast('Password updated')}return false},
reg(e){e.preventDefault();const v=id=>$('#'+id).value.trim();
 if(d().users.some(u=>u.email==v('e').toLowerCase())){toast('Email already registered');return false}
 tmp={name:v('n'),email:v('e').toLowerCase(),mobile:v('m'),pass:$('#p').value,otp:String(100000+Math.floor(Math.random()*900000))};
 $('#app').innerHTML=`<div class=card><h2>Verify OTP</h2><p class=m>Demo mode: your OTP is <b>${tmp.otp}</b> (a real SMS gateway would send it)</p><form onsubmit="return F.otp(event)"><input id=o placeholder="6-digit OTP" required><button>Verify</button></form></div>`;return false},
otp(e){e.preventDefault();if($('#o').value.trim()!=tmp.otp){toast('Wrong OTP');return false}
 const u={id:d().nid++,name:tmp.name,email:tmp.email,mobile:tmp.mobile,pass:tmp.pass,role:'applicant'};d().users.push(u);S.log('Registered '+u.email);S.save();toast('Registered! Please login');location.hash='#login';return false},
save(sub){let a=myApp();if(!a){a={id:'APP'+(d().nid++),uid:me.id,docs:{},status:'draft',prefs:[]};d().apps.push(a)}const v=id=>$('#'+id).value;
 if(sub&&new Date()>new Date(d().deadline+'T23:59:59'))return toast('Deadline is over – contact admin');
 for(const k of ['marks','cert','photo']){const f=$('#f_'+k).files[0];if(f){if(!/\.(pdf|jpe?g|png)$/i.test(f.name)||f.size>2e6)return toast(f.name+': only PDF/JPG/PNG up to 2 MB');a.docs[k]=f.name}}
 Object.assign(a,{name:v('n'),dob:v('dob'),cat:v('cat'),marks:+v('mk'),entrance:v('en')===''?null:+v('en'),prefs:[v('p0'),v('p1'),v('p2')].filter((x,i,r)=>x&&r.indexOf(x)==i)});
 if(sub){const m=!a.name||!a.dob||v('mk')===''?'Fill all fields':!a.prefs.length?'Choose at least one course':Object.keys(a.docs).length<3?'Upload all 3 documents':a.marks>100||a.entrance>100?'Marks must be 0-100':'';
  if(m){S.save();return toast(m)}
  if(a.status!='rejected'){if(!confirm('Demo payment gateway: pay ₹'+d().fee.app+'?'))return;pay(a,'Application fee',d().fee.app)}
  a.status='submitted';a.remarks='';S.log(a.id+' submitted');S.note(me.id,'Application '+a.id+' submitted. Fee received.')}
 done(sub?'Submitted!':'Draft saved')},
ver(id,ok){const a=d().apps.find(x=>x.id==id);
 if(ok){a.status='verified';S.note(a.uid,'Documents verified for '+id)}else{const r=prompt('Remarks (what is wrong?)');if(!r)return;a.status='rejected';a.remarks=r;S.note(a.uid,'Discrepancy: '+r+'. Re-upload before the deadline.')}
 S.log(id+(ok?' verified':' rejected'));done('Updated')},
merit(){calc();S.log('Merit calculated');done('Merit calculated')},
allot(){calc();const D=d();D.round++;let n=0;
 D.apps.filter(a=>a.status=='verified'||(a.status=='accepted'&&a.up)).sort((a,b)=>b.merit-a.merit).forEach(a=>{
  const lim=a.status=='accepted'?a.prefs.indexOf(a.alloc.course):a.prefs.length;
  for(const cid of a.prefs.slice(0,lim)){const c=D.courses.find(x=>x.id==cid);if(a.marks<c.min)continue;
   const k=left(c,'GEN')>0?'GEN':a.cat!='GEN'&&left(c,a.cat)>0?a.cat:null;
   if(k){a.alloc={course:cid,cat:k,round:D.round,ok:false};a.status='allotted';a.up=false;n++;break}}});
 S.log('Allotment round '+D.round+': '+n+' seats');done(n+' allotments made – pending HOD approval')},
hod(id){d().apps.filter(a=>a.status=='allotted'&&!a.alloc.ok&&cof(a.alloc.course).col==me.col&&(!id||a.id==id)).forEach(a=>{a.alloc.ok=true;S.note(a.uid,'Seat allotted: '+cn(a.alloc.course)+' (Round '+a.alloc.round+'). Accept or decline from your dashboard.')});
 S.log(me.col+' approved allotments');done('Approved')},
acc(f){const a=myApp();a.status='accepted';a.up=!f;S.log(a.id+' accepted seat');done('Seat accepted')},
dec(){const a=myApp();a.status='declined';S.log(a.id+' declined seat');done('Seat declined')},
fee(){const a=myApp(),c=d().courses.find(c=>c.id==a.alloc.course);if(!confirm('Demo payment gateway: pay ₹'+c.fee+'?'))return;
 pay(a,'Admission fee',c.fee);a.status='enrolled';a.up=false;S.log(a.id+' enrolled');S.note(me.id,'Admission fee received. You are enrolled in '+cn(c.id)+'.');done('Enrolled!')},
rec(id,v){d().pay.find(p=>p.id==id).rec=v;S.save()},
seat(c,k,v){d().courses.find(x=>x.id==c).seats[k]=+v;S.log('Seat matrix changed');S.save();toast('Updated')},
set(){const v=id=>+$('#'+id).value;if(v('wm')+v('we')!=100){toast('Weights must add up to 100');return}
 d().w={m:v('wm'),e:v('we')};d().deadline=$('#dl').value;d().fee.app=v('af');S.log('Settings changed');done('Saved')},
demo(){const N=Array.from({length:60},(_,i)=>['Arun','Priya','Karthik','Divya','Vikram','Meena','Suresh','Anita','Ravi','Lakshmi','Naveen','Kavya'][i%12]+' '+['Kumar','Raj','Devi','Selvam','Murugan','Krishnan','Ramesh','Venkat','Iyer','Nair'][(i*7)%10]),C=['GEN','GEN','OBC','SC'],ids=d().courses.map(c=>c.id),r=()=>Math.floor(60+Math.random()*40);
 N.forEach(n=>{const a={id:'APP'+(d().nid++),uid:0,name:n,cat:C[Math.floor(Math.random()*4)],marks:r(),entrance:r(),docs:{marks:'m.pdf',cert:'c.pdf',photo:'p.jpg'},status:'verified',prefs:[...ids].sort(()=>Math.random()-.5).slice(0,3)};d().apps.push(a);pay(a,'Application fee',d().fee.app)});
 S.log('Loaded demo applicants');done('60 demo applicants added (verified)')},
csv(){const r=[['AppID','Name','Course','Category','Merit']].concat(d().apps.filter(a=>a.status=='enrolled').map(a=>[a.id,a.name,a.alloc.course,a.alloc.cat,a.merit]));
 const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([r.map(x=>x.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'}));l.download='enrolled_students.csv';l.click()},
reset(){if(confirm('Delete ALL data?')){localStorage.removeItem('admithub1');sessionStorage.clear();location.hash='#home';location.reload()}}
};

function cards(L){return `<div class=cg>${L.map(k=>`<a class=ccard href="#college/${k.id}">${mono(k)}<div><h4>${H(k.name)}</h4><p class=m>📍 ${H(k.city)}</p><span class=tag>${H(k.type)}</span> <span class=tag>${H(k.kind)}</span></div></a>`).join('')||'<p class=m>No colleges match your search.</p>'}</div>`}
function homePage(){const dl=[['Applications open','01 Nov 2026'],['Last date to apply',d().deadline],['Document verification','Jan 2027'],['Merit / rank lists','Jan 2027'],['Counselling & seat allotment','Feb 2027 (multiple rounds)'],['Admission fee & enrolment','Within the allotment window']];
 return `<section class=hero><p class=eyebrow>ADMISSIONS ${d().cycle}</p><h1>One application.<br>Top colleges across Tamil Nadu.</h1><p class=lead>Apply to SRM, VIT, Anna University (CEG), PSG, SSN, Loyola, MCC and more – register, apply, pay, track and enrol from a single portal.</p><div class=search><input id=hq placeholder="Search a college, city or course…" onkeydown="if(event.key=='Enter')F.hsearch()"><button onclick="F.hsearch()">Search</button></div><p><a class=btn href="#register">Apply now</a> <a class="btn ghost" href="#colleges">Explore colleges</a></p></section>
<div class=stats><div><b>${d().colleges.length}</b>Colleges</div><div><b>${d().courses.length}</b>Programmes</div><div><b>${d().apps.length}</b>Applications</div><div><b>3</b>Reservation categories</div></div>
<h2>Featured colleges</h2>${cards(d().colleges.slice(0,6))}<p><a href="#colleges">View all colleges →</a></p>
<h2>How admission works</h2><div class=steps2>${['Register','Apply','Pay fee','Verification','Merit list','Counselling','Enrol'].map((s,i)=>`<div><b>${i+1}</b>${s}</div>`).join('')}</div>
<h2>Important dates <small>(sample)</small></h2><div class=sc><table>${dl.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join('')}</table></div>`}
function collegesPage(){const q=Q;Q='';return `<h1>Colleges</h1><div class=bar><input id=cq placeholder="Search name, city, programme…" value="${H(q)}" oninput="F.filt()"><select id=ct onchange="F.filt()"><option value="">All types</option><option>Engineering</option><option>Arts &amp; Science</option></select><select id=cc onchange="F.filt()"><option value="">All cities</option>${[...new Set(d().colleges.map(k=>k.city))].map(c=>`<option>${H(c)}</option>`).join('')}</select></div><div id=list>${cards(flt(q,'',''))}</div>`}
function collegePage(id){const k=col(id);if(!k)return '<p>College not found.</p>';
 return `<div class=banner>${mono(k)}<div><h1>${H(k.name)}</h1><p class=m>📍 ${H(k.city)} · ${H(k.kind)} · Admission via: ${H(k.exam)}</p></div></div><p>${H(k.about)}</p><h2>Programmes &amp; seats <small>(sample seat matrix)</small></h2><div class=sc><table><tr><th>Programme</th><th>Duration</th><th>Min. 12th %</th><th>Fee / yr (sample)</th><th>Seats left GEN/OBC/SC</th></tr>${d().courses.filter(c=>c.col==id).map(c=>`<tr><td>${H(c.name)}</td><td>${c.years} yrs</td><td>${c.min}%</td><td>₹${c.fee.toLocaleString('en-IN')}</td><td>${CAT.map(x=>left(c,x)).join(' / ')}</td></tr>`).join('')}</table></div><p><a class=btn href="${me?'#apply':'#register'}">Apply to ${H(k.short)}</a> <a class="btn ghost" href="#colleges">← All colleges</a></p>`}
function contactPage(){return `<div class=card><h2 style="margin-top:0">Contact / Helpdesk</h2><p class=m>Questions about eligibility, documents or payments? Send us a query.</p><form onsubmit="return F.enq(event)"><input id=qn placeholder="Your name" required><input id=qe type=email placeholder="Email" required><textarea id=qm placeholder="Your question" required></textarea><button>Submit query</button></form></div>`}
function nav(){const l=me?(me.role=='applicant'?[['dash','My Status'],['apply','Application'],['notes','Notifications'],['letter','Letter'],['colleges','Colleges']]:[['dash','Dashboard']]).concat([['out','Logout']]):[['home','Home'],['colleges','Colleges'],['contact','Contact'],['login','Login'],['register','Apply Now']];
 $('#nav').innerHTML=l.map(x=>`<a href="#${x[0]}"${x[0]=='register'?' class=cta':''}>${x[1]}</a>`).join('')+(me?`<span class=who>${H(me.name)}</span>`:'')}
function go(){let [p,arg]=(location.hash||'#home').slice(1).split('/');if(!me&&!['home','login','register','colleges','college','contact'].includes(p))p='login';
 if(me&&me.role!='applicant'&&['apply','notes','letter'].includes(p))p='dash';$('#app').innerHTML=(R[p]||R.home)(arg);nav();window.scrollTo(0,0)}
window.onhashchange=go;go();
