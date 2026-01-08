using Microsoft.EntityFrameworkCore;
using SmartPulseApi.Models;

namespace SmartPulseApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Feedback> Feedbacks { get; set; }
    }
}