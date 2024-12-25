using HotChocolate.Subscriptions;
using ProjectOne.Model;
using TableDependency.SqlClient;
using TableDependency.SqlClient.Base.EventArgs;
using TableDependency.SqlClient.Base.Enums;

namespace ProjectOne.Query
{
    public class ChangeTrackingService : BackgroundService
    {
        private readonly string _connectionString;
        private readonly ITopicEventSender _eventSender;
        private SqlTableDependency<User> _tableDependency;

        public ChangeTrackingService(string connectionString, ITopicEventSender eventSender)
        {
            _connectionString = connectionString;
            _eventSender = eventSender;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                _tableDependency = new SqlTableDependency<User>(
                    connectionString: _connectionString,
                    tableName: "UserDetails",
                    schemaName: null,
                    includeOldValues: true
                );

                _tableDependency.OnChanged += OnTableChanged;
                _tableDependency.OnError += OnError;

                _tableDependency.Start();

                Console.WriteLine("Waiting for database changes...");

                while (!stoppingToken.IsCancellationRequested)
                {
                    Console.WriteLine("hERE");
                    await Task.Delay(1000, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing SqlTableDependency: {ex.Message}");
            }
            finally
            {
                _tableDependency?.Stop();
                Console.WriteLine("Stopped listening to changes.");
            }
        }

        private void OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"Error detected in SqlTableDependency: {e.Message}");
        }

        private async void OnTableChanged(object sender, RecordChangedEventArgs<User> e)
        {
            try
            {
                if (e.ChangeType == ChangeType.None)
                {
                    return;
                }

                Console.WriteLine($"Change detected: {e.ChangeType} for User ID: {e.Entity.Id}");

                var payload = new UserChangePayload
                {
                    Operation = e.ChangeType,
                    User = e.Entity
                };

                // Publish the event with the payload
                await _eventSender.SendAsync("OnRoleAdded", payload);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing table change: {ex.Message}");
            }
        }
    }
}
