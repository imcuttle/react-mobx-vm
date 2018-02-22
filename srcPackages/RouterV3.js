/**
 * @file Router
 * @author Cuttle Cong
 * @date 2018/1/27
 * @description
 */
import * as React from 'react'
import { h } from '../'
import { RouterContext, Router } from 'react-router'

function render(props) {
  const components = props.components.map(comp => {
    if (comp && typeof comp === 'object') {
      const f = () => {
      }
      f['__[[actual]]__'] = comp
      return f
    }
    return comp
  })
  return (
    <RouterContext
      {...props}
      components={components}
      createElement={function (model, props = {}) {
        const { children, ...rest } = props || {}
        if (model['__[[actual]]__']) {
          model = model['__[[actual]]__']
        }
        return h.call(this, model, rest, children)
      }}
    />
  )
}


/**
 * 如果你依赖了 **react-router v3**，那么可以使用该 Router 定义，而不是 react-router 的 Router
 *
 * **注意**: 请用以下方式引入
 * `import Router from 'react-mobx-vm/packages/RouterV3'`
 * @public
 * @name Router
 */
export default function VMRouter(props = {}) {
  return <Router {...props} render={render} />
}