import _ from 'lodash'
import H_Form from './renderForm';
export class DataProcess {
  public static isEmpty = (value: null | undefined) => {
    return value === null || value === undefined
  }
  public static getType = (variable: any) => {
    if (Array.isArray(variable)) {
      return 'Array';
    } else if (variable !== null && typeof variable === 'object') {
      return 'Object';
    } else {
      return 'Neither';
    }
  }
  public static getReflect = (result: any[], hf: H_Form, formName: string) => {
    const { config, setConfig } = hf.getConfig(formName)
    result.forEach((val: any) => {
      const { target } = val
      if (_.get(val, 'condition')) {
        if (target instanceof Array) {
          target.forEach(ele => {
            _.set(DataProcess.traceTree(ele, config), '$show$', true)
          })
        } else {
          _.set(DataProcess.traceTree(target, config), '$show$', true)
        }
      } else {
        if (target instanceof Array) {
          target.forEach(ele => {
            _.set(DataProcess.traceTree(ele, config), '$show$', false)
          })
        } else {
          _.set(DataProcess.traceTree(target, config), '$show$', false)
        }
      }
    })
    setConfig(() => _.cloneDeep(config))

  }
  public static traceTree = (name: string, data: any[]): any => {
    const nameList = name.split('-')
    if (nameList.length === 1) {
      if (data instanceof Object) {
        for (const val of Object.keys(data)) {
          if (data[val as any] instanceof Object && data[val as any]['name'] == name) {
            return data[val as any]
          }
          const result = DataProcess.traceTree(name, data[val as any])
          if (result) {
            return result
          }
        }
      }
      if (data instanceof Array) {
        for (const val of data) {
          if (val instanceof Object && val['name'] == name) {
            return val
          }
          const result = DataProcess.traceTree(name, val)
          if (result) {
            return result
          }
        }
      }
    } else {
      let _data = data
      do {
        const current = nameList.shift() as string
        _data = this.traceTree(current, _data)
      } while (nameList.length > 0)
      return _data
    }

  };
  public static isWrappedWithDollarSigns = (str: string) => {
    const regex = /^\$.*\$$/;
    return regex.test(str);
  }
  public static removeSigns = (element: any) => {
    const keys = Object.keys(element).filter(d => DataProcess.isWrappedWithDollarSigns(d))
    return _.omit(element, keys)
  }
  public static reset = (data: any[], tree: any[], name = '') => {
    if (!Array.isArray(data) && typeof (data) === 'object') {
      Object.keys(data).forEach(val => {
        name = name + '-' + val
        const node = DataProcess.traceTree(name.slice(1), tree)
        if (node) {
          _.set(node, '$show$', true)
          if (typeof (data[val]) !== 'object') {
            name = ''
          }
        }
        DataProcess.reset(data[val as any], tree, name)
      })
    }
    if (Array.isArray(data)) {
      data.forEach(val => {
        DataProcess.reset(val, tree, name)
      })
    }
  }
}
