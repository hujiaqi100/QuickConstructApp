import { useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import { DataProcess } from '../dataProcess'
const initTree = async (data: any) => {
    if (!data) return
    if (DataProcess.getType(data) === 'Object') {
        for (const val of Object.keys(data)) {
            if (_.has(data[val], '$initData$')) {
                const initialization: Function = _.get(data[val], '$initData$')
                await initialization.bind(data[val])()
            }
            await initTree(data[val])
        }
    }
    if (DataProcess.getType(data) === 'Array') {
        for (const val of data) {
            if (_.has(val, '$initData$')) {
                const initialization: Function = _.get(val, '$initData$')
                await initialization.bind(val)()
            }
            await initTree(val)
        }
    }
}
export const useInitData = (config: any, params, init: (name: string) => any) => {
    const [cc, setCc] = useState(config(params));
    const [done, setDone] = useState<boolean | undefined>(true)
    const hf = useMemo(() => {
        if ('hf' in params) {
            return params.hf
        } else {
            throw new Error('config params must includes hf which instance of H_form')
        }
    }, [])
    useEffect(() => {
        (async () => {
            const _cc = _.cloneDeep(config(params))
            setDone(false)
            await initTree(_cc)
            const data = await init(config.formName)
            if (data) {
                hf.operatorFormValue(config.formName, 'setFieldsValue', data)
            }
            const dd = hf.echoData(data, _cc)
            setDone(true)
            setCc(() => dd)
        })()
    }, []);
    return [cc, setCc, done];
}