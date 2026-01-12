using Microsoft.EntityFrameworkCore;
using SmartPulseApi.Models;

namespace SmartPulseApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Source> Sources { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Company - Feedback İlişkisi (One-to-Many)
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Company)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.CompanyId);

            // Source - Feedback İlişkisi (One-to-Many)
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Source)
                .WithMany(s => s.Feedbacks)
                .HasForeignKey(f => f.SourceId);
        }
    }
}