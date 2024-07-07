import React from 'react'
import { Input } from 'antd'
const H_Input = (props: any) => {
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
    return <Input disabled={action == 'view'}  {...componentOptions} value={form.getFieldValue(name)} onChange={onChange} />
}
export default H_Input