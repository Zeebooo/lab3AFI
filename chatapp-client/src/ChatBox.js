import React, { useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatBox = ({ sendMessage, role, chatRoom, userName, onTyping }) => {
    const isReadOnly = chatRoom.toLowerCase() === 'announcement' && role.toLowerCase() !== 'teacher';
    const [message, setMessage] = useState('');
    const typingTimeout = useRef(null);

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        if (e.target.value.trim()) {
            onTyping();
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => onTyping(true), 2000);
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
            {isReadOnly ? (
                <p style={{ color: 'white', margin: 'auto' }}>Du kan bara läsa i Announcement-rummet.</p>
            ) : (
                <>
                    <textarea
                        rows="1"
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Skriv ett meddelande..."
                        style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '8px', resize: 'none' }}
                    />
                    <button onClick={handleSend} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FiSend size={24} color="white" />
                    </button>
                </>
            )}
        </div>
    );
};

export default ChatBox;
