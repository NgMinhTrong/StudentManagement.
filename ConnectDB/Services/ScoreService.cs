namespace ConnectDB.Services
{
    public static class ScoreService
    {
        public static string GetClassification(double gpa)
        {
            if (gpa >= 8.0) return "Giỏi";
            if (gpa >= 6.5) return "Khá";
            if (gpa >= 5.0) return "Trung bình";
            return "Yếu";
        }

        public static double CalculateAverage(double score15, double score45, double scoreFinal)
        {
            return Math.Round(score15 * 0.15 + score45 * 0.35 + scoreFinal * 0.50, 2, MidpointRounding.AwayFromZero);
        }
    }
}
