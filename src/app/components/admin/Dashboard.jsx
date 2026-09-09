import React, { useState } from 'react';
import { HiHome, HiFolder, HiUsers, HiShoppingBag, HiChartBar, HiNewspaper, HiServer, HiLogout, HiMenuAlt2, HiX, HiTrendingUp, HiCurrencyDollar, HiPlus, HiTrash, HiPencil, HiStar } from 'react-icons/hi';

const menuItems = [
  { name: "Dashboard", icon: HiHome, id: "dashboard", href: "#dashboard" },
  { name: "Projects", icon: HiFolder, id: "projects", href: "#projects" },
  { name: "Blog", icon: HiNewspaper, id: "blog", href: "#blog" },
  { name: "Users", icon: HiUsers, id: "users", href: "#users" },
  { name: "Store", icon: HiShoppingBag, id: "store", href: "#store" },
  { name: "Server", icon: HiServer, id: "server", href: "#server" },
  { name: "Analytics", icon: HiChartBar, id: "analytics", href: "#analytics" },
];

const stats = [
  { title: "Total Pendapatan", value: "Rp 45.800.000", change: "+12.5%", icon: HiCurrencyDollar },
  { title: "Pengguna Baru", value: "1,240", change: "+8.2%", icon: HiUsers },
  { title: "Proyek Aktif", value: "34", change: "+4.1%", icon: HiFolder },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // States untuk data dinamis
  const [projects, setProjects] = useState([
    { id: 1, name: "Portfolio Website v3", category: "React / Tailwind", status: "Completed", deadline: "12 Des 2026", progress: 100 },
    { id: 2, name: "E-Commerce Store API", category: "Node.js / Express", status: "In Progress", deadline: "25 Sep 2026", progress: 75 }
  ]);

  const [blogs, setBlogs] = useState([
    { id: 1, title: "Membangun Full-Stack App dengan React & Node.js", date: "01 Sep 2026", status: "Published" },
    { id: 2, title: "Optimasi Performa Web Menggunakan Tailwind CSS", date: "28 Agu 2026", status: "Draft" }
  ]);

  const [usersList, setUsersList] = useState([
    { id: 1, name: "Budi Santoso", email: "budi@example.com", role: "Admin" },
    { id: 2, name: "Siti Rahma", email: "siti@example.com", role: "Editor" }
  ]);

  const [storeItems, setStoreItems] = useState([
    { id: 1, name: "Mechanical Keyboard", price: "Rp 1.250.000", stock: 12, rating: 4.8, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "Mousepad Minimalis", price: "Rp 150.000", stock: 45, rating: 4.5, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60" }
  ]);

  const [servers, setServers] = useState([
    { id: 1, name: "SG-Node-01 (Singapore)", ip: "128.199.204.10", cpu: 85, ram: 90 },
    { id: 2, name: "JKT-Node-02 (Jakarta)", ip: "103.150.188.4", cpu: 0, ram: 0 },
    { id: 3, name: "US-Node-03 (Ohio)", ip: "192.241.140.21", cpu: 25, ram: 30 },
    { id: 4, name: "ID-Node-04 (Surabaya)", ip: "103.247.202.1", cpu: 0, ram: 25 }
  ]);

  // Form input states
  const [formData, setFormData] = useState({ title: '', category: '', email: '', price: '', stock: '', rating: '', image: '', ip: '', cpu: '', ram: '' });

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({ title: '', category: '', email: '', price: '', stock: '', rating: '', image: '', ip: '', cpu: '', ram: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditId(item.id);
    if (activeMenu === 'projects') {
      setFormData({ title: item.name, category: item.category, email: '', price: '', stock: '', rating: '', image: '', ip: '', cpu: '', ram: '' });
    } else if (activeMenu === 'blog') {
      setFormData({ title: item.title, category: '', email: '', price: '', stock: '', rating: '', image: '', ip: '', cpu: '', ram: '' });
    } else if (activeMenu === 'users') {
      setFormData({ title: item.name, category: '', email: item.email, price: '', stock: '', rating: '', image: '', ip: '', cpu: '', ram: '' });
    } else if (activeMenu === 'store') {
      setFormData({ title: item.name, category: '', email: '', price: item.price, stock: item.stock, rating: item.rating, image: item.image, ip: '', cpu: '', ram: '' });
    } else if (activeMenu === 'server') {
      setFormData({ title: item.name, category: '', email: '', price: '', stock: '', rating: '', image: '', ip: item.ip, cpu: item.cpu, ram: item.ram });
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (activeMenu === 'projects') setProjects(projects.filter(p => p.id !== id));
    else if (activeMenu === 'blog') setBlogs(blogs.filter(b => b.id !== id));
    else if (activeMenu === 'users') setUsersList(usersList.filter(u => u.id !== id));
    else if (activeMenu === 'store') setStoreItems(storeItems.filter(s => s.id !== id));
    else if (activeMenu === 'server') setServers(servers.filter(srv => srv.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title && activeMenu !== 'server') return;
    if (activeMenu === 'server' && !formData.ip) return;

    if (editId) {
      if (activeMenu === 'projects') {
        setProjects(projects.map(p => p.id === editId ? { ...p, name: formData.title, category: formData.category || p.category } : p));
      } else if (activeMenu === 'blog') {
        setBlogs(blogs.map(b => b.id === editId ? { ...b, title: formData.title } : b));
      } else if (activeMenu === 'users') {
        setUsersList(usersList.map(u => u.id === editId ? { ...u, name: formData.title, email: formData.email || u.email } : u));
      } else if (activeMenu === 'store') {
        setStoreItems(storeItems.map(s => s.id === editId ? { ...s, name: formData.title, price: formData.price || s.price, stock: formData.stock || s.stock, rating: formData.rating || s.rating, image: formData.image || s.image } : s));
      } else if (activeMenu === 'server') {
        setServers(servers.map(srv => srv.id === editId ? { ...srv, name: formData.title || srv.name, ip: formData.ip || srv.ip, cpu: Number(formData.cpu) || 0, ram: Number(formData.ram) || 0 } : srv));
      }
    } else {
      if (activeMenu === 'projects') {
        setProjects([{ id: Date.now(), name: formData.title, category: formData.category || 'General', status: 'Planning', deadline: '30 Des 2026', progress: 0 }, ...projects]);
      } else if (activeMenu === 'blog') {
        setBlogs([{ id: Date.now(), title: formData.title, date: 'Hari Ini', status: 'Published' }, ...blogs]);
      } else if (activeMenu === 'users') {
        setUsersList([{ id: Date.now(), name: formData.title, email: formData.email || 'user@example.com', role: 'Member' }, ...usersList]);
      } else if (activeMenu === 'store') {
        setStoreItems([{ 
          id: Date.now(), 
          name: formData.title, 
          price: formData.price || 'Rp 100.000', 
          stock: formData.stock || 10, 
          rating: formData.rating || 5.0, 
          image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' 
        }, ...storeItems]);
      } else if (activeMenu === 'server') {
        setServers([{
          id: Date.now(),
          name: formData.title || 'New Server Node',
          ip: formData.ip || '192.168.1.1',
          cpu: Number(formData.cpu) || 0,
          ram: Number(formData.ram) || 0
        }, ...servers]);
      }
    }

    setShowModal(false);
    setFormData({ title: '', category: '', email: '', price: '', stock: '', rating: '', image: '', ip: '', cpu: '', ram: '' });
  };

  // Helper function untuk menghitung status server secara terpusat
  const getServerStatusInfo = (cpu, ram) => {
    const isOffline = cpu === 0 && ram === 0;
    const isMaintenance = (cpu === 0 && ram > 10) || (ram === 0 && cpu > 10);
    const isOnline = cpu > 80 && ram > 80;
    const isWarm = cpu < 40 && ram < 40;

    if (isOffline) {
      return { status: "Offline", uptime: "0%", badge: "bg-red-500/10 text-red-400" };
    } else if (isMaintenance) {
      return { status: "Maintenance", uptime: "0%", badge: "bg-amber-500/10 text-amber-400" };
    } else if (isOnline) {
      return { status: "Online", uptime: "99.9%", badge: "bg-emerald-500/10 text-emerald-400" };
    } else if (isWarm) {
      return { status: "Warm", uptime: "98.5%", badge: "bg-blue-500/10 text-blue-400" };
    } else {
      return { status: "Normal", uptime: "99.0%", badge: "bg-purple-500/10 text-purple-400" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      
      {/* Sidebar Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              mfikria<span className="text-pink-500">.</span> <span className="text-[10px] text-gray-500 font-normal">Admin</span>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white cursor-pointer">
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveMenu(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer no-underline ${
                    isActive 
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-pink-400 group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
          <HiLogout className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 text-pink-400 flex items-center justify-center cursor-pointer"
            >
              <HiMenuAlt2 className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white capitalize">{activeMenu} Management</h2>
              <p className="text-xs text-gray-400">Kelola data {activeMenu} dengan fitur lengkap.</p>
            </div>
          </div>

          {activeMenu !== 'dashboard' && activeMenu !== 'analytics' && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
            >
              <HiPlus className="w-4 h-4" />
              <span>Tambah {activeMenu.slice(0, -1)}</span>
            </button>
          )}

          {activeMenu === 'dashboard' && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-pink-600/20">
              A
            </div>
          )}
        </div>

        {/* Dynamic Content Views */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 p-5 rounded-2xl shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">{stat.title}</span>
                      <div className="w-8 h-8 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-bold text-white">{stat.value}</h3>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <HiTrendingUp className="w-3 h-3" /> {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeMenu === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 p-5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleOpenEditModal(project)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"><HiPencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(project.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer"><HiTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                    <span>Progres</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'blog' && (
          <div className="space-y-3">
            {blogs.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-white">{post.title}</h4>
                  <span className="text-[10px] text-gray-500">{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400">{post.status}</span>
                  <button onClick={() => handleOpenEditModal(post)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"><HiPencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer"><HiTrash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'users' && (
          <div className="space-y-3">
            {usersList.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name}</h4>
                  <span className="text-[10px] text-gray-500">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-400">{user.role}</span>
                  <button onClick={() => handleOpenEditModal(user)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"><HiPencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(user.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer"><HiTrash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'store' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeItems.map((item) => (
              <div key={item.id} className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-3">
                <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-xl border border-gray-800" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="text-pink-400 text-xs font-bold">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                    <HiStar className="w-3 h-3" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[10px] text-gray-400">
                  <span>Stok: <strong className="text-white">{item.stock}</strong></span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"><HiPencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer"><HiTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'server' && (
          <div className="space-y-6">
            {/* Grafik Server Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {servers.map((srv) => {
                const info = getServerStatusInfo(srv.cpu, srv.ram);

                return (
                  <div key={srv.id} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 p-5 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                        <span className="text-[10px] text-gray-500">{srv.ip}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${info.badge}`}>
                        {info.status}
                      </span>
                    </div>

                    {/* CPU Usage Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                        <span>CPU Usage</span>
                        <span>{srv.cpu}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                        <div className={`h-full rounded-full ${srv.cpu > 80 ? 'bg-emerald-500' : srv.cpu < 40 ? 'bg-blue-500' : 'bg-pink-600'}`} style={{ width: `${srv.cpu}%` }} />
                      </div>
                    </div>

                    {/* RAM Usage Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                        <span>RAM Usage</span>
                        <span>{srv.ram}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                        <div className={`h-full rounded-full ${srv.ram > 80 ? 'bg-emerald-500' : srv.ram < 40 ? 'bg-blue-500' : 'bg-purple-500'}`} style={{ width: `${srv.ram}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table Server Section */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Infrastruktur Server</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500">
                      <th className="pb-3 font-semibold">Nama Node</th>
                      <th className="pb-3 font-semibold">Alamat IP</th>
                      <th className="pb-3 font-semibold">Server Up</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-gray-300">
                    {servers.map((srv) => {
                      const info = getServerStatusInfo(srv.cpu, srv.ram);

                      return (
                        <tr key={srv.id}>
                          <td className="py-3 font-medium text-white">{srv.name}</td>
                          <td className="py-3 font-mono text-[11px] text-gray-400">{srv.ip}</td>
                          <td className="py-3 font-semibold text-white">{info.uptime}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${info.badge}`}>
                              {info.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleOpenEditModal(srv)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"><HiPencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDelete(srv.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer"><HiTrash className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'analytics' && (
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-12 text-center space-y-3">
            <h3 className="text-sm font-bold text-white">Analitik Pengunjung & Traffic</h3>
            <p className="text-xs text-gray-400">Statistik pengunjung bulanan menunjukkan peningkatan sebesar 24% dari bulan lalu.</p>
          </div>
        )}

      </main>

      {/* Modal Form Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{editId ? 'Edit Data' : 'Tambah Data Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">{activeMenu === 'server' ? 'Nama Node Server' : 'Nama / Judul'}</label>
                <input
                  type="text"
                  required={activeMenu !== 'server'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={activeMenu === 'server' ? 'SG-Node-01' : 'Masukkan judul atau nama...'}
                  className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                />
              </div>

              {activeMenu === 'projects' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Mis: React / Tailwind"
                    className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}

              {activeMenu === 'users' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}

              {activeMenu === 'store' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Harga</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Rp 100.000"
                      className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Stok</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="10"
                        className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        placeholder="4.8"
                        className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">URL Gambar</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </>
              )}

              {activeMenu === 'server' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Alamat IP</label>
                    <input
                      type="text"
                      required
                      value={formData.ip}
                      onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                      placeholder="128.199.xxx.xxx"
                      className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">CPU (%)</label>
                      <input
                        type="number"
                        value={formData.cpu}
                        onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                        placeholder="45"
                        className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking- dan RAM (%)</label">
                        Ram(%)
                        </label>
                      <input
                        type="number"
                        value={formData.ram}
                        onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                        placeholder="60"
                        className="w-full h-10 bg-gray-950 border border-gray-800 rounded-xl px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full h-10 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
              >
                {editId ? 'Simpan Perubahan' : 'Tambahkan'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}