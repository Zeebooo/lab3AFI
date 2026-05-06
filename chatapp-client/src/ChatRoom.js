import React, { useRef, useEffect } from 'react';

const getRoleColor = (msg) => {
	if (msg.user.toLowerCase() === 'admin') return '#e2e8f0';
	if (msg.role.toLowerCase() === 'teacher') return '#c6f6d5';
	if (msg.role.toLowerCase() === 'student') return '#fefcbf';
	return '#FFCC01';
};

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
					backgroundColor: getRoleColor(msg),
					borderRadius: '6px'
				}}>
					<div><strong>{msg.user}</strong> <small style={{ color: '#555', fontStyle: 'italic' }}>{msg.role}</small></div>
					<div>{msg.message}</div>
				</div>
			))}
			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatRoom;