
import { useState } from "react";
import "./App.css";

const initialComplaints = [
  { id: "CC-1024", title: "Water leakage in bathroom", location: "Hostel A · Room 204", category: "Plumbing", priority: "High", status: "In Progress" },
  { id: "CC-1023", title: "Ceiling fan not working", location: "Hostel B · Room 108", category: "Electrical", priority: "Medium", status: "Pending" },
  { id: "CC-1022", title: "Broken study table", location: "Hostel A · Room 312", category: "Furniture", priority: "Low", status: "Resolved" },
  { id: "CC-1021", title: "Corridor light not working", location: "Hostel C · Floor 2", category: "Electrical", priority: "High", status: "Pending" },
];

function App() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    title: "", location: "", category: "Plumbing",
    priority: "Medium", description: ""
  });

  const filtered = complaints.filter(
    (item) => filter === "All" || item.status === filter
  );

  function submitComplaint(event) {
    event.preventDefault();
    const newComplaint = {
      id: `CC-${1025 + complaints.length - initialComplaints.length}`,
      title: form.title,
      location: form.location,
      category: form.category,
      priority: form.priority,
      status: "Pending",
    };
    setComplaints((previous) => [newComplaint, ...previous]);
    setForm({
      title: "", location: "", category: "Plumbing",
      priority: "Medium", description: ""
    });
    setShowForm(false);
    setFilter("All");
  }

  const pending = complaints.filter((item) => item.status === "Pending").length;
  const active = complaints.filter((item) => item.status === "In Progress").length;
  const resolved = complaints.filter((item) => item.status === "Resolved").length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">C</span>
          <span>CampusCare<small>SMART MAINTENANCE</small></span>
        </a>

        <p className="nav-heading">WORKSPACE</p>
        <a className="nav-link active" href="#dashboard">▦ &nbsp; Dashboard</a>
        <button className="nav-link" onClick={() => setShowForm(true)}>＋ &nbsp; Report an issue</button>
        <a className="nav-link" href="#complaints">☷ &nbsp; Complaints</a>

        <p className="nav-heading">MANAGEMENT</p>
        <a className="nav-link" href="#complaints">▤ &nbsp; Maintenance tasks</a>
        <a className="nav-link" href="#insights">▥ &nbsp; Insights</a>

        <div className="sidebar-bottom">
          <div className="help-card">
            <strong>Need assistance?</strong>
            <p>Report a campus issue and track its repair here.</p>
            <button onClick={() => setShowForm(true)}>Create complaint →</button>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div><strong>Campus Student</strong><small>Student portal</small></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div><span className="breadcrumb">Workspace /</span> Dashboard</div>
          <div className="topbar-right"><span className="online-dot"></span> System operational <span className="avatar small-avatar">S</span></div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">CAMPUS FACILITIES · OVERVIEW</p>
            <h1>Good morning! <span>👋</span></h1>
            <p>Here's what's happening with campus maintenance today.</p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(true)}>＋ Report an issue</button>
        </section>

        <section className="stats-grid">
          <article className="stat-card"><div className="stat-top"><span>Total complaints</span><span className="stat-icon blue">▤</span></div><strong>{complaints.length}</strong><small className="muted">All reported issues</small></article>
          <article className="stat-card"><div className="stat-top"><span>Awaiting action</span><span className="stat-icon orange">◷</span></div><strong>{pending}</strong><small className="muted">Pending assignment</small></article>
          <article className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon purple">⚒</span></div><strong>{active}</strong><small className="muted">Being repaired</small></article>
          <article className="stat-card"><div className="stat-top"><span>Resolved</span><span className="stat-icon green">✓</span></div><strong>{resolved}</strong><small className="muted">Marked as complete</small></article>
        </section>

        <section className="content-grid">
          <article className="panel complaints-panel" id="complaints">
            <div className="panel-header">
              <div><h2>Recent complaints</h2><p>Monitor and track reported campus issues.</p></div>
              <button className="text-button" onClick={() => setFilter("All")}>View all →</button>
            </div>
            <div className="filter-row">
              {["All", "Pending", "In Progress", "Resolved"].map((status) => (
                <button key={status} className={`filter-chip ${filter === status ? "selected" : ""}`} onClick={() => setFilter(status)}>{status}</button>
              ))}
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>COMPLAINT</th><th>CATEGORY</th><th>PRIORITY</th><th>STATUS</th></tr></thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.title}</strong><small>{item.id} · {item.location}</small></td>
                      <td>{item.category}</td>
                      <td><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                      <td><span className={`status ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan="4">No complaints in this category.</td></tr>}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="panel side-panel" id="insights">
            <div className="panel-header"><div><h2>Quick actions</h2><p>What would you like to do?</p></div></div>
            <button className="action-card" onClick={() => setShowForm(true)}><span className="action-icon blue">＋</span><span><strong>Report an issue</strong><small>Tell us what needs fixing</small></span><b>→</b></button>
            <a className="action-card" href="#complaints"><span className="action-icon purple">☷</span><span><strong>Track complaints</strong><small>Check repair progress</small></span><b>→</b></a>
            <div className="tip-card"><span>✦ &nbsp; CAMPUS CARE TIP</span><p>Include your exact hostel and room number to help the maintenance team resolve issues faster.</p></div>
          </aside>
        </section>

        <footer>CampusCare · Smart Campus Maintenance System <span>Built for a better campus</span></footer>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form className="complaint-modal" onSubmit={submitComplaint} onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading"><div><p className="eyebrow">CAMPUS MAINTENANCE</p><h2>Report an issue</h2><p>Provide details so the right team can help.</p></div><button type="button" className="close-button" onClick={() => setShowForm(false)}>✕</button></div>
            <label>Issue title<input required maxLength="100" placeholder="e.g. Water leakage in bathroom" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/></label>
            <label>Hostel and room<input required maxLength="100" placeholder="e.g. Hostel A, Room 204" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}/></label>
            <div className="form-row">
              <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Plumbing</option><option>Electrical</option><option>Furniture</option><option>Cleaning</option><option>Other</option></select></label>
              <label>Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></label>
            </div>
            <label>Description<textarea required rows="3" maxLength="1000" placeholder="Explain the issue in simple words..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit">Submit complaint →</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
