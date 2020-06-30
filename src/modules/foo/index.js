import FoobarClass from './Foobar'

export const instance = new FoobarClass()
export const emitter = instance.emitter

export default { instance, emitter }