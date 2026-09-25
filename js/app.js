const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

const defaultDB={
  courses:[
    {id:1,name:"Implementasi dan Pengujian Perangkat Lunak",code:"IPPL",lecturer:"Dosen Pengampu",credits:3},
    {id:2,name:"Pemrograman Berbasis Objek",code:"PBO",lecturer:"Dosen Pengampu",credits:3},
    {id:3,name:"Machine Learning 1",code:"ML1",lecturer:"Dosen Pengampu",credits:3}
  ],
  materials:[
    {id:1,title:"Pengenalan SDLC dan MVP",course:"Implementasi dan Pengujian Perangkat Lunak",type:"PDF",date:"24 Sep 2026",desc:"Pengenalan siklus pengembangan perangkat lunak dan konsep Minimum Viable Product."},
    {id:2,title:"Analisis Kebutuhan Perangkat Lunak",course:"Implementasi dan Pengujian Perangkat Lunak",type:"PDF",date:"25 Sep 2026",desc:"Kebutuhan fungsional, non-fungsional, dan pemodelan sistem."},
    {id:3,title:"Konsep Class dan Object",course:"Pemrograman Berbasis Objek",type:"PDF",date:"22 Sep 2026",desc:"Dasar OOP: class, object, attribute, method, dan encapsulation."},
    {id:4,title:"Dasar Machine Learning",course:"Machine Learning 1",type:"PDF",date:"20 Sep 2026",desc:"Konsep dasar supervised dan unsupervised learning."}
  ],
  tasks:[
    {id:1,title:"Use Case Diagram Mini LMS",course:"Implementasi dan Pengujian Perangkat Lunak",deadline:"30 Sep 2026",desc:"Buat Use Case Diagram untuk sistem Mini LMS.",status:"Belum dikumpulkan"},
    {id:2,title:"Activity Diagram",course:"Implementasi dan Pengujian Perangkat Lunak",deadline:"07 Okt 2026",desc:"Buat activity diagram untuk proses login dan pengumpulan tugas.",status:"Belum dikumpulkan"},
    {id:3,title:"Prototype UI/UX",course:"Implementasi dan Pengujian Perangkat Lunak",deadline:"14 Okt 2026",desc:"Buat prototype interaktif halaman utama Mini LMS.",status:"Belum dikumpulkan"}
  ],
  grades:[
    {id:1,student:"Nur Lutfia Amalia Khaisya",task:"Use Case Diagram Mini LMS",course:"Implementasi dan Pengujian Perangkat Lunak",score:90,feedback:"Struktur aktor dan use case sudah jelas."},
    {id:2,student:"Nur Lutfia Amalia Khaisya",task:"Activity Diagram",course:"Implementasi dan Pengujian Perangkat Lunak",score:88,feedback:"Alur sudah baik, rapikan decision node."}
  ],
  announcements:[
    {id:1,title:"Bimbingan Project Mingguan",date:"25 Sep 2026",content:"Setiap kelompok membawa progress implementasi dan dokumen pengujian untuk dikonsultasikan."},
    {id:2,title:"Pembagian Role Kelompok",date:"23 Sep 2026",content:"Pastikan role System Analyst & UI/UX, Developer, dan QA/Tester sudah ditentukan."},
    {id:3,title:"Fokus pada MVP",date:"20 Sep 2026",content:"Aplikasi tidak perlu rumit. Prioritaskan fitur utama, minim bug, dan dokumentasi testing."}
  ],
  submissions:[]
};

let db=JSON.parse(localStorage.getItem("ruangKelasDB")||"null")||defaultDB;
let user={name:"",role:"mahasiswa"};

function save(){localStorage.setItem("ruangKelasDB",JSON.stringify(db))}
function uid(arr){return arr.length?Math.max(...arr.map(x=>Number(x.id)||0))+1:1}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=msg;$("#toast").appendChild(el);setTimeout(()=>el.remove(),2500)}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function today(){return new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}

const navStudent=[
  ["dashboard","▦","Dashboard"],["courses","▤","Mata Kuliah"],["materials","▣","Materi"],["tasks","✓","Tugas"],["grades","★","Nilai"],["announcements","◈","Pengumuman"]
];
const navLecturer=[
  ["dashboard","▦","Dashboard"],["courses","▤","Mata Kuliah"],["materials","▣","Kelola Materi"],["tasks","✓","Kelola Tugas"],["grades","★","Kelola Nilai"],["announcements","◈","Pengumuman"]
];

