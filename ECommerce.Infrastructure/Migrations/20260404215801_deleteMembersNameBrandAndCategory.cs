using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class deleteMembersNameBrandAndCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Brand",
                table: "products");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "products",
                type: "text",
                nullable: true);
        }
    }
}
