import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/projectService';
import ProjectModal from '../components/ProjectModal';
import { Plus, FolderKanban } from 'lucide-react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";
        try {
            const clsData = JSON.parse(localStorage.getItem(`persist:${storageKey}`) || "{}");
            const parsedData = clsData?.loginReducer ? JSON.parse(clsData.loginReducer) : {};
            // Fix: In Login.jsx, the user object is stored as 'user' inside loginReducer
            setUser(parsedData?.user);
        } catch (e) {
            console.error("Error parsing storage data", e);
        }
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await getProjects();
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects', err);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FolderKanban size={24} color="#42526e" />
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#172b4d', fontWeight: '700' }}>Your Projects</h3>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            backgroundColor: 'var(--blue-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-primary)'}
                    >
                        <Plus size={18} />
                        New Project
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#5e6c84' }}>Loading projects...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {projects.map(project => (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/project/${project._id}`)}
                            style={{
                                padding: '1.75rem',
                                backgroundColor: 'white',
                                border: '1px solid #dfe1e6',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '180px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = 'var(--blue-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = '#dfe1e6';
                            }}
                        >
                            <div>
                                <h4 style={{ margin: '0 0 1rem 0', color: '#172b4d', fontSize: '1.2rem', fontWeight: '700' }}>{project.name}</h4>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: '#5e6c84',
                                    margin: 0,
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: '1.6'
                                }}>
                                    {project.description || 'No description provided.'}
                                </p>
                            </div>
                            <div style={{
                                marginTop: '1.75rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1.25rem',
                                borderTop: '1px solid #f4f5f7'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#36b37e' }}></div>
                                    <span style={{ fontSize: '0.85rem', color: '#5e6c84', fontWeight: '600' }}>{project.members?.length || 0} Members</span>
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--blue-primary)', fontWeight: '700' }}>Open Board →</span>
                            </div>
                        </div>
                    ))}

                    {/* Create Project Card (Admin Only) */}
                    {isAdmin && (
                        <div
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                padding: '1.75rem',
                                backgroundColor: '#ebf0ff',
                                border: '2px dashed #b3c5ff',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '180px',
                                color: 'var(--blue-primary)',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#deebff';
                                e.currentTarget.style.borderColor = 'var(--blue-primary)';
                                e.currentTarget.style.transform = 'translateY(-6px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ebf0ff';
                                e.currentTarget.style.borderColor = '#b3c5ff';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                backgroundColor: 'white',
                                padding: '1rem',
                                borderRadius: '50%',
                                marginBottom: '1.25rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}>
                                <Plus size={28} />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Create new project</span>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#5e6c84', opacity: 0.8 }}>Add members and scale your team</p>
                        </div>
                    )}
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={fetchProjects}
            />
        </div>
    );
};

export default Dashboard;
