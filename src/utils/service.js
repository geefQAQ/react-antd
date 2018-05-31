import axios from 'axios'
import { Modal, message } from 'antd'
import _ from 'lodash'
import * as np from 'nprogress'
import { loadStore, getType } from './util'
// import { baseUrl } from './config'
// import { Redirect } from 'react-router-dom'

np.configure({ speed: 500 })

axios.defaults.baseURL = window.baseUrl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

function fetchData (url, options, method = 'GET') {
  let localAuth = loadStore('token')
  let f = window.location.hash.substr(2)
  if (!localAuth && f.indexOf('login') !== 0) {
    // console.log('no token')
    return Promise.resolve({ status: 500 })
  }
  np.start()
  let config = {
    url,
    method,
    headers: {
      Authorization: localAuth
    },
    timeout: 100000,
    validateStatus: function (status) {
      return status >= 200 && status < 500
    }
  }
  if (method.toLowerCase() === 'get') {
    config = {
      ...config,
      params: options
    }
  } else {
    config = {
      ...config,
      data: options
    }
  }

  // axios.interceptors.request.use(config => {
  //   // Do something before request is sent
  //   console.log(config)
  //   return config
  // }, error => {
  //   // Do something with request error
  //   return Promise.reject(error)
  // })

  return axios(config)
    .then(data => {
      np.done()
      if (data.status === 401) {
        Modal.warning({
          title: '提示！',
          content: '登录已过期，请重新登陆',
          onOk: () => {
            window.location.href = `/#/login?from=${encodeURIComponent(f)}`
          }
        })
      }
      let result = _.cloneDeep(data.data)
      if (getType(result) === 'object') {
        result.status = data.status
      }
      if (data.status >= 400) {
        message.error(result.message || `发生错误：${data.status}`)
      }
      return Promise.resolve(result)
    })
    .catch(e => {
      np.done()
      if (e.message !== 'out route') {
        message.error(e.message)
        // console.log(`something error when you ${method} the request ${url}: `, e)
      }
      return Promise.reject(e)
    })
}

/**
 * GET请求
 * @param url 请求地址
 * @param options 请求参数
 */
export function GET (url, options) {
  return fetchData(url, options, 'GET')
}

/**
 * POST请求
 * @param url 请求地址
 * @param options 请求参数
 */
export function POST (url, options) {
  return fetchData(url, options, 'POST')
}

export function PUT (url, options) {
  return fetchData(url, options, 'PUT')
}

export function DELETE (url, options) {
  return fetchData(url, options, 'DELETE')
}
