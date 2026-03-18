import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    Layout as LayoutIcon,
    FolderKanban,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    User as UserIcon
} from 'lucide-react';

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";
        try {
            const clsData = JSON.parse(localStorage.getItem(`persist:${storageKey}`) || "{}");
            const parsedData = clsData?.loginReducer ? JSON.parse(clsData.loginReducer) : {};
            setUser(parsedData?.user);
        } catch (e) {
            console.error("Error parsing storage data", e);
        }
    }, []);

    const handleLogout = () => {
        const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";
        localStorage.removeItem(`persist:${storageKey}`);
        window.location.href = '/login';
    };

    const navItems = [
        { label: 'Dashboard', icon: <LayoutIcon size={20} />, path: '/dashboard' },
        { label: 'Projects', icon: <FolderKanban size={20} />, path: '/dashboard' }, // For now, both lead to dashboard
    ];

    const sidebarWidth = isSidebarCollapsed ? '80px' : '260px';

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f4f5f7', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                backgroundColor: '#091e42',
                color: 'white',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                zIndex: 100
            }}>
                {/* Sidebar Header */}
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    height: '64px',
                    boxSizing: 'border-box'
                }}>
                    {!isSidebarCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ backgroundColor: 'var(--blue-primary)', padding: '0.4rem', borderRadius: '0.4rem' }}>
                                <FolderKanban size={20} />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.5px' }}>DupleBoard</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#a5adba',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Sidebar Nav */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', marginTop: '1rem' }}>
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => item.path !== '#' && navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.85rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: item.path === '#' ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                                marginBottom: '0.25rem',
                                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: location.pathname === item.path ? 'white' : '#a5adba',
                                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
                            }}
                            onMouseEnter={(e) => {
                                if (location.pathname !== item.path) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (location.pathname !== item.path) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#a5adba';
                                }
                            }}
                        >
                            {item.icon}
                            {!isSidebarCollapsed && <span style={{ fontWeight: '500' }}>{item.label}</span>}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer (User Info) */}
                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--blue-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                        }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {!isSidebarCollapsed && (
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#a5adba', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.role}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Navbar */}
                <header style={{
                    height: '64px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #dfe1e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    zIndex: 90
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#f4f5f7',
                            borderRadius: '0.4rem',
                            padding: '0.4rem 0.75rem',
                            width: '100%',
                            maxWidth: '400px',
                            border: '1px solid transparent',
                            transition: 'all 0.2s'
                        }}
                            onFocusCapture={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = 'var(--blue-primary)';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)';
                            }}
                            onBlurCapture={(e) => {
                                e.currentTarget.style.backgroundColor = '#f4f5f7';
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <Search size={18} color="#5e6c84" />
                            <input
                                type="text"
                                placeholder="Search tasks, projects..."
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    paddingLeft: '0.75rem',
                                    width: '100%',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button style={{ background: 'none', border: 'none', color: '#42526e', cursor: 'pointer', position: 'relative' }}>
                            <Bell size={20} />
                            <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
                        </button>
                        <div style={{ width: '1px', height: '24px', backgroundColor: '#dfe1e6' }}></div>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                border: '1px solid #dfe1e6',
                                borderRadius: '0.4rem',
                                backgroundColor: 'white',
                                color: '#42526e',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f5f7'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
