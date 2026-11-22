import { get, post } from './http';

export const getBills = (date = '') => get(date ? `/bills?date=${date}` : '/bills');
export const getBill = (id) => get(`/bills/${id}`);
export const createBill = (data) => post('/bills', data);
