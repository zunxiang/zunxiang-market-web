import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Cascader } from 'antd';
import areaData from './areaData';
import filter from './filter';

const FormItem = Form.Item;

export default function AreaSelector(props) {
  const formItemLayout = props.formItemLayout || {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
      md: { span: 17 },
    },
  };
  const {
    getFieldDecorator,
    fieldName,
    required,
    initialValue,
    label = '地址选择',
    level = 3,
  } = props;
  const data = filter(areaData, level);
  return (
    <FormItem {...formItemLayout} label={label}>
      {getFieldDecorator(fieldName, {
        rules: [
          {
            required,
            message: '请选择地址',
            type: 'array',
            min: level,
          },
        ],
        initialValue,
      })(<Cascader options={data} placeholder="请选择地址" style={{ width: '100%' }} />)}
    </FormItem>
  );
}
