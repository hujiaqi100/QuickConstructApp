import React from 'react'
import { Select } from 'antd'
const H_Select = (props: any) => {
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
    return <Select
        showSearch
        filterOption={(input, option) =>
            ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())
        }
        disabled={action == 'view'}
        value={form.getFieldValue(name)}
        onChange={onChange}
        {...componentOptions}
    />
}
export default H_Select