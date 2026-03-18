import React, { useState } from 'react';
import { createTask } from '../api/taskService';
import UserSelect from './common/UserSelect';

const TaskModal = ({ isOpen, onClose, projectId, onTaskCreated, members }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createTask({
                title,
                description,
                projectId,
                assignedTo: assignedTo || undefined
            });
            onTaskCreated();
            onClose();
            setTitle('');
            setDescription('');
            setAssignedTo('');
        } catch (err) {
            setError(err.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ marginBottom: '2rem', color: '#172b4d', fontWeight: '800', textAlign: 'center' }}>Add New Task</h2>
                {error && <p style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.4rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#42526e', fontSize: '0.9rem' }}>Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: '1px solid #dfe1e6',
                                borderRadius: '0.4rem',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            placeholder="What needs to be done?"
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#42526e', fontSize: '0.9rem' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: '1px solid #dfe1e6',
                                borderRadius: '0.4rem',
                                fontSize: '1rem',
                                minHeight: '100px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                resize: 'vertical'
                            }}
                            placeholder="Add more details about this task..."
                        />
                    </div>

                    <UserSelect
                        options={members}
                        value={assignedTo}
                        onChange={setAssignedTo}
                        isMulti={false}
                        label="Assign To"
                        placeholder="Search for a team member..."
                    />

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                border: '1px solid #dfe1e6',
                                borderRadius: '0.4rem',
                                backgroundColor: 'white',
                                color: '#42526e',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.75rem 2rem',
                                border: 'none',
                                borderRadius: '0.4rem',
                                backgroundColor: 'var(--blue-primary)',
                                color: 'white',
                                fontWeight: '700',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