function buildNav(){
  const nav=user.role==="dosen"?navLecturer:navStudent;
  $("#sidebarNav").innerHTML=nav.map(([p,i,t])=>`<button class="nav-btn" data-page="${p}">${i} &nbsp; ${t}</button>`).join("");
  $$("#sidebarNav .nav-btn").forEach(b=>b.onclick=()=>{render(b.dataset.page);$("#sidebarNav").parentElement.classList.remove("open")});
}

function render(page="dashboard"){
  buildNav();
  $$("#sidebarNav .nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const labels={dashboard:"Dashboard",courses:"Mata Kuliah",materials:user.role==="dosen"?"Kelola Materi":"Materi",tasks:user.role==="dosen"?"Kelola Tugas":"Tugas",grades:user.role==="dosen"?"Kelola Nilai":"Nilai",announcements:"Pengumuman"};
  $("#pageTitle").textContent=labels[page]||"Dashboard";
  ({dashboard:renderDashboard,courses:renderCourses,materials:renderMaterials,tasks:renderTasks,grades:renderGrades,announcements:renderAnnouncements}[page]||renderDashboard)();
}

function stats(){
  return `<div class="stats">
    <div class="stat"><div class="stat-top"><span>Mata Kuliah</span><span class="stat-icon">📚</span></div><strong>${db.courses.length}</strong><small>tersedia</small></div>
    <div class="stat"><div class="stat-top"><span>Materi</span><span class="stat-icon">📄</span></div><strong>${db.materials.length}</strong><small>materi aktif</small></div>
    <div class="stat"><div class="stat-top"><span>Tugas</span><span class="stat-icon">✓</span></div><strong>${db.tasks.length}</strong><small>tugas aktif</small></div>
    <div class="stat"><div class="stat-top"><span>Pengumuman</span><span class="stat-icon">🔔</span></div><strong>${db.announcements.length}</strong><small>informasi</small></div>
  </div>`
}

function renderDashboard(){
  const latest=db.announcements.slice(-3).reverse();
  $("#pageContent").innerHTML=`
  <div class="welcome"><div><h1>Halo, ${esc(user.name)}! 👋</h1><p>Selamat datang di RuangKelas. Semua aktivitas pembelajaran ada di satu tempat.</p></div><div class="welcome-icon">🎓</div></div>
  ${stats()}
  <div class="section-head"><div><h3>Pengumuman Terbaru</h3><p>Informasi penting dari dosen</p></div><button class="btn secondary" onclick="render('announcements')">Lihat semua</button></div>
  <div class="timeline">${latest.map(a=>`<div class="item"><div class="timeline-date">${esc(a.date)}</div><div><h4>${esc(a.title)}</h4><p>${esc(a.content)}</p></div></div>`).join("")}</div>
  <div class="section-head"><div><h3>${user.role==="dosen"?"Ringkasan Pengelolaan":"Tugas Mendatang"}</h3></div></div>
  <div class="grid">${db.tasks.slice(0,3).map(t=>`<div class="item"><span class="tag orange">${esc(t.deadline)}</span><h4>${esc(t.title)}</h4><p>${esc(t.course)}</p><div class="progress"><span style="width:${t.status==="Sudah dikumpulkan"?100:35}%"></span></div><p style="font-size:11px;margin-top:7px">${esc(t.status)}</p></div>`).join("")}</div>`;
}

function renderCourses(){
  $("#pageContent").innerHTML=`
  <div class="section-head"><div><h3>Daftar Mata Kuliah</h3><p>${user.role==="dosen"?"Kelola mata kuliah yang diajar.":"Mata kuliah yang tersedia di RuangKelas."}</p></div>${user.role==="dosen"?'<button class="btn primary" onclick="courseModal()">+ Tambah Mata Kuliah</button>':''}</div>
  <div class="grid">${db.courses.map(c=>`<div class="item"><span class="tag">${esc(c.code)}</span><h4>${esc(c.name)}</h4><p><b>Dosen:</b> ${esc(c.lecturer)}</p><p><b>SKS:</b> ${c.credits}</p>${user.role==="dosen"?`<div class="action-row"><button class="btn small secondary" onclick="courseModal(${c.id})">Edit</button><button class="btn small danger" onclick="removeItem('courses',${c.id},'Mata kuliah')">Hapus</button></div>`:""}</div>`).join("")}</div>`;
}

function renderMaterials(){
  $("#pageContent").innerHTML=`
  <div class="section-head"><div><h3>${user.role==="dosen"?"Kelola Materi":"Materi Pembelajaran"}</h3><p>${db.materials.length} materi tersedia</p></div>${user.role==="dosen"?'<button class="btn primary" onclick="materialModal()">+ Tambah Materi</button>':''}</div>
  <div class="grid">${db.materials.map(m=>`<div class="item"><span class="tag">${esc(m.type)}</span><h4>${esc(m.title)}</h4><p><b>${esc(m.course)}</b></p><p>${esc(m.desc)}</p><p style="font-size:11px">Diunggah: ${esc(m.date)}</p><div class="action-row">${user.role==="mahasiswa"?'<button class="btn small secondary" onclick="toast(\'Materi siap dibuka pada versi backend.\')">Buka Materi</button>':`<button class="btn small secondary" onclick="materialModal(${m.id})">Edit</button><button class="btn small danger" onclick="removeItem('materials',${m.id},'Materi')">Hapus</button>`}</div></div>`).join("")}</div>`;
}

function renderTasks(){
  const isD=user.role==="dosen";
  $("#pageContent").innerHTML=`
  <div class="section-head"><div><h3>${isD?"Kelola Tugas":"Daftar Tugas"}</h3><p>${isD?"Buat dan kelola tugas mahasiswa.":"Tugas yang harus diselesaikan."}</p></div>${isD?'<button class="btn primary" onclick="taskModal()">+ Buat Tugas</button>':''}</div>
  <div class="table-wrap"><table><thead><tr><th>Tugas</th><th>Mata Kuliah</th><th>Deadline</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
  ${db.tasks.map(t=>`<tr><td><b>${esc(t.title)}</b><br><small>${esc(t.desc)}</small></td><td>${esc(t.course)}</td><td>${esc(t.deadline)}</td><td><span class="tag ${t.status==="Sudah dikumpulkan"?"green":"orange"}">${esc(t.status)}</span></td><td><div class="action-row">${isD?`<button class="btn small secondary" onclick="taskModal(${t.id})">Edit</button><button class="btn small danger" onclick="removeItem('tasks',${t.id},'Tugas')">Hapus</button>`:`<button class="btn small primary" onclick="submitModal(${t.id})">Kumpulkan</button>`}</div></td></tr>`).join("")}
  </tbody></table></div>`;
}

function renderGrades(){
  if(user.role==="dosen"){
    $("#pageContent").innerHTML=`
    <div class="section-head"><div><h3>Kelola Nilai</h3><p>Berikan nilai dan feedback kepada mahasiswa.</p></div><button class="btn primary" onclick="gradeModal()">+ Tambah Nilai</button></div>
    <div class="table-wrap"><table><thead><tr><th>Mahasiswa</th><th>Tugas</th><th>Mata Kuliah</th><th>Nilai</th><th>Feedback</th><th>Aksi</th></tr></thead><tbody>${db.grades.map(g=>`<tr><td>${esc(g.student)}</td><td>${esc(g.task)}</td><td>${esc(g.course)}</td><td class="score">${g.score}</td><td>${esc(g.feedback||"-")}</td><td><button class="btn small danger" onclick="removeItem('grades',${g.id},'Nilai')">Hapus</button></td></tr>`).join("")}</tbody></table></div>`;
  }else{
    const my=db.grades.filter(g=>g.student===user.name||g.student==="Nur Lutfia Amalia Khaisya");
    const avg=my.length?Math.round(my.reduce((a,b)=>a+b.score,0)/my.length):0;
    $("#pageContent").innerHTML=`
    <div class="stats"><div class="stat"><div class="stat-top"><span>Rata-rata</span><span class="stat-icon">★</span></div><strong>${avg}</strong><small>dari ${my.length} nilai</small></div><div class="stat"><div class="stat-top"><span>Tugas Dinilai</span><span class="stat-icon">✓</span></div><strong>${my.length}</strong><small>tugas</small></div></div>
    <div class="section-head"><div><h3>Hasil Penilaian</h3><p>Nilai dan feedback dari dosen.</p></div></div>
    <div class="table-wrap"><table><thead><tr><th>Tugas</th><th>Mata Kuliah</th><th>Nilai</th><th>Feedback</th></tr></thead><tbody>${my.map(g=>`<tr><td>${esc(g.task)}</td><td>${esc(g.course)}</td><td class="score">${g.score}</td><td>${esc(g.feedback||"-")}</td></tr>`).join("")}</tbody></table></div>`;
  }
}

function renderAnnouncements(){
  $("#pageContent").innerHTML=`
  <div class="section-head"><div><h3>Pengumuman</h3><p>Informasi terbaru dari ruang kelas.</p></div>${user.role==="dosen"?'<button class="btn primary" onclick="announcementModal()">+ Buat Pengumuman</button>':''}</div>
  <div class="grid two">${db.announcements.slice().reverse().map(a=>`<div class="item"><span class="tag">${esc(a.date)}</span><h4>${esc(a.title)}</h4><p>${esc(a.content)}</p>${user.role==="dosen"?`<div class="action-row"><button class="btn small secondary" onclick="announcementModal(${a.id})">Edit</button><button class="btn small danger" onclick="removeItem('announcements',${a.id},'Pengumuman')">Hapus</button></div>`:""}</div>`).join("")}</div>`;
}

function openModal(html){$("#modal").innerHTML=html;$("#modalBackdrop").classList.remove("hidden")}
function closeModal(){$("#modalBackdrop").classList.add("hidden")}
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});

