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

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();