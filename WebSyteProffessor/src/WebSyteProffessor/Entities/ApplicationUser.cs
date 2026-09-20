using Microsoft.AspNetCore.Identity;

namespace WebSyteProffessor.Entities;

public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}