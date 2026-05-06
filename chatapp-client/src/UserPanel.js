import React from 'react';

const UserPanel = ({ userList, typingUser }) => {

	return (
		<div style={{ width: '200px', background: '#2d3748', padding: '1rem', overflowY: 'auto' }}>
			<h4 style={{ color: '#a0aec0', margin: '0 0 0.75rem 0', fontSize: '0.8rem', textTransform: 'uppercase' }}>
				Användare ({userList.length})
			</h4>
			{userList.map((user, index) => (
				<div key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<span style={{ color: 'white', fontSize: '0.9rem' }}>
						<span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#68d391', marginRight: 6 }} />
					</span>
					<span style={{ color: 'white', fontSize: '0.9rem' }}>{user.userName}</span>
					<br />
					<small style={{ color: '#a0aec0', fontStyle: 'italic' }}>{user.role}</small>
					{typingUser === user.userName && (
						<small style={{ color: '#68d391', display: 'block' }}>...skriver</small>
					)}
				</div>
			))}
		</div>
	);
};

export default UserPanel;