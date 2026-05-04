import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './ChatRoom';
import ChatBox from './ChatBox';

const ChatHome = () => {
    const [connection, setConnection] = useState(null);
    const [usermessages, setUserMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [chatRoom, setChatRoom] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (user, message) => {
                setUserMessages(prev => [...prev, { user, message }]);
            });

            connection.onclose(() => {
                console.log("Anslutning stängd");
            });
        }
    }, [connection]);

    const joinChatRoom = async (userName, chatRoom) => {
        setLoading(true);
        try {
            const newConnection = new HubConnectionBuilder()
                .withUrl("http://localhost:5217/chat")
                .configureLogging(LogLevel.Information)
                .build();

            await newConnection.start();
            await newConnection.invoke("JoinChatRoom", userName, chatRoom);
            setConnection(newConnection);
        } catch (e) {
            console.error("Kunde inte ansluta:", e);
        }
        setLoading(false);
    };

    const sendMessage = async (message) => {
        if (connection) {
            await connection.invoke("SendMessage", chatRoom, userName, message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1a202c' }}>
            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <p style={{ color: 'white', textAlign: 'center' }}>Ansluter...</p>
                ) : connection ? (
                    <>
                        <ChatRoom usermessages={usermessages} />
                        <ChatBox sendMessage={sendMessage} />
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Ditt namn"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Chattrum"
                                value={chatRoom}
                                onChange={(e) => setChatRoom(e.target.value)}
                            />
                            <button onClick={() => joinChatRoom(userName, chatRoom)}>
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