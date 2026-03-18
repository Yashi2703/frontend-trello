import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

const UserSelect = ({
    options = [],
    value = [],
    onChange,
    placeholder = "Select users...",
    isMulti = true,
    label = "Select Members"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optionId) => {
        if (isMulti) {
            const newValue = value.includes(optionId)
                ? value.filter(id => id !== optionId)
                : [...value, optionId];
            onChange(newValue);
        } else {
            onChange(optionId);
            setIsOpen(false);
        }
    };

    const removeOption = (e, optionId) => {
        e.stopPropagation();
        onChange(value.filter(id => id !== optionId));
    };

    const getSelectedNames = () => {
        if (isMulti) {
            return options.filter(opt => value.includes(opt._id));
        }
        return options.find(opt => opt._id === value);
    };

    const selectedUsers = getSelectedNames();

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#42526e', fontSize: '0.9rem' }}>
                {label}
            </label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    minHeight: '42px',
                    padding: '4px 8px',
                    border: isOpen ? '2px solid var(--blue-primary)' : '1px solid #dfe1e6',
                    borderRadius: '0.4rem',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isOpen ? '0 0 0 2px rgba(37, 99, 235, 0.1)' : 'none'
                }}
            >
                {isMulti && selectedUsers.length > 0 ? (
                    selectedUsers.map(user => (
                        <div key={user._id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#deebff',
                            color: '#0747a6',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}>
                            {user.name}
                            <X
                                size={14}
                                style={{ marginLeft: '4px', cursor: 'pointer' }}
                                onClick={(e) => removeOption(e, user._id)}
                            />
                        </div>
                    ))
                ) : !isMulti && selectedUsers ? (
                    <span style={{ fontSize: '0.95rem', color: '#172b4d' }}>{selectedUsers.name}</span>
                ) : (
                    <span style={{ color: '#a5adba', fontSize: '0.95rem', paddingLeft: '4px' }}>{placeholder}</span>
                )}

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: '#5e6c84' }}>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'white',
                    border: '1px solid #dfe1e6',
                    borderRadius: '0.4rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 2000,
                    maxHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid #f4f5f7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={16} color="#5e6c84" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search names or emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '0.9rem',
                                color: '#172b4d'
                            }}
                        />
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => {
                                const isSelected = isMulti
                                    ? value.includes(option._id)
                                    : value === option._id;

                                return (
                                    <div
                                        key={option._id}
                                        onClick={() => toggleOption(option._id)}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: isSelected ? '#f4f5f7' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f5f7'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#f4f5f7' : 'transparent'}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#172b4d' }}>{option.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#5e6c84' }}>{option.email}</span>
                                        </div>
                                        {isSelected && <Check size={16} color="var(--blue-primary)" />}
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#5e6c84', fontSize: '0.9rem' }}>
                                No users found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSelect;
