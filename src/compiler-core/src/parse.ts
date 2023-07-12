import { NODES_TYPE } from "./ast"
export const openDelimiter = '{{'
export const closeDelimiter = '}}'

export function baseParse(content: string) {
  const context = createParseContent(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any = []
  let node
  if (context.source.startsWith(openDelimiter)) {
    node = parseInterpolation(context)
  }
  nodes.push(node)
  return nodes
}

function parseInterpolation(context) {
  // {{message}}
  // 定义 起点和终点分隔符
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advanceBy(context, openDelimiter.length)
  // 内容长度
  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = context.source.slice(0, rawContentLength)
  // 处理边缘对象
  const content = rawContent.trim()

  // 清空 context.source
  advanceBy(context, rawContentLength + closeDelimiter.length)
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