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