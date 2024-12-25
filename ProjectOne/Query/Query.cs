using ProjectOne.Model;

namespace ProjectOne.Query
{
    public class Query
    {
        private readonly GetDataFromDB _getDataFromDB;

        public Query(GetDataFromDB getDataFromDB)
        {
            Console.WriteLine("In Query Class");
            _getDataFromDB = getDataFromDB;
        }

        public async Task<List<User>> GetUsers() => await _getDataFromDB.GetUsersAsync();
    }
}