function modalShell(title,body,submit){openModal(`<div class="modal-head"><h3>${title}</h3><button class="close" onclick="closeModal()">✕</button></div>${body}<div class="modal-actions"><button class="btn ghost" onclick="closeModal()">Batal</button><button class="btn primary" onclick="${submit}">Simpan</button></div>`)}

function courseModal(id=null){
 const c=id?db.courses.find(x=>x.id===id):{};
 modalShell(id?"Edit Mata Kuliah":"Tambah Mata Kuliah",`<label>Nama Mata Kuliah</label><input id="fName" value="${esc(c.name||"")}"><label>Kode</label><input id="fCode" value="${esc(c.code||"")}"><label>Dosen</label><input id="fLecturer" value="${esc(c.lecturer||"Dosen Pengampu")}"><label>SKS</label><input id="fCredits" type="number" value="${c.credits||3}">`,`saveCourse(${id||"null"})`);
}
function saveCourse(id){
 const x={name:$("#fName").value,code:$("#fCode").value,lecturer:$("#fLecturer").value,credits:Number($("#fCredits").value)||3};
 if(!x.name||!x.code)return toast("Nama dan kode wajib diisi");
 if(id)Object.assign(db.courses.find(c=>c.id===id),x);else db.courses.push({id:uid(db.courses),...x});
 save();closeModal();render("courses");toast("Mata kuliah berhasil disimpan");
}

