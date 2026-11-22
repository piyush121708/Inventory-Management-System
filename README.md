G - Supermarket Management System

A full-stack store management app for a single kirana shop or small supermarket. It handles point-of-sale billing, inventory, supplier purchases, stock history, employees and a daily dashboard.

| Layer | Tech |
|-------|------|
| Backend (`kirana-backend`) | Java 21, Spring Boot 3.3, Spring Data JPA, Bean Validation, Lombok, MySQL 8 |
| Frontend (`kirana-frontend`) | React 18, Vite 5, React Router 6, Nunito font (bundled) |
| Tests | JUnit 5 + Spring Boot Test (backend) |

---

## Table of Contents

1. [Features](#features)
2. [Current Status](#current-status)
3. [Roles & Access](#roles--access)
4. [Getting Started](#getting-started)
5. [Sample Data](#sample-data)
6. [How It Works](#how-it-works)
7. [API Reference](#api-reference)
8. [Data Model](#data-model)
9. [Project Structure](#project-structure)
10. [Testing](#testing)
11. [Roadmap](#roadmap)
12. [Docs](#docs)

---

## Features

**Billing (POS)**
- Search products by name or scan/type a barcode
- Cart with quantity changes, flat discount and payment mode (Cash, UPI, Card)
- Bills get an automatic number like `BILL-000001`
- Bill list with date filter, bill detail page and print view

**Products & Categories**
- Add, edit and deactivate products (soft delete)
- Unique barcode per product, unit label (pcs, pack, kg), selling and cost price
- Reorder level with a low-stock list
- Categories with unique names; deleting a category in use is blocked

**Stock**
- Stock changes only through sales, purchases and manager adjustments
- Every change is saved as a stock movement (type, quantity change, balance after, who, when)
- Paginated, filterable stock history, newest first
- Stock can never go below zero

**Purchases & Suppliers**
- Record a supplier invoice with multiple lines
- On save: stock increases, cost price updates to the latest unit cost, movements are written
- Suppliers with purchases cannot be deleted

**Employees**
- Add, edit and deactivate employees (no hard delete, so old bills stay valid)
- Inactive employees cannot bill, purchase or adjust stock

**Dashboard**
- Active products, low-stock count, supplier count, today's bills and today's sales

---

## Current Status

| Area | Status |
|------|--------|
| Backend REST API (all modules) | Done |
| Frontend pages for all modules | Done |
| Server-side validation and error handling | Done |
| Unit tests for stock and billing logic | Done |
| Authentication and authorization | **In progress** |
| Security hardening | **In progress** |
| Everything else in the [Roadmap](#roadmap) | Planned |

> **Important:** The app currently has **no login**. Anyone who can reach the API can call any endpoint. See [Security Notes](#security-notes-current-limitations) and the [Roadmap](#roadmap).

---

## Roles & Access

Roles are stored on the employee record: `MANAGER` or `CASHIER`.

For now there is no login. A **"Working as"** dropdown in the top bar picks the employee, and that employee id is sent with bills, purchases and stock adjustments.

| Capability | Manager | Cashier | Enforced by |
|-----------|:------:|:------:|-------------|
| Create bills | Yes | Yes | Backend (employee must be active) |
| View products, stock, bills | Yes | Yes | - |
| Add / edit products and categories | Yes | - | UI only |
| Manage suppliers and employees | Yes | - | UI only |
| Record purchases | Yes | - | **Backend** |
| Adjust stock | Yes | - | **Backend** |
| Dashboard | Yes | - | UI only |

---

## Getting Started

**Requirements:** Java 21, Maven, MySQL 8 (port 3306), Node.js 18+

### 1. Backend

```bash
cd kirana-backend
mvn spring-boot:run
```

- API runs at `http://localhost:8080`
- The `kirana_db` database and all tables are created automatically (`ddl-auto=update`)
- Sample data is inserted on first run

Database settings can be overridden with environment variables:

| Variable | Purpose |
|----------|---------|
| `DB_URL` | JDBC URL (defaults to local `kirana_db`) |
| `DB_USERNAME` | MySQL user (default `root`) |
| `DB_PASSWORD` | MySQL password. Set this to match your machine |

Example:

```bash
DB_USERNAME=root DB_PASSWORD=yourpassword mvn spring-boot:run
```

### 2. Frontend

```bash
cd kirana-frontend
npm install
npm run dev
```

- Open `http://localhost:5173`
- Keep this port. The backend CORS only allows `5173` and `3000`
- To use another backend URL, copy `.env.example` to `.env` and change `VITE_API_URL`

Production build: `npm run build`, then `npm run preview` to test it.

---

## Sample Data

Added automatically when the employee table is empty.

| Type | Data |
|------|------|
| Employees | Ramesh Sharma (Manager, id 1), Suresh Kumar (Cashier, id 2) |
| Categories | Grocery, Dairy, Snacks, Beverages, Household |
| Supplier | Gupta Wholesale Traders |
| Products | Basmati Rice 1kg, Toor Dal 1kg, Amul Milk 500ml, Lays Classic 50g (low stock), Pepsi 600ml |

Barcode example for testing billing: `8900000000011` (Basmati Rice).

---

## How It Works

**Architecture:** `Controller -> Service -> Repository`. Controllers only handle HTTP, services hold the business rules, repositories are Spring Data JPA interfaces.

**Business rules**

1. Stock is changed in exactly one place (`StockService`), and every change writes a movement row.
2. `balanceAfter` in a movement always equals the product's stock right after that change.
3. Billing, purchase and adjustment each run in a single database transaction. Any failure rolls back everything.
4. Prices and totals are always calculated on the server. The client cannot set a bill price.
5. If any bill line has insufficient stock, the whole bill is rejected.
6. The product row is locked while stock is updated, so two simultaneous sales cannot oversell.
7. Employees and products are soft-deleted. Bills and history stay valid forever.
8. Discount cannot be negative or higher than the bill total.
9. Quantities are whole numbers. `unit` is only a label.
10. Money uses `BigDecimal` / `DECIMAL`, never floating point.

**Error format** (all errors look the same, and the frontend shows `message`):

```json
{ "timestamp": "2026-11-21T10:15:30", "status": 400, "message": "Insufficient stock for 'Toor Dal 1kg' (available 3)" }
```

| Status | Meaning |
|--------|---------|
| 201 | Created |
| 400 | Validation error or business rule failed |
| 404 | Record not found |
| 409 | Duplicate value or record is in use |

---

## API Reference

Base URL: `http://localhost:8080/api`

| Resource | Endpoints |
|----------|-----------|
| Products | `GET /products?search=`, `GET /products/{id}`, `GET /products/barcode/{barcode}`, `GET /products/low-stock`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}` |
| Categories | `GET /categories`, `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}` |
| Suppliers | `GET /suppliers`, `GET /suppliers/{id}`, `POST /suppliers`, `PUT /suppliers/{id}`, `DELETE /suppliers/{id}` |
| Employees | `GET /employees`, `GET /employees/{id}`, `POST /employees`, `PUT /employees/{id}`, `DELETE /employees/{id}` |
| Bills | `GET /bills?date=YYYY-MM-DD`, `GET /bills/{id}`, `POST /bills` |
| Purchases | `GET /purchases`, `GET /purchases/{id}`, `POST /purchases` (manager only) |
| Stock | `GET /stock/movements?productId=&page=&size=`, `POST /stock/adjust` (manager only) |
| Dashboard | `GET /dashboard` |

Stock history: `page` starts at 0, `size` must be 1 to 100.

**Create a bill**

```bash
curl -X POST localhost:8080/api/bills -H "Content-Type: application/json" -d '{
  "employeeId": 2, "paymentMode": "CASH", "discount": 5,
  "items": [ {"productId": 1, "quantity": 2}, {"productId": 3, "quantity": 4} ]
}'
```

**Record a purchase** (manager)

```bash
curl -X POST localhost:8080/api/purchases -H "Content-Type: application/json" -d '{
  "supplierId": 1, "employeeId": 1, "invoiceNo": "INV-101",
  "items": [ {"productId": 4, "quantity": 50, "unitCost": 15.5} ]
}'
```

**Adjust stock** (manager)

```bash
curl -X POST localhost:8080/api/stock/adjust -H "Content-Type: application/json" -d '{
  "productId": 3, "employeeId": 1, "quantityChange": -2, "note": "Expired packets"
}'
```

---

## Data Model

```
Category 1---* Product
Supplier 1---* Purchase 1---* PurchaseItem *---1 Product
Employee 1---* Bill     1---* BillItem     *---1 Product
Product  1---* StockMovement      Employee 1---* StockMovement
Employee 1---* Purchase (created by)
```

| Table | Main columns |
|-------|--------------|
| employee | id, name, phone, role, active |
| category | id, name (unique) |
| product | id, name, barcode (unique), category_id, unit, selling_price, cost_price, stock_qty, reorder_level, active |
| supplier | id, name, phone, address |
| purchase | id, supplier_id, created_by, invoice_no, purchase_date, total_amount |
| purchase_item | id, purchase_id, product_id, quantity, unit_cost, line_total |
| bill | id, bill_number, employee_id, bill_date, total_amount, discount, net_amount, payment_mode |
| bill_item | id, bill_id, product_id, quantity, unit_price, line_total |
| stock_movement | id, product_id, type, quantity_change, balance_after, reference_id, note, performed_by, created_at |

Enums: `Role` (MANAGER, CASHIER), `PaymentMode` (CASH, UPI, CARD), `MovementType` (OPENING, PURCHASE, SALE, ADJUSTMENT).

---

## Project Structure

```
kirana-backend/
  docs/               SRS.md, REVIEW.md
  src/main/java/com/kirana/
    controller/       REST endpoints
    service/          business logic (Bill, Purchase, Stock, Product ...)
    repository/       Spring Data JPA interfaces
    model/            JPA entities and enums
    dto/              request objects with validation
    exception/        custom exceptions + global handler
    config/           CORS and sample data seeder
  src/main/resources/application.properties
  src/test/           unit tests

kirana-frontend/
  src/
    api/              one file per backend controller (client.js = fetch + errors)
    context/          EmployeeContext ("working as"), ToastContext
    hooks/            useFetch, useForm, useSubmit, useAction, useDebounce
    components/       layout/ (top bar, header, nav) and ui/ (modal, field, pager ...)
    routes/           AppRoutes, RoleRoute, navItems
    pages/            dashboard, billing, bills, products, categories,
                      suppliers, purchases, stock, employees
    styles/           theme.css, layout.css, pages.css
```

---

## Security Notes (Current Limitations)

These are known gaps and are being worked on (see Roadmap).

- **No authentication.** The `employeeId` is sent by the client, so any caller can pretend to be a manager.
- **Authorization is partial.** Only purchases and stock adjustments are checked on the backend. Other manager-only pages are hidden in the UI but the API stays open.
- **No password or session handling** and no token-based access.
- **CORS is open to local dev origins only** (`5173`, `3000`) and allows `GET`, `POST`, `PUT`, `DELETE`.
- **No HTTPS.** Traffic is plain HTTP.
- **No rate limiting or audit login trail** beyond stock movements.

---

## Roadmap

### In Progress

- [ ] **Authentication:** login with username and password, JWT access tokens (Spring Security)
- [ ] **Authorization:** enforce Manager / Cashier permissions on every backend endpoint, not only purchases and stock adjustments
- [ ] **Password security:** BCrypt password hashing, password fields on employees
- [ ] **Frontend login flow:** login page, token storage, protected routes, logout, replace the "Working as" dropdown
- [ ] **Use the logged-in user** for `employeeId` on the server instead of trusting the request body
- [ ] **Security hardening:** locked-down CORS per environment, secrets in environment variables only, HTTPS, input sanitising, rate limiting on login

---