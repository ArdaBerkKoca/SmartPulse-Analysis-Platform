namespace SmartPulseApi.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty; // Örn: E-commerce, Tech, Fashion
        
        // Navigation Property: Bir şirketin birçok feedback'i olur
        public List<Feedback> Feedbacks { get; set; } = new();
    }
}