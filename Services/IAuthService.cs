using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string username, string password);
        Task<User?> RegisterAsync(User user, string password, List<string> roles);
        Task SeedAuthDataAsync();
    }
}
