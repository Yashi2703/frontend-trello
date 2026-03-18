import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '../api/projectService';
import { getTasksByProjectId, updateTaskStatus } from '../api/taskService';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import { Plus, ChevronLeft, Calendar, Users as UsersIcon, Info } from 'lucide-react';
import { initSocket, joinProjectRoom } from '../api/socket';

const ProjectDetail = () => {
    // ... existing setup ...
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [user, setUser] = useState(null);

    const statuses = [
        { id: 'todo', label: 'To Do', color: '#4c9aff' },
        { id: 'inprogress', label: 'In Progress', color: '#f59e0b' },
        { id: 'review', label: 'Review', color: '#8b5cf6' },
        { id: 'done', label: 'Done', color: '#36b37e' }
    ];

    useEffect(() => {
        const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";
        try {
            const clsData = JSON.parse(localStorage.getItem(`persist:${storageKey}`) || "{}");
            const parsedData = clsData?.loginReducer ? JSON.parse(clsData.loginReducer) : {};
            setUser(parsedData?.user);
        } catch (e) {
            console.error("Error parsing storage data", e);
        }
        fetchProjectData();

        // Socket integration
        const socket = initSocket();
        joinProjectRoom(id);

        socket.on('taskCreated', (newTask) => {
            setTasks(prev => [...prev, newTask]);
        });

        socket.on('taskStatusUpdated', (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        });

        socket.on('taskDeleted', (taskId) => {
            setTasks(prev => prev.filter(t => t._id !== taskId));
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskStatusUpdated');
            socket.off('taskDeleted');
        };
    }, [id]);

    const fetchProjectData = async () => {
        setLoading(true);
        try {
            const [projectRes, tasksRes] = await Promise.all([
                getProjectById(id),
                getTasksByProjectId(id)
            ]);
            setProject(projectRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error('Error fetching project data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskDetailOpen(true);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            // fetchProjectData(); // No longer needed thanks to sockets!
        } catch (err) {
            console.error('Error updating task status', err);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><p style={{ color: '#5e6c84' }}>Loading project board...</p></div>;
    if (!project) return <div style={{ textAlign: 'center', padding: '5rem' }}><p style={{ color: '#ef4444', fontWeight: '600' }}>Project not found.</p></div>;

    const isAdmin = user?.role === 'admin';

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Project Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#5e6c84',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            padding: 0,
                            marginBottom: '0.75rem'
                        }}
                    >
                        <ChevronLeft size={16} />
                        Back to Projects
                    </button>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#172b4d', fontWeight: '800' }}>{project.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5e6c84', fontSize: '0.9rem' }}>
                            <Info size={16} />
                            <span>{project.description}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5e6c84', fontSize: '0.9rem' }}>
                            <UsersIcon size={16} />
                            <span>{project.members?.length || 0} Members</span>
                        </div>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
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
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        <Plus size={18} />
                        Create Task
                    </button>
                )}
            </div>

            {/* Kanban Board */}
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '2rem',
                minHeight: 'calc(100vh - 250px)',
                alignItems: 'flex-start'
            }}>
                {statuses.map(status => {
                    const statusTasks = tasks.filter(t => t.status === status.id);
                    return (
                        <div
                            key={status.id}
                            style={{
                                minWidth: '320px',
                                width: '320px',
                                backgroundColor: '#f4f5f7',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '100%',
                                border: '1px solid #dfe1e6'
                            }}
                        >
                            <div style={{
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: `3px solid ${status.color}`
                            }}>
                                <h4 style={{
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#42526e',
                                    fontWeight: '700'
                                }}>
                                    {status.label}
                                </h4>
                                <span style={{
                                    backgroundColor: 'white',
                                    fontSize: '0.75rem',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '1rem',
                                    color: '#42526e',
                                    fontWeight: '700',
                                    border: '1px solid #dfe1e6'
                                }}>
                                    {statusTasks.length}
                                </span>
                            </div>

                            <div style={{
                                padding: '0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                overflowY: 'auto'
                            }}>
                                {statusTasks.map(task => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleTaskClick(task)}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: '1rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #dfe1e6',
                                            boxShadow: '0 1px 2px rgba(9, 30, 66, 0.08)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 8px -2px rgba(9, 30, 66, 0.25)';
                                            e.currentTarget.style.borderColor = '#c1c7d0';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 1px 2px rgba(9, 30, 66, 0.08)';
                                            e.currentTarget.style.borderColor = '#dfe1e6';
                                        }}
                                    >
                                        <h5 style={{ margin: '0 0 0.75rem 0', color: '#172b4d', fontSize: '0.95rem', fontWeight: '600' }}>{task.title}</h5>
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: '#5e6c84',
                                            marginBottom: '1rem',
                                            lineHeight: '1.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {task.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: '#deebff',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                color: '#0747a6',
                                                fontSize: '0.75rem',
                                                fontWeight: '700'
                                            }}>
                                                <div style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--blue-primary)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.65rem'
                                                }}>
                                                    {task.assignedTo?.name?.charAt(0) || 'U'}
                                                </div>
                                                {task.assignedTo?.name || 'Unassigned'}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {statusTasks.length === 0 && (
                                    <div style={{
                                        padding: '2rem 1rem',
                                        textAlign: 'center',
                                        color: '#a5adba',
                                        fontSize: '0.85rem',
                                        fontStyle: 'italic',
                                        border: '1px dashed #dfe1e6',
                                        borderRadius: '0.5rem'
                                    }}>
                                        No tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                projectId={id}
                onTaskCreated={() => { }} // Sockets will update the list
                members={project.members}
            />

            <TaskDetailModal
                isOpen={isTaskDetailOpen}
                onClose={() => setIsTaskDetailOpen(false)}
                task={selectedTask}
                onUpdate={() => { }} // Sockets will update the task
                isAdmin={isAdmin}
            />
        </div>
    );
};

export default ProjectDetail;
