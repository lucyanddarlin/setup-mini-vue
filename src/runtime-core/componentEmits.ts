import { toHandlerKey } from "../shared"

export const emit = (instance, event, ...args) => {
  const { props } = instance
  const handler = props[toHandlerKey(event)]
  handler && handler(...args)
}