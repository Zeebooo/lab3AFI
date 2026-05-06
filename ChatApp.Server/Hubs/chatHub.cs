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

		public async Task JoinChatRoom(string userName, string chatRoom, string role)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom);
			_sharedDb.Connection[Context.ConnectionId] = new UserConnection
			{
				UserName = userName,
				ChatRoom = chatRoom,
				Role = role.ToLower()
			};

			await Clients.Group(chatRoom).SendAsync("ReceiveMessage", "admin", $"{userName} med roll {role.ToLower()} har gått med i {chatRoom}");
			await UpdateUserList(chatRoom);
		}

		public async Task SendMessage(string chatRoom, string userName, string message, string role)
		{
			role = role.ToLower();
			await Clients.Group(chatRoom).SendAsync("ReceiveMessage", userName, message, role);
		}

		public async Task UpdateUserList(string chatRoom)
		{
			var usersInRoom = _sharedDb.Connection.Values
				.Where(c => c.ChatRoom == chatRoom)
				.Select(c => new { c.UserName, c.Role })
				.ToList();

			await Clients.Group(chatRoom).SendAsync("UpdateUserList", usersInRoom);
		}

		public async Task Typing(string chatRoom, string userName)
		{
			await Clients.OthersInGroup(chatRoom).SendAsync("UserTyping", userName);
		}


		public override async Task OnDisconnectedAsync(Exception? exception)
		{
			if (_sharedDb.Connection.TryGetValue(Context.ConnectionId, out var userConnection))
			{
				_sharedDb.Connection.TryRemove(Context.ConnectionId, out _);
				await Clients.Group(userConnection.ChatRoom).SendAsync(
					"ReceiveMessage", "admin",
					$"{userConnection.UserName} har lämnat rummet"
				);
				await UpdateUserList(userConnection.ChatRoom);
			}
			await base.OnDisconnectedAsync(exception);
		}
	}
}