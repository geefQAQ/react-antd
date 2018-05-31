import React from 'react'
import { Button } from 'antd'
import { GET, POST } from '@/utils/service'
import { setStore } from '@/utils/util'

export default class Test extends React.Component {
  state = {
    token: ''
  }

  postlogin () {
    POST('/api/administration/token', {
      name: 'jhpm',
      password: '123123'
    }).then(data => {
      console.log(data)
      this.setState({ token: `Bearer ${data.data}` })
      setStore('token', `Bearer ${data.data}`)
    })
  }

  getStatis () {
    GET('/api/user/administration/electronicAccountForChannel', {
      channel: 'xiaomi_test'
    }).then(data => {
      console.log(data)
    })
  }

  render () {
    return (
      <div>
        Test
        <div>
          <Button onClick={this.postlogin.bind(this)}>login</Button>
        </div>

        <div>
          <Button onClick={this.getStatis.bind(this)}>statis</Button>
        </div>
      </div>
    )
  }
}
