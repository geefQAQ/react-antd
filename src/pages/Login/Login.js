import React from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'

import { Form, Icon, Input, Button, Checkbox, message } from 'antd'

import { LOGIN, SELECTMENU } from '@/utils/constants'
import { queryString, setStore } from '@/utils/util'
import { API, logo } from '@/utils/config'
import { POST } from '@/utils/service'
import { loadMenu } from '@/store/actions'
import './Login.less'

const FormItem = Form.Item

class LoginForm extends React.Component {
  state = {
    loading: false
  }

  componentWillMount () {
    setStore('token', '')
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        this.postData(values)
      }
    })
  }

  postData = values => {
    const { dispatch, history, location } = this.props
    let fromRoute = queryString(location.search, 'from')
    // console.log('Received values of form: ', values)
    POST(API.login, {
      name: values.username,
      password: values.password
    })
      .then(data => {
        if (data.status === 200) {
          this.setState({ loading: false }, () => {
            setStore('token', `Bearer ${data.data}`)
            setStore('username', values.username)
            setStore('remember', values.remember)
            dispatch({
              type: LOGIN,
              username: values.username,
              remember: values.remember,
              isLogin: true,
              role: 1
            })
            history.push(fromRoute && fromRoute.indexOf('login') < 0 ? decodeURIComponent(fromRoute) : '/')
            dispatch(loadMenu())
            dispatch({
              type: SELECTMENU,
              selectKey: ['14']
            })
          })
        } else {
          // message.error(data.message || '登录失败！')
          this.setState({ loading: false })
        }
      })
      .catch(e => {
        // message.error(e.message || '登录失败！')
        this.setState({ loading: false })
      })
  }

  render () {
    const { form, user } = this.props
    const { getFieldDecorator } = form
    return (
      <div className="login">
        <div className="login-logo">
          <img src={logo} alt="普惠通" />
        </div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              initialValue: user.remember ? user.username : '',
              rules: [{ required: true, message: '请输入用户名！' }]
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" autoComplete="new-username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码！' }]
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" autoComplete="new-password" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: user.remember
            })(
              <Checkbox>记住我</Checkbox>
            )}
            <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading} >
              {this.state.loading ? '正在登录...' : '登 录'}
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(Form.create()(LoginForm))
