import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

const initTree = async (data: any) => {
    if (!data) return;
    if (data instanceof Object) {
        for (const val of Object.keys(data)) {
            if (_.has(data[val], '$initData$')) {
                const initialization: Function = _.get(data[val], '$initData$');
                await initialization.bind(data[val])();
            }
            await initTree(data[val]);
        }
    }
    if (data instanceof Array) {
        for (const val of data) {
            if (_.has(val, '$initData$')) {
                const initialization: Function = _.get(val, '$initData$');
                await initialization.bind(val)();
            }
            await initTree(val);
        }
    }
};

interface Params {
    [key: string]: any;
    hf: any;
}

interface ConfigFunction {
    formName: any;
    (params: Params): any;
}

export const useInitData = (
    config: ConfigFunction,
    params: Params,
    init: () => Promise<any>
): [any, React.Dispatch<React.SetStateAction<any>>, boolean | undefined] => {
    const _c = useMemo(() => config(params), [config, params]);
    const [cc, setCc] = useState(_c);
    const [data, setData] = useState<any>();
    const [done, setDone] = useState<boolean | undefined>();

    const hf = useMemo(() => {
        if ('hf' in params) {
            return params.hf;
        } else {
            throw new Error('config params must include hf, which is an instance of H_Form');
        }
    }, [params]);

    useEffect(() => {
        (async () => {
            const _cc = _.cloneDeep(config(params));
            setDone(true);
            await initTree(_cc);
            const data = await init();
            if (data) {
                setData(() => data);
            }
            const dd = hf.echoData(data, _cc);
            setCc(() => dd);
        })();
    }, [config, params, init, hf]);

    useEffect(() => {
        if (data) {
            hf.setFormFieldsValue(config.formName, data);
        }
    }, [data, hf, config.formName]);

    return [cc, setCc, done];
};