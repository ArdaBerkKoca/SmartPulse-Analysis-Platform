namespace SmartPulseApi.Models
{
    public class Source
    {
        public int Id { get; set; }
        public string PlatformName { get; set; } = string.Empty; // Amazon, Trendyol vb.
        public string? BaseUrl { get; set; }
        
        // Navigation Property: Bir platformdan birçok feedback gelir
        public List<Feedback> Feedbacks { get; set; } = new();
    }
}