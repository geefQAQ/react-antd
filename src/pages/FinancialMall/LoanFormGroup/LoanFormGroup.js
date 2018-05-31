import React from 'react'
import { connect } from 'react-redux'
import { Tree, Modal, Table, Icon, Button, Input, InputNumber, Form, Select, DatePicker, Upload, Affix, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST, PUT, DELETE } from '@/utils/service'
import { API } from '@/utils/config'
import { getRouteParams, loadStore } from '@/utils/util'
import formtypes from '@/mock/formcomponents'

import { loadFormData } from './functions'
import EditGroupModal from './EditGroupModal'
import EditFieldModal from './EditFieldModal'

import './LoanFormGroup.less'

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm

/**
 * 字段关系管理分为 5 层，0~4 分别为
 *  0 第一层，总分组
 *  1 第二层，分组下的常规字段
 *  2 第三层，若第二层的字段存在 radio/list/list_group 字段，此层为这些字段的值
 *  3 第四层，在第三层字段的值下面存在值的分组，属于内部分组
 *  4 第五层，第四层分组下面的字段
 * 数据结构由后台约定好，每一层都有不同的操作，主要是增删改查
 */

class LoanFormGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: getRouteParams(props),
      treeData: [],
      loadingTree: false,
      currentHeader: 0,
      selectedId: '',
      selectedKeys: {}, // 当前选择下所有的id字段

      // group分组编辑框数据
      showEditGroupModal: false,
      selectedGroupId: '', // 当前选择的分组id
      groupModalTitle: '',
      groupName: '',
      isGroupRequired: false,
      groupOrder: 0,
      groupModalState: '', // 编辑状态，添加（add）/ 编辑（edit）
      groupLevel: 0,

      // field 字段编辑框信息数据
      showEditFieldModal: false,
      fieldModalTitle: '',
      selectedFieldIds: [],
      fieldModalFormData: []
    }
    this.hasState = true
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
  }
  componentWillMount () {
    const params = getRouteParams(this.props)
    this.setState({ params }, () => {
      this.loadData()
    })
    loadFormData(data => {
      this.hasState && this.setState({ fieldModalFormData: data })
    })
  }

  componentWillUnmount () {
    this.hasState = false
  }

  // 加载关系树
  loadData = () => {
    this.setState({ loadingTree: true })
    GET('/api/product/form/product', {
      product_id: this.props.match.params.id
    }).then(data => {
      // console.log(data)
      this.hasState && this.setState({ treeData: data, loadingTree: false })
    })
  }

  routeBack = () => {
    // console.log(this.state.params)
    // console.log(this.props.history)
    this.props.history.goBack()
  }

  // 删除弹出提示框
  showDelWaring = cb => {
    confirm({
      title: '确定要删除这一项吗？',
      content: '危险操作，请慎重选择！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: cb
    })
  }

  // 选择每一项
  onSelect = (selectedRecord, info) => {
    const selectedId = selectedRecord[0]
    // console.log('selected', selectedRecord, info)
    this.setState({ selectedId })
  }

  // 处理头部显示
  handleHover = sign => { this.setState({ currentHeader: sign }) }

  renderHeader = sign => {
    switch (sign) {
      case 0:
        return (
          <div className="m-loangroup-header">
            <span>分组名称</span>
            <span>是否必填</span>
          </div>
        )
      case 1:
        return (
          <div className="m-loangroup-header" style={{ paddingLeft: 48 }}>
            <span>名称</span>
            {/* <span>键值</span> */}
            <span>类型</span>
            {/* <span>排序</span> */}
            <span>是否必填</span>
            <span>说明</span>
          </div>
        )
      case 2:
        return (
          <div className="m-loangroup-header" style={{ paddingLeft: 65 }}>
            <span>选项值</span>
          </div>
        )
      case 3:
        return (
          <div className="m-loangroup-header" style={{ paddingLeft: 85 }}>
            <span>分组名称</span>
            <span>是否必填</span>
          </div>
        )
      case 4:
        return (
          <div className="m-loangroup-header" style={{ paddingLeft: 105 }}>
            <span>名称</span>
            {/* <span>键值</span> */}
            <span>类型</span>
            {/* <span>排序</span> */}
            <span>是否必填</span>
            <span>说明</span>
          </div>
        )
      default:
        return (
          <div className="m-loangroup-header">
            <span>分组名称</span>
            <span>是否必填</span>
          </div>
        )
    }
  }

  // 添加分组
  addGroup = () => {
    this.setState({
      showEditGroupModal: true,
      selectedGroupId: '',
      groupModalTitle: '添加分组',
      groupName: '',
      isGroupRequired: false,
      groupOrder: 0,
      groupModalState: 'add',
      groupLevel: 0
    })
  }

  // 添加像 radio/list/list_group 这类子项值的分组字段 (可以与上面方法合并)
  addValueGroup = (e, keys, level) => {
    e.stopPropagation()
    e.preventDefault()
    // console.log(keys, level)
    this.setState({
      selectedKeys: keys,
      showEditGroupModal: true,
      selectedGroupId: '',
      groupModalTitle: '添加分组',
      groupName: '',
      isGroupRequired: false,
      groupOrder: 0,
      groupModalState: 'add',
      groupLevel: level
    })
  }

  // 创建编辑分组，包括添加和编辑
  createGroup = () => {
    const form = this.editGroupModal
    form.validateFields((err, values) => {
      if (!err) {
        const { selectedKeys, groupLevel, groupModalState, selectedGroupId } = this.state
        // console.log(values, groupModalState, selectedKeys)

        // 添加分组 group
        if (groupModalState === 'add') {
          POST(API.loanFormGroups, {
            product_id: this.props.match.params.id,
            group_name: values.groupName,
            required: values.isRequired,
            order: values.order,
            parent_id: groupLevel === 0 ? 0 : selectedKeys.parent_id,
            field_id: groupLevel === 0 ? 0 : selectedKeys.field_id,
            value_id: groupLevel === 0 ? 0 : selectedKeys.value_id
          }).then(data => {
            // console.log(data)
            if (data.status === 200) {
              message.success(data.message)
              this.setState({ showEditGroupModal: false })
              form.resetFields()
              this.loadData()
            }
          })
        }

        if (groupModalState === 'edit') {
          if (
            values.groupName === this.state.groupName &&
            values.isRequired === this.state.isGroupRequired &&
            values.order === this.state.groupOrder
          ) {
            this.setState({ showEditGroupModal: false })
            form.resetFields()
            return
          }
          PUT(API.loanFormGroups, {
            product_id: this.props.match.params.id,
            field_group_id: selectedGroupId,
            group_name: values.groupName,
            required: values.isRequired,
            order: values.order
          }).then(data => {
            if (data.status === 200) {
              message.success(data.message)
              this.setState({ showEditGroupModal: false })
              form.resetFields()
              this.loadData()
            }
          })
        }
      }
    })
  }

  // 管理子级的分组下的字段， 弹出字段编辑框
  showFieldControl = (e, record, level) => {
    e.stopPropagation()
    e.preventDefault()
    // console.log(record)
    let keys = []
    record.fields.forEach(item => {
      keys.push(item.id + '')
    })
    this.setState({
      showEditFieldModal: true,
      selectedGroupId: record.field_group_id,
      fieldModalTitle: '编辑字段',
      selectedFieldIds: keys
    })
  }

  // 隐藏字段编辑框
  hideFieldControl = () => {
    this.setState({
      showEditFieldModal: false,
      fieldModalTitle: '',
      selectedFieldIds: []
    })
  }

  // 字段编辑后结果
  createFieldControl = keys => {
    const keyStr = keys.map(k => parseInt(k, 10)).filter(_ => _ > -1).join(',')
    // console.log(this.state.selectedFieldIds.join(','))
    // console.log(keyStr)
    if (this.state.selectedFieldIds.join(',') === keyStr) {
      this.setState({
        showEditFieldModal: false,
        fieldModalTitle: '',
        selectedFieldIds: []
      })
      return
    }
    POST(API.loanFormProductField, {
      product_id: this.props.match.params.id,
      field_group_id: this.state.selectedGroupId,
      field_id: keyStr
    }).then(data => {
      if (data.status === 200) {
        message.success(data.message)
        this.setState({
          showEditFieldModal: false,
          fieldModalTitle: '',
          selectedFieldIds: []
        })
        this.loadData()
      }
    })
  }

  /**
   * 编辑行，包括每一层，从上至下有五层分别为 0 ~ 5
   * @e 默认事件，保留必填，防止冒泡和默认事件
   * @record 当前数据记录
   * @level 层级，用于标记当前在哪一层级范围
   * @keys 向上层级的 id
   */
  editRow = (e, record, level, keys) => {
    e.stopPropagation()
    e.preventDefault()
    // console.log(record, level)

    // group层，分组
    if (level === 0 || level === 3) {
      // console.log('编辑第一层')
      this.setState({
        selectedKeys: keys || {},
        showEditGroupModal: true,
        selectedGroupId: record.field_group_id,
        groupModalTitle: '编辑分组',
        groupName: record.group_name,
        isGroupRequired: record.required,
        groupOrder: record.order,
        groupModalState: 'edit',
        groupLevel: level
      })
    }
  }

  delRow = (e, record, level, extraData) => {
    e.stopPropagation()
    e.preventDefault()
    // console.log(record)
    this.showDelWaring(() => {
      // console.log('del OK')
      if (level === 0 || level === 3) {
        // 第一层，删除分组
        DELETE(API.loanFormGroups, {
          product_id: this.props.match.params.id,
          field_group_id: record.field_group_id
        }).then(data => {
          if (data.status === 200) {
            this.loadData()
            message.success(data.message)
          }
        })
      }

      if (level === 1 || level === 4) {
        // 第二层，删除分组下的字段
        let currentKeys = extraData.fields.map(_ => _.id).filter(_ => _ !== record.id).join(',')
        POST(API.loanFormProductField, {
          product_id: this.props.match.params.id,
          field_group_id: extraData.field_group_id,
          field_id: currentKeys
        }).then(data => {
          if (data.status === 200) {
            message.success('删除成功！')
            this.loadData()
          }
        })
      }
    })
  }
  onFinish = () => {
    const { history } = this.props
    const id = this.props.match.params.id
    history.push(`/loan/check/${id}`)
  }
  render () {
    return (
      <div style={{ marginTop: -20, padding: '10px 0 40px', overflow: 'hidden', backgroundColor: '#fff' }}>
        <Affix
          style={{ position: 'absolute', top: 48, left: 20, zIndex: 997, padding: '20px 0 0 20px', minWidth: 1140, backgroundColor: '#fff' }}
        >
          <h3>
            <Button type="primary" icon={'left'} onClick={this.routeBack}>返回</Button>
            <div style={{ marginTop: 15 }}>
              <Button style={{ marginRight: 8 }} type="dashed" icon={this.state.loadingTree ? 'loading' : 'reload'} size="small" onClick={this.loadData} />
              <span>{this.state.params.name}</span> / <span>表单字段设置</span>
            </div>
          </h3>
          {this.renderHeader(this.state.currentHeader)}
        </Affix>

        <div style={{ margin: '150px 0 0 20px' }}>
          {this.state.treeData.length > 0 && <Tree
            draggable
            onSelect={this.onSelect}
            onRightClick={() => {}}
            onDrop={() => { message.warn('不支持拖拽！') }}
          >
            {this.state.treeData
              .sort((a, b) => a.order - b.order || a.field_group_id - b.field_group_id)
              .map(group => (
                <TreeNode
                  key={group.field_group_id}
                  title={<Popover placement="right" content={<div>
                    <a onClick={e => { this.editRow(e, group, 0) }}>编辑</a>
                    <span> | </span>
                    <a onClick={e => { this.delRow(e, group, 0) }}>删除</a>
                    <span> | </span>
                    <a onClick={e => { this.showFieldControl(e, group, 0) }}>管理分组字段</a>
                  </div>}>
                    <div className="m-loangroup-label" onMouseOver={() => { this.handleHover(0) }}>
                      <span>{group.group_name || '-'}</span>
                      <span>{group.required ? '是' : '否'}</span>
                    </div>
                  </Popover>}
                >
                  {
                    group.fields &&
                    group.fields.length > 0 &&
                    group.fields
                      .sort((a, b) => a.order - b.order || a.id - b.id)
                      .map(field => (
                        <TreeNode
                          key={`${group.field_group_id}-${field.id}`}
                          title={<Popover placement="right" content={<div>
                            <a onClick={e => { this.delRow(e, field, 1, group) }}>删除</a>
                          </div>}>
                            <div className="m-loangroup-label" onMouseOver={() => { this.handleHover(1) }}>
                              <span>{field.label || '-'}</span>
                              {/* <span>{field.key || '-'}</span> */}
                              <span>{field.type || '-'}</span>
                              {/* <span>{field.order || '0'}</span> */}
                              <span>{field.required ? '是' : '否'}</span>
                              <span>{field.help_text || '-'}</span>
                            </div>
                          </Popover>}
                        >
                          {
                            field.values &&
                            field.values.length > 0 &&
                            field.values
                              .sort((a, b) => a.order - b.order || a.value_id - b.value_id)
                              .map(v => (
                                <TreeNode
                                  key={`${group.field_group_id}-${field.id}-${v.value_id}`}
                                  title={<Popover placement="right" content={<div>
                                    <a onClick={e => {
                                      this.addValueGroup(
                                        e,
                                        { parent_id: group.field_group_id, field_id: field.id, value_id: v.value_id },
                                        2
                                      )
                                    }}>为该值添加分组</a>
                                  </div>}>
                                    <div className="m-loangroup-label" onMouseOver={() => { this.handleHover(2) }}>
                                      <span>{v.key || '-'}</span>
                                    </div>
                                  </Popover>}
                                >
                                  {
                                    v.child &&
                                    v.child.length > 0 &&
                                    v.child
                                      .sort((a, b) => a.order - b.order || a.field_group_id - b.field_group_id)
                                      .map(child => (
                                        <TreeNode
                                          key={`${group.field_group_id}-${field.id}-${v.value_id}-${child.field_group_id}`}
                                          title={<Popover placement="right" content={<div>
                                            <a onClick={e => { this.editRow(e, child, 3, { parent_id: group.field_group_id, field_id: field.id, value_id: v.value_id }) }}>编辑组</a>
                                            <span> | </span>
                                            <a onClick={e => { this.delRow(e, child, 3) }}>删除组</a>
                                            <span> | </span>
                                            <a onClick={e => { this.showFieldControl(e, child, 3) }}>管理该组字段</a>
                                          </div>}>
                                            <div className="m-loangroup-label" onMouseOver={() => { this.handleHover(3) }}>
                                              <span>{child.group_name || '-'}</span>
                                              <span>{child.required ? '是' : '否'}</span>
                                            </div>
                                          </Popover>}
                                        >
                                          {
                                            child.fields &&
                                            child.fields.length > 0 &&
                                            child.fields
                                              .sort((a, b) => a.order - b.order || a.id - b.id)
                                              .map(valueField => (
                                                <TreeNode
                                                  key={`${group.field_group_id}-${field.id}-${v.value_id}-${child.field_group_id}-${valueField.id}`}
                                                  title={<Popover placement="right" content={<div>
                                                    <a onClick={e => { this.delRow(e, valueField, 4, child) }}>删除</a>
                                                  </div>}>
                                                    <div className="m-loangroup-label" onMouseOver={() => { this.handleHover(4) }}>
                                                      <span>{valueField.label || '-'}</span>
                                                      {/* <span>{valueField.key || '-'}</span> */}
                                                      <span>{valueField.type || '-'}</span>
                                                      {/* <span>{valueField.order || '0'}</span> */}
                                                      <span>{valueField.required ? '是' : '否'}</span>
                                                      <span>{valueField.help_text || '-'}</span>
                                                    </div>
                                                  </Popover>}
                                                />
                                              ))}
                                        </TreeNode>
                                      ))}
                                </TreeNode>
                              ))}
                        </TreeNode>
                      ))}
                </TreeNode>
              ))}
          </Tree>}
          <div style={{ marginLeft: 24, paddingTop: 10, width: 412 }}>
            <Button type="dashed" style={{ width: '100%' }} onClick={(e) => { e.stopPropagation(); this.addGroup() }}>
              <Icon type="plus" />添加分组
            </Button>
          </div>
          <Col span={24} style={{ marginTop: '30px', textAlign: 'center' }}>
            <Button type="primary" onClick={this.onFinish}>
              完成
            </Button>
          </Col>
        </div>

        <EditGroupModal
          ref={node => { this.editGroupModal = node }}
          visible={this.state.showEditGroupModal}
          title={this.state.groupModalTitle}
          onCreate={this.createGroup}
          onCancel={() => { this.editGroupModal.resetFields(); this.setState({ showEditGroupModal: false }) }}
          groupName={this.state.groupName}
          isRequired={this.state.isGroupRequired}
          order={this.state.groupOrder}
        />
        <EditFieldModal
          visible={this.state.showEditFieldModal}
          title={this.state.fieldModalTitle}
          onCreate={this.createFieldControl}
          onCancel={this.hideFieldControl}
          selectedKeys={this.state.selectedFieldIds}
          data={this.state.fieldModalFormData}
        />
      </div>
    )
  }
}

export default connect()(LoanFormGroup)
