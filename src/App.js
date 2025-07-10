import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import './App.css';

export default function AdminPanel() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [activePage, setActivePage] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'admin');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const dailyChartRef = useRef(null);
  const roleChartRef = useRef(null);
  const feedbackChartRef = useRef(null);
  const healthChartRef = useRef(null);

  const chartInstances = useRef({});

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const handleLogin = (name, role) => {
    setUsername(name);
    setUserRole(role);
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', name);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUsername('');
    setUserRole('');
  };

  useEffect(() => {
    if (activePage === 'dashboard') {
      setTimeout(() => {
        Object.values(chartInstances.current).forEach(chart => chart?.destroy());

        if (dailyChartRef.current) {
          chartInstances.current.dailyChart = new Chart(dailyChartRef.current, {
            type: 'line',
            data: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                label: 'Users',
                data: [120, 90, 130, 180, 160, 190, 200],
                borderColor: '#6366f1',
                fill: true,
                tension: 0.4
              }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
          });
        }

        if (roleChartRef.current) {
          chartInstances.current.roleChart = new Chart(roleChartRef.current, {
            type: 'bar',
            data: {
              labels: ['Admin', 'Manager', 'User'],
              datasets: [{
                data: [4, 12, 84],
                backgroundColor: ['#ef4444', '#3b82f6', '#10b981']
              }]
            },
            options: { plugins: { legend: { display: false } } }
          });
        }

        if (feedbackChartRef.current) {
          chartInstances.current.feedbackChart = new Chart(feedbackChartRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Positive', 'Neutral', 'Negative'],
              datasets: [{
                data: [65, 20, 15],
                backgroundColor: ['#34d399', '#fbbf24', '#f87171']
              }]
            },
            options: { responsive: true }
          });
        }

        if (healthChartRef.current) {
          chartInstances.current.healthChart = new Chart(healthChartRef.current, {
            type: 'radar',
            data: {
              labels: ['CPU', 'Memory', 'Disk', 'Network', 'Uptime'],
              datasets: [{
                label: 'System Health',
                data: [80, 70, 75, 65, 90],
                backgroundColor: 'rgba(59,130,246,0.3)',
                borderColor: '#3b82f6'
              }]
            },
            options: { responsive: true }
          });
        }
      }, 100);
    }
  }, [activePage]);

  const summaryCards = [
    { title: 'Total Users', value: '1,245' },
    { title: 'Reports', value: '537' },
    { title: 'New Signups', value: '27' },
    { title: 'Sessions', value: '89' },
    { title: 'Server Load', value: '72%' },
    { title: 'Notifications', value: '14' }
  ];

  return (
    <div className={`d-flex min-h-screen ${darkMode ? 'dark-mode' : ''}`}>
      {!loggedIn ? (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in" style={{ zIndex: 9999 }}>
          <div className="glass-box p-4 rounded shadow" style={{ minWidth: '320px' }}>
            <h4 className="mb-3 text-center text-white">🔐 Login</h4>
            <input type="text" placeholder="Enter username" className="form-control mb-3" onChange={e => setUsername(e.target.value)} />
            <select className="form-select mb-3" onChange={e => setUserRole(e.target.value)} value={userRole}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <button onClick={() => handleLogin(username, userRole)} className="btn btn-primary w-100">Login</button>
          </div>
        </div>
      ) : (
        <>
          <div className={`bg-light sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} d-flex flex-column border-end p-2`}>
            <div className="text-center mb-3">
              <button onClick={toggleSidebar} className="btn btn-outline-secondary w-100">☰</button>
            </div>
            <ul className="nav nav-pills flex-column text-sm">
              {['dashboard', 'users', 'reports', 'logs', 'todo', 'calendar', 'notifications', 'settings'].map(page => (
                <li key={page} className="nav-item">
                  <button className={`nav-link btn text-start w-100 ${activePage === page ? 'active' : ''}`} onClick={() => setActivePage(page)}>
                    <span className="me-1">📊</span> <span className="nav-text">{page.charAt(0).toUpperCase() + page.slice(1)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-auto text-center">
              <button onClick={toggleDarkMode} className="btn btn-outline-dark btn-sm w-100 mt-2">🌙 Dark Mode</button>
              <button onClick={logout} className="btn btn-outline-danger btn-sm w-100 mt-2">🚪 Logout</button>
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <nav className="navbar navbar-light bg-white border-bottom px-4 py-2 d-flex justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <input type="text" placeholder="Search..." className="form-control form-control-sm" style={{ maxWidth: 200 }} />
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-sm text-muted">{username} ({userRole})</span>
                <img src="https://i.pravatar.cc/100" alt="avatar" className="avatar" />
              </div>
            </nav>

            <div className="p-4">
              {activePage === 'dashboard' ? (
                <>
                  <h2 className="text-xl font-bold mb-4">📊 Dashboard</h2>
                  <div className="row g-4 mb-4">
                    {summaryCards.map((card, idx) => (
                      <div key={idx} className="col-md-2">
                        <div className="card glass p-3">
                          <h6>{card.title}</h6>
                          <p className="text-xl">{card.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card glass p-3">
                        <h6>Daily Active Users</h6>
                        <canvas ref={dailyChartRef}></canvas>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card glass p-3">
                        <h6>Role Distribution</h6>
                        <canvas ref={roleChartRef}></canvas>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card glass p-3">
                        <h6>Feedback Ratings</h6>
                        <canvas ref={feedbackChartRef}></canvas>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card glass p-3">
                        <h6>System Health</h6>
                        <canvas ref={healthChartRef}></canvas>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted">Page under construction: {activePage}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
