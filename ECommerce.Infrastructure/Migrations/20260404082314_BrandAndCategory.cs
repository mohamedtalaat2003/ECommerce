using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BrandAndCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "cloudinaryUrl",
                table: "products",
                newName: "PictureUrl");

            migrationBuilder.AddColumn<int>(
                name: "ProductBrandId",
                table: "products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProductCategoryId",
                table: "products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ProductBrands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductBrands", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_products_ProductBrandId",
                table: "products",
                column: "ProductBrandId");

            migrationBuilder.CreateIndex(
                name: "IX_products_ProductCategoryId",
                table: "products",
                column: "ProductCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_products_ProductBrands_ProductBrandId",
                table: "products",
                column: "ProductBrandId",
                principalTable: "ProductBrands",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_products_ProductCategories_ProductCategoryId",
                table: "products",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_products_ProductBrands_ProductBrandId",
                table: "products");

            migrationBuilder.DropForeignKey(
                name: "FK_products_ProductCategories_ProductCategoryId",
                table: "products");

            migrationBuilder.DropTable(
                name: "ProductBrands");

            migrationBuilder.DropTable(
                name: "ProductCategories");

            migrationBuilder.DropIndex(
                name: "IX_products_ProductBrandId",
                table: "products");

            migrationBuilder.DropIndex(
                name: "IX_products_ProductCategoryId",
                table: "products");

            migrationBuilder.DropColumn(
                name: "ProductBrandId",
                table: "products");

            migrationBuilder.DropColumn(
                name: "ProductCategoryId",
                table: "products");

            migrationBuilder.RenameColumn(
                name: "PictureUrl",
                table: "products",
                newName: "cloudinaryUrl");
        }
    }
}
