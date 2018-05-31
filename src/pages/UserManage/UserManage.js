'use strict'
import React from 'react'
import {Card, Row, Col, Table, Button, message, Modal} from 'antd'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { SearchForm } from '@/components'
import { getPieChartOption, loadStore } from '@/utils/util'
import './UserManage.less'
import Item from 'antd/lib/list/Item';

//人员管理

class UserManage extends React.Component {
  state = {
    data:[],
    loading:false,
    pageSize: 10,
    total: 0,
    current: 1,
    acceptNum:null,
    creditedAmount:null,
    creditedNum:null,
    lendingRate:[],
    currentArea:'兰考县',
    region_credited_num_LK:null,
    region_credited_num_SX:null,
    region_ele_account_num_LK:null,
    region_ele_account_num_SX:null,
    echartsDataLK: [],
    echartsDataSX:[],
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
    const hide = message.loading('数据加载中..')
    GET(API.getUserManageInfo)
    .then(data => {
      console.log(data)
      hide()
      if(data.status === 200){
        this.setState({
          acceptNum:data.accept_num,
          creditedAmount:data.credited_amount,
          creditedNum:data.credited_num,
          lendingRate:data.lending_rate,
          echartsDataLK:data.region_distribution_map[0].child,
          echartsDataSX:data.region_distribution_map[1].child,
          region_credited_num_LK:data.region_distribution_map[0].region_credited_num,
          region_credited_num_SX:data.region_distribution_map[1].region_credited_num,
          region_ele_account_num_LK:data.region_distribution_map[0].region_ele_account_num,
          region_ele_account_num_SX:data.region_distribution_map[1].region_ele_account_num,
          // echartsDataLK
        })
      }
    })
  }
  search = (group, name) => {
    console.log('')
  }
  getData = (page) => {

  }
  switchArea = () => {
    if(this.state.currentArea === '兰考县') {
      this.setState({
        currentArea:'睢县',
      })
    } else {
      this.setState({
        currentArea:'兰考县'
      })
    }
  }

  render () {
    const columns = [{
      title: '所属银行',
      dataIndex: 'bank',
      key: 'bank',
    }, {
      title: '所属组',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '分配区域',
      dataIndex: 'area',
      key: 'area',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '岗位',
      dataIndex: 'position',
      key: 'position',
    }];
    const { currentArea, echartsDataSX, echartsDataLK, acceptNum, creditedAmount, creditedNum, lendingRate, region_credited_num_LK, region_credited_num_SX, region_ele_account_num_SX, region_ele_account_num_LK } = this.state
    const echartsData = currentArea === '兰考县' ? echartsDataLK : echartsDataSX
    const region_credited_num = currentArea === '兰考县' ? region_credited_num_LK : region_credited_num_SX
    const region_ele_account_num = currentArea === '兰考县' ? region_ele_account_num_LK : region_ele_account_num_SX
    return (
      <div>
        <div className="page-head">
          <h3>
            人员管理
          </h3>
        </div>
        <div className="page-content">
          {/* <Table
            title={() => (
              <div className="u-table-title">
                <span>营销人员及业务</span>
                <SearchForm
                  onSubmit={this.search}
                  catagory={[
                    {
                      key: 'group',
                      type: 'select',
                      label: '所属组',
                      initialValue: '',
                      options: [
                        { value: 'publish', text: '已发布' },
                        { value: 'draft', text: '草稿' },
                        { value: 'pending', text: '待确定信息' },
                        { value: 'deleted', text: '已删除' },
                        { value: 'unpublish', text: '已下架' },
                      ] },
                    {
                      key: 'name',
                      type: 'select',
                      label: '姓名',
                      initialValue: '',
                      options: [
                        { value: 'publish', text: '已发布' },
                        { value: 'draft', text: '草稿' },
                        { value: 'pending', text: '待确定信息' },
                        { value: 'deleted', text: '已删除' },
                        { value: 'unpublish', text: '已下架' },
                      ] }
                  ]}
                />
              </div>
            )}
            rowKey={record => record.name}
            columns={columns}
            dataSource={this.state.data}
            bordered={true}
            loading={this.state.loading}
            pagination={{
              pageSize: this.state.pageSize,
              total: this.state.total,
              current: this.state.current,
              onChange: (page, pageSize) => {
                this.getData(page)
              }
            }}
          /> */}
          <Row className='card'>
            <Col span={6}>
              <Card title="目前受理业务笔数" bordered={true} className='card-content'>{acceptNum}</Card>
            </Col>
            <Col span={6}>
              <Card title="目前已授信业务笔数" bordered={true} className='card-content'>{creditedNum}</Card>
            </Col>
            <Col span={6}>
              <Card title="目前已授信金额" bordered={true} className='card-content'>{creditedAmount}</Card>
            </Col>
            <Col span={6}>
              <Card title="发放贷款种类及权重" bordered={true} className='card-content'>
                <Row>
                  {
                    lendingRate.length > 0 
                    ? lendingRate.map((Item,index) => {
                        return <Col span={24} key={index}>{Item}</Col>
                    })
                    : null
                  }
                </Row>
              </Card>
            </Col>
          </Row>
          <div className='area-content'>
            <p>
              <span className='area'>地区：{this.state.currentArea} </span> 
              <Button
                type="primary" 
                size='small'
                onClick={this.switchArea}
              >
                切换
              </Button>
            </p>
            <p>已授信业务笔数：{region_credited_num}</p>
            {/* <p>产业授信笔数：XXX</p> */}
            <p>二类账户开通笔数：{region_ele_account_num}</p>
          </div>
          <ReactEcharts
            option={getPieChartOption(currentArea, echartsData)}
            lazyUpdate={true}
            className='echarts'
          />
        </div>
      </div>
    )
  }
}
export default UserManage