function materialModal(id=null){
 const m=id?db.materials.find(x=>x.id===id):{};
 modalShell(id?"Edit Materi":"Tambah Materi",`<label>Judul Materi</label><input id="fTitle" value="${esc(m.title||"")}"><label>Mata Kuliah</label><select id="fCourse">${db.courses.map(c=>`<option ${m.course===c.name?"selected":""}>${esc(c.name)}</option>`).join("")}</select><label>Tipe File</label><select id="fType"><option ${m.type==="PDF"?"selected":""}>PDF</option><option ${m.type==="PPT"?"selected":""}>PPT</option><option ${m.type==="DOC"?"selected":""}>DOC</option></select><label>Deskripsi</label><textarea id="fDesc">${esc(m.desc||"")}</textarea>`,`saveMaterial(${id||"null"})`);
}
function saveMaterial(id){
 const x={title:$("#fTitle").value,course:$("#fCourse").value,type:$("#fType").value,desc:$("#fDesc").value,date:today()};
 if(!x.title)return toast("Judul materi wajib diisi");
 if(id)Object.assign(db.materials.find(m=>m.id===id),x);else db.materials.push({id:uid(db.materials),...x});
 save();closeModal();render("materials");toast("Materi berhasil disimpan");
}

function taskModal(id=null){
 const t=id?db.tasks.find(x=>x.id===id):{};
 modalShell(id?"Edit Tugas":"Buat Tugas",`<label>Judul Tugas</label><input id="fTitle" value="${esc(t.title||"")}"><label>Mata Kuliah</label><select id="fCourse">${db.courses.map(c=>`<option ${t.course===c.name?"selected":""}>${esc(c.name)}</option>`).join("")}</select><label>Deadline</label><input id="fDeadline" type="date" value="${id?isoDate(t.deadline):""}"><label>Deskripsi</label><textarea id="fDesc">${esc(t.desc||"")}</textarea>`,`saveTask(${id||"null"})`);
}
function isoDate(s){const d=new Date(s);if(isNaN(d))return"";return d.toISOString().slice(0,10)}
function saveTask(id){
 const raw=$("#fDeadline").value;const date=raw?new Date(raw+"T00:00:00").toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):"-";
 const old=id?db.tasks.find(t=>t.id===id):{};
 const x={title:$("#fTitle").value,course:$("#fCourse").value,deadline:date,desc:$("#fDesc").value,status:old.status||"Belum dikumpulkan"};
 if(!x.title)return toast("Judul tugas wajib diisi");
 if(id)Object.assign(old,x);else db.tasks.push({id:uid(db.tasks),...x});
 save();closeModal();render("tasks");toast("Tugas berhasil disimpan");
}

