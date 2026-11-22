import { get, post, put, del } from './http';

export const getProducts = (search = '') => get(`/products?search=${encodeURIComponent(search)}`);
export const getLowStock = () => get('/products/low-stock');
export const getByBarcode = (code) => get(`/products/barcode/${encodeURIComponent(code)}`);
export const createProduct = (data) => post('/products', data);
export const updateProduct = (id, data) => put(`/products/${id}`, data);
export const deactivateProduct = (id) => del(`/products/${id}`);
