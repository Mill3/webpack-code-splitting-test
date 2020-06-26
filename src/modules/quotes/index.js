import _ from "lodash"
import moduleB from '../../module-b'

export default () => {
  console.log(`should init quotes`);
  moduleB()
}