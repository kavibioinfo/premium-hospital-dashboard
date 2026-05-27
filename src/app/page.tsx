"use client";
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient'; 

const DOCTORS = [
  { name:'Dr. Ayush Nexa', spec:'Cardiologist', init:'DA', color:'#00b4a6', avail:'busy', pts:8 },
  { name:'Dr. S. Patil', spec:'Neurologist', init:'SP', color:'#8b5cf6', avail:'yes', pts:5 },
  { name:'Dr. R. Shinde', spec:'Orthopedic', init:'RS', color:'#3b82f6', avail:'yes', pts:6 },
];

const NAV = [
  { id:'dashboard', icon:'📊', label:'Main Dashboard' },
  { id:'patients', icon:'👤', label:'Patients Registry' },
  { id:'opd', icon:'📅', label:'OPD Schedule' },
  { id:'pharmacy', icon:'💊', label:'Pharmacy Inventory' },
];

export default function Dashboard() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [nav, setNav] = useState('dashboard');
  
  // ⚡ DYNAMIC CLOUD DATA CLUSTERS
  const [patients, setPatients] = useState<any[]>([]);
  const [pharmaStock, setPharmaStock] = useState<any[]>([]);
  const [opdQueue, setOpdQueue] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // FORM STATES
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState('M');
  const [formBlood, setFormBlood] = useState('O+');
  const [formDoc, setFormDoc] = useState('Dr. Ayush Nexa');
  const [formWard, setFormWard] = useState('General Ward 1');
  const [formStatus, setFormStatus] = useState('stable');

  // 📥 MULTI-TABLE CLOUD FETCH
  const fetchAllCloudData = async () => {
    setLoading(true);
    
    // 1. Fetch Patients
    const { data: ptData } = await supabase.from('patients').select('*').order('time', { ascending: false });
    if (ptData) setPatients(ptData);

    // 2. Fetch Pharmacy
    const { data: phData } = await supabase.from('pharmacy').select('*').order('name', { ascending: true });
    if (phData) setPharmaStock(phData);

    // 3. Fetch OPD Schedule
    const { data: opdData } = await supabase.from('opd').select('*').order('token', { ascending: true });
    if (opdData) setOpdQueue(opdData);

    setLoading(false);
  };

  useEffect(() => {
    fetchAllCloudData();
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
      setDate(n.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short', year:'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // 📤 SUBMIT PATIENT
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAge) return alert("Please fill all fields");

    const newId = `P-${100 + patients.length + 1}`;
    const currentTimeStr = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

    const newPatientData = {
      id: newId, name: formName, age: parseInt(formAge), gender: formGender,
      blood: formBlood, doctor: formDoc, ward: formWard, status: formStatus, time: currentTimeStr
    };

    const { error } = await supabase.from('patients').insert([newPatientData]);
    if (!error) {
      fetchAllCloudData();
      setFormName(''); setFormAge(''); setIsModalOpen(false);
    }
  };

  const lowStockCount = pharmaStock.filter(p => p.stock < 100).length;

  return (
    <div className="shell">
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="brand-logo">🏥</div>
          <div>
            <h1>AyushNexa Super Speciality Hospital</h1>
            <p>Hospital Management Core Dashboard · Latur, Maharashtra, India</p>
          </div>
        </div>
        <div className="live-pill"><span className="live-dot" />Live Database Cluster</div>
        <div className="hdr-right">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search data..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="user-chip">
            <div className="u-avatar">AN</div>
            <div><div className="u-name">Dr. AyushNexa</div><div className="u-role">Super Admin</div></div>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="nav-section">Core Modules</div>
        {NAV.map(n => (
          <a key={n.id} className={`nav-link${nav===n.id?' active':''}`} onClick={()=>setNav(n.id)}>
            <span className="nav-icon">{n.icon}</span>{n.label}
            {n.id === 'patients' && <span className="nav-badge badge-red">{patients.length} Live</span>}
            {n.id === 'opd' && <span className="nav-badge badge-teal">{opdQueue.length} Active</span>}
            {n.id === 'pharmacy' && lowStockCount > 0 && <span className="nav-badge badge-amber">{lowStockCount} Alert</span>}
          </a>
        ))}
      </aside>

      {/* MAIN CONTENT HUB */}
      <main className="main">
        {loading ? <p style={{padding:20, fontWeight:600}}>Loading AyushNexa Cloud Architecture...</p> : (
          <>
            {/* 📊 SCREEN 1: MAIN DASHBOARD */}
            {nav === 'dashboard' && (
              <>
                <div className="page-hdr">
                  <div>
                    <h2>Main Dashboard</h2>
                    <p>Real-time Telemetry Engine Active</p>
                  </div>
                  <div className="page-actions">
                    <div className="time-chip">{date} | {time}</div>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>＋ New Admission</button>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi" style={{'--kpi-color':'#3b82f6'} as React.CSSProperties}>
                    <div className="kpi-top"><span className="kpi-label">Active EHR Records</span><div className="kpi-icon" style={{background:'#eff6ff',color:'#3b82f6'}}>👥</div></div>
                    <div className="kpi-num">{patients.length}<sub> Patients</sub></div>
                    <div className="kpi-foot"><span className="kpi-badge up">Live</span><span className="kpi-sub">from Mumbai Server</span></div>
                  </div>
                  <div className="kpi" style={{'--kpi-color':'#00b4a6'} as React.CSSProperties}>
                    <div className="kpi-top"><span className="kpi-label">OPD Queue</span><div className="kpi-icon" style={{background:'#e6f7f6',color:'#00b4a6'}}>📅</div></div>
                    <div className="kpi-num">{opdQueue.length}<sub> Today</sub></div>
                    <div className="kpi-foot"><span className="kpi-badge up">Live</span><span className="kpi-sub">appointments active</span></div>
                  </div>
                </div>

                <div className="main-grid">
                  <div className="card">
                    <div className="card-head"><h3>📡 Live Patient Monitoring System</h3></div>
                    <table className="ptable">
                      <thead>
                        <tr><th>ID</th><th>Patient Name</th><th>Doctor</th><th>Ward</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {patients.map(p => (
                          <tr key={p.id}>
                            <td><span className="pid">{p.id}</span></td>
                            <td><div className="pname">{p.name}<span className="blood-tag">{p.blood}</span></div></td>
                            <td>{p.doctor}</td>
                            <td><span className="ward-tag">🛏 {p.ward}</span></td>
                            <td><span className={`status-tag ${p.status==='critical'?'s-critical':p.status==='stable'?'s-stable':'s-obs'}`}><span className="s-dot" />{p.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* OPD MINI CARD INSIDE DASHBOARD */}
                  <div className="r-panel">
                    <div className="card">
                      <div className="card-head"><h3>Today's OPD Queue</h3></div>
                      {opdQueue.map((o, i) => (
                        <div key={i} className="opd-item" style={{padding:'12px 16px'}}>
                          <div className="opd-time" style={{fontWeight:700, color:'var(--teal-dark)'}}>{o.token}</div>
                          <div style={{flex:1}}>
                            <div className="opd-name">{o.patient}</div>
                            <div className="opd-doc">{o.doctor} · {o.dept}</div>
                          </div>
                          <span className={`chip ${o.status==='in-progress'?'chip-teal':'chip-amber'}`}>{o.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 👤 SCREEN 2: PATIENTS REGISTRY */}
            {nav === 'patients' && (
              <div className="card">
                <div className="card-head"><h2>Patients Central Registry</h2></div>
                <table className="ptable">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Age/Sex</th><th>Blood</th><th>Ward</th><th>Doctor</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p.id}>
                        <td><span className="pid">{p.id}</span></td>
                        <td style={{fontWeight:700}}>{p.name}</td>
                        <td>{p.age} / {p.gender}</td>
                        <td><span className="blood-tag">{p.blood}</span></td>
                        <td><span className="ward-tag">🛏️ {p.ward}</span></td>
                        <td>{p.doctor}</td>
                        <td><span className={`status-tag ${p.status==='critical'?'s-critical':p.status==='stable'?'s-stable':'s-obs'}`}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 📅 SCREEN 3: OPD SCHEDULE */}
            {nav === 'opd' && (
              <div className="card">
                <div className="card-head"><h2>Today's Outpatient Department (Supabase Live Queue)</h2></div>
                <table className="ptable">
                  <thead>
                    <tr><th>Token No</th><th>Patient Name</th><th>Doctor Consultant</th><th>Department</th><th>Time Slot</th><th>Live Status</th></tr>
                  </thead>
                  <tbody>
                    {opdQueue.map((o, i) => (
                      <tr key={i}>
                        <td style={{fontWeight:800, color:'var(--teal-dark)'}}>{o.token}</td>
                        <td style={{fontWeight:700}}>{o.patient}</td>
                        <td>{o.doctor}</td>
                        <td><span className="chip chip-violet">{o.dept}</span></td>
                        <td>{o.time}</td>
                        <td><span className={`chip ${o.status==='in-progress'?'chip-teal':'chip-amber'}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 💊 SCREEN 4: PHARMACY INVENTORY */}
            {nav === 'pharmacy' && (
              <div className="card">
                <div className="card-head">
                  <h2>Pharmacy Stock & Dispensing (Supabase Live Feed)</h2>
                  {lowStockCount > 0 && <span className="chip chip-red">🚨 {lowStockCount} Items Low Stock</span>}
                </div>
                <table className="ptable">
                  <thead>
                    <tr style={{background: 'var(--bg-page)'}}><th>Medicine Name</th><th>Category</th><th>Current Stock</th><th>Shelf Location</th><th>Safety Status</th></tr>
                  </thead>
                  <tbody>
                    {pharmaStock.map((p, i) => (
                      <tr key={i}>
                        <td style={{fontWeight: 700, color: 'var(--text-h)'}}>{p.name}</td>
                        <td><span className="chip chip-blue">{p.cat}</span></td>
                        <td style={{fontFamily: 'var(--font-data)', fontWeight: 700}}>{p.stock.toLocaleString()} units</td>
                        <td style={{fontFamily: 'var(--font-data)', fontWeight: 600}}>{p.shelf}</td>
                        <td>
                          <span className={`status-tag ${p.stock < 100 ? 's-critical' : 's-stable'}`}>
                            {p.stock < 100 ? 'Critical Low' : 'Good'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent:'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', width: '460px', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3>🏥 New Patient Cloud Entry</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAdmissionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Patient Full Name</label>
                <input type="text" required placeholder="e.g. Avinash Patil" value={formName} onChange={(e) => setFormName(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label>Age</label>
                  <input type="number" required value={formAge} onChange={(e) => setFormAge(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label>Gender</label>
                  <select value={formGender} onChange={(e) => setFormGender(e.target.value)} style={{ width: '100%', padding: '8px 12px', background:'#fff' }}>
                    <option value="M">Male</option><option value="F">Female</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', background: 'var(--teal)', color: '#fff', fontWeight: 700 }}>Save to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}