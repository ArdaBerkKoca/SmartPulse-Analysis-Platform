using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartPulseApi.Data;
using SmartPulseApi.Models;
using SmartPulseApi.Services; // SentimentService'i bulabilmesi için bu şart!

namespace SmartPulseApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;
        // Servisi burada tanımlıyoruz
        private readonly SentimentService _sentimentService = new SentimentService();

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Feedback/analyze-all
        // Bu metod veritabanındaki tüm analiz edilmemiş yorumları tarar.
        [HttpPost("analyze-all")]
        public async Task<IActionResult> AnalyzeAll()
        {
            // Sadece SentimentScore alanı boş olanları getiriyoruz
            var feedbacks = await _context.Feedbacks
                .Where(f => string.IsNullOrEmpty(f.SentimentScore))
                .ToListAsync();

            if (feedbacks.Count == 0)
                return Ok("Analiz edilecek yeni veri bulunamadı.");

            foreach (var item in feedbacks)
            {
                // Analiz edip sonucu atıyoruz
                item.SentimentScore = _sentimentService.Analyze(item.Content);
            }

            // Tüm değişiklikleri veritabanına tek seferde kaydediyoruz
            await _context.SaveChangesAsync();

            return Ok($"{feedbacks.Count} adet yorum başarıyla analiz edildi.");
        }

        // GET: api/Feedback (Tüm verileri listeler)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        // GET: api/Feedback/summary (Duygu skoruna göre özet)
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _context.Feedbacks
                .GroupBy(f => f.SentimentScore)
                .Select(g => new
                {
                    Name = g.Key ?? "Unknown",
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(summary);
        }

        // GET: api/Feedback/source-distribution (Kaynaklara göre dağılım)
        [HttpGet("source-distribution")]
        public async Task<IActionResult> GetSourceDistribution()
        {
            var sourceData = await _context.Feedbacks
                .Include(f => f.Source) // İlişkili tabloyu dahil etmeyi unutma!
                .GroupBy(f => f.Source != null ? f.Source.PlatformName : "Other") // Objenin içindeki PlatformName'e bak
                .Select(g => new
                {
                    source = g.Key,
                    count = g.Count()
                })
                .OrderByDescending(x => x.count)
                .ToListAsync();

            return Ok(sourceData);
        }

        // GET: api/Feedback/top-keywords (AI insights için basit kelime analizi)
        [HttpGet("top-keywords")]
        public async Task<IActionResult> GetTopKeywords()
        {
            var contents = await _context.Feedbacks
                .Where(f => !string.IsNullOrEmpty(f.Content))
                .Select(f => f.Content.ToLower())
                .ToListAsync();

            var stopwords = new[] { 
                "the", "and", "this", "was", "with", "that", "for", "very", "have", "they", 
                "but", "from", "were", "been", "would", "could", "should", "just" 
            };

            var keywords = contents
                .SelectMany(c => c.Split(' ', StringSplitOptions.RemoveEmptyEntries))
                .Where(word => word.Length > 3 && !stopwords.Contains(word))
                .GroupBy(word => word)
                .OrderByDescending(g => g.Count())
                .Take(5)
                .Select(g => new { word = g.Key, count = g.Count() })
                .ToList();

            return Ok(keywords);
        }

        // GET: api/Feedback/trend (Son 30 günlük trend analizi)
        [HttpGet("trend")]
        public async Task<IActionResult> GetTrend()
        {
            var startDate = DateTime.UtcNow.AddDays(-30);

            // 1. ADIM: Veriyi veritabanından ham tarih (Date) olarak çekiyoruz
            var rawData = await _context.Feedbacks
                .Where(f => f.CreatedAt >= startDate && f.SentimentScore != null)
                .GroupBy(f => f.CreatedAt.Date) // PostgreSQL .Date kısmını anlayabilir
                .Select(g => new
                {
                    RawDate = g.Key,
                    Positive = g.Count(f => f.SentimentScore == "Positive"),
                    Negative = g.Count(f => f.SentimentScore == "Negative"),
                    Neutral = g.Count(f => f.SentimentScore == "Neutral")
                })
                .OrderBy(x => x.RawDate)
                .ToListAsync(); // Sorgu burada veritabanında çalışır ve sonuçlar listeye dökülür

            // 2. ADIM: Hafızaya alınan (In-Memory) veriyi formatlıyoruz
            var formattedData = rawData.Select(x => new
            {
                Date = x.RawDate.ToString("MMM dd"), // Burası artık C# tarafında çalıştığı için hata vermez
                x.Positive,
                x.Negative,
                x.Neutral
            });

            return Ok(formattedData);
        }

        // POST: api/Feedback (Yeni veri kaydeder)
        [HttpPost]
        public async Task<ActionResult<Feedback>> PostFeedback(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return Ok(feedback);
        }
    }
}