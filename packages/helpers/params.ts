import { isFunction, isObject, isString } from 'lodash'
import { DrawPosterPlugin } from '../core'
import { DrawPosterOptions } from '../core/typed'
import { UNI_PLATFORM } from '../utils'
import { globalPlugins } from './internal'

/**
 * 处理 drawPoster 参数
 * @param args
 * @returns options
 */
export const helperDrawPosterParams = (...args: any[]) => {
  const _default: DrawPosterOptions = {
    selector: '',
    componentThis: undefined,
    type: UNI_PLATFORM === 'mp-weixin' ? '2d' : 'context',
    loading: false,
    debug: false,
    gcanvas: false
  }
  let _overrides: DrawPosterOptions
  if (isObject(args[0])) {
    _overrides = args[0] as any
  } else if (isObject(args[1])) {
    _overrides = <any>args[1]
    _overrides.selector = args[0]
  } else {
    _overrides = { selector: args[0] }
  }
  const options = { ..._default, ..._overrides }
  options.selector = options.selector.replace('#', '')
  if (options.type === '2d') {
    options.selector = `#${options.selector}`
  }
  if (options.loading === true) {
    options.loading = { render: '绘制海报中...', create: '生成图片中...' }
  }
  if (isObject(options.loading)) {
    options.loading!.render = options.loading?.render ?? '绘制海报中...'
    options.loading!.create = options.loading?.create ?? '生成图片中...'
  }
  if (!UNI_PLATFORM) {
    console.warn(
      '注意! draw-poster未开启uni条件编译! 当环境是微信小程序将不会动态切换为type=2d模式'
    )
    console.warn(`请在vue.config.js中的'transpileDependencies'中添加 'u-draw-poster' `)
  }
  return options
}

/**
 * 对插件参数进行处理并引入
 * @param plugins 插件列表
 * @param args 参数
 */
export const helperPluginParams = (plugins: DrawPosterPlugin[], ...args: any[]) => {
  if (!args[0]) {
    throw new Error('DrawPoster Error: plugins arguments required')
  }
  let _options: DrawPosterPlugin = { name: '' }
  if (isString(args[0]) && isFunction(args[1])) {
    _options.name = args[0]
    _options.mounted = args[1]
  }
  if (isString(args[0]) && isObject(args[1])) {
    _options = { name: args[0], ...args[1] }
  }
  if (isObject(args[0])) {
    _options = <any>args[0]
  }
  if (![...globalPlugins, ...plugins].some((v) => _options.name === v.name)) {
    plugins.push(_options)
    return _options
  }
  console.warn(`该扩展已存在: ${_options.name}`)
}
