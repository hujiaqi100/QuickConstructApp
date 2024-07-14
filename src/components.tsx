import _ from 'lodash'
import React from 'react';
import { DataProcess } from './dataProcess';
import { Input, Select, Checkbox, InputNumber, Button } from 'antd'
import { FormList, Span } from './own'
const { TextArea, Search } = Input
export class H_Components {
  static instance: H_Components
  private components: any
  public constructor() {
    if (H_Components.instance) {
      return H_Components.instance
    }
    this.components = void 0
    this.init()
    H_Components.instance = this
  }
  private init = () => {
    this.components = {
      'input': <Input />,
      'select': <Select />,
      'checkbox': <Checkbox />,
      'textArea': <TextArea />,
      'number': <InputNumber />,
      'checkbox_group': <Checkbox.Group />,
      'button': <Button />,
      'search': <Search />,
      'formlist': <FormList formList={[]} h_form={undefined} btnName={''} name={''} labelCol={undefined} wrapperCol={undefined} />,
      'span': <Span />
    }
  }

  getComponents(type: string | undefined, args: any, h_form: any = {}) {
    const _args = DataProcess.removeSigns(args)
    if (!type) {
      const ReactNode = this.components['input']
      return React.cloneElement(ReactNode, { ...ReactNode.props, ..._args, h_form })
    } else {
      const ReactNode = this.components[type]
      if (!ReactNode) throw new Error('没有可选组件')
      return React.cloneElement(ReactNode, { ...ReactNode.props, ..._args, h_form })
    }
  }
  registerComponent = (type: string, RN: any) => {
    if (type in this.components) throw new Error('组件名称重复')
    _.set(this.components, type, RN)
  }
}
