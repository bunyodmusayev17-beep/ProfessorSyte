using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Auth;
using WebSyteProffessor.Entities;
using WebSyteProffessor.Exceptions;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var errors = new Dictionary<string, string>();

        var existingEmail = await _userManager.FindByEmailAsync(dto.Email);
        if (existingEmail is not null)
            errors["email"] = "This email is already used";

        var existingUserName = await _userManager.FindByNameAsync(dto.UserName);
        if (existingUserName is not null)
            errors["userName"] = "This username is already used";

        if (errors.Count > 0)
            throw new ConflictException(errors);

        var user = new ApplicationUser
        {
            Email = dto.Email,
            UserName = dto.UserName,
            Role = UserRole.User
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var identityErrors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException(identityErrors);
        }

        var response = BuildAuthResponse(user);
        await SaveRefreshTokenForUserAsync(user, response);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.EmailOrUserName)
                   ?? await _userManager.FindByNameAsync(dto.EmailOrUserName);

        if (user is null)
            throw new UnauthorizedException("Invalid email/username or password");

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            throw new UnauthorizedException("Invalid email/username or password");

        var response = BuildAuthResponse(user);
        await SaveRefreshTokenForUserAsync(user, response);
        return Ok(response);
    }



    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
    {
        var storedToken = await _tokenService.GetValidRefreshTokenAsync(dto.RefreshToken);
        if (storedToken is null)
            throw new UnauthorizedException("Invalid or expired refresh token");

        var user = await _userManager.FindByIdAsync(storedToken.UserId);
        if (user is null)
            throw new UnauthorizedException("Invalid or expired refresh token");

        await _tokenService.RevokeRefreshTokenAsync(storedToken);

        var response = BuildAuthResponse(user);
        await SaveRefreshTokenForUserAsync(user, response);
        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenDto dto)
    {
        var storedToken = await _tokenService.GetValidRefreshTokenAsync(dto.RefreshToken);
        if (storedToken is not null)
        {
            await _tokenService.RevokeRefreshTokenAsync(storedToken);
        }

        return NoContent();
    }

    private AuthResponseDto BuildAuthResponse(ApplicationUser user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Email = user.Email ?? string.Empty,
            Role = user.Role.ToString()
        };
    }

    private async Task SaveRefreshTokenForUserAsync(ApplicationUser user, AuthResponseDto response)
    {
        await _tokenService.SaveRefreshTokenAsync(user.Id, response.RefreshToken);
    }
}