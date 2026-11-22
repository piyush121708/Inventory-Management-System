import { request } from './client';

export const get = (path) => request(path);
export const post = (path, body) => request(path, 'POST', body);
export const put = (path, body) => request(path, 'PUT', body);
export const del = (path) => request(path, 'DELETE');
