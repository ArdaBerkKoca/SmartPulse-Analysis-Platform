using VaderSharp2;

namespace SmartPulseApi.Services
{
    public class SentimentService
    {
        private readonly SentimentIntensityAnalyzer _analyzer;

        public SentimentService()
        {
            _analyzer = new SentimentIntensityAnalyzer();
        }

        public string Analyze(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "Neutral";

            var results = _analyzer.PolarityScores(text);

            // Compound skoru -1 ile +1 arasındadır.
            if (results.Compound >= 0.05) return "Positive";
            if (results.Compound <= -0.05) return "Negative";
            
            return "Neutral";
        }
    }
}

