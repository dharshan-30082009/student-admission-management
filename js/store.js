// Data layer: browser localStorage (no backend -> works on GitHub Pages). Seat/fee data is SAMPLE data.
const S={
  d:null,
  init(){try{this.d=JSON.parse(localStorage.getItem('admithub1'))}catch(e){} if(!this.d)this.d=this.seed()},
  save(){localStorage.setItem('admithub1',JSON.stringify(this.d))},
  log(m){this.d.audit.unshift({t:new Date().toLocaleString(),m})},
  note(uid,m){this.d.notes.unshift({uid,t:new Date().toLocaleString(),m})},
  seed(){
    const K=(id,short,name,city,type,kind,exam,about)=>({id,short,name,city,type,kind,exam,about});
    const C=(col,sid,name,min,fee,years=4)=>({id:col+'-'+sid,col,name,min,years,fee,seats:{GEN:2,OBC:1,SC:1}});
    const colleges=[
      K('SRM','SRM','SRM Institute of Science and Technology','Kattankulathur, Chengalpattu','Engineering','Deemed University','SRMJEEE / Class 12 marks','Large deemed university near Chennai offering engineering, science, management and health programmes.'),
      K('VIT','VIT','Vellore Institute of Technology','Vellore','Engineering','Deemed University','VITEEE / Class 12 marks','Deemed university in Vellore, with a second campus in Chennai, known for engineering programmes.'),
      K('CEG','CEG','College of Engineering, Guindy (Anna University)','Guindy, Chennai','Engineering','State University','TNEA cut-off','Flagship engineering college of Anna University; admissions through TNEA counselling.'),
      K('PSG','PSG','PSG College of Technology','Coimbatore','Engineering','Autonomous','TNEA cut-off','Autonomous engineering college in Coimbatore with a long academic and industry track record.'),
      K('SSN','SSN','SSN College of Engineering','Kalavakkam, Chennai','Engineering','Autonomous','TNEA / management quota','Autonomous engineering institution on the Old Mahabalipuram Road, Chennai.'),
      K('TCE','TCE','Thiagarajar College of Engineering','Madurai','Engineering','Autonomous','TNEA cut-off','Autonomous engineering college in Madurai serving southern Tamil Nadu.'),
      K('VEC','VEC','Velammal Engineering College','Ambattur, Chennai','Engineering','Anna University affiliated','TNEA / Class 12 marks','Engineering college in Chennai affiliated to Anna University.'),
      K('LOYOLA','Loyola','Loyola College','Nungambakkam, Chennai','Arts & Science','Autonomous (Jesuit)','Class 12 marks','Jesuit autonomous arts and science college in Chennai, affiliated to the University of Madras.'),
      K('MCC','MCC','Madras Christian College','Tambaram, Chennai','Arts & Science','Autonomous','Class 12 marks','Historic autonomous arts and science college in Tambaram, Chennai.'),
      K('STELLA','Stella Maris','Stella Maris College','Chennai','Arts & Science','Autonomous (Women)','Class 12 marks','Autonomous arts and science college for women in Chennai.'),
      K('PRES','Presidency','Presidency College','Chennai','Arts & Science','Government','Class 12 marks','Government arts and science college in Chennai, affiliated to the University of Madras.')];
    const courses=[
      C('SRM','CSE','B.Tech Computer Science & Engineering',75,250000),C('SRM','ECE','B.Tech Electronics & Communication',70,230000),C('SRM','MECH','B.Tech Mechanical Engineering',65,210000),
      C('VIT','CSE','B.Tech Computer Science & Engineering',75,198000),C('VIT','IT','B.Tech Information Technology',70,198000),C('VIT','EEE','B.Tech Electrical & Electronics',65,198000),
      C('CEG','CSE','B.E. Computer Science & Engineering',90,60000),C('CEG','ECE','B.E. Electronics & Communication',85,60000),C('CEG','CIVIL','B.E. Civil Engineering',75,60000),
      C('PSG','CSE','B.E. Computer Science & Engineering',85,95000),C('PSG','ECE','B.E. Electronics & Communication',80,95000),C('PSG','BT','B.Tech Biotechnology',70,95000),
      C('SSN','CSE','B.E. Computer Science & Engineering',85,225000),C('SSN','IT','B.Tech Information Technology',80,225000),C('SSN','ECE','B.E. Electronics & Communication',80,225000),
      C('TCE','CSE','B.E. Computer Science & Engineering',85,90000),C('TCE','ECE','B.E. Electronics & Communication',80,90000),C('TCE','MECH','B.E. Mechanical Engineering',70,90000),
      C('VEC','CSE','B.E. Computer Science & Engineering',70,110000),C('VEC','AIDS','B.Tech Artificial Intelligence & Data Science',70,110000),C('VEC','ECE','B.E. Electronics & Communication',65,110000),
      C('LOYOLA','CS','B.Sc Computer Science',75,35000,3),C('LOYOLA','COM','B.Com',70,30000,3),C('LOYOLA','ECO','B.A. Economics',70,30000,3),
      C('MCC','MATH','B.Sc Mathematics',65,28000,3),C('MCC','ENG','B.A. English Literature',60,26000,3),C('MCC','COM','B.Com',65,28000,3),
      C('STELLA','CS','B.Sc Computer Science',70,40000,3),C('STELLA','ENG','B.A. English',60,32000,3),C('STELLA','COM','B.Com',65,35000,3),
      C('PRES','PHY','B.Sc Physics',60,6000,3),C('PRES','ECO','B.A. Economics',60,5000,3),C('PRES','CHEM','B.Sc Chemistry',60,6000,3)];
    const users=[{id:1,name:'Admin',email:'admin@admithub.edu',pass:'admin123',role:'admin'},{id:2,name:'Admission Officer',email:'officer@admithub.edu',pass:'officer123',role:'officer'},{id:3,name:'Accounts',email:'accounts@admithub.edu',pass:'acc123',role:'accounts'}]
      .concat(colleges.map((k,i)=>({id:4+i,name:'Head – '+k.short,email:'hod.'+k.short.toLowerCase().replace(' ','')+'@admithub.edu',pass:'hod123',role:'hod',col:k.id})));
    return{nid:100,round:0,cycle:'2026-27',deadline:'2026-12-31',w:{m:50,e:50},fee:{app:500},users,colleges,courses,apps:[],pay:[],notes:[],audit:[],enq:[]}}
};
S.init();
