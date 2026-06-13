using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicMoodApi.Migrations
{
    /// <inheritdoc />
    public partial class AddListeningHistoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Histories",
                table: "Histories");

            migrationBuilder.RenameTable(
                name: "Histories",
                newName: "ListeningHistory");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ListeningHistory",
                table: "ListeningHistory",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ListeningHistory",
                table: "ListeningHistory");

            migrationBuilder.RenameTable(
                name: "ListeningHistory",
                newName: "Histories");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Histories",
                table: "Histories",
                column: "Id");
        }
    }
}
