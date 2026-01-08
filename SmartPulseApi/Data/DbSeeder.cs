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
                        feedbacks.Add(new Feedback
                        {
                            CustomerName = string.IsNullOrWhiteSpace(title) ? "Anonim Müşteri" : title,
                            Content = content,
                            Source = "Kaggle E-Commerce Dataset",
                            CreatedAt = DateTime.UtcNow
                        });
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
