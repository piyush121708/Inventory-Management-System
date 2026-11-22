import { get, post } from './http';

export const getMovements = (productId, page = 0, size = 20) => {
  const product = productId ? `productId=${productId}&` : '';
  return get(`/stock/movements?${product}page=${page}&size=${size}`);
};
export const adjustStock = (data) => post('/stock/adjust', data);
