import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Router from '@/router'
import store from '@/store'

import '@/assets/styles/index.less'

render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
)
