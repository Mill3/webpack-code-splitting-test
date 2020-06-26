import _ from "lodash"
import(/* webpackPreload: true */ './module-b')

export default () => {
  console.log(`should init quotes`);
}