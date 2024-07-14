import { Form, FormInstance } from 'antd'
import _, { divide } from 'lodash'
import React, { memo, useEffect, useMemo } from 'react'
import { DataProcess } from '../dataProcess'
import { H_Components } from '../components'
const hc = new H_Components

export default class H_Form {
  public forms: any = {}
  constructor() {
    this.forms = {}
  }
  public removeForms = () => {
    this.forms = {}
  }
  public getForms = () => {
    return this.forms
  }
  public getForm = (formName: string): FormInstance => {
    return _.get(this, `forms.${formName}.form`)
  }
  public getConfig = (formName: string) => {
    if (this.getForm(formName)) {
      return {
        config: this.forms[formName]['config'],
        setConfig: this.forms[formName]['setConfig']
      }
    }
  }
  private getReflect = (formName: string, name: string) => {
    return _.get(this.forms, `${formName}.reflects.${name}`)
  }
  public operatorFormValue = (formName: string, type: string, data: any) => {
    if (this.getForm(formName)) {
      if (type in this.getForm(formName)) {
        return this.getForm(formName)[type](data)
      } else {
        throw new Error(type + ' ' + 'is not in form')
      }
    }
  }
  public onReflect = (formName: string, name: string) => {
    let reflect = this.getReflect(formName, name)
    if (!reflect) return () => { }
    let _this = this
    return (c: any) => {
      const result = reflect(c)
      reflect = null
      DataProcess.getReflect(result, _this, formName)
    }
  }
  public echoData = (data: any, cc) => {
    const _config = _.cloneDeep(cc)
    DataProcess.reset(data, _config)
    return _config
  }
  private WarpItem = (type, label) => {
    const Dom = ({ children }) => {
      return <Form.Item label={label}>
        {children}
      </Form.Item>
    }
    switch (type) {
      case 'formlist':
        return Dom
      default:
        return Form.Item
    }
  }
  public RenderForm = memo(({ formName, config, setConfig, formProps = {}, reflects = {} }: any) => {
    const [form] = Form.useForm()
    useEffect(() => {
      _.set(this.forms, formName, {
        reflects,
        form,
        config,
        setConfig
      });
    }, [reflects, config, setConfig, setConfig]);
    return React.createElement(
      Form,
      { ...formProps, form, name: formName },
      [
        ...config.map((item: any, idx: number) => {
          const label = _.get(item, 'label', '')
          const name = _.get(item, 'name', '')
          const _item = DataProcess.removeSigns(item)
          const type = _.get(item, '$type$', '')
          const show = _.get(item, '$show$') || !_.has(item, '$show$')
          const componentOptions = _.get(item, '$componentOptions$', {})
          const props = { children: {}, ..._item, key: idx, }
          if (type === 'formlist') {
            _.set(componentOptions, 'name', name)
          }
          if (show) {
            return React.createElement(
              this.WarpItem(type, label),
              props,
              hc.getComponents(type, componentOptions, { hf: this, formName })
            )
          } else {
            return React.createElement(
              React.Fragment,
              { key: idx },
            )
          }
        })
      ]
    )
  })
}
