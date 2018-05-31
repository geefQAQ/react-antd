import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button, Popconfirm, message, Modal } from 'antd'
import { EditableMenuForm } from '@/components'
import { arrayToTree, loadStore } from '@/utils/util'
import { API } from '@/utils/config'
import { POST, DELETE, GET } from '@/utils/service'
import { loadMenu, addMenuRow, updateMenuRow, delMenuRow } from '@/store/actions'
import { TOGGLESIDER, LOAD_MENU, SELECTMENU, CHANGEOPENMENUKEY } from '@/utils/constants'
import './MenuEditor.less'

class MenuEditor extends React.Component {
  state = {
    selectedKey: '',
    selectedRowData: {},
    showEditableForm: false,
    formModalTitle: '',
    editType: ''
  }
  componentDidMount(){
    //登录校验
    const { user, location, history, dispatch, app } = this.props
    const { pathname } = location
    if (pathname === '/login') {
      return
    }
    const token = loadStore('token')
    if (!token) {
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
    //登录校验结束
    GET(API.menusEditor)
    .then(data => {
      console.log('menusEditor------>',data)
      dispatch({ type: LOAD_MENU, items: data })
    })
  }
  enterEditor (type, record = {}) {
    this.setState({
      showEditableForm: true,
      formModalTitle: type === 'edit' ? '编辑菜单' : '添加菜单',
      editType: type,
      selectedKey: record._id,
      selectedRowData: type === 'edit' ? record : {}
    })
  }

  saveData () {
    const { selectedRowData, editType, selectedKey } = this.state
    const { app, dispatch } = this.props
    const form = this.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      // console.log('Received values of form: ', values)

      // 没有编辑内容
      if (
        selectedRowData.label === values.label &&
        selectedRowData.uri === values.uri &&
        selectedRowData.icon === values.icon &&
        selectedRowData.order === values.order &&
        selectedRowData.isShow === values.isShow
      ) {
        form.resetFields()
        this.setState({ showEditableForm: false })
        return
      }

      if (editType === 'edit') {
        let id = selectedKey
        let obj = {
          ...values,
          id: id
        }
        dispatch(updateMenuRow(obj))
      } else if (editType === 'addsub') {
        let id = selectedKey
        let obj = {
          ...values,
          pid: id
        }
        dispatch(addMenuRow(obj))
      } else {
        dispatch(addMenuRow(values))
      }

      form.resetFields()
      this.setState({ showEditableForm: false })
    })
  }

  addRow (key) {
    // console.log(key)
    let row = {}
    if (!key) {

    }
    // this.props.dispatch(addMenuRow(row))
  }

  editRow (key) {
    // console.log(key)
    let row = {}
    // this.props.dispatch({
    //   type: UPDATEMENUROW,
    //   item: row
    // })
  }

  deleteRow (key) {
    // console.log(key)
    DELETE(API.menus, {
      id: key
    }).then(data => {
      // console.log(data)
      if (data.status === 200) {
        this.props.dispatch(loadMenu())
        // this.props.dispatch(delMenuRow(key))
      }
    })
  }

  cancel () {
    this.form.resetFields()
    this.setState({ showEditableForm: false })
  }

  render () {
    const { app } = this.props
    const mlist = arrayToTree(app.menuList, '_id')
    // console.log(mlist)

    const columns = [{
      title: '菜单名称',
      dataIndex: 'label'
    }, {
      title: '图标icon',
      dataIndex: 'icon',
      render: text => <span><Icon type={text} /> <span> {text}</span></span>
    }, {
      title: '路由地址',
      dataIndex: 'uri'
    }, {
      title: '是否显示',
      dataIndex: 'isShow',
      render: text => text ? '是' : '否'
    }, {
      title: '排序',
      dataIndex: 'order'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return <span>
          <a onClick={() => this.enterEditor('edit', record)}>编辑</a>
          <span> | </span>
          <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteRow(record._id)} okText="确定" cancelText="取消">
            <a>删除</a>
          </Popconfirm>
          <span> | </span>
          <a onClick={() => this.enterEditor('addsub', record)}>添加下级</a>
        </span>
      }
    }]

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      onSelect: (record, selected, selectedRows) => {
        // this.setState({ formSelected: record })
        // console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        // console.log(selected, selectedRows, changeRows)
      }
    }

    return (
      <div className="m-menueditor">
        <div className="page-head">
          <h3>菜单管理</h3>
        </div>
        <div className="page-content">
          <Table
            title={() => (
              <div className="u-table-title">
                <span>{'系统菜单配置'}</span>
                <Button type="primary" icon="plus" size="small" onClick={this.enterEditor.bind(this, 'add')}>添加新菜单</Button>
              </div>
            )}
            size={'small'}
            rowKey={record => record._id}
            columns={columns}
            dataSource={mlist}
            bordered={true}
            defaultExpandAllRows={true}
            pagination={false}
          />
        </div>
        <EditableMenuForm
          ref={node => { this.form = node }}
          visible={this.state.showEditableForm}
          mainTitle={this.state.formModalTitle}
          onCreate={this.saveData.bind(this)}
          onCancel={this.cancel.bind(this)}
          label={this.state.selectedRowData.label || ''}
          uri={this.state.selectedRowData.uri || ''}
          icon={this.state.selectedRowData.icon || ''}
          order={this.state.selectedRowData.order || ''}
          isShow={this.state.selectedRowData.isShow || true}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ app }) => ({ app })

export default connect(mapStateToProps)(MenuEditor)
