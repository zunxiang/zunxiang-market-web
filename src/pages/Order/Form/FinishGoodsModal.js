import React, { useState } from 'react';
import { Form, Modal, Input } from 'antd';

const FinishGoodsModal = Form.create()(({ children, onSubmit, form }) => {
  const [visible, setVisible] = useState(false);
  const { getFieldDecorator } = form;
  const onOk = () => {
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        onSubmit(fieldsValue);
      }
    });
  };
  return (
    <>
      <div style={{ display: 'inline-block' }} onClick={() => setVisible(true)}>
        {children}
      </div>
      <Modal
        title="发货信息"
        destroyOnClose
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onOk}
      >
        <Form>
          <Form.Item label="快递名称">
            {getFieldDecorator('shipper_name', {
              rules: [
                {
                  required: true,
                  message: '请输入快递名称',
                },
              ],
            })(<Input placeholder="请输入快递名称" />)}
          </Form.Item>
          <Form.Item label="快递单号">
            {getFieldDecorator('courier_number', {
              rules: [
                {
                  required: true,
                  message: '请输入快递单号',
                },
              ],
            })(<Input placeholder="请输入快递单号" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default FinishGoodsModal;
