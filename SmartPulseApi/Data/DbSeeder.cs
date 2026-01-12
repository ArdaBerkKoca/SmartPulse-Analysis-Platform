using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using SmartPulseApi.Models;

namespace SmartPulseApi.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // Eğer veritabanı zaten doluysa işlem yapma
            if (context.Feedbacks.Any()) 
            {
                Console.WriteLine("--> Veritabanı zaten dolu, seeding atlanıyor.");
                return;
            }

            // Önce örnek bir şirket ve kaynaklar oluşturalım (Eğer yoksa)
            var defaultCompany = context.Companies.FirstOrDefault(c => c.Name == "Arda Analytics Corp");
            if (defaultCompany == null)
            {
                defaultCompany = new Company { Name = "Arda Analytics Corp", Industry = "Tech" };
                context.Companies.Add(defaultCompany);
                context.SaveChanges();
            }

            // Rastgele kaynaklar için Source objeleri oluştur
            var sourceNames = new[] { "Amazon", "Trendyol", "Hepsiburada", "Shopify", "eBay" };
            var sources = new List<Source>();
            foreach (var sourceName in sourceNames)
            {
                var source = context.Sources.FirstOrDefault(s => s.PlatformName == sourceName);
                if (source == null)
                {
                    source = new Source { PlatformName = sourceName };
                    context.Sources.Add(source);
                }
                sources.Add(source);
            }
            context.SaveChanges();

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "reviews.csv");
            if (!File.Exists(filePath)) 
            {
                Console.WriteLine("--> HATA: reviews.csv dosyası bulunamadı!");
                return;
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                MissingFieldFound = null,
                HeaderValidated = null,
                PrepareHeaderForMatch = args => args.Header.Trim() // Sütun isimlerindeki gizli boşlukları temizler
            };

            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);

            var feedbacks = new List<Feedback>();
            int count = 0;
            var random = new Random();

            Console.WriteLine("--> CSV dosyası okunuyor...");

            // Satır satır okuma yapıyoruz
            if (csv.Read())
            {
                csv.ReadHeader();
                while (csv.Read())
                {
                    // Tam olarak senin paylaştığın "Review Text" ve "Title" sütunlarını arıyoruz
                    var content = csv.GetField("Review Text");
                    var title = csv.GetField("Title");

                    if (!string.IsNullOrWhiteSpace(content))
                    {
                        var feedback = new Feedback
                        {
                            CustomerName = string.IsNullOrWhiteSpace(title) ? "Anonim Müşteri" : title,
                            Content = content,
                            CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 30)), // Verileri son 30 güne rastgele dağıtır
                            Company = defaultCompany, // String yerine obje atıyoruz
                            Source = sources[random.Next(sources.Count)] // Rastgele bir Source objesi seçiyoruz
                        };
                        feedbacks.Add(feedback);
                        count++;
                    }

                    // Her 5000 kayıtta bir log basalım ki takıldığını sanma
                    if (count % 5000 == 0) Console.WriteLine($"--> {count} satır hafızaya alındı...");
                }
            }

            if (feedbacks.Any())
            {
                Console.WriteLine($"--> Toplam {feedbacks.Count} kayıt veritabanına yazılıyor, lütfen bekleyin...");
                context.Feedbacks.AddRange(feedbacks);
                context.SaveChanges();
                Console.WriteLine("--> BAŞARILI: Tüm veriler yüklendi!");
            }
            else
            {
                Console.WriteLine("--> HATA: CSV dosyasından veri okunamadı. Sütun isimlerini kontrol edin.");
            }
        }
    }
}
