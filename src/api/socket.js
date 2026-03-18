import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io(socketUrl);

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
    }
    return socket;
};

export const joinProjectRoom = (projectId) => {
    if (socket) {
        socket.emit('joinProject', projectId);
    }
};

export const getSocket = () => socket;
