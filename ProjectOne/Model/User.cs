using TableDependency.SqlClient.Base.Enums;

namespace ProjectOne.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserChangePayload
    {
        public ChangeType? Operation { get; set; }
        public User? User { get; set; }
    }

}
