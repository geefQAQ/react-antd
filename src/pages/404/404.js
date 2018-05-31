import React from 'react'
import { Link } from 'react-router-dom'

class PageNotFound extends React.Component {
  render () {
    return (
      <div className="pnf-wrapper">
        <div className="pnf-wrapper--title">4 0 4</div>
        <div className="pnf-wrapper--subtitle"> <strong>:(</strong>抱歉，你访问的页面不存在</div>
        <div className="pnf-wrapper--tip">返回<Link to="/">首页</Link></div>
      </div>
    )
  }
}

export default PageNotFound
