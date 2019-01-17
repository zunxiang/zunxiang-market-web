import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Button, Card, InputNumber, Radio } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { routerRedux, Link } from 'dva/router';
import { BaseImgUrl } from '@/common/config';
import { Editor } from '@/components/FormItems/Editor';
import UploadFormItem from '@/components/FormItems/Upload';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let changedfields = {};
const handleValuesChange = (props, values) => {
  changedfields = {
    ...changedfields,
    ...values,
  };
};
const payFinishSms =
  '尊敬的客户，您购买的产品$itemName$已经可以自助预约啦，请访问网址：$link$，通过手机号码自助预约。';
const bookFinishSms =
  '尊敬的客户，您的订单已确认成功啦！预约日期$bookDate$，$itemNum$间$dayNum$晚$package$，请合理安排出行时间。';
const bookFailSms =
  '尊敬的客户，非常抱歉！由于您预约的产品库存紧张，您预约的订单已经退改，您可以登录网址：$link$，重新预约其他日期。';
const giveEcodeSms =
  '尊敬的客户，您收到了好友赠送的$size$张$itemName$的电子券，请登录网址：$link$，使用手机号自助预约。';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ presale, loading }) => ({
  presale,
  submitting: loading.models.presale,
}))
@Form.create({ onValuesChange: handleValuesChange })
export default class BasicForms extends PureComponent {
  state = {
    createEcode: this.props.presale.currentPresale.create_ecode || 'false',
    setReduce:
      this.props.presale.currentPresale.discount_limit_num > 1 &&
      this.props.presale.currentPresale.discount_reduce > 0,
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
  };

