# G-super mart - React Frontend

React 18 + Vite + React Router. Font: Nunito (bundled, no internet needed).
Talks to the Spring Boot `kirana-backend` at `http://localhost:8080/api`.

## Run
1. Start MySQL and the backend (`mvn spring-boot:run` in `kirana-backend`).
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173 (the port is fixed because the backend CORS only allows 5173 and 3000).

To point at another backend, copy `.env.example` to `.env` and change `VITE_API_URL`.

## How "login" works
The backend has no authentication (see SRS 2.1). Use the **Working as** dropdown in the top bar.
Its employee id is sent with bills, purchases and stock adjustments.
Cashiers see Billing, Bills, Products and Stock. Managers see everything.
Only purchases and stock adjustments are enforced by the backend; the rest is hidden in the UI.

## Folder structure
```
src/
  api/         one file per backend controller (client.js = fetch + error handling)
  context/     EmployeeContext (working-as), ToastContext
  hooks/       useFetch, useForm, useSubmit, useAction, useDebounce
  components/  layout/ (top bar, header, nav) and ui/ (modal, field, pager ...)
  routes/      AppRoutes, RoleRoute, navItems
  pages/       dashboard, billing, bills, products, categories,
               suppliers, purchases, stock, employees
  styles/      theme.css (colors, font), layout.css, ui.css, pages.css
```

## Manual test checklist (run against the live backend)
- [ ] Top bar dropdown lists Ramesh (MANAGER) and Suresh (CASHIER)
- [ ] Manager: Dashboard shows 5 seeded products, low stock list shows Lays Classic
- [ ] Products: add, edit, remove; duplicate barcode shows the backend message
- [ ] Categories / Suppliers: add, edit; deleting one in use shows the 409 message
- [ ] Billing: add by search and by barcode (8900000000011), discount, save; stock drops
- [ ] Bills: filter by date, open a bill, print
- [ ] Purchases: record one; stock goes up; Stock page shows a PURCHASE row
- [ ] Stock: adjust with a negative number larger than stock shows the backend error
- [ ] Employees: add, edit, deactivate; dropdown updates
- [ ] Switch to Suresh: manager pages disappear from the nav and show "Only a manager..."
- [ ] Stop the backend: a red banner appears at the top
