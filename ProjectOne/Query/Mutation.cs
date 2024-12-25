﻿using ProjectOne.Model;

namespace ProjectOne.Query
{
    public class Mutation
    {
        public async Task<UserChangePayload> InsertNewUserAsync(UserChangePayload user, [Service] GetDataFromDB dataService)
        {
            await dataService.InsertedUserAsync(user);
            return user;
        }
    }
}