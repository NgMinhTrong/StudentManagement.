using Xunit;
using ConnectDB.Services;

namespace ConnectDB.Tests
{
    public class ScoreServiceTests
    {
        [Theory]
        [InlineData(8.5, "Giỏi")]
        [InlineData(7.0, "Khá")]
        [InlineData(5.5, "Trung bình")]
        [InlineData(4.0, "Yếu")]
        public void GetClassification_ReturnsCorrectLabel(double gpa, string expected)
        {
            var result = ScoreService.GetClassification(gpa);
            Assert.Equal(expected, result);
        }

        [Fact]
        public void CalculateAverage_ReturnsCorrectRoundedValue()
        {
            // (10 * 0.15) + (8 * 0.35) + (9 * 0.50) = 1.5 + 2.8 + 4.5 = 8.8
            var result = ScoreService.CalculateAverage(10, 8, 9);
            Assert.Equal(8.8, result);
        }

        [Fact]
        public void CalculateAverage_ComplexDecimals_RoundsToTwoPlaces()
        {
            // (7.5 * 0.15) + (6.8 * 0.35) + (8.2 * 0.50) = 1.125 + 2.38 + 4.1 = 7.605 -> 7.61
            var result = ScoreService.CalculateAverage(7.5, 6.8, 8.2);
            Assert.Equal(7.61, result);
        }
    }
}
