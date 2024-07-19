### 一个快速构建antd-form应用的组件
# demo ： https://github.com/hujiaqi100/my_frame
# 当前version ：1.0.2
## 如何安装
```
npm install h-form-qca
```

## 注册组件
在项目初始化入口引入H_Components 之后在registerComponent里注册自定义的组件 并且自定义名称 比如'formList'
```
import { H_Components } from 'h-form-qca'
export const load = () => {
  const hc = new H_Components
  hc.registerComponent('formList', <FormList />)
}
```

## 初始化组件
通过useInitData来进行初始化对象 把formConfig作为第一个参数 第二个参数为formConfig的参数 第三个是需要初始化的表单内容
```
import { H_Form ，useInitData} from 'h-form-qca'
import { formConfig } from './own'
const Page = () => {
    const hf = useMemo(() => new H_Form, [])
    const { RenderForm } = hf
    const init = async () => {
        const data = { name: '1', age: '1', sex: [{ name: '1', key: '1' }] }
        return await data
    }
    const params = {
        hf
    }
    const [up, setUp, upDone] = useInitData(formConfig, params, init)
    ...
    return <RenderForm
              formName={formConfig.formName}
              config={up}
              setConfig={setUp}
              formProps={{ className: 'flex' }}
              reflects={formConfig.reflects}
           />
}
```
## formConfig配置
需要对每个formConfig配置一个formName 之后在hf里会根据formName来对不同的form区域进行选择
基本配置如下
reflects 为组件受控的映射表 
$type$是 内置或者自定义的组件名 在初始化注册时可自定义
$componentOptions$ 组件本身属性
$initData$ 组件初始化需要进行的数据处理
```
const formConfig = (params) => {
    const formName = params.formName
    _.set(config, 'formName', formName)
    _.set(config, 'reflects', {
        'age-name': function ([c, v]) {
            return [
                {
                    condition: c === '3',
                    target: 'content-name'
                }
            ]
        }
    })
    const { action, hf } = params
    return [
        {
            label: 'Name',
            name: 'name',
            $type$: 'input',
            $componentOptions$: {
                style: { width: 200 },
                disabled: action === 'view',
                suffix: formName === 'form0' ? 'YY' : 'BY'
            }
        },
        {
            label: 'Age',
            name: 'age',
            $type$: 'select',
            $componentOptions$: {
                style: { width: 200 },
                disabled: action === 'view',
                $initData$: async function () {
                    await sleep(1)
                    const data = [
                        {
                            label: '18',
                            value: '18'
                        },
                        {
                            label: '3',
                            value: '3'
                        }
                    ]
                    _.set(this, 'options', data)
                },
                onChange: function () {
                    hf.onReflect('form0', 'age-name')(arguments)
                }
            }
        },
        {
            label: 'CONTENTaaaa',
            name: 'content',
            $type$: 'formlist',
            $componentOptions$: {
                initAddData: { name: '1' },
                addToHead: true,
                labelCol: { span: 5 },
                disabled: action === 'view',
                formList: [
                    {
                        label: 'Name',
                        name: 'name',
                        $show$: false,
                        $type$: 'input',
                        style: { width: 230 },
                        $componentOptions$: {
                            disabled: action === 'view',
                            suffix: formName === 'form0' ? 'YY' : 'BY'
                        }
                    }, {
                        label: 'Age',
                        name: 'age',
                        $type$: 'select',
                        $componentOptions$: {
                            style: { width: 200 },
                            disabled: action === 'view',
                            $initData$: async function () {
                                await sleep(1)
                                const data = [
                                    {
                                        label: '18',
                                        value: '18'
                                    },
                                    {
                                        label: '3',
                                        value: '3'
                                    }
                                ]
                                _.set(this, 'options', data)
                            }
                        }
                    }
                ]
            }
        }
    ]
}
```
# 如何使用映射表 reflects
通过onReflect方法 选择需要处理的表单 以及 映射表内存在的映射关系age-name
```
onChange: function () {
    hf.onReflect('form0', 'age-name')(arguments)
}
```
## 提交表单
operatorFormValue集成antd form的表单操作
```
const value = hf.operatorFormValue('formName', 'getFieldsValue', { strict: true })
hf.operatorFormValue(filterUpList.formName, 'setFieldValue', 'name','2')
```
### H_Layout 布局组件
效果图如下
<img width="1679" alt="image" src="https://github.com/user-attachments/assets/b18750e1-91ff-4b57-add0-a739d5957c45">

