const path = require('path')
const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const rewireEslint = require('react-app-rewire-eslint')

module.exports = function override (config, env) {
  // 修改 babel 相关配置，如：配置使用 antd 库
  config = injectBabelPlugin([
    'import',
    {
      libraryName: 'antd',
      style: true
    }
  ], config)

  // 修改 antd 主题（或其他样式）配置
  // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#EF3F59',
      '@layout-header-background': '#EF2034',
      '@menu-dark-submenu-bg': '#EF1E33',
      'link-color': '#EF3F59',
      // 'border-radius-base': '2px',
    }
  })(config, env)

  // 使用 .eslintrc.js 配置文件对代码进行格式检查
  config = rewireEslint(config, env)

  // 修改全局依赖，添加 @ 为全局引用
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src')
    }
  }

  return config
}
