using Microsoft.AspNetCore.SignalR;
using ChattApp.Server.DataService;
using ChattApp.Server.Models;

namespace ChattApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly SharedDb _sharedDb;

        public ChatHub(SharedDb sharedDb)
        {
            _sharedDb = sharedDb;
        }

        public async Task JoinChatRoom(string userName, string chatRoom)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom);
            _sharedDb.Connection[Context.ConnectionId] = new UserConnection
            {
                UserName = userName,
                ChatRoom = chatRoom
            };

            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", "admin", $"{userName} har gått med i {chatRoom}");
        }

        public async Task SendMessage(string chatRoom, string userName, string message)
        {
            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", userName, message);
        }
    }
}