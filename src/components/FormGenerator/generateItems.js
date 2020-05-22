import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, InputNumber, DatePicker, Select } from 'antd';

import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const getOptions = options => {
  if (!options) {
    return null;
  }
  if (Array.isArray(options)) {
    return options.map(op => (
      <Option value={op.value} key={op.value}>
        {op.text}
      </Option>
    ));
  }
  const Options = [];
  for (const key in options) {
    if (key) {
      Options.push(
        <Option value={key} key={key}>
          {options[key]}
        </Option>
      );
    }
  }
  return Options;
};
const renderInput = item => {
  if (item.component) {
    return item.component;
  }
  let InputItem = null;
  switch (item.type) {
    case 'text':
      InputItem = <Input />;
      break;
    case 'number':
      InputItem = <InputNumber className={styles.fullWidth} />;
      break;
    case 'date':
      InputItem = <DatePicker className={styles.fullWidth} />;
      break;
    case 'dateRange':
      InputItem = <RangePicker className={styles.fullWidth} />;
      break;
    case 'textarea':
      InputItem = <TextArea className={styles.fullWidth} rows={1} />;
      break;
    case 'select':
      InputItem = (
        <Select className={styles.fullWidth} mode={item.selectMode}>
          {getOptions(item.selectOptions)}
        </Select>
      );
      break;
    default:
      InputItem = <Input />;
      break;
  }
  return InputItem;
};
const CreateFormItem = props => {
  const { item, getFieldDecorator, layout, values = {} } = props;
  const { label, key, required = false, rules, parse } = item;
  return (
    <FormItem key={key} label={label} {...layout}>
      {getFieldDecorator(key, {
        rules: rules || [{ required, message: `${label}为空` }],
        initialValue: parse === 'in' && values[key] ? [values[key]] : values[key],
      })(renderInput(item))}
    </FormItem>
  );
};
const generateItems = ({ items, getFieldDecorator, layout, values }) => {
  const Items = items.map(item => (
    <CreateFormItem
      item={item}
      getFieldDecorator={getFieldDecorator}
      layout={layout}
      values={values}
      key={item.key}
    />
  ));
  return Items;
};

export default generateItems;
