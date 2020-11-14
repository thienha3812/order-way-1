import axios from 'axios';

const apiConfig = axios.create({
  baseURL: 'https://api.orderway.vn/api/',
  timeout: 5000,
});
apiConfig.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token !== '') {
    config.headers['token'] = token
  }
    return config
},(err)=>{
  Promise.reject(err)
})
export default apiConfig;
