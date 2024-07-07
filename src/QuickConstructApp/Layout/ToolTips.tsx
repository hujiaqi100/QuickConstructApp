import { Tooltip, message } from "antd"
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from "react";
import React from "react";
const copyToClipboard = (value: any) => {
  var link = document.createElement('input');
  document.body.appendChild(link);
  link.value = value;
  link.select();
  document.execCommand('Copy');
  document.body.removeChild(link);
  message.success('已复制！');
};
const ToolTips = (props: any) => {
  const { name } = props
  const [show, setShow] = useState(false)
  return <Tooltip placement="topLeft" destroyTooltipOnHide={true} onOpenChange={() => {
    setShow(false)
  }} title={() => (
    <div style={{
      position: 'relative',
      paddingRight: '12px'
    }}>
      {name}
      {
        !show ?
          <div style={{
            marginLeft: '6px',
            position: 'absolute',
            right: 0,
            top: '-1px'
          }}>
            <CopyOutlined onClick={() => {
              setShow(true)
              copyToClipboard(name)
            }
            } />
          </div>
          : <div style={{
            marginLeft: '6px',
            position: 'absolute',
            right: 0,
            top: '-1px',
            color: '#00cc99'
          }}> <CheckOutlined /></div>
      }

    </div>
  )}>
    {name}
  </Tooltip>
}
export default ToolTips
