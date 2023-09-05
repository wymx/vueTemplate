// import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { AxiosCancel } from './cancel';
import { AxiosRetry } from './retry';
// import { AxiosLoading } from './loading';

import router from '@/router';

interface axiosConfig {
  successMessage?: boolean;
  errorMessage?: boolean;
  cancelSame?: boolean;
  retryCount?: number;
  isRetry?: boolean;
  loading?: boolean;
}

const defaultConfig: axiosConfig = {
  successMessage: false,
  errorMessage: true,
  cancelSame: false,
  isRetry: false,
  retryCount: 3,
  loading: true,
};

/*
 * 创建实例
 * 与后端服务通信
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10 * 1000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=UTF-8', 'x-platform': 'PC' },
});

// const axiosLoaing = new AxiosLoading();
const axiosCancel = new AxiosCancel();

/**
 * 请求拦截器
 * 功能：配置请求头
 */
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // @ts-ignore
  const { cancelSame } = config.requestOptions;
  if (cancelSame) {
    axiosCancel.addPending(config);
  }
  // axiosLoaing.addLoading();
  // 获取ticket
  const ticket = 'ssss';
  if (ticket) {
    config.headers['ticket'] = ticket;
  }
  //固定传值区，分平台
  config.headers['platform'] = 'PC';

  return config;
});

/**
 * 响应拦截器
 * 功能：处理异常
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;
    axiosCancel.removePending(response.config);
    // axiosLoaing.closeLoading();
    // console.log(data);

    if (data.respCode === '0000' || data.respCode === '4444') {
      return data.data;
    } else if (data.respCode === '0006' || data.respCode === '0002') {
      console.log('登录信息过期，请重新登录');
      router.push('/login');
      return data;
    } else if (
      data.respCode === '0007' ||
      data.respCode === '0014' ||
      data.respCode === '0005' ||
      data.respCode === '0001'
    ) {
      // return Promise.reject(data); // 注释掉可以reject添加自定义报错信息
      return data;
    }
  },
  (err) => {
    // axiosLoaing.closeLoading();
    if (err.code === 'ERR_CANCELED') return;
    const { isRetry, retryCount } = err.config.requestOptions;
    if (isRetry && (err.config._retryCount || 0) < retryCount) {
      const axiosRetry = new AxiosRetry();
      axiosRetry.retry(service, err);
      return;
    }
    axiosCancel.removePending(err.config || {});
    // 处理被取消的请求
    if (axios.isCancel(err)) return console.error('请求的重复请求：' + err.message);
    const message = axiosCancel.httpErrorStatusHandle(err); // 处理错误状态码
    console.log(message);

    return Promise.reject(err.response);
  },
);

const request = {
  get<T = any>(url: string, params?: any, config?: axiosConfig): Promise<T> {
    return request.request('GET', url, { params }, config);
  },
  post<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request('POST', url, { data }, config);
  },
  put<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request('PUT', url, { data }, config);
  },
  delete<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request('DELETE', url, { data }, config);
  },
  download<T = any>(url: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const config = {
        headers: { 'Content-Type': 'application/json', resposeType: 'blob', platform: 'PC' },
        // headers: { resposeType: 'arraybuffer' },
      };
      axios
        .get(url, config)
        .then((resp) => {
          if (resp.status == 200) {
            // const url = window.URL.createObjectURL(new Blob([resp.data], { type: resp.headers['content-type'] }));
            const newstring = url.substring(url.length - 4, url.length);
            if (['.png', '.jpg', 'jpeg', '.bmp', '.gif', 'webp', '.psd', '.svg', 'tiff'].indexOf(newstring) !== -1) {
              url = url + '?response-content-type=application/octet-stream';
            }
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.setAttribute('download', data.name);
            a.download = data.name;
            document.body.appendChild(a);
            a.click(); //执行下载
            window.URL.revokeObjectURL(a.href); //释放url
            document.body.removeChild(a); //释放标签

            // const blob = new Blob([resp.data], { type: resp.headers['content-type'] }); //type这里表示默认的下载文件类型为xlsx类型
            // const downloadElement = document.createElement('a');
            // const href = window.URL.createObjectURL(blob); //创建下载的链接
            // downloadElement.href = href;
            // downloadElement.download = data.name; //下载后文件名
            // document.body.appendChild(downloadElement);
            // downloadElement.click(); //点击下载
            // document.body.removeChild(downloadElement); //下载完成移除元素
            // window.URL.revokeObjectURL(href);

            const back = <any>{ msg: '下载成功' };
            resolve(back);
          } else {
            reject({ msg: '下载失败' });
          }
          // resolve({ host: ossConf.host });
        })
        .catch((err) => reject(err));
    });
  },
  request<T = any>(method = 'GET', url: string, data?: any, config?: axiosConfig): Promise<T> {
    const options = Object.assign({}, defaultConfig, config);
    return new Promise((resolve, reject) => {
      service({ method, url, ...data, requestOptions: options })
        .then((res) => {
          // console.log('--------', res);

          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          // console.log('+++++', e);
          reject(e);
        })
        .finally(() => {
          //   console.log('请求结束');
        });
    });
  },
};

export default request;
