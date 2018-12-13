import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const payWay = {
  WXPAY: '微信支付',
  CREDIT: '授信支付',
};

const payWayOptions = [];
for (const key in payWay) {
  if (key) {
    payWayOptions.push(
      <Option value={key} key={key}>
        {payWay[key]}
      </Option>
    );
  }
}

export { payWay, payWayOptions };
