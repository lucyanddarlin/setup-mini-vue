import { NODES_TYPE } from "./ast"
export const openDelimiter = '{{'
export const closeDelimiter = '}}'

export const enum TAG_TYPE {
  START,
  END
}

export function baseParse(content: string) {
  const context = createParseContent(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any = []
  while (!isEnd(context)) {
    let node
    // 处理插值
    const s = context.source
    if (s.startsWith(openDelimiter)) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      // 处理元素
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context)
      }
    } else {
      // 默认处理 TEXT
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context: any) {
  // 2. 当遇到结束标签的时候,结束循环 <div></div>
  if (context.source.startsWith('</div>')) return true
  // 1. 当 context.source 没有值的时候,结束
  return !context.source

}

function parseText(context: any) {
  // 1. 获取 content
  const endToken = openDelimiter
  let endIndex = context.source.length
  const index = context.source.indexOf(endToken)
  if (index !== -1) {
    endIndex = index
  }
  const content = parseTextData(context, endIndex)
  return {
    content,
    type: NODES_TYPE.TEXT
  }
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length)
  //  推进
  advanceBy(context, length)
  return content
}

function parseElement(context: any) {
  // 解析 tag
  const element: any = parseTag(context, TAG_TYPE.START);
  element.children = parseChildren(context)
  parseTag(context, TAG_TYPE.END)
  return element
}

function parseTag(context: any, type: TAG_TYPE) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  // 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  if (type === TAG_TYPE.END) return
  return {
    type: NODES_TYPE.ELEMENT,
    tag
  }
}

function parseInterpolation(context) {
  // {{message}}
  // 定义 起点和终点分隔符
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advanceBy(context, openDelimiter.length)
  // 中间内容长度
  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  // 处理边缘对象
  const content = rawContent.trim()

  // 清空 context.source
  advanceBy(context, closeDelimiter.length)
  return {
    type: NODES_TYPE.INTERPOLATION,
    content: {
      type: NODES_TYPE.SIMPLE_EXPRESSION,
      content: content
    }
  }
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length)
}

function createRoot(children) {
  return {
    children
  }
}

function createParseContent(content: string) {
  return { source: content }
}