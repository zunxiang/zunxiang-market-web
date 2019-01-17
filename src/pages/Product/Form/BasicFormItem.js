import React, { Fragment } from 'react';
import { Form, Input, Select } from 'antd';
import { formItemLayout } from './common';
import ImgFormItem from './ImgFormItem';

import './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const NameFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="产品标题">
      {getFieldDecorator('title', {
        rules: [
          {
            required: true,
            message: '请输入产品标题',
          },
        ],
        initialValue: initialValue.title,
      })(<Input placeholder="请输入产品标题" />)}
    </FormItem>
  );
};

const IntroFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="产品简介">
      {getFieldDecorator('intro', {
        rules: [
          {
            required: true,
            message: '请输入产品简介',
          },
        ],
        initialValue: initialValue.intro,
      })(<Input placeholder="请输入产品简介" />)}
    </FormItem>
  );
};

const TagsFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  const tags = [
    ...new Set([
      '温泉',
      '沙滩',
      '亲子',
      '美食酒店',
      '自助餐',
      '河源',
      '跟团',
      '签证',
      '门票',
      '住宿',
      '美食',
      ...(initialValue.tags || []),
    ]),
  ];
  const TagOptions = tags.map(val => (
    <Option key={val} value={val}>
      {val}
    </Option>
  ));
  return (
    <FormItem {...formItemLayout} label="产品标签">
      {getFieldDecorator('tags', {
        rules: [
          {
            required: true,
            message: '请输入选择或者输入标签',
            type: 'array',
            min: 1,
          },
        ],
        initialValue: initialValue.tags,
      })(
        <Select mode="tags" style={{ width: '100%' }} placeholder="选择或者输入标签">
          {TagOptions}
        </Select>
      )}
    </FormItem>
  );
};

const HotelStarFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="酒店星级">
      {getFieldDecorator('hotel_star', {
        rules: [
          {
            required: true,
            message: '请输选择酒店星级',
          },
        ],
        initialValue: initialValue.hotel_star || 3,
      })(
        <Select style={{ width: '100%' }}>
          <Option value={1}>一星</Option>
          <Option value={2}>二星</Option>
          <Option value={3}>三星</Option>
          <Option value={4}>四星</Option>
          <Option value={5}>五星</Option>
        </Select>
      )}
    </FormItem>
  );
};

const NoticeMobileFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="通知手机">
      {getFieldDecorator('notice_mobile', {
        rules: [
          {
            required: true,
            message: '请输入通知手机',
          },
        ],
        initialValue: initialValue.notice_mobile,
      })(<Input placeholder="请输入通知手机" />)}
    </FormItem>
  );
};

const ServicePhoneFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="服务电话">
      {getFieldDecorator('tel', {
        rules: [
          {
            required: true,
            message: '请输入服务电话',
          },
        ],
        initialValue: initialValue.tel,
      })(<Input placeholder="请输入服务电话" />)}
    </FormItem>
  );
};

const BasicFormItem = props => (
  <Fragment>
    <ImgFormItem {...props} />
    <NameFormItem {...props} />
    <IntroFormItem {...props} />
    <TagsFormItem {...props} />
    <HotelStarFormItem {...props} />
    <NoticeMobileFormItem {...props} />
    <ServicePhoneFormItem {...props} />
  </Fragment>
);

export { BasicFormItem };
