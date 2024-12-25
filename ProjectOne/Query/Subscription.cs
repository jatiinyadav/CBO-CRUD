using ProjectOne.Model;

namespace ProjectOne.Query
{
    public class Subscription
    {
        [Subscribe]
        [Topic("OnRoleAdded")]
        public UserChangePayload OnRoleAdded([EventMessage] UserChangePayload user) => user;
    }
}
