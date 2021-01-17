import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const configJson: AxiosRequestConfig = {
  headers: {
    'Content-type': 'application/json'
  }
}

export const api: AxiosInstance = axios.create(configJson)

export const get = (path: string): Promise<AxiosResponse<any>> => {
  const token = window.localStorage.getItem('@ella-web')
  api.defaults.headers.Authorization = `Bearer ${token}`
  return api.get(path)
}

api.interceptors.response.use(undefined, err => {
  const error = err.response

  // if (error.data.code === 'token_not_valid') {
  //   console.log('token espirou')
  //   return
  // }

  return error
})
