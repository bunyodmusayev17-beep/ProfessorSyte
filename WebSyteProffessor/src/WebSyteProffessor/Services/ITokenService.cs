using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user);
    string GenerateRefreshToken();
    Task<RefreshToken> SaveRefreshTokenAsync(string userId, string refreshToken);
    Task<RefreshToken?> GetValidRefreshTokenAsync(string refreshToken);
    Task RevokeRefreshTokenAsync(RefreshToken refreshToken);
}