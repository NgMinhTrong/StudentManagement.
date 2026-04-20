using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectDB.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAverageScoreFormula : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "AverageScore",
                table: "Scores",
                type: "float",
                nullable: true,
                computedColumnSql: "(ISNULL(Score15Min, 0) * 0.15 + ISNULL(Score45Min, 0) * 0.35 + ISNULL(ScoreFinal, 0) * 0.50)",
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true,
                oldComputedColumnSql: "(ISNULL(Score15Min,0) + ISNULL(Score45Min,0)*2 + ISNULL(ScoreFinal,0)*3) / 6");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "AverageScore",
                table: "Scores",
                type: "float",
                nullable: true,
                computedColumnSql: "(ISNULL(Score15Min,0) + ISNULL(Score45Min,0)*2 + ISNULL(ScoreFinal,0)*3) / 6",
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true,
                oldComputedColumnSql: "(ISNULL(Score15Min, 0) * 0.15 + ISNULL(Score45Min, 0) * 0.35 + ISNULL(ScoreFinal, 0) * 0.50)");
        }
    }
}
