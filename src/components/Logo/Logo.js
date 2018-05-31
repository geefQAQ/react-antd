import React from 'react'
import PropTypes from 'prop-types'
import './Logo.less'

const Logo = ({ logo, siderFold, sitename }) => (
  <div className="m-logo">
    <img src={logo} alt="logo" style={{ width: siderFold ? 100 : 40 }} />
    {siderFold && <div className="m-logo--sitename">{sitename}</div>}
  </div>
)

Logo.propTypes = {
  logo: PropTypes.string,
  sitename: PropTypes.string,
  siderFold: PropTypes.bool
}

export default Logo
