import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import './SideMenu.less'

const { SubMenu, Item } = Menu

const getMenus = (menuTree = [], siderFold) => menuTree.map(item => {
  if (item.children) {
    return <SubMenu
      key={item._id}
      title={<span>
        {item.icon && <Icon type={item.icon} />}
        <span>{item.label}</span>
      </span>}
    >
      {getMenus(item.children, siderFold)}
    </SubMenu>
  }
  return <Item key={item._id}>
    <Link to={item.uri}>
      {item.icon && <Icon type={item.icon} />}
      <span>{item.label}</span>
    </Link>
  </Item>
})

class SideMenu extends React.Component {
  render () {
    const { siderFold, menuList, openMenuKey, selectMenuKey, onMenuSelect, onMenuOpenChange } = this.props
    return (
      <Menu
        defaultSelectedKeys={selectMenuKey}
        selectedKeys={selectMenuKey}
        defaultOpenKeys={openMenuKey}
        mode="inline"
        theme={'light'}
        inlineCollapsed={!siderFold}
        onOpenChange={onMenuOpenChange}
        onSelect={onMenuSelect}
      >
        {getMenus(menuList, siderFold)}
      </Menu>
    )
  }
}

SideMenu.propTypes = {
  siderFold: PropTypes.bool.isRequired,
  menuList: PropTypes.array.isRequired,
  openMenuKey: PropTypes.array,
  selectMenuKey: PropTypes.array,
  onMenuSelect: PropTypes.func,
  onOpenChange: PropTypes.func
}

export default SideMenu
