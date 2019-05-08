import React, { Fragment } from 'react';
import { Form, Input, Select } from 'antd';
import { formItemLayout } from './common';
import ImgFormItem from './ImgFormItem';
import './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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

const HotelNameFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="酒店名称">
      {getFieldDecorator('hotel_name', {
        rules: [
          {
            required: true,
            message: '请输入酒店名称',
          },
        ],
        initialValue: initialValue.hotel_name,
      })(<Input placeholder="请输入" />)}
    </FormItem>
  );
};

const HotelTelFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="酒店电话">
      {getFieldDecorator('hotel_tel', {
        rules: [
          {
            required: true,
            message: '请输入酒店电话',
          },
        ],
        initialValue: initialValue.hotel_tel,
      })(<Input placeholder="请输入" />)}
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

const SmsTempFormItem = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <FormItem {...formItemLayout} label="通知短信模板">
      {getFieldDecorator('sms_template', {
        rules: [
          {
            required: true,
            message: '请输入通知短信模板',
          },
        ],
        initialValue: initialValue.sms_template,
      })(<TextArea placeholder="请输入" rows={4} />)}
    </FormItem>
  );
};

const BasicFormItem = props => {
  const {
    initialValue: { type },
  } = props;
  return (
    <Fragment>
      <ImgFormItem {...props} formItemLayout={formItemLayout} />
      <NameFormItem {...props} />
      <IntroFormItem {...props} />
      <TagsFormItem {...props} />
      {type === 'HOTEL' ? (
        <Fragment>
          <HotelNameFormItem {...props} />
          <HotelTelFormItem {...props} />
          <HotelStarFormItem {...props} />
        </Fragment>
      ) : null}
      <SmsTempFormItem {...props} />
    </Fragment>
  );
};

export { BasicFormItem };