H_Layout.Block为自定义区域
```
import React, { useState,  useEffect, useMemo } from 'react'
import { H_Layout } from '@/qca'
import { getPageList } from './services'
import _ from 'lodash'
import { H_Form, useInitData } from '../../qca'
import { filterUpList, queryList, filterDownList, col } from './own'
import { Button, message } from 'antd'
const initPage = {
    current: 1,
    size: 30
}
const Page = () => {
    const [load, setLoad] = useState(false)
    const [data, setData] = useState()
    const hf = useMemo(() => new H_Form, [])
    const RenderForm = useMemo(() => hf.RenderForm, [])
    const init = async () => {
        const data = { name: '1', age: '1', sex: [{ name: '1', key: '1' }] }
        return await data
    }
    const params = {
        hf
    }
    const [up, setUp, upDone] = useInitData(filterUpList, params, init)
    const [down, setDown, downDone] = useInitData(filterDownList, { hf }, init)
    const handleQuery = async (params) => {
        setLoad(true)
        try {
            const result = await getPageList({ ...initPage, ...params })
            if (result) {
                const { data } = result.data
                const { records, current, size, total } = data
                const _records = records.map((val, idx) => {
                    return {
                        ...val,
                        key: idx
                    }
                })
                const _data = { list: _records, current: current, size: size, total: total }
                setData(() => _.cloneDeep(_data))
            }
        } catch (error) {
            message.error(new Error(error).message)
        } finally {
            setLoad(false)
        }
    }
    useEffect(() => {
        handleQuery()
    }, [])
    const [c, setC] = useState(0)
    const layoutDom = (
        <H_Layout>
            <H_Layout.Block>
                <Button onClick={() => setC(c + 1)}>aa</Button>
            </H_Layout.Block>
            <H_Layout.Filter
                query={queryList(handleQuery, hf)}
                filterUp={<RenderForm
                    formName={filterUpList.formName}
                    config={up}
                    setConfig={setUp}
                    formProps={{ className: 'flex' }}
                    reflects={filterUpList.reflects}
                />}
                filterDown={
                    <RenderForm
                        formName={filterDownList.formName}
                        config={down}
                        setConfig={setDown}
                        formProps={{ className: 'flex flex-wrap' }}
                    />}
            />
            <H_Layout.Table loading={load} dataSource={_.get(data, 'list', [])} columns={col(hf) || []} />
            <H_Layout.Footer
                total={_.get(data, 'total', 0)}
                current={_.get(data, 'current', initPage.current)}
                pageSize={_.get(data, 'size', initPage.size)}
                onChange={(current, size) => {
                    const formData = H_Layout['formStore']['layout'].getFieldsValue()
                    handleQuery({ ...formData, current, size })
                }}
            />
        </H_Layout>
    )
    return (
        <div className='overflow-hidden h-[calc(100vh)]'>
            {layoutDom}
        </div>

    )
}
export default Page;

```
H_Layout.Filter内有配置query 为按钮list
```
export const queryList = (query: Function, hf: H_Form) => {
  return [
    {
      name: '添加',
      danger: true,
      cb: function () {

      }
    }
  ]
}
```
H_Layout.Footer 下有carry属性 可配置左下脚部分功能
```
 carry = {[<Button>test1</Button>,<Button>test2</Button>]}
```
