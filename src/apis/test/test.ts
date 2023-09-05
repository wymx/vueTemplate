import request from '../../utils/request';
import type { testModel } from './testModel';
// get请求示例
export const getTest = () => {
  return request.get<testModel>('/xxx');
};
// post请求示例
export const postTest = () => {
  return request.post<testModel>('/xxx');
};
