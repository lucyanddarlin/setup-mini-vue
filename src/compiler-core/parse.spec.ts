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
})