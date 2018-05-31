import { combineReducers } from 'redux'

import { LOGIN } from '@/utils/constants'
import { loadStore } from '@/utils/util'

const token = loadStore('token')
const uname = loadStore('username')
const remb = loadStore('remember')

const user = {
  username: uname,
  isLogin: !!token,
  role: '',
  remember: remb === true
}

const username = (state = user.username, action) => {
  switch (action.type) {
    case LOGIN:
      return action.username
    default:
      return state
  }
}

const isLogin = (state = user.isLogin, action) => {
  switch (action.type) {
    case LOGIN:
      return action.isLogin
    default:
      return state
  }
}

const role = (state = user.role, action) => {
  switch (action.type) {
    case LOGIN:
      return action.role
    default:
      return state
  }
}

const remember = (state = user.remember, action) => {
  switch (action.type) {
    case LOGIN:
      return action.remember
    default:
      return state
  }
}

export default combineReducers({
  username,
  isLogin,
  role,
  remember
})
