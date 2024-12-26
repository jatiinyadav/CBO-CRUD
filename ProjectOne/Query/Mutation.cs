using ProjectOne.Model;

namespace ProjectOne.Query
{
    public class Mutation
    {
        public async Task<UserChangePayload> InsertNewUserAsync(UserChangePayload user, [Service] GetDataFromDB dataService)
        {
            await dataService.InsertedUserAsync(user);
            return user;
        }

        public async Task<UserChangePayload> DeleteUserAsync(UserChangePayload user, [Service] GetDataFromDB dataService)
        {
            await dataService.DeleteUserAsync(user);
            return user;
        }

        public async Task<UserChangePayload> UpdateUserAsync(UserChangePayload user, [Service] GetDataFromDB dataService)
        {
            await dataService.UpdateUserAsync(user);
            return user;
        }
    }
}
