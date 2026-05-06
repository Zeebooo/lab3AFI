import React, { useState, useEffect} from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './ChatRoom';
import ChatBox from './ChatBox';
import UserPanel from './UserPanel';

const ChatHome = () => {
    const [connection, setConnection] = useState(null);
    const [usermessages, setUserMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [chatRoom, setChatRoom] = useState('');
	const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectionState, setConnectionState] = useState('disconnected');
	const [userList, setUserList] = useState([]);
    const [typingUser, setTypingUser] = useState(null);

    const joinChatRoom = async (userName, chatRoom, role) => {
        setLoading(true);
        setConnectionState('connecting');
        try {
            const newConnection = new HubConnectionBuilder()
                .withUrl("http://localhost:5217/chat")
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            newConnection.on("ReceiveMessage", (user, message, role) => {
                setUserMessages(prev => [...prev, { user, message, role }].slice(-100));
            });

            newConnection.on("UpdateUserList", (users) => {
                setUserList(users);
            });

            newConnection.on("UserTyping", (user) => {
                setTypingUser(user);
                setTimeout(() => setTypingUser(null), 2000);
            });

            newConnection.onclose(() => {
                setConnection(null);
                setUserMessages([]);
                setUserList([]);
                setConnectionState('disconnected');
            });

            newConnection.onreconnecting(() => setConnectionState('connecting'));
            newConnection.onreconnected(() => setConnectionState('connected'));

            await newConnection.start();
            await newConnection.invoke("JoinChatRoom", userName, chatRoom, role);
            setConnection(newConnection);
            setConnectionState('connected');
        } catch (e) {
            console.error("Kunde inte ansluta:", e);
            setConnectionState('error');
        }
        setLoading(false);
    };

    const leaveRoom = async () => {
        if (connection) {
            await connection.stop();
        }
    };

    const sendMessage = async (message) => {
        if (connection) {
            await connection.invoke("SendMessage", chatRoom, userName, message, role);
        }
    };

    const onTyping = (stopped = false) => {
        if (connection && !stopped) {
            connection.invoke("Typing", chatRoom, userName);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1a202c' }}>
            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <p style={{ color: 'white', textAlign: 'center' }}>Ansluter...</p>
                ) : connection ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', padding: '0.5rem 1rem', background: '#2d3748' }}>
                            <button onClick={leaveRoom} style={{ background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>
                                Lämna rum
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <ChatRoom usermessages={usermessages} />
                                <ChatBox sendMessage={sendMessage} role={role} chatRoom={chatRoom} userName={userName} onTyping={onTyping} />
                            </div>
                            <UserPanel userList={userList} typingUser={typingUser} />
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {connectionState === 'error' && (
                                <p style={{ color: 'red', margin: 0 }}>Kunde inte ansluta. Försök igen.</p>
                            )}
                            <input
                                type="text"
                                placeholder="Ditt namn"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
							<input
								type="text"
								placeholder="Roll (t.ex. admin, user)"
								value={role}
								onChange={(e) => setRole(e.target.value)}
							/>
                            <input
                                type="text"
                                placeholder="Chattrum"
                                value={chatRoom}
                                onChange={(e) => setChatRoom(e.target.value)}
                            />
                            <button onClick={() => joinChatRoom(userName, chatRoom, role)}>
                                Gå med
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChatHome;
