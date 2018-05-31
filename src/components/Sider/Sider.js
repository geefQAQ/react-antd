import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import { Logo, SideMenu } from '@/components'
import { arrayToTree } from '@/utils/util'
import './Sider.less'

const SubMenu = Menu.SubMenu

export default class Sider extends React.Component {
  render () {
    const { logo, sitename, siderWidth, siderFold, menuList, selectMenuKey, onMenuSelect, openMenuKey, onMenuOpenChange } = this.props
    return (
      <div className="m-siderwapper">
        <Link to="/">
          <Logo
            logo={logo}
            sitename={sitename}
            siderFold={siderFold}
          />
        </Link>
        <div className="m-menulist" style={{ width: siderWidth }}>
          <SideMenu
            selectMenuKey={selectMenuKey}
            openMenuKey={openMenuKey}
            siderFold={siderFold}
            menuList={menuList}
            onMenuSelect={onMenuSelect}
            onMenuOpenChange={onMenuOpenChange}
          />
        </div>
      </div>
    )
  }
}
