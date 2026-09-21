using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly IBaseRepository<RefreshToken> _refreshTokenRepository;

    public TokenService(IConfiguration configuration, IBaseRepository<RefreshToken> refreshTokenRepository)
    {
        _configuration = configuration;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public string GenerateAccessToken(ApplicationUser user)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var jwtIssuer = _configuration["Jwt:Issuer"]!;
        var jwtAudience = _configuration["Jwt:Audience"]!;
        var expirationMinutes = int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"]!);

        var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }

    public async Task<RefreshToken> SaveRefreshTokenAsync(string userId, string refreshToken)
    {
        var expirationDays = int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"]!);

        var entity = new RefreshToken
        {
            Token = refreshToken,
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(expirationDays),
            IsRevoked = false
        };

        return await _refreshTokenRepository.AddAsync(entity);
    }

    public async Task<RefreshToken?> GetValidRefreshTokenAsync(string refreshToken)
    {
        var allTokens = await _refreshTokenRepository.GetAllAsync();
        var token = allTokens.FirstOrDefault(t => t.Token == refreshToken);

        if (token is null || token.IsRevoked || token.ExpiresAt < DateTime.UtcNow)
            return null;

        return token;
    }

    public async Task RevokeRefreshTokenAsync(RefreshToken refreshToken)
    {
        refreshToken.IsRevoked = true;
        await _refreshTokenRepository.UpdateAsync(refreshToken);
    }
}