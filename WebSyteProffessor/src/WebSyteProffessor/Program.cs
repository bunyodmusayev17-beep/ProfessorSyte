using WebSyteProffessor.Configurations;
using WebSyteProffessor.Data;
using WebSyteProffessor.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.AddDatabaseConfigurations();
builder.AddIdentityConfigurations();
builder.Services.AddControllers();
builder.AddDependencyInjectionConfigurations();
builder.AddSwaggerConfigurations();
builder.AddCorsConfigurations();
builder.AddJwtConfigurations(); 


var app = builder.Build();




app.UseMiddleware<ExceptionHandlingMiddleware>();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// In the container only HTTP:8080 is bound (TLS is terminated by nginx), so
// redirecting there would either be a no-op warning or break API calls.
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();