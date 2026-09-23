# =========================
# 1. BUILD
# =========================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY WebSyteProffessor.csproj .

RUN dotnet restore

COPY . .

RUN dotnet publish WebSyteProffessor.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# =========================
# 2. RUNTIME
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "WebSyteProffessor.dll"]