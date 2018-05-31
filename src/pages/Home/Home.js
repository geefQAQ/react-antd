import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { message, Modal } from 'antd'
import _ from 'lodash'
import { routes } from '@/router'
import NoPermisionPage from '@/pages/403/403'
import { Sider, HeaderNav, Footer } from '@/components'
import { loadMenu } from '@/store/actions'
import { TOGGLESIDER, LOAD_MENU, SELECTMENU, CHANGEOPENMENUKEY } from '@/utils/constants'
import { logo, sitename, API } from '@/utils/config'
import { GET, POST } from '@/utils/service'
import { arrayToTree, setStore, loadStore } from '@/utils/util'
import './Home.less'

class Home extends React.Component {
  state = {
    site: '',
    loading: false
  }
  // list = [
  //   {key:'0',title:'所属银行',value:'郑州银行'},
  //   {key:'1',title:'姓名',value:'张小明'},
  //   {key:'2',title:'所属岗位',value:'经理'},
  // ]
  componentDidMount () {
    const { user, location, history, dispatch, app } = this.props
    const { pathname } = location
    // const routeMenu = app.menuList.filter(_ => pathname === _.uri)
    // const currentKey = routeMenu.length > 0 ? String(routeMenu[0]._id) : ''
    // const localselectMenuKey = loadStore('selectMenuKey').split(',')
    // if (!localselectMenuKey.some(_ => _ === currentKey)) {
    //   dispatch({
    //     type: SELECTMENU,
    //     selectKey: [currentKey]
    //   })
    // }

    if (pathname === '/login') {
      return
    }
    if (!user.isLogin) {
      Modal.warning({
        title: '提示！',
        content: '登录已过期，请重新登陆',
        onOk: () => {
          if (pathname !== '/') {
            history.push(`/login?from=${encodeURIComponent(pathname.substr(1))}`)
          } else {
            history.push('/login')
          }
        }
      })
      return
    }

    GET(API.menus)
      .then(data => {
        console.log('menus------>',data)
        dispatch({ type: LOAD_MENU, items: data })
        const localselectMenuKey = loadStore('selectMenuKey').split(',') // 拿到本地保存的key
        const routeMenu = data.filter(_ => pathname === _.uri) // 当前路由对应的菜单
        let currentKey = routeMenu.length > 0 ? String(routeMenu[0]._id) : '' // 找到对应菜单，拿到id值
        currentKey = currentKey || localselectMenuKey[0]
        if (pathname !== '/' && !localselectMenuKey.some(_ => _ === currentKey)) {
          // 不是首页，本地没有保存当前路由值
          dispatch({
            type: SELECTMENU,
            selectKey: [currentKey]
          })
        }
      })
  }

  toggleSider = () => {
    this.props.dispatch({
      type: TOGGLESIDER,
      width: this.props.app.siderFold ? 80 : 256
    })
  }

  logout () {
    // POST('/api/logout').then(data => {
    setStore('token', '')

    this.props.history.push('/login')
    // })
  }

  render () {
    const { app, user, dispatch, location } = this.props
    if (location.pathname === '/login') {
      return this.props.children
    }
    let menuList = app.menuList.filter(_ => _.isShow)
    let hasPermission = true
    if (
      routes.filter(_ => _.path === location.pathname).length > 0 && // 当前路由在路由列表里面（部分带参数的路由可以访问）
      menuList.length > 0 && // 菜单列表不为空
      menuList.filter(_ => _.uri === location.pathname).length === 0 // 当前路由不在菜单列表里面，视为没有权限访问页面
    ) {
      hasPermission = false
    }
    menuList = arrayToTree(menuList, '_id')

    const siderProps = {
      logo,
      sitename,
      siderWidth: app.siderWidth,
      siderFold: app.siderFold,
      menuList,
      selectMenuKey: app.selectMenuKey,
      openMenuKey: app.openMenuKey,
      onMenuOpenChange: keys => {
        dispatch({
          type: CHANGEOPENMENUKEY,
          openKey: keys
        })
      },
      onMenuSelect: ({ item, key, selectedKeys }) => {
        dispatch({
          type: SELECTMENU,
          selectKey: selectedKeys
        })
      }
    }

    const headerProps = {
      siderFold: app.siderFold,
      toggleSider: this.toggleSider,
      user,
      menuClick: key => {
        switch (key) {
          case 'setting':
            message.info('功能暂未开通')
            break
          case 'logout':
            this.logout()
            break
          default:
            message.info('功能未知')
        }
      }
    }
    return (
      <div className="g-global">
        <div className="m-sider" style={{ width: app.siderWidth }}>
          <Sider {...siderProps} />
        </div>
        <div className="m-main" style={{ marginLeft: app.siderWidth }}>
          <HeaderNav {...headerProps} list={this.list}/>
          <div className="m-container">
            {hasPermission ? this.props.children : <NoPermisionPage />}
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, user }) => ({ app, user })

export default withRouter(connect(mapStateToProps)(Home))
