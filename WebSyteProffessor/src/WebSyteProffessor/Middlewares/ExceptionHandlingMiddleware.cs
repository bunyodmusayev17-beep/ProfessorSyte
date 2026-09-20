using System.Net;
using System.Text.Json;
using WebSyteProffessor.Exceptions;

namespace WebSyteProffessor.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;

        }

        public async Task InvokeAsync(HttpContext context)
        {

            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kutilmagan xatolik yuz berdi");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = exception switch
            {
                NotFoundException => HttpStatusCode.NotFound,
                BadRequestException => HttpStatusCode.BadRequest,
                ConflictException => HttpStatusCode.Conflict,
                UnauthorizedException => HttpStatusCode.Unauthorized,
                ArgumentException => HttpStatusCode.BadRequest,
                _ => HttpStatusCode.InternalServerError
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            object response = exception is ConflictException conflictEx && conflictEx.Errors.Count > 0
                ? new { statusCode = (int)statusCode, message = "Validation failed", errors = conflictEx.Errors }
                : new { statusCode = (int)statusCode, message = exception.Message };

            var json = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(json);
        }

    }
}