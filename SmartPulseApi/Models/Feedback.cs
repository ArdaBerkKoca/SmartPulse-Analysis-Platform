using System.ComponentModel.DataAnnotations.Schema;

namespace SmartPulseApi.Models
{
    [Table("Feedbacks")] // Tablo ismin artık büyük F ile olduğu için bu doğru
    public class Feedback
    {
        [Column("id")] // PostgreSQL tarafındaki küçük harf karşılığı
        public int Id { get; set; }

        [Column("customername")]
        public string? CustomerName { get; set; }

        [Column("content")]
        public string Content { get; set; } = string.Empty;

        [Column("source")]
        public string? Source { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("sentiment_score")]
        public string? SentimentScore { get; set; }
    }
}