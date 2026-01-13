using System.ComponentModel.DataAnnotations;

namespace SmartPulseApi.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Email { get; set; } = string.Empty;

        // Kullanıcıyı bir şirkete bağlıyoruz (FK)
        public int CompanyId { get; set; }
        public Company? Company { get; set; }
    }
}