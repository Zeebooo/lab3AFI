import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatBox = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ padding: '1rem', background: '#6b46c1', display: 'flex', gap: '0.5rem' }}>
            <textarea
                rows="1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Skriv ett meddelande..."
                style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '8px', resize: 'none' }}
            />
            <button onClick={handleSend} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FiSend size={24} color="white" />
            </button>
        </div>
    );
};

export default ChatBox;