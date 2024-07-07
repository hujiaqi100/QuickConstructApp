import React from 'react'
import { InputNumber } from 'antd'
const H_Number = (props: any) => {
    const {
        onChange,
        args: {
            action,
            element: {
                componentOptions,
                name },
            form,
        }
    } = props
    return <InputNumber disabled={action == 'view'}  {...componentOptions} value={form.getFieldValue(name)} onChange={onChange} />
}
export default H_Number