import _ from 'lodash'

export const classname = arr => arr.join(' ')
export const getType = obj => {
  let str = Object.prototype.toString.call(obj)
  return str.substr(1, str.length - 2).split(' ')[1].toLowerCase()
}
export const isArray = obj => Object.prototype.toString.call(obj) === '[object Array]'
export const hideTel = tel => tel.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')

export const isEmptyObj = obj => {
  for (let _ in obj) {
    return 0
  }
  return 1
}

export const getRouteParams = props => {
  const { location } = props
  let { state } = location
  return !state ? {} : state
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTree = (data, id = 'id', pid = 'pid', children = 'children') => {
  let cpData = _.cloneDeep(data)
  cpData.sort((a, b) => a.order - b.order)
  let result = []
  let idData = {}

  cpData.forEach(item => {
    idData[item[id]] = item
  })

  cpData.forEach(item => {
    let pidData = idData[item[pid]]

    if (!pidData) {
      result.push(item)
    } else {
      if (!pidData[children]) {
        pidData[children] = []
      }
      pidData[children].push(item)
    }
  })

  return result
}

/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
export function obj2String (obj, arr = [], idx = 0) {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}

// export const queryString = name => {
//   let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
//   let r = window.location.search.substr(1).match(reg)
//   return r ? unescape(r[2]) : null
// }
export const queryString = (search, name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = search.substr(1).match(reg)
  return r ? unescape(r[2]) : null
}

export function getCookie (name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

/**
 * 设置 cookie
 * @key : cookie 名
 * @value : cookie 值
 * @options : 可选配置参数
 *      options = {
 *          expires : 7|new Date(), // 失效时间
 *          path : "/", // 路径
 *          domain : "", // 域名
 *          secure : true // 安全连接
 *      }
 */
export const cookie = (key, value, options) => {
  /* read 读取 */
  // 如果没有传递 value ，则表示根据 key 读取 cookie 值
  if (typeof value === 'undefined') { // 读取
    // 获取当前域下所有的 cookie，保存到 cookies 数组中
    let cookies = document.cookie.split('; ')
    // 遍历 cookies 数组中的每个元素
    for (let i = 0, len = cookies.length; i < len; i++) {
      // cookies[i] : 当前遍历到的元素，代表的是 'key=value' 意思的字符串,
      // 将字符串以 = 号分割返回的数组中第一个元素表示 key，
      // 第二个元素表示 value
      let cookie = cookies[i].split('=')
      // 判断是否是要查找的 key，对查找的 key 、value 都要做解码操作
      if (decodeURIComponent(cookie[0]) === key) {
        return decodeURIComponent(cookie[1])
      }
    }
    // 没有查找到指定的 key 对应的 value 值，则返回 null
    return null
  }

  /* 存入 设置 */
  // 设置 options 默认为空对象
  options = options || {}
  // key = value，对象 key，value 编码
  let cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value)
  // 失效时间
  if ((typeof options.expires) !== 'undefined') { // 有配置失效时间
    if (typeof options.expires === 'number') { // 失效时间为数字
      const days = options.expires
      const t = options.expires = new Date()
      t.setDate(t.getDate() + days)
    }
    cookie += ';expires=' + options.expires.toUTCString()
  }
  // 路径
  if (typeof options.path !== 'undefined') {
    cookie += ';path=' + options.path
  }
  // 域名
  if (typeof options.domain !== 'undefined') {
    cookie += ';domain=' + options.domain
  }
  // 安全连接
  if (options.secure) {
    cookie += ';secure'
  }

  // 保存
  document.cookie = cookie
}

// 从所有的 cookie 中删除指定的 cookie
export const removeCookie = (key, options) => {
  options = options || {}
  options.expires = -1 // 将失效时间设置为 1 天前
  cookie(key, '', options)
}

/**
 * 使用 localstorage 存取数据
 */
const storeKey = '__PHTMS__'

export const loadStorage = () => JSON.parse(window.localStorage.getItem(storeKey) || '{}')

export const saveStorage = data => {
  window.localStorage.setItem(storeKey, JSON.stringify(data))
}

export const setStore = (key, value) => {
  let data = loadStorage()
  data[key] = value
  saveStorage(data)
}

export const loadStore = key => {
  let data = loadStorage()
  return data[key] || ''
}

export const getLineChartOption = (title, xData, yData, withArea = false) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        type: 'dashed',
        color: '#EF3F59',
        width: 0.5,
        opacity: 0.8
      }
    }
  },
  grid: {
    top: 30,
    bottom: 20
  },
  xAxis: {
    type: 'category',
    data: xData,
    boundaryGap: false,
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      color: '#666'
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      // show: false,
      lineStyle: {
        color: '#ddd',
        width: 0.5,
        type: 'dashed'
      }
    }
  },
  series: withArea ? [{
    name: title,
    data: yData,
    type: 'line',
    smooth: false,
    // symbolSize: 2,
    lineStyle: {
      color: '#EF3F59',
      width: 2
    },
    //阴影
    // itemStyle: {
    //   color: {
    //     type: 'linear',
    //     x: 1,
    //     y: 1,
    //     x2: 1,
    //     y2: 0,
    //     colorStops: [{
    //       offset: 1, color: '#EF3F59' // 0% 处的颜色
    //     }, {
    //       offset: 0, color: '#fff' // 100% 处的颜色
    //     }],
    //     globalCoord: false // 缺省为 false
    //   }
    // },
    // areaStyle: {}
  }] : [{
    name: title,
    data: yData,
    type: 'line',
    smooth: false,
    // symbolSize: 2,
    lineStyle: {
      color: '#EF3F59',
      width: 2
    }
  }]
})

export const getPieChartOption = (currentArea, data) => ({
  title : {
    text: currentArea+'各地区授信业务笔数',
    // subtext: '纯属虚构',
    x:'center'
  },
  tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  series : [
      {
          name: '授信业务笔数',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:data,
          itemStyle: {
              emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
})


