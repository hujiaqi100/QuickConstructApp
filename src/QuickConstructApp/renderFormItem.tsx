import React from 'react';
import { H_Components } from './components'
export const renderFormItem = (
  val: any,
  form: any,
  content: any,
  setContent: React.Dispatch<React.SetStateAction<any[]>>,
  traceTree: any,
  action: 'view' | 'add' | 'edit' | undefined,
) => {
  const c = new H_Components()
  const { type } = val
  const ReactNode = c.getComponents(type, { element: val, form, content, setContent, traceTree, action })
  return ReactNode
}
