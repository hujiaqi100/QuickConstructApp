import React, { useMemo } from 'react';
import { Form, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { DataProcess } from '../dataProcess';
import { H_Components } from '../components';

interface FormListProps {
  formList: Array<{
    label: string;
    name: string;
    $type$: string;
    $componentOptions$?: any;
    $show$?: boolean;
  }>;
  h_form: any;
  btnName: string;
  name: string;
  labelCol: any;
  wrapperCol: any;
  initAddData?: any;
  addToHead?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

const FormList: React.FC<FormListProps> = (props) => {
  const { formList, initAddData, addToHead, h_form, labelCol, btnName, wrapperCol, disabled, name: listName, ..._props } = props;
  const hc = useMemo(() => new H_Components(), []);

  return (
    <Form.List name={listName} {..._props}>
      {(fields, { add, remove }, { errors }) => (
        <React.Fragment>
          <Form.Item>
            <Button
              type="dashed"
              disabled={disabled}
              onClick={() => addToHead ? add(initAddData, 0) : add(initAddData)}
              style={{ width: '100px' }}
              icon={<PlusOutlined />}
            >
              {btnName}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
          {fields.map(({ key, name, ...restField }, _idx) =>
            <div key={_idx + listName} style={{ marginTop: '36px' }}>
              <Space
                key={key}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                  flexWrap: 'wrap',
                  gap: '24px'
                }}
                align="baseline"
              >

                <MinusCircleOutlined style={{ paddingLeft: '12px' }} onClick={() => remove(name)} />
                {
                  formList.map((item, idx) => {
                    const item_name = _.get(item, 'name', '');
                    const _item = DataProcess.removeSigns(item);
                    const type = _.get(item, '$type$', '');
                    const show = _.get(item, '$show$') || !_.has(item, '$show$');
                    const componentOptions = _.get(item, '$componentOptions$', {});
                    return (
                      <React.Fragment key={`${key}-${idx}-key`}>
                        {show ? (
                          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} key={`${key}-${idx}`} {...restField} {..._item} name={[name, item_name]}>
                            {hc.getComponents(type, { ...componentOptions }, h_form)}
                          </Form.Item>
                        ) : null}

                      </React.Fragment>
                    );
                  })
                }
              </Space>
            </div>
          )}

        </React.Fragment>
      )}
    </Form.List>
  );
};

export default FormList;