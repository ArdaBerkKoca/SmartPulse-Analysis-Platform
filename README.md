# SmartPulse: AI-Powered Customer Experience Analytics Platform 🚀
> [TR] Akıllı Müşteri Deneyimi ve Analiz Platformu

**SmartPulse**, yapay zeka ve veri madenciliği tekniklerini kullanarak 22.000'den fazla müşteri geri bildirimini işleyen, analiz eden ve profesyonel bir SaaS mimarisiyle sunan kurumsal düzeyde bir analiz platformudur.

---

## 🌍 Language Options / Dil Seçenekleri
* [English](#english-version)
* [Türkçe](#türkçe-versiyon)

---

<a name="english-version"></a>
## 🛠️ Technical Architecture & Security (English)

This project is built on a scalable **Relational Database (RDBMS)** architecture and follows enterprise security standards:

* **JWT Authentication & Security:** Fully implemented **JSON Web Token (JWT)** flow. Secure login/logout system with password hashing (BCrypt).
* **Axios Interceptor Logic:** A central API communication layer that automatically attaches the JWT token to every request, ensuring secure data flow.
* **Multi-Tenancy Support:** Architecture designed so that users only access data belonging to their own `CompanyId`.
* **Big Data Processing:** 22,641 real-world records processed with high performance using .NET 9.0 and EF Core.

### 🏗️ Technology Stack
* **Backend:** .NET 9.0, C#, EF Core, PostgreSQL, JWT, BCrypt.
* **Frontend:** React 19, TypeScript, Axios (Interceptors), Tailwind CSS, Recharts.
* **AI/ML:** VaderSharp (Sentiment Analysis).

---

<a name="türkçe-versiyon"></a>
## 🛠️ Teknik Mimari ve Güvenlik (Türkçe)

Bu proje, ölçeklenebilir bir **İlişkisel Veritabanı (RDBMS)** mimarisi ve kurumsal güvenlik standartları üzerine inşa edilmiştir:

* **JWT Kimlik Doğrulama:** **JSON Web Token (JWT)** mimarisi tam kapsamlı olarak entegre edildi. Şifreleme (BCrypt) ve güvenli giriş/çıkış sistemi kuruldu.
* **Axios Interceptor Yapısı:** Tüm API isteklerine otomatik olarak 'Bearer Token' ekleyen merkezi iletişim katmanı sayesinde güvenli veri trafiği sağlandı.
* **Çoklu Kiracılık (Multi-Tenancy):** Kullanıcıların sadece kendi şirketlerine (`CompanyId`) ait verilere erişebildiği profesyonel yetkilendirme altyapısı.
* **Büyük Veri Analizi:** 22.641 adet gerçek dünya verisi, .NET 9.0 ve EF Core kullanılarak analiz edilmektedir.

---

## 📊 Dashboard Insights & AI
* **Sentiment Distribution:** Visualizes the ratio of Positive, Negative, and Neutral feedback.
* **Marketplace Share:** Competitive analysis across platforms like Amazon, Trendyol, and Shopify.
* **Secure Data Flow:** Every chart and metric is protected by endpoint-level authorization.

## 🚀 How to Run / Nasıl Çalıştırılır?
1. **Backend:** `cd SmartPulseApi` -> `dotnet run`
2. **Frontend:** `cd SmartPulseClient` -> `npm run dev -- --legacy-peer-deps`
3. **Access:** Navigate to `http://localhost:5173/login` and use your credentials.