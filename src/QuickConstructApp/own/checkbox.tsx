import React from 'react'
import { Checkbox } from 'antd'
const H_CheckBox = (props: any) => {
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
    return <Checkbox.Group
        disabled={action == 'view'}
        {...componentOptions}
        value={form.getFieldValue(name)}
        onChange={onChange}
    />
}
export default H_CheckBox