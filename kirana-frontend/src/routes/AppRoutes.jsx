import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RoleRoute from './RoleRoute';
import HomeRedirect from './HomeRedirect';
import DashboardPage from '../pages/dashboard/DashboardPage';
import BillingPage from '../pages/billing/BillingPage';
import BillsPage from '../pages/bills/BillsPage';
import BillDetailPage from '../pages/bills/BillDetailPage';
import ProductsPage from '../pages/products/ProductsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import SuppliersPage from '../pages/suppliers/SuppliersPage';
import PurchasesPage from '../pages/purchases/PurchasesPage';
import NewPurchasePage from '../pages/purchases/NewPurchasePage';
import StockPage from '../pages/stock/StockPage';
import EmployeesPage from '../pages/employees/EmployeesPage';

const manager = (page) => <RoleRoute>{page}</RoleRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeRedirect />} />
        <Route path="dashboard" element={manager(<DashboardPage />)} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="bills" element={<BillsPage />} />
        <Route path="bills/:id" element={<BillDetailPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={manager(<CategoriesPage />)} />
        <Route path="suppliers" element={manager(<SuppliersPage />)} />
        <Route path="purchases" element={manager(<PurchasesPage />)} />
        <Route path="purchases/new" element={manager(<NewPurchasePage />)} />
        <Route path="stock" element={<StockPage />} />
        <Route path="employees" element={manager(<EmployeesPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
