using Microsoft.EntityFrameworkCore;

using MusicMoodApi; 
using MusicMoodApi.Services;

var builder = WebApplication.CreateBuilder(args);

//  use MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFeeloidUI",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") //  Angular URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers(); 

builder.Services.AddScoped<IRecommendationService, RecommendationService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowFeeloidUI");
// --------------------------

app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}






// Seeder logic
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    MusicSeeder.Seed(context); 
}

app.Run();