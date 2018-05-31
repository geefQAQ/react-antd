import React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'

// import createBrowserHistory from 'history/createBrowserHistory'
import createHistory from 'history/createHashHistory'
import AsyncComponent from './AsyncComponent'

import Home from '@/pages/Home/Home'
// import Test from '@/pages/Test/Test'

const history = createHistory()
const supportsHistory = 'pushState' in window.history

export const routes = [{
  path: '/eleAccount',
  component: () => import('@/pages/EleAccount/EleAccount.js')//二类户暂时
}, {
  path: '/userManage',
  component: () => import('@/pages/UserManage/UserManage')//人员管理暂时
}, {
  path: '/register',
  component: () => import('@/pages/Register/Register')//人员注册
}, {
  path: '/dashboard',
  component: () => import('@/pages/Dashboard/Dashboard')
}, {
  path: '/login',
  component: () => import('@/pages/Login/Login')
}, {
  path: '/eaccountstatis',
  component: () => import('@/pages/EAccountStatis/EAccountStatis')
}, {
  path: '/menus',
  component: () => import('@/pages/MenuEditor/MenuEditor')
}, {
  path: '/loan/prodlist',
  component: () => import('@/pages/FinancialMall/LoanProductList/LoanProductList')
}, {
  path: '/loan/component',
  component: () => import('@/pages/FinancialMall/LoanFormComponents/LoanFormComponents')
}, {
  path: '/loan/check',
  component: () => import('@/pages/FinancialMall/LoanProductCheck/LoanProductCheck')
}, {
  path: '/loan/check/:id',
  component: () => import('@/pages/FinancialMall/LoanProductCheck/LoanProductCheck')
}, {
  path: '/loan/form',
  component: () => import('@/pages/FinancialMall/LoanProductForm/LoanProductForm')
}, {
  path: '/loan/form/:id',
  component: () => import('@/pages/FinancialMall/LoanProductForm/LoanProductForm')
}, {
  path: '/loan/formgroup/:id',
  component: () => import('@/pages/FinancialMall/LoanFormGroup/LoanFormGroup')
}, {
  path: '/order/cartogram',
  component: () => import('@/pages/OrderManage/OrderCartogram/OrderCartogram')
}, {
  path: '/order/list',
  component: () => import('@/pages/OrderManage/OrderList/OrderList')
}, {
  path: '/order/view/:id',
  component: () => import('@/pages/OrderManage/OrderView/OrderView')
}]

const router = (props) => (
  <Router history={history} forceRefresh={!supportsHistory}>
    <Home>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/dashboard"/>} />
        {routes.map(({ path, component }, index) => (
          <Route
            key={index}
            exact
            path={path}
            component={AsyncComponent(component)}
          />
        ))}
        <Route component={AsyncComponent(() => import('@/pages/404/404'))} />
      </Switch>
    </Home>
  </Router>
)

export default router