function submitModal(taskId){
 const t=db.tasks.find(x=>x.id===taskId);
 openModal(`<div class="modal-head"><h3>Kumpulkan Tugas</h3><button class="close" onclick="closeModal()">✕</button></div><p><b>${esc(t.title)}</b></p><label>File Tugas</label><input id="fFile" type="file"><label>Catatan</label><textarea id="fNote" placeholder="Catatan untuk dosen (opsional)"></textarea><div class="modal-actions"><button class="btn ghost" onclick="closeModal()">Batal</button><button class="btn primary" onclick="submitTask(${taskId})">Kirim Tugas</button></div>`);
}
function submitTask(taskId){
 const f=$("#fFile").files[0];if(!f)return toast("Pilih file terlebih dahulu");
 const t=db.tasks.find(x=>x.id===taskId);t.status="Sudah dikumpulkan";
 db.submissions.push({id:uid(db.submissions),taskId,student:user.name,file:f.name,note:$("#fNote").value,date:today()});
 save();closeModal();render("tasks");toast("Tugas berhasil dikumpulkan");
}

function gradeModal(){
 modalShell("Tambah Nilai",`<label>Nama Mahasiswa</label><input id="fStudent" value=""><label>Tugas</label><select id="fTask">${db.tasks.map(t=>`<option>${esc(t.title)}</option>`).join("")}</select><label>Nilai (0-100)</label><input id="fScore" type="number" min="0" max="100"><label>Feedback</label><textarea id="fFeedback"></textarea>`,`saveGrade()`);
}
function saveGrade(){
 const task=db.tasks.find(t=>t.title===$("#fTask").value);
 const score=Number($("#fScore").value);if(!$("#fStudent").value||!task||score<0||score>100)return toast("Lengkapi data nilai");
 db.grades.push({id:uid(db.grades),student:$("#fStudent").value,task:task.title,course:task.course,score,feedback:$("#fFeedback").value});
 save();closeModal();render("grades");toast("Nilai berhasil ditambahkan");
}

function announcementModal(id=null){
 const a=id?db.announcements.find(x=>x.id===id):{};
 modalShell(id?"Edit Pengumuman":"Buat Pengumuman",`<label>Judul</label><input id="fTitle" value="${esc(a.title||"")}"><label>Isi Pengumuman</label><textarea id="fContent">${esc(a.content||"")}</textarea>`,`saveAnnouncement(${id||"null"})`);
}
function saveAnnouncement(id){
 const x={title:$("#fTitle").value,content:$("#fContent").value,date:today()};
 if(!x.title||!x.content)return toast("Judul dan isi wajib diisi");
 if(id)Object.assign(db.announcements.find(a=>a.id===id),x);else db.announcements.push({id:uid(db.announcements),...x});
 save();closeModal();render("announcements");toast("Pengumuman berhasil disimpan");
}

function removeItem(type,id,label){
 if(!confirm(`Hapus ${label} ini?`))return;
 db[type]=db[type].filter(x=>x.id!==id);save();render(type==="materials"?"materials":type==="tasks"?"tasks":type==="courses"?"courses":type==="grades"?"grades":"announcements");toast(label+" berhasil dihapus");
}

$("#loginForm").addEventListener("submit",e=>{
 e.preventDefault();
 user.name=$("#loginName").value.trim()||"Pengguna";
 user.role=document.querySelector('input[name="role"]:checked').value;
 $("#profileName").textContent=user.name;$("#profileRole").textContent=user.role==="dosen"?"Dosen":"Mahasiswa";$("#avatar").textContent=user.name.charAt(0).toUpperCase();
 $("#loginPage").classList.add("hidden");$("#app").classList.remove("hidden");$("#currentDate").textContent=today();render("dashboard");
});
$("#logoutBtn").onclick=()=>{user={name:"",role:"mahasiswa"};$("#app").classList.add("hidden");$("#loginPage").classList.remove("hidden");$("#loginForm").reset()};
$("#mobileMenu").onclick=()=>$(".sidebar").classList.toggle("open");
$("#notifBtn").onclick=()=>toast(`${db.announcements.length} pengumuman tersedia`);
