import React from 'react'
import {Form, Row, Col, Input, Select, Button, message, Modal} from 'antd'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore } from '@/utils/util'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  }
}
const formItemInnerLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 }
  }
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 }
  }
}

class RegisterForm extends React.Component {
  state = {
    selectOptions:[],
    role_level:null,
    load:false,
  }
  async componentDidMount () {
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
    //获取用户信息api请求
    this.setState({load:true})
    GET(API.getUserInfo).then(
      data => {
        console.log('获取当前用户信息api---->',data)
        
        if (data.status === 200) {
          this.setState({
            load:false,
            role_level:data.role_level
          })
          
        }
      }
    )
    // const username = await loadStore('username')
    // // console.log('username---->',username)
    // if(username === 'puhuibank'){
    //   this.setState({
    //     authority:0,
    //   })
    // }
    this.loadSelectOptions()
  }
  loadSelectOptions = () => {
    GET(API.getRoleList)
      .then(data => {
        // console.log('loadSelectOptions------>',data)
        this.setState({
          selectOptions: data,
        })
      })
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  onSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, fieldValue) => {
      if ( !err ) {
        console.log('fieldValue----->',fieldValue)
        POST(API.registerNewUser,{
          realname:fieldValue.name,
          bank_code:fieldValue.bank,
          position:fieldValue.post,
          role_id: fieldValue.authority,
          name:fieldValue.account,
          password:fieldValue.password,
          confirm_password:fieldValue.passwordConfirm
        }).then(data => {
          console.log('注册submit返回----->',data)
          if(data.status === 200){
            message.success('注册成功')
            form.resetFields()

          }

        })
      }
    })
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    if(this.state.load){
      return  <p/>
    }
    if(this.state.role_level > 10){
      return (
        <h1>权限不足</h1>
      )  
    }
    return (
      <Form onSubmit={this.onSubmit} layout="inline">
        <Row>
          <Col>
            <p><b>银行相关必填资料</b></p>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem 
              label="姓名"
              {...formItemLayout}
              style={{width:'100%'}}
            >
              {getFieldDecorator('name', {
                rules: [{ 
                  required: true, 
                  message: '姓名不能为空！',
                  whitespace: true 
                }],
                initialValue:''
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="所属银行" style={{width:'100%'}}>
              {getFieldDecorator('bank', {
                rules: [{ 
                  required: true, 
                  message: '所属银行不能为空！',
                  whitespace: true  
                }],
                initialValue:''
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="所属岗位" style={{width:'100%'}}>
              {getFieldDecorator('post', {
                rules: [{ 
                  required: true, 
                  message: '所属岗位不能为空！',
                  whitespace: true  
                }],
                initialValue:''
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <p><b>选择岗位权限</b></p>
          </Col>
        </Row>
        <Row>
          <Col>
          <FormItem 
              label="选择岗位权限"
              {...formItemLayout}
              style={{width:'100%'}}
            >
              {getFieldDecorator('authority', {
                rules: [{ 
                  required: true, 
                  message: '权限不能为空！',
                  whitespace: true  
                }],
                initialValue:''
              })(<Select
                filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.state.selectOptions.map(o => <Option key={o.role_id} id={o.role_id}>{o.role_name || o.role_id}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <p><b>账号和密码</b></p>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem 
              label="账号"
              {...formItemLayout}
              style={{width:'100%'}}
            >
              {getFieldDecorator('account', {
                rules: [{ 
                  required: true, 
                  message: '账号不能为空！',
                  whitespace: true 
                }],
                initialValue:''
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="密码" style={{width:'100%'}}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '密码不能为空！', whitespace: true  }, 
                  { validator: this.validateToNextPassword }
                ],
                initialValue:''
              })(<Input type="password"/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="确认密码" style={{width:'100%'}}>
              {getFieldDecorator('passwordConfirm', {
                rules: [
                  { required: true, message: '确认密码不能为空！', whitespace: true  },
                  { validator: this.compareToFirstPassword }
                ],
                initialValue:''
              })(<Input type="password"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: '30px', textAlign: 'center' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">提交 </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const FormFieldComponent = Form.create()(RegisterForm)
class Register extends React.Component{
  render () {
    return (
      <div className="m-loadprod">
        <div className="page-head">
          <h3>新用户注册</h3>
        </div>
        <div className="page-content">
          <FormFieldComponent {...this.props}/>
        </div>
      </div>
    )
  }
} 

export default Register