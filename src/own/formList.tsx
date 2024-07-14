import React, { useMemo } from 'react';
import { Form, Button } from 'antd';
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
  [key: string]: any;
}

const FormList: React.FC<FormListProps> = (props) => {
  const { formList, h_form, btnName, name: listName, ..._props } = props;
  const hc = useMemo(() => new H_Components(), []);

  return (
    <Form.List name={listName} {..._props}>
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }, _idx) =>
            formList.map((item, idx) => {
              const item_name = _.get(item, 'name', '');
              const _item = DataProcess.removeSigns(item);
              const type = _.get(item, '$type$', '');
              const show = _.get(item, '$show$') || !_.has(item, '$show$');
              const componentOptions = _.get(item, '$componentOptions$', {});
              return (
                <React.Fragment key={`${key}-${idx}`}>
                  {show ? (
                    <Form.Item {...restField} {..._item} name={[name, item_name]}>
                      {hc.getComponents(type, { ...componentOptions }, h_form)}
                    </Form.Item>
                  ) : null}
                  <MinusCircleOutlined style={{ paddingLeft: '12px' }} onClick={() => remove(name)} />
                </React.Fragment>
              );
            })
          )}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              style={{ width: '60%' }}
              icon={<PlusOutlined />}
            >
              {btnName}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default FormList;