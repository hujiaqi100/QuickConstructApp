import React, { useEffect, useState, RefObject } from 'react';
import { Modal, Form, message } from 'antd';
import { renderFormItem } from '../renderFormItem';
import ReactDOM from 'react-dom/client';
import './index.less';
import _ from 'lodash';
import { DataProcess } from '../dataProcess'
interface H_ModalProps {
  close: () => void;
  postQuery: (form: any) => Promise<void>;
  action: 'view' | 'add' | 'edit';
  aveConfig: () => any[];
  listQuery: () => void;
  detailQuery: (form: any, setContent: any, traceTree: any) => void;
  ref?: any;
  initialValues: any,
  className?: string,
  style?: any
}
const sleep = (ms: number) => {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}
const dp = new DataProcess()
const traceTree = dp.traceTree
export const H_Modal: React.FC<H_ModalProps> & {
  args: any,
  reflect: Function
} = (props) => {
  const { close, detailQuery, postQuery, action, aveConfig, listQuery, initialValues, className, style } = props;
  const [form] = Form.useForm();
  const [content, setContent] = useState<any[]>([]);
  const [load, setLoad] = useState(false)

  useEffect(() => {
    (async () => {
      setLoad(true)
      const tree = _.cloneDeep(aveConfig())
      await sleep(50)
      if (detailQuery) {
        const data = await detailQuery(form, setContent, dp.traceTree)
        dp.reRender(data as any, tree)
      }
      for await (const k of tree) {
        for await (const i of k.formList) {
          const { componentOptions } = i;
          if (!_.isEmpty(componentOptions)) {
            const { getOptions } = componentOptions;
            if (getOptions) {
              const options = await getOptions(form);
              _.set(componentOptions, 'options', options);
            }
          }
        }
      }
      const reflect = (name: string) => {
        return function (c: any) {
          const x = reflectList.find(d => d.name == name).reflect
          const a = x(c)(form, tree, setContent, dp.traceTree)
          dp.getReflect(a, tree, setContent)
        }
      }
      const reflectList = dp.setReflect(tree)
      _.set(H_Modal, 'args', { action, content: tree, form, setContent, traceTree: dp.traceTree })
      _.set(H_Modal, 'reflect', reflect)
      setLoad(false)
      setContent(() => _.cloneDeep(tree));
    })();
  }, []);

  const getTitle = () => {
    switch (action) {
      case 'view':
        return '查看';
      case 'add':
        return '添加';
      case 'edit':
        return '编辑';
      default:
        return '';
    }
  };


  return (
    <Modal
      title={getTitle()}
      open={true}
      maskClosable={false}
      loading={load}
      onCancel={close}
      className={`h_modal ${className}`}
      onOk={async () => {
        try {
          if (action !== 'view') {
            await postQuery(form);
            close();
            listQuery();
          }
        } catch (err: any) {
          message.error(`操作失败 ${new Error(err).message}`);
        }
      }}
    >
      <Form style={style} form={form} initialValues={initialValues}>
        {content &&
          content.map((val: any, idx) => {
            return <div key={idx}>
              {
                (val.show === true || !_.has(val, 'show')) && <div key={idx} className='h_formArea' style={val?.style}>
                  <div className='h_title'>{val.title}</div>
                  {
                    val.formList.some((d: any) => d.show === true || !_.has(d, 'show')) && <div className='h_modal_formlist'>
                      {val.formList.map((ele: any, idx: any) => {
                        const _ele = _.omit(ele, ['componentOptions', 'reflect']);
                        return <React.Fragment key={idx}>
                          {(ele.show === true || !_.has(ele, 'show')) && (
                            ele.outsideForm ? <> {renderFormItem(ele, form, _.cloneDeep(content), setContent, traceTree, action)}</> :
                              <Form.Item className={ele.name} {..._ele}>
                                {renderFormItem(ele, form, _.cloneDeep(content), setContent, traceTree, action)}
                              </Form.Item>
                          )}
                        </React.Fragment>
                      })}
                    </div>
                  }
                </div >
              }
            </div>
          })}
      </Form>
    </Modal >
  );
};
H_Modal['args'] = {}
H_Modal['reflect'] = () => { }
const create = (options: H_ModalProps, ref?: RefObject<HTMLDivElement>) => {
  const div = document.createElement('div');
  if (ref && ref.current) {
    ref.current.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  const root = ReactDOM.createRoot(div);

  function close() {
    root.unmount();
    setTimeout(() => {
      if (div.parentNode) {
        _.get(div, 'parentNode')?.removeChild(div);
      }
    }, 300);
  }

  root.render(<H_Modal {...options} close={close} />);
};

export default create;