  componentDidMount() {
    const {
      dispatch,
      presale: { currentPresale },
      location: { search },
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    if (query.type === 'edit' && !currentPresale.i) {
      dispatch(routerRedux.push('/presale/list'));
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      presale: { currentPresale },
    } = this.props;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const params = {
          ...fieldsValue,
          images: fieldsValue.images.map(file => file.response.hash).join(','),
          price: fieldsValue.price * 100,
          cost: fieldsValue.cost * 100,
          commission: fieldsValue.commission * 100,
          rush_begin_time: fieldsValue.rush_time[0].format('YYYY-MM-DD 00:00:00'),
          rush_end_time: fieldsValue.rush_time[1].format('YYYY-MM-DD 23:59:59'),
          use_begin_time: fieldsValue.use_time[0].format('YYYY-MM-DD 00:00:00'),
          use_end_time: fieldsValue.use_time[1].format('YYYY-MM-DD 23:59:59'),
          send_code_time: fieldsValue.send_code_time.format('YYYY-MM-DD 00:00:00'),
          sort: 1,
          discount_limit_num: fieldsValue.reduce ? fieldsValue.discount_limit_num : 0,
          discount_reduce: fieldsValue.reduce ? fieldsValue.discount_reduce * 100 : 0,
        };
        if (currentPresale.i) {
          const newParams = {};
          let flag = false;
          for (const key in changedfields) {
            if (key === 'rush_time') {
              newParams.rush_begin_time = params.rush_begin_time;
              newParams.rush_end_time = params.rush_end_time;
              flag = true;
            } else if (key === 'use_time') {
              newParams.use_begin_time = params.use_begin_time;
              newParams.use_end_time = params.use_end_time;
              flag = true;
            } else if (
              key === 'reduce' ||
              key === 'discount_limit_num' ||
              key === 'discount_reduce'
            ) {
              newParams.discount_limit_num = params.discount_limit_num;
              newParams.discount_reduce = params.discount_reduce;
              flag = true;
            } else {
              newParams[key] = params[key];
              flag = true;
            }
          }
          if (flag) {
            newParams.i = currentPresale.i;
            dispatch({
              type: 'presale/publicPost',
              payload: newParams,
            });
          } else {
            dispatch(routerRedux.push('/presale/list'));
          }
        } else {
          delete params.rush_time;
          delete params.use_time;
          delete params.reduce;
          dispatch({
            type: 'presale/publicAdd',
            payload: params,
          });
        }
      }
    });
  };

  handlerCreateEcodeChange = e => {
    this.setState({
      createEcode: e.target.value,
    });
  };

  handlerSetReduceChange = e => {
    this.setState({
      setReduce: e.target.value,
    });
  };

  render() {
    const {
      submitting,
      form,
      presale: { currentPresale },
    } = this.props;
    const { getFieldDecorator } = form;
    const { createEcode, setReduce, query } = this.state;
    const images = currentPresale.images ? currentPresale.images.split(',') : [];
    const uploadDefualtList = images.map((key, index) => ({
      response: {
        hash: key,
        key,
      },
      url: `${BaseImgUrl}${key}?.png`,
      thumbUrl: `${BaseImgUrl}${key}?.png`,
      status: 'done',
      uid: 0 - (index + 1),
      name: key,
    }));

    return (
      <PageHeaderWrapper key={currentPresale.i}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="预售名称">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入预售名称',
                  },
                ],
                initialValue: currentPresale.title,
              })(<Input placeholder="请输入预售名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="预售时间">
              {getFieldDecorator('rush_time', {
                rules: [
                  {
                    required: true,
                    message: '请选择预售时间',
                  },
                ],
                initialValue:
                  query.type !== 'add'
                    ? [moment(currentPresale.rush_begin_time), moment(currentPresale.rush_end_time)]
                    : [],
              })(
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="发码时间">
              {getFieldDecorator('send_code_time', {
                rules: [
                  {
                    required: true,
                    message: '请选择发码日期',
                  },
                ],
                initialValue:
                  currentPresale.send_code_time && moment(currentPresale.send_code_time),
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择发码日期" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="使用时间">
              {getFieldDecorator('use_time', {
                rules: [
                  {
                    required: true,
                    message: '请选择预约时间',
                  },
                ],
                initialValue:
                  query.type !== 'add'
                    ? [moment(currentPresale.use_begin_time), moment(currentPresale.use_end_time)]
                    : [],
              })(
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="预售数量">
              {getFieldDecorator('inventory', {
                rules: [
                  { required: true, message: '请输入预售数量' },
                  { type: 'number', min: 0, message: '预售数量不能小于0' },
                ],
                initialValue: currentPresale.inventory,
              })(<InputNumber style={{ width: '100%' }} min={0} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="售价">
              {getFieldDecorator('price', {
                rules: [
                  { required: true, message: '请输入销售价格' },
                  { type: 'number', min: 0, message: '价格不能小于0' },
                ],
                initialValue: currentPresale.price && currentPresale.price / 100,
              })(<InputNumber style={{ width: '100%' }} min={0} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="佣金">
              {getFieldDecorator('commission', {
                rules: [
                  { required: true, message: '请输入佣金' },
                  { type: 'number', min: 0, message: '佣金不能小于0' },
                ],
                initialValue: currentPresale.commission && currentPresale.commission / 100,
              })(<InputNumber style={{ width: '100%' }} min={0} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="电子码" help="此项发布后不可更改">
              {getFieldDecorator('create_ecode', {
                initialValue: currentPresale.create_ecode || 'false',
              })(
                <Radio.Group disabled={!!currentPresale.i} onChange={this.handlerCreateEcodeChange}>
                  <Radio value="true">创建</Radio>
                  <Radio value="false">不创建</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {createEcode === 'true' ? (
              <FormItem {...formItemLayout} label="每份电子码数">
                {getFieldDecorator('create_ecode_num', {
                  rules: [
                    { required: true, message: '请输入电子码数量' },
                    { type: 'number', min: 1, message: '数量不能小于1' },
                  ],
                  initialValue: currentPresale.create_ecode_num || 1,
                })(<InputNumber style={{ width: '100%' }} min={1} />)}
              </FormItem>
            ) : (
              ''
            )}
            <FormItem {...formItemLayout} label="补差方式" help="此项发布后不可更改">
              {getFieldDecorator('pay_way', {
                initialValue: currentPresale.pay_way || 'offline',
              })(
                <Radio.Group disabled={!!currentPresale.i}>
                  <Radio value="online">在线补差</Radio>
                  <Radio value="offline">到店补差</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="最小购买数量">
              {getFieldDecorator('min_pay_num', {
                rules: [
                  { required: true, message: '请输入最小购买数量' },
                  { type: 'number', min: 1, message: '数量不能小于1' },
                ],
                initialValue: currentPresale.min_pay_num || 1,
              })(<InputNumber style={{ width: '100%' }} min={1} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="最大购买数量">
              {getFieldDecorator('max_pay_num', {
                rules: [
                  { required: true, message: '请输入最大购买数量' },
                  { type: 'number', min: 1, message: '数量不能小于1' },
                ],
                initialValue: currentPresale.max_pay_num || 999,
              })(<InputNumber style={{ width: '100%' }} min={1} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="满减优惠">
              {getFieldDecorator('reduce', {
                initialValue: setReduce,
              })(
                <Radio.Group onChange={this.handlerSetReduceChange}>
                  <Radio value>设置优惠</Radio>
                  <Radio value={false}>不设优惠</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {setReduce ? (
              <Fragment>
                <FormItem {...formItemLayout} label="满减份数">
                  {getFieldDecorator('discount_limit_num', {
                    rules: [
                      { required: true, message: '请输入满减份数' },
                      { type: 'number', min: 2, message: '数量不能小于2' },
                    ],
                    initialValue: currentPresale.discount_limit_num || 2,
                  })(<InputNumber style={{ width: '100%' }} min={2} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="满减金额">
                  {getFieldDecorator('discount_reduce', {
                    rules: [
                      { required: true, message: '请输入满减金额' },
                      { type: 'number', min: 0, message: '金额不能小于 0' },
                    ],
                    initialValue: currentPresale.discount_reduce
                      ? currentPresale.discount_reduce / 100
                      : 0,
                  })(<InputNumber style={{ width: '100%' }} min={0} />)}
                </FormItem>
              </Fragment>
            ) : (
              ''
            )}
            <UploadFormItem
              formItemProps={{
                ...formItemLayout,
                label: '预售图片(可不传)',
              }}
              filedName="images"
              getFieldDecorator={getFieldDecorator}
              uploadOptions={{
                listType: 'picture-card',
              }}
              fieldOptions={{
                rules: [{ required: false, type: 'array' }],
                initialValue: uploadDefualtList,
              }}
            />
            <Editor
              form={form}
              initialValue={currentPresale.content}
              required={false}
              name="content"
              label="预售详情（选填）"
            />
            <FormItem
              {...formItemLayout}
              label="购买成功短信"
              help="$itemName$ = 商品名称; $link$ = 预约地址; $ecode$=电子码; $ecodeLink$ = 电子码预约网址; 100字以内"
            >
              {getFieldDecorator('pay_finish_sms', {
                rules: [
                  { required: true, message: '请输入购买成功短信模板' },
                  { type: 'string', max: 100, message: '不能超过100个字' },
                ],
                initialValue: currentPresale.pay_finish_sms || payFinishSms,
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入购买成功短信模板" rows={4} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预约成功短信"
              help="$bookDate$ = 预约日期;$itemNum$ = 预约房间数量;$dayNum$ = 预约入住晚数;$package$ = 预约套餐名称;100字以内"
            >
              {getFieldDecorator('book_finish_sms', {
                rules: [
                  { required: true, message: '请输入预约成功短信模板' },
                  { type: 'string', max: 100, message: '不能超过100个字' },
                ],
                initialValue: currentPresale.book_finish_sms || bookFinishSms,
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入预约成功短信模板" rows={4} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预约失败短信"
              help="$size$ = 张数;$itemName$ = 商品名称;$link$ = 预约地址;100字以内"
            >
              {getFieldDecorator('book_fail_sms', {
                rules: [
                  { required: true, message: '请输入预约失败短信模板' },
                  { type: 'string', max: 100, message: '不能超过100个字' },
                ],
                initialValue: currentPresale.book_fail_sms || bookFailSms,
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入预约失败短信模板" rows={4} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="获赠通知短信" help="$link$ = 预约地址;100字以内">
              {getFieldDecorator('give_ecode_sms', {
                rules: [
                  { required: true, message: '请输入获赠通知短信模板' },
                  { type: 'string', max: 100, message: '不能超过100个字' },
                ],
                initialValue: currentPresale.give_ecode_sms || giveEcodeSms,
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入获赠短信通知模板" rows={4} />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Link to="/presale/list">
                <Button style={{ marginLeft: 8 }}>取消</Button>
              </Link>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
