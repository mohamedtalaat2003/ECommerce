//using System;
//using Microsoft.EntityFrameworkCore.Migrations;
//using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

//#nullable disable

//namespace ECommerce.Infrastructure.Data.Identity.Migrations
//{
//    /// <inheritdoc />
//    public partial class Orders : Migration
//    {
//        /// <inheritdoc />
//        protected override void Up(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.CreateTable(
//                name: "DeliveryMethods",
//                columns: table => new
//                {
//                    Id = table.Column<int>(type: "integer", nullable: false)
//                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
//                    ShortName = table.Column<string>(type: "text", nullable: false),
//                    DeliveryTime = table.Column<string>(type: "text", nullable: false),
//                    Description = table.Column<string>(type: "text", nullable: false),
//                    Price = table.Column<decimal>(type: "numeric", nullable: false)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_DeliveryMethods", x => x.Id);
//                });

//            migrationBuilder.CreateTable(
//                name: "Orders",
//                columns: table => new
//                {
//                    Id = table.Column<int>(type: "integer", nullable: false)
//                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
//                    BuyerEmail = table.Column<string>(type: "text", nullable: false),
//                    OrderDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
//                    ShipToAddress_FirstName = table.Column<string>(type: "text", nullable: false),
//                    ShipToAddress_LastName = table.Column<string>(type: "text", nullable: false),
//                    ShipToAddress_Street = table.Column<string>(type: "text", nullable: false),
//                    ShipToAddress_City = table.Column<string>(type: "text", nullable: false),
//                    ShipToAddress_ZipCode = table.Column<string>(type: "text", nullable: false),
//                    DeliveryMethodId = table.Column<int>(type: "integer", nullable: false),
//                    Subtotal = table.Column<decimal>(type: "numeric", nullable: false),
//                    Status = table.Column<string>(type: "text", nullable: false),
//                    PaymentIntentId = table.Column<string>(type: "text", nullable: false)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_Orders", x => x.Id);
//                    table.ForeignKey(
//                        name: "FK_Orders_DeliveryMethods_DeliveryMethodId",
//                        column: x => x.DeliveryMethodId,
//                        principalTable: "DeliveryMethods",
//                        principalColumn: "Id",
//                        onDelete: ReferentialAction.Cascade);
//                });

//            migrationBuilder.CreateTable(
//                name: "OrderItems",
//                columns: table => new
//                {
//                    Id = table.Column<int>(type: "integer", nullable: false)
//                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
//                    ItemOrdered_ProductItemId = table.Column<int>(type: "integer", nullable: false),
//                    ItemOrdered_Name = table.Column<string>(type: "text", nullable: false),
//                    ItemOrdered_PictureUrl = table.Column<string>(type: "text", nullable: false),
//                    Price = table.Column<decimal>(type: "numeric", nullable: false),
//                    Quantity = table.Column<int>(type: "integer", nullable: false),
//                    OrderId = table.Column<int>(type: "integer", nullable: true)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_OrderItems", x => x.Id);
//                    table.ForeignKey(
//                        name: "FK_OrderItems_Orders_OrderId",
//                        column: x => x.OrderId,
//                        principalTable: "Orders",
//                        principalColumn: "Id");
//                });

//            migrationBuilder.CreateIndex(
//                name: "IX_OrderItems_OrderId",
//                table: "OrderItems",
//                column: "OrderId");

//            migrationBuilder.CreateIndex(
//                name: "IX_Orders_DeliveryMethodId",
//                table: "Orders",
//                column: "DeliveryMethodId");
//        }

//        /// <inheritdoc />
//        protected override void Down(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropTable(
//                name: "OrderItems");

//            migrationBuilder.DropTable(
//                name: "Orders");

//            migrationBuilder.DropTable(
//                name: "DeliveryMethods");
//        }
//    }
//}
