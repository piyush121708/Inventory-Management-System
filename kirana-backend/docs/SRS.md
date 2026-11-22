# Software Requirements Specification
## General Kirana & Supermarket Management System

| | |
|---|---|
| Version | 1.0 |
| Type | Portfolio project (interview + resume) |
| Stack | Java 21, Spring Boot 3.3, MySQL 8, React (next phase) |

---

## 1. Introduction

### 1.1 Purpose
A simple management system for a single general kirana + supermarket store. It covers inventory tracking, supplier purchases, point-of-sale billing, stock movement history and two employee roles.

### 1.2 Scope
**In scope**
- Single store, single counter-style billing (normal billing only)
- Product & category management
- Inventory (current stock, low-stock alerts)
- Supplier management and purchase entry
- POS billing with stock deduction
- Stock movement history (full audit trail of stock changes)
- Employees with roles: Manager, Cashier
- Basic dashboard

**Out of scope (intentionally)**
- Authentication / authorization / JWT (no security, by design)
- Multi-store, GST/tax invoices, returns/refunds, customer loyalty, credit (udhaar) accounts
- Barcode hardware integration, receipt printer integration, online orders
- Loose-weight (decimal) quantities. Quantity is a whole number; `unit` is only a label

### 1.3 Definitions
| Term | Meaning |
|---|---|
| SKU / Product | An item sold in the store |
| Reorder level | Stock at or below this value is flagged "low stock" |
| Stock movement | One record for every increase/decrease of a product's stock |
| Bill | A sale made at the counter |
| Purchase | Goods bought from a supplier (stock in) |

---

## 2. Overall Description

### 2.1 Users and roles
Roles are stored on the employee record. The system has no login: the client sends `employeeId` with actions, and the backend checks that employee's role. (A "select current employee" dropdown in the UI is enough.)

| Capability | Manager | Cashier |
|---|:--:|:--:|
| Create bills (POS) | Yes | Yes |
| View products, stock, bills | Yes | Yes |
| Add / edit products, categories | Yes | - |
| Manage suppliers | Yes | - |
| Record purchases | **Yes (enforced)** | - |
| Stock adjustment | **Yes (enforced)** | - |
| Manage employees | Yes | - |
| Dashboard / reports | Yes | - |

"Enforced" = the backend rejects the request if `employeeId` is not an active MANAGER. Other restrictions are applied by the frontend by hiding screens.

### 2.2 Assumptions
- One store, one MySQL database
- Prices are in INR, 2 decimal places
- Selling price is always taken from the product record at billing time

---

## 3. Functional Requirements

### 3.1 Employee management
| ID | Requirement |
|---|---|
| FR-EMP-1 | Add an employee with name, phone and role (MANAGER / CASHIER) |
| FR-EMP-2 | Edit employee details and role |
| FR-EMP-3 | Deactivate an employee (no hard delete, bills refer to them) |
| FR-EMP-4 | Inactive employees cannot create bills, purchases or adjustments |

### 3.2 Category & product management
| ID | Requirement |
|---|---|
| FR-PRD-1 | CRUD for categories (name unique). Deleting a category in use is rejected |
| FR-PRD-2 | Add product: name, optional barcode (unique), category, unit, selling price, cost price, reorder level, opening stock |
| FR-PRD-3 | Edit product details. Stock cannot be edited here; it changes only via purchase, sale or adjustment |
| FR-PRD-4 | Deactivate product (soft delete). Inactive products are hidden and cannot be billed |
| FR-PRD-5 | Search products by name; find a product by barcode |
| FR-PRD-6 | Opening stock creates an OPENING stock movement |

### 3.3 Inventory tracking
| ID | Requirement |
|---|---|
| FR-INV-1 | Every product shows its current stock quantity |
| FR-INV-2 | Low-stock list: products where stock <= reorder level |
| FR-INV-3 | Stock can never go below zero |
| FR-INV-4 | Manager can adjust stock (+/-) with a mandatory reason (damage, expiry, count correction) |

### 3.4 Supplier & purchases
| ID | Requirement |
|---|---|
| FR-SUP-1 | CRUD for suppliers (name, phone, address). Supplier with purchases cannot be deleted |
| FR-PUR-1 | Manager records a purchase: supplier, invoice no, date, list of (product, quantity, unit cost) |
| FR-PUR-2 | On save: stock increases, product cost price updates to the latest unit cost, PURCHASE movements are written, all in one transaction |
| FR-PUR-3 | Purchase total = sum of line totals (calculated by the server) |
| FR-PUR-4 | View purchase list and purchase details |

