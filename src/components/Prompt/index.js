import React from 'react';
import { Modal, Form, Input } from 'antd';
import UploadImg from '../FormItems/UploadImg';

const FormItem = Form.Item;
const { TextArea } = Input;

const renderFormItem = (type, label, name, error, getFieldDecorator, initialValue, required) => {
  if (type === 'textArea') {
    return (
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={label}>
        {getFieldDecorator(name, {
          rules: [{ required: true, message: error }],
          initialValue,
        })(<TextArea placeholder="请输入" rows={5} style={{ wordBreak: 'break-all' }} />)}
      </FormItem>
    );
  }
  if (type === 'uploadImg') {
    return <UploadImg {...{ label, name, error, getFieldDecorator, required }} />;
  }
  return (
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={label}>
      {getFieldDecorator(name, {
        rules: [{ required: true, message: error }],
        initialValue,
      })(<Input placeholder="请输入" />)}
    </FormItem>
  );
};

export default Form.create()(props => {
  const {
    modalVisible,
    form,
    title,
    label,
    error,
    name,
    onOk,
    onCancel,
    type,
    initialValue,
    required,
  } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onOk({ ...fieldsValue });
      onCancel();
    });
  };

  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
    >
      {renderFormItem(type, label, name, error, getFieldDecorator, initialValue, required)}
    </Modal>
  );
});
