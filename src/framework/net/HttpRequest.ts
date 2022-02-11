import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
// import { getBaseURL } from './baseURL'

// const baseURL = getBaseURL()

const axios: AxiosInstance = Axios.create({

 baseURL: 'http://192.168.110.113:8071',

  // baseURL : 'http://192.168.110.60:8848',
 
  timeout: 20000, // 请求超时 20s
})

interface IAxiosRequestConfig extends AxiosRequestConfig {
  showError?: boolean
}

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config: IAxiosRequestConfig): IAxiosRequestConfig => {
    
    const configProps = config || {}
    configProps.params = config.params ? config.params : {}
    let params = config.data || undefined
    params = params ? JSON.stringify(params) : ''

    return configProps
  },
  (error) => Promise.reject(error)
)

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {

    console.log("return");
    console.log()

    return response.data.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axios
