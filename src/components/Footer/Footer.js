import React from 'react'

import { footertext } from '@/utils/config'
import './Footer.less'

const Footer = () => (
  <div className="m-footer">
    <div className="m-footer--text">{footertext}</div>
  </div>
)

export default Footer
