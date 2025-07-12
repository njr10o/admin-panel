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

  const [users, setUsers] = useState([
    { id: 1, name: 'alice', role: 'Admin', online: true },
    { id: 2, name: 'bob', role: 'User', online: false },
    { id: 3, name: 'carol', role: 'Manager', online: true }
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('User');
  const [viewUser, setViewUser] = useState(null);

  // New logs data
  const [loginHistory] = useState([
    { user: 'alice', time: '2025-07-10 09:00', success: true },
    { user: 'bob', time: '2025-07-10 10:15', success: false }
  ]);
  const [ipLogs] = useState([
    { user: 'alice', ip: '192.168.1.1', time: '2025-07-10 09:00' },
    { user: 'carol', ip: '192.168.1.2', time: '2025-07-10 09:30' }
  ]);
  const [failedLogins] = useState([
    { user: 'bob', time: '2025-07-10 10:15', reason: 'Wrong password' }
  ]);
  const [activityLogs] = useState([
    { user: 'alice', page: 'dashboard', action: 'Viewed', time: '2025-07-10 09:01' },
    { user: 'carol', page: 'users', action: 'Added user', time: '2025-07-10 09:32' }
  ]);
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "", due: "", status: "Pending", priority: "Low" });
  const [priorityFilter, setPriorityFilter] = useState("");
  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", assignedTo: "", due: "", status: "Pending", priority: "Low" });
    }
  };
  const [tasks, setTasks] = useState([]);


  const filteredTasks = priorityFilter
    ? tasks.filter(task => task.priority === priorityFilter)
    : tasks;


  const dailyChartRef = useRef(null);
  const roleChartRef = useRef(null);
  const feedbackChartRef = useRef(null);
  const healthChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
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

  const addNewUser = () => {
    if (!newUserName.trim()) return;
    const id = Date.now();
    setUsers([...users, { id, name: newUserName, role: newUserRole, online: false }]);
    setNewUserName('');
    setNewUserRole('User');
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  useEffect(() => {
    Object.values(chartInstances.current).forEach(chart => chart?.destroy());

    if (activePage === 'dashboard') {
      if (dailyChartRef.current) {
        chartInstances.current.dailyChart = new Chart(dailyChartRef.current, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ label: 'Users', data: [120, 90, 130, 180, 160, 190, 200], borderColor: '#6366f1', fill: true, tension: 0.4 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }

      if (roleChartRef.current) {
        chartInstances.current.roleChart = new Chart(roleChartRef.current, {
          type: 'bar',
          data: {
            labels: ['Admin', 'Manager', 'User'],
            datasets: [{ data: [4, 12, 84], backgroundColor: ['#ef4444', '#3b82f6', '#10b981'] }]
          },
          options: { plugins: { legend: { display: false } } }
        });
      }

      if (feedbackChartRef.current) {
        chartInstances.current.feedbackChart = new Chart(feedbackChartRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{ data: [65, 20, 15], backgroundColor: ['#34d399', '#fbbf24', '#f87171'] }]
          },
          options: { responsive: true }
        });
      }

      if (healthChartRef.current) {
        chartInstances.current.healthChart = new Chart(healthChartRef.current, {
          type: 'radar',
          data: {
            labels: ['CPU', 'Memory', 'Disk', 'Network', 'Uptime'],
            datasets: [{ label: 'System Health', data: [80, 70, 75, 65, 90], backgroundColor: 'rgba(59,130,246,0.3)', borderColor: '#3b82f6' }]
          },
          options: { responsive: true }
        });
      }
    }

    if (activePage === 'reports') {
      if (barChartRef.current) {
        chartInstances.current.barChart = new Chart(barChartRef.current, {
          type: 'bar',
          data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], datasets: [{ data: [300, 400, 200, 500, 450], backgroundColor: '#6366f1' }] },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }

      if (lineChartRef.current) {
        chartInstances.current.lineChart = new Chart(lineChartRef.current, {
          type: 'line',
          data: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], datasets: [{ label: 'Signups', data: [30, 50, 40, 60], borderColor: '#10b981', fill: false }] },
          options: { responsive: true }
        });
      }

      if (pieChartRef.current) {
        chartInstances.current.pieChart = new Chart(pieChartRef.current, {
          type: 'pie',
          data: { labels: ['Email', 'Chat', 'Call'], datasets: [{ data: [40, 30, 30], backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444'] }] },
          options: { responsive: true }
        });
      }
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
            <nav className="navbar navbar-light bg-white border-bottom px-4 py-2 d-flex justify-content-between align-items-center">
              <input type="text" placeholder="Search..." className="form-control form-control-sm" style={{ maxWidth: 200 }} />
              <img src="https://tse2.mm.bing.net/th/id/OIP.jOcdCtxN1e5AOG_-AGHNcQAAAA" alt="center logo" className="mx-auto" style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '80%' }} />
              <div className="d-flex align-items-center gap-2">
                <span className="text-sm text-muted">{username} ({userRole})</span>
                <img src="https://i.pravatar.cc/100" alt="avatar" className="avatar" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
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
                    <div className="col-md-6"><div className="card glass p-3"><h6>Daily Active Users</h6><canvas ref={dailyChartRef}></canvas></div></div>
                    <div className="col-md-6"><div className="card glass p-3"><h6>Role Distribution</h6><canvas ref={roleChartRef}></canvas></div></div>
                    <div className="col-md-6"><div className="card glass p-3"><h6>Feedback Ratings</h6><canvas ref={feedbackChartRef}></canvas></div></div>
                    <div className="col-md-6"><div className="card glass p-3"><h6>System Health</h6><canvas ref={healthChartRef}></canvas></div></div>
                  </div>
                </>
              ) : activePage === 'users' ? (
                <>
                  <h2 className="text-xl font-bold mb-4">👥 Users</h2>
                  <div className="mb-3 d-flex">
                    <input type="text" className="form-control me-2" placeholder="New username" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
                    <select className="form-select me-2" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button onClick={addNewUser} className="btn btn-primary">Add</button>
                  </div>
                  <table className="table table-hover glass">
                    <thead>
                      <tr><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.role}</td>
                          <td>{u.online ? '🟢 Online' : '⚫ Offline'}</td>
                          <td>
                            <button onClick={() => setViewUser(u)} className="btn btn-sm btn-outline-info me-1">View</button>
                            <button onClick={() => deleteUser(u.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {viewUser && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">User: {viewUser.name}</h5>
                            <button className="btn-close" onClick={() => setViewUser(null)}></button>
                          </div>
                          <div className="modal-body">
                            <p><strong>Role:</strong> {viewUser.role}</p>
                            <p><strong>Status:</strong> {viewUser.online ? 'Online' : 'Offline'}</p>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewUser(null)}>Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
                </>
              ) : activePage === 'reports' ? (
                <>
                  <h2 className="text-xl font-bold mb-4">📑 Reports </h2>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4"><div className="card glass p-3"><h6>Bar Chart - Sales by Day</h6><canvas ref={barChartRef}></canvas></div></div>
                    <div className="col-md-4"><div className="card glass p-3"><h6>Line Chart - User Signups</h6><canvas ref={lineChartRef}></canvas></div></div>
                    <div className="col-md-4"><div className="card glass p-3"><h6>Pie Chart - Inquiry Types</h6><canvas ref={pieChartRef}></canvas></div></div>
                  </div>
                </>
              ) : activePage === 'logs' ? (
                <>
                  <h2 className="text-xl font-bold mb-4">📜 Logs</h2>
                  <div className="mb-4">
                    <h6>Login History</h6>
                    <table className="table glass">
                      <thead><tr><th>User</th><th>Time</th><th>Success</th></tr></thead>
                      <tbody>
                        {loginHistory.map((log, idx) => (
                          <tr key={idx}>
                            <td>{log.user}</td>
                            <td>{log.time}</td>
                            <td>{log.success ? '✅' : '❌'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-4">
                    <h6>IP Address Log</h6>
                    <table className="table glass">
                      <thead><tr><th>User</th><th>IP</th><th>Time</th></tr></thead>
                      <tbody>
                        {ipLogs.map((log, idx) => (
                          <tr key={idx}>
                            <td>{log.user}</td>
                            <td>{log.ip}</td>
                            <td>{log.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-4">
                    <h6>Failed Login Attempts</h6>
                    <table className="table glass">
                      <thead><tr><th>User</th><th>Time</th><th>Reason</th></tr></thead>
                      <tbody>
                        {failedLogins.map((log, idx) => (
                          <tr key={idx}>
                            <td>{log.user}</td>
                            <td>{log.time}</td>
                            <td>{log.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-4">
                    <h6>Activity Logs</h6>
                    <table className="table glass">
                      <thead><tr><th>User</th><th>Page</th><th>Action</th><th>Time</th></tr></thead>
                      <tbody>
                        {activityLogs.map((log, idx) => (
                          <tr key={idx}>
                            <td>{log.user}</td>
                            <td>{log.page}</td>
                            <td>{log.action}</td>
                            <td>{log.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : activePage === "Todo" ? (
              <div>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">📝 Todo</h2>

              <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
              <input type="text" placeholder="Task title" className="border p-2 rounded w-full mb-2" />
              <input type="text" placeholder="Task description" className="border p-2 rounded w-full mb-2" />
              <input type="date" className="border p-2 rounded w-full mb-2" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Add Task</button>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">Active</span>

              <select
                className="border rounded p-2"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Task
              </button>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">
            Active
            </span>
              )){'}'}
              </div>
              <table className="table glass">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assigned To</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, idx) => (
                  <tr key={idx}>
                    <td>{task.title}</td>
                    <td>{task.assignedTo || "Unassigned"}</td>
                    <td>{task.due}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
              ) : (
                  <h2 className="text-xl font-bold">🚧 Coming soon: {activePage}</h2>
        )
      }</div>
      </div>
    </>
    )
}
)
</div>
)}



