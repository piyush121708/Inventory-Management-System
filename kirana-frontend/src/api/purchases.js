import { get, post } from './http';

export const getPurchases = () => get('/purchases');
export const getPurchase = (id) => get(`/purchases/${id}`);
export const createPurchase = (data) => post('/purchases', data);
