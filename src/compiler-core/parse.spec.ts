import { NODES_TYPE } from "./src/ast";
import { baseParse } from "./src/parse";

describe('Parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast = baseParse('{{ message }}')
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NODES_TYPE.INTERPOLATION,
        content: {
          type: NODES_TYPE.SIMPLE_EXPRESSION,
          content: 'message'
        }
      })
    });
  })

  describe('interpolation element', () => {
    test('simple interpolation element', () => {
      const ast = baseParse('<div></div>')
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NODES_TYPE.ELEMENT,
        tag: 'div'
      })
    });
  })

  describe('interpolation text', () => {
    test('simple text', () => {
      const ast = baseParse('some text')
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NODES_TYPE.TEXT,
        content: 'some text'
      })
    });
  })
})