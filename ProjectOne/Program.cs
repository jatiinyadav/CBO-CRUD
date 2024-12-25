using HotChocolate.Subscriptions;
using Microsoft.Net.Http.Headers;
using ProjectOne.Model;
using ProjectOne.Query;
using TableDependency.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<GetDataFromDB>();
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddInMemorySubscriptions();

builder.Services.AddHostedService(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("MySqlConnection");
    var eventSender = sp.GetRequiredService<ITopicEventSender>();
    return new ChangeTrackingService(connectionString, eventSender);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("apollographql-client-version")
              .AllowCredentials();
    });
});


builder.Services.AddAuthorization();

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowAngularApp");

app.UseWebSockets();

app.MapGraphQL();

app.Run();
