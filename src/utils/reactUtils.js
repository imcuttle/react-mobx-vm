/**
 * @file: reactUtils
 * @author: Cuttle Cong
 * @date: 2018/2/6
 * @description:
 */
import React from 'react'
import _ from 'lodash'

export function isComponentInstance(instance) {
  return instance && instance instanceof React.Component
}

export function isComponentClass(com) {
  return com && isComponentInstance(com.prototype)
}

export function assertReactClass(Component, message) {
  if (!isComponentClass(Component)) {
    throw new Error(message + ' require ReactClass')
  }
}

/**
 * 转换 ReactElem
 * @param element
 * @param rules: [[cond, process]]
 * @param parent
 * @return element
 */
export function convertReactElement(element, rules = [], parent = null, outerIndex = 0) {
  if (!element || rules.length === 0) {
    return element
  }

  function convert(element, index, children) {
    rules.forEach(([cond, handle]) => {
      if (cond(element, index, parent, children)) {
        let handledElem
        if (
          typeof(
            handledElem = handle(element, index, parent, children)
          ) !== 'undefined'
        ) {
          element = handledElem
        }
      }
    })

    // @thinking return element ?
    return element
  }

  if (Array.isArray(element)) {
    return React
      .Children
      .toArray(element)
      .map((elem, index) => convertReactElement(elem, rules, parent, index))
  }
  let children = element && element.props && element.props.children
  let newElement = element
  newElement = convert(element, outerIndex, children)
  // convert may update children
  let newChildren = newElement && newElement.props && newElement.props.children
  if (newChildren) {
    newChildren = convertReactElement(newChildren, rules, newElement, outerIndex)
  }

  if (newElement === element && newChildren === children) {
    return element
  }

  return React.isValidElement(newElement)
    ? React.cloneElement(newElement, newElement.props, newChildren)
    : newElement
}

export function proxy(host, path, getValue) {
  const old = _.get(host, path)
  const newVal = getValue(old)
  _.set(host, path, newVal)
  return newVal
}

exports.isElementOf = Component => {

  // Trying to solve the problem with 'children: XXX.isRequired'
  // (https://github.com/gaearon/react-hot-loader/issues/710). This does not work for me :(
  const originalPropTypes = Component.propTypes
  Component.propTypes = void 0

  // Well known workaround
  const elementType = (
    <Component/>
  ).type

  // Restore originalPropTypes
  Component.propTypes = originalPropTypes

  return element => element && element.type === elementType
}
