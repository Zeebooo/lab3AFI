import React, { useRef, useEffect } from 'react';

const ChatRoom = ({ usermessages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [usermessages]);

    return (
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', background: 'white' }}>
            {usermessages.map((msg, index) => (
                <div key={index} style={{
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: msg.user === 'admin' ? '#e2e8f0' : '#bee3f8',
                    borderRadius: '6px'
                }}>
                    <strong>{msg.user}: </strong>{msg.message}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatRoom;