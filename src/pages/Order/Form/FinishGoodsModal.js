import React, { useState, useEffect } from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { connect } from 'dva';

const FinishGoodsModal = Form.create()(({ children, onSubmit, form, dispatch }) => {
  const [visible, setVisible] = useState(false);
  const [kdList, setKdList] = useState([]);
  useEffect(
    () => {
      dispatch({
        type: 'order/getcoms',
        payload: {},
        calback: data => {
          setKdList(data);
        },
      });
    },
    [dispatch]
  );
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
            })(
              <Select style={{ width: '100%' }}>
                {kdList.map(kd => (
                  <Select.Option value={kd.code} key={kd.code}>
                    {kd.name}
                  </Select.Option>
                ))}
              </Select>
            )}
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

export default connect()(FinishGoodsModal);
