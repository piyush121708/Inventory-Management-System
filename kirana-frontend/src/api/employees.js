import { get, post, put, del } from './http';

export const getEmployees = () => get('/employees');
export const createEmployee = (data) => post('/employees', data);
export const updateEmployee = (id, data) => put(`/employees/${id}`, data);
export const deactivateEmployee = (id) => del(`/employees/${id}`);
