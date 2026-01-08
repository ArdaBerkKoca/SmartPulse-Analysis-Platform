using Microsoft.EntityFrameworkCore;
using SmartPulseApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Politikasını tanımlıyoruz
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// 1. PostgreSQL bağlantısını ekliyoruz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Controller desteğini ekliyoruz (Bu satır çok önemli!)
builder.Services.AddControllers();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 2. CORS politikasını aktif ediyoruz
app.UseCors("AllowAll");

app.UseHttpsRedirection();

// 3. Controller'ları haritalandırıyoruz
app.MapControllers();

// Veri setini yükleme (Seeding) işlemi
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    
    try {
        DbSeeder.Seed(context);
        Console.WriteLine("--> Veri seti başarıyla yüklendi!");
    }
    catch (Exception ex) {
        Console.WriteLine($"--> Veri yükleme hatası: {ex.Message}");
    }
}

app.Run();