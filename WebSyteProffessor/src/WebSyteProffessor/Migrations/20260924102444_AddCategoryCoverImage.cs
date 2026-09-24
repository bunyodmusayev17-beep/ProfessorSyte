using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSyteProffessor.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryCoverImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "Categories",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "Categories");
        }
    }
}
