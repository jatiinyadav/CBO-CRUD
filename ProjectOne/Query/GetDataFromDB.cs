using HotChocolate.Subscriptions;
using Microsoft.Data.SqlClient;
using ProjectOne.Model;

namespace ProjectOne.Query
{
    public class GetDataFromDB
    {
        private readonly string _connectionString;
        private readonly ITopicEventSender _eventSender;

        public GetDataFromDB(IConfiguration configuration, ITopicEventSender eventSender)
        {
            _eventSender = eventSender;
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        public async Task<int> InsertedUserAsync(UserChangePayload user)
        {
            const string query = "INSERT INTO UserDetails (Name, Email, IsActive) VALUES (@Name, @Email, @IsActive); SELECT SCOPE_IDENTITY();";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Name", user.User.Name);
                    command.Parameters.AddWithValue("@Email", user.User.Email);
                    command.Parameters.AddWithValue("@IsActive", user.User.IsActive);

                    await connection.OpenAsync();
                    var result = await command.ExecuteScalarAsync();

                    // Send the inserted user data to subscribers
                    await _eventSender.SendAsync("OnUserAdded", user);

                    // SCOPE_IDENTITY() returns the last inserted identity value
                    return Convert.ToInt32(result);
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., log the error)
                Console.WriteLine($"Error inserting user: {ex.Message}");
                throw;
            }
        }


        public async Task<List<User>> GetUsersAsync()
        {
            var users = new List<User>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string query = "SELECT Id, Name, Email, CreatedDate, IsActive FROM UserDetails";
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            users.Add(new User
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Email = reader.GetString(2),
                                CreatedDate = reader.GetDateTime(3),
                                IsActive = reader.GetBoolean(4)
                            });
                        }
                    }
                }
            }

            return users;
        }

    }
}
