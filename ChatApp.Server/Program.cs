using ChattApp.Server.Hubs;
using ChattApp.Server.DataService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddSingleton<SharedDb>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("reactapp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("reactapp");
app.MapHub<ChatHub>("/chat");

app.Run();