import React from 'react'
import { Input } from 'antd'
const { TextArea } = Input
const H_TextArea = (props: any) => {
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
    return <TextArea disabled={action == 'view'}  {...componentOptions} value={form.getFieldValue(name)} onChange={onChange} />
}
export default H_TextArea