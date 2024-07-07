interface ComponentOptions extends FormItemProps {
  onChange?: (...args: any) =>
    (form: FormItemProps,
      setContent: React.Dispatch<React.SetStateAction<any>>,
      traceTree: (name: string, tree: any[]) => void,
      content: any[])
      => void | any;
}
interface FormItemProps {
  componentOptions?: ComponentOptions;
  type?: 'input' | 'select' | 'checkbox' | 'textArea' | 'location' | 'number' | 'formList' | 'span';
  [key: string]: any;
}
import _ from 'lodash'
import React from 'react';
import { H_Input, H_Select, H_CheckBox, H_Number, H_TextArea } from './own'

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
      'input': <H_Input />,
      'select': <H_Select />,
      'checkbox': <H_CheckBox />,
      'textArea': <H_TextArea />,
      'number': <H_Number />,
    }
  }
  getComponents(type: string | undefined, { ...args }) {
    if (!type) {
      const ReactNode = this.components['input']
      return React.cloneElement(ReactNode, { args })
    } else {
      const ReactNode = this.components[type]
      if (!ReactNode) throw new Error('没有可选组件')
      return React.cloneElement(ReactNode, { args })
    }
  }
  setComponents = (type: string, RN: any) => {
    if (type in this.components) throw new Error('组件名称重复')
    _.set(this.components, type, RN)
  }
}
