using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly WarehouseDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(WarehouseDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string?> LoginAsync(string username, string password)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Username == username && u.IsActive);

            if (user == null)
            {
                return null;
            }

            // Verify password hash
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }

            // Generate JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Secret"] ?? "SuperSecretKeyForWarehouseManagementSystemMustBeLongEnough123!";
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("FullName", user.FullName ?? string.Empty)
            };

            foreach (var userRole in user.UserRoles)
            {
                if (userRole.Role != null)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole.Role.RoleName));
                }
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60")),
                Issuer = _configuration["Jwt:Issuer"] ?? "WarehouseAPI",
                Audience = _configuration["Jwt:Audience"] ?? "WarehouseClient",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<User?> RegisterAsync(User user, string password, List<string> roleNames)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            {
                return null; // Username already exists
            }

            // Hash password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            user.CreatedAt = DateTime.UtcNow;

            await _context.Users.AddAsync(user);

            // Assign roles
            foreach (var roleName in roleNames)
            {
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
                if (role != null)
                {
                    await _context.UserRoles.AddAsync(new UserRole
                    {
                        UserRoleId = Guid.NewGuid(),
                        UserId = user.UserId,
                        RoleId = role.RoleId
                    });
                }
            }

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task SeedAuthDataAsync()
        {
            // Seed roles
            var requiredRoles = new List<string>
            {
                "Super Admin", "Admin", "Warehouse Manager", "Receiver",
                "Putaway Operator", "Picker / Technician", "Packer", "Dispatcher",
                "Project Manager", "Quality Inspector", "Purchase Manager", "Auditor"
            };

            foreach (var roleName in requiredRoles)
            {
                if (!await _context.Roles.AnyAsync(r => r.RoleName == roleName))
                {
                    await _context.Roles.AddAsync(new Role
                    {
                        RoleId = Guid.NewGuid(),
                        RoleName = roleName,
                        Description = $"Default role for {roleName}"
                    });
                }
            }
            await _context.SaveChangesAsync();

            // Seed default admin user
            if (!await _context.Users.AnyAsync(u => u.Username == "admin"))
            {
                var adminUser = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Email = "admin@warehouse.com",
                    FullName = "Super Administrator",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(adminUser);

                var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Super Admin");
                if (adminRole != null)
                {
                    await _context.UserRoles.AddAsync(new UserRole
                    {
                        UserRoleId = Guid.NewGuid(),
                        UserId = adminUser.UserId,
                        RoleId = adminRole.RoleId
                    });
                }
                await _context.SaveChangesAsync();
            }
        }
    }
}
