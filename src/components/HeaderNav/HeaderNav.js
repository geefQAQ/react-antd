import React from 'react'
import { Icon, Button, Menu } from 'antd'
import './HeaderNav.less'

const SubMenu = Menu.SubMenu
// const MenuItemGroup = Menu.ItemGroup

export default class HeaderNav extends React.Component {
  state = {
    current: 'mail'
  }

  handleClick = (e) => {
    this.setState({
      current: e.key
    })
    this.props.menuClick(e.key)
  }

  render () {
    const {
      list
    } = this.props
    return (
      <div className="m-header">
        <Button type="primary" size="small" onClick={this.props.toggleSider} >
          <Icon type={this.props.siderFold ? 'menu-fold' : 'menu-unfold'} />
        </Button>
        {
          list && list.length > 0
          ? list.map(item => {
            return  <div key = {item.key}>{item.title}：{item.value}</div>
          })
          : null
        }
        <div className="m-header--right">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <SubMenu
              title={<span><Icon type="user" />{this.props.user.username}</span>}
            >
              {/* <Melnu.Item key="setting"><Icon type="setting" />设置</Menu.Item> */}
              <Menu.Item key="logout"><Icon type="logout" />注销</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    )
  }
}