### 3.5 Point-of-sale billing (normal billing only)
| ID | Requirement |
|---|---|
| FR-POS-1 | Create a bill with one or more (product, quantity) lines, payment mode (CASH / UPI / CARD), optional flat discount |
| FR-POS-2 | Unit price is read from the product (client cannot override it) and stored on the bill line |
| FR-POS-3 | Net amount = total - discount. Discount cannot be negative or exceed the total |
| FR-POS-4 | On save: stock decreases and SALE movements are written, in one transaction. If any item has insufficient stock, the whole bill is rejected |
| FR-POS-5 | Bill gets an auto number: `BILL-000001` |
| FR-POS-6 | Bill records the employee who created it |
| FR-POS-7 | View bill list (optionally filter by date) and bill details (for reprint) |

### 3.6 Stock movement history
| ID | Requirement |
|---|---|
| FR-STK-1 | Every stock change writes one movement: product, type (OPENING / PURCHASE / SALE / ADJUSTMENT), quantity change (+/-), balance after, reference id, note, employee, timestamp |
| FR-STK-2 | Movements are never edited or deleted |
| FR-STK-3 | History can be viewed for one product or for all products, newest first, paginated |

### 3.7 Dashboard
| ID | Requirement |
|---|---|
| FR-DSH-1 | Show: total active products, low-stock count, supplier count, today's bill count, today's sales amount |

---

## 4. Business Rules
1. Stock is changed in exactly one place (`StockService`), and every change creates a movement row.
2. `balanceAfter` in a movement always equals the product's stock right after that change.
3. Billing, purchase and adjustment are each a single DB transaction. Any failure rolls back everything.
4. Prices and totals are always calculated on the server.
5. Employees, products are soft-deleted; bills and history remain valid forever.

---

## 5. Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR-1 | REST/JSON API, standard HTTP status codes (201 create, 400 validation, 404 missing, 409 conflict) |
| NFR-2 | Input validation on all write APIs with clear error messages |
| NFR-3 | Money uses `BigDecimal` / `DECIMAL`, never floating point |
| NFR-4 | Simple layered code: Controller -> Service -> Repository |
| NFR-5 | Runs locally with one command (`mvn spring-boot:run`); schema auto-created; sample data seeded on first run |
| NFR-6 | Billing API responds in under 1 second for a normal bill (up to ~50 lines) |
| NFR-7 | No authentication or encryption (explicit non-goal for this portfolio scope) |

---

## 6. Data Model

```
Category 1---* Product
Supplier 1---* Purchase 1---* PurchaseItem *---1 Product
Employee 1---* Bill     1---* BillItem     *---1 Product
Product  1---* StockMovement      Employee 1---* StockMovement (performed_by)
Employee 1---* Purchase (created_by)
```

| Table | Main columns |
|---|---|
| employee | id, name, phone, role, active |
| category | id, name (unique) |
| product | id, name, barcode (unique), category_id, unit, selling_price, cost_price, stock_qty, reorder_level, active |
| supplier | id, name, phone, address |
| purchase | id, supplier_id, created_by, invoice_no, purchase_date, total_amount |
| purchase_item | id, purchase_id, product_id, quantity, unit_cost, line_total |
| bill | id, bill_number, employee_id, bill_date, total_amount, discount, net_amount, payment_mode |
| bill_item | id, bill_id, product_id, quantity, unit_price, line_total |
| stock_movement | id, product_id, type, quantity_change, balance_after, reference_id, note, performed_by, created_at |

---

## 7. REST API Summary

| Area | Endpoints |
|---|---|
| Employees | `GET/POST /api/employees`, `GET/PUT/DELETE /api/employees/{id}` |
| Categories | `GET/POST /api/categories`, `PUT/DELETE /api/categories/{id}` |
| Products | `GET /api/products?search=`, `GET /api/products/low-stock`, `GET /api/products/barcode/{code}`, `GET/PUT/DELETE /api/products/{id}`, `POST /api/products` |
| Suppliers | `GET/POST /api/suppliers`, `GET/PUT/DELETE /api/suppliers/{id}` |
| Purchases | `GET/POST /api/purchases`, `GET /api/purchases/{id}` |
| Billing | `GET /api/bills?date=`, `POST /api/bills`, `GET /api/bills/{id}` |
| Stock | `GET /api/stock/movements?productId=&page=&size=`, `POST /api/stock/adjust` |
| Dashboard | `GET /api/dashboard` |

---

## 8. Frontend Screens (React, next phase)
1. Dashboard
2. POS / Billing (product search + barcode input, cart, discount, payment mode, save)
3. Bills list + bill detail
4. Products (list, add/edit, low-stock tab)
5. Categories
6. Suppliers
7. Purchases (list, new purchase)
8. Stock history (filter by product) + stock adjustment
9. Employees
10. "Working as" employee selector in the header (replaces login)

---

## 9. Delivery Plan
1. Backend API (this delivery)
2. React: layout, products, categories, suppliers
3. React: purchases, POS billing
4. React: stock history, dashboard, employees
5. README with screenshots, resume bullets
