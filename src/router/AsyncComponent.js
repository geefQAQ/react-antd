// https://segmentfault.com/a/1190000009539836
import React from 'react'

export default function asyncComponent (importComponent) {
  class AsyncComponent extends React.Component {
    state = {
      component: null
    }
    hasState = true

    async componentDidMount () {
      const { default: component } = await importComponent()
      this.hasState && this.setState({ component })
    }
    
    render () {
      const C = this.state.component
      return C ? <C {...this.props} /> : null
      
    }

    componentWillUnmount () {
      this.hasState = false
    }
  }

  return AsyncComponent
}
