/*
 * @Author
 * @Date: 2021-07-23 09:38:49
 * @LastEditTime: 2021-11-15 16:55:14
 * @Description: 不同环境下对应地址
 */
interface BaseURL {
  development: string
  test: string
  uat: string
  production: string
}

// 对应的请求地址
const baseURL: BaseURL = {
  development: 'http://192.168.110.113:8071',
  test: 'https://...com',
  uat: 'https://...com',
  production: 'https://...com',
}


/**
 * 根据环境变量获取域名
 */
export const getBaseURL = () =>{
   return baseURL[process.env.NODE_ENV as keyof BaseURL] || baseURL.production
}
