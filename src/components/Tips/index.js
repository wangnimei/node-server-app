import Vue from 'vue'
import main from './main'

const TipsConstructor = Vue.extend(main)

export function Tips(options) {
  const tips = new TipsConstructor({
    data: options
  })
  const vm = tips.$mount()
  document.body.appendChild(vm.$el)
  vm.visible = true
  return vm
}
