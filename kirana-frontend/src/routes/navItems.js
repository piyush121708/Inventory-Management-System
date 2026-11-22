// managerOnly items are hidden for cashiers (see SRS section 2.1)
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', managerOnly: true },
  { to: '/billing', label: 'Billing' },
  { to: '/bills', label: 'Bills' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories', managerOnly: true },
  { to: '/suppliers', label: 'Suppliers', managerOnly: true },
  { to: '/purchases', label: 'Purchases', managerOnly: true },
  { to: '/stock', label: 'Stock' },
  { to: '/employees', label: 'Employees', managerOnly: true },
];
