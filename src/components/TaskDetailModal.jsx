import React, { useState, useEffect } from 'react';
import { getCommentsByTaskId, createComment } from '../api/commentService';
import { updateTaskStatus } from '../api/taskService';

const TaskDetailModal = ({ isOpen, onClose, task, onUpdate, isAdmin }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    const statuses = [
        { id: 'todo', label: 'To Do' },
        { id: 'inprogress', label: 'In Progress' },
        { id: 'review', label: 'Review' },
        { id: 'done', label: 'Done' }
    ];

    useEffect(() => {
        if (isOpen && task) {
            fetchComments();
        }
    }, [isOpen, task]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await getCommentsByTaskId(task._id);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments', err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateTaskStatus(task._id, newStatus);
            onUpdate();
            onClose();
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmittingComment(true);
        try {
            await createComment({ taskId: task._id, text: newComment });
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Error adding comment', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (!isOpen || !task) return null;

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
                padding: '2rem',
                borderRadius: '0.8rem',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--blue-primary)' }}>{task.title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Description</h4>
                    <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>{task.description || 'No description provided.'}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Status</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {statuses.map(s => (
                            <button
                                key={s.id}
                                disabled={!isAdmin && task.status !== s.id}
                                onClick={() => handleStatusChange(s.id)}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '1rem',
                                    border: '1px solid ' + (task.status === s.id ? 'var(--blue-primary)' : 'var(--gray-border)'),
                                    backgroundColor: task.status === s.id ? 'var(--blue-primary)' : 'white',
                                    color: task.status === s.id ? 'white' : '#4b5563',
                                    fontSize: '0.85rem',
                                    cursor: isAdmin ? 'pointer' : 'default',
                                    opacity: !isAdmin && task.status !== s.id ? 0.5 : 1
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    {!isAdmin && <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>Only admins can change status.</small>}
                </div>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Comments</h4>

                    <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={isAdmin ? "Add a comment as Admin..." : "Add a comment..."}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--gray-border)',
                                borderRadius: '0.4rem',
                                minHeight: '60px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button
                                type="submit"
                                disabled={submittingComment || !newComment.trim()}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'var(--blue-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {submittingComment ? 'Sending...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loadingComments ? (
                            <p>Loading comments...</p>
                        ) : comments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>No comments yet.</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment._id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{comment.userId?.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
