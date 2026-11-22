# Kirana & Supermarket Management System - Backend

Java 21 + Spring Boot 3.3 + Spring Data JPA + MySQL. No security by design (portfolio scope).

## Run
1. Install Java 21, Maven, MySQL 8 (running on port 3306).
2. Configure the connection with environment variables if needed: `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Defaults target a local `kirana_db` database and the `root` user with no password.
3. Start:
   ```
   mvn spring-boot:run
   ```
The `kirana_db` database and all tables are created automatically. Sample employees, categories,
products and one supplier are added on first run. API runs at `http://localhost:8080`.

## Tests
Run the unit test suite with `mvn test`. Tests cover stock quantity changes, insufficient stock,
stock history pagination validation, and inclusive/exclusive bill date filtering.

Seeded employees: id 1 = Ramesh (MANAGER), id 2 = Suresh (CASHIER).

## Package layout
```
controller/   REST endpoints
service/      business logic (BillService, PurchaseService, StockService ...)
repository/   Spring Data JPA interfaces
model/        JPA entities + enums
dto/          request objects with validation
exception/    custom exceptions + global handler
config/       CORS + sample data seeder
```

## Quick tests (curl)
Create a bill (cashier):
```
curl -X POST localhost:8080/api/bills -H "Content-Type: application/json" -d '{
  "employeeId": 2, "paymentMode": "CASH", "discount": 5,
  "items": [ {"productId": 1, "quantity": 2}, {"productId": 3, "quantity": 4} ]
}'
```
Record a purchase (manager only):
```
curl -X POST localhost:8080/api/purchases -H "Content-Type: application/json" -d '{
  "supplierId": 1, "employeeId": 1, "invoiceNo": "INV-101",
  "items": [ {"productId": 4, "quantity": 50, "unitCost": 15.5} ]
}'
```
Stock adjustment (manager only):
```
curl -X POST localhost:8080/api/stock/adjust -H "Content-Type: application/json" -d '{
  "productId": 3, "employeeId": 1, "quantityChange": -2, "note": "Expired packets"
}'
```
Stock history of a product: `GET /api/stock/movements?productId=1`
Low stock: `GET /api/products/low-stock`  |  Dashboard: `GET /api/dashboard`

Full requirements: `docs/SRS.md`
