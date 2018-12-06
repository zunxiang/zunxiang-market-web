import React from 'react';
import { Form } from 'antd';
import BraftEditor, { EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import { BaseImgUrl, getQiniuToken } from '../../common/config';
import { htmlIsEmpty } from '../../utils/utils';

const FormItem = Form.Item;

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

const handleEditorupload = param => {
  getQiniuToken().then(token => {
    const serverURL = 'http://up-z2.qiniu.com';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const successFn = () => {
      const blkRet = JSON.parse(xhr.responseText);
      param.success({
        url: BaseImgUrl + blkRet.key,
      });
    };

    const progressFn = event => {
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = () => {
      param.error({ msg: '上传失败' });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    fd.append('token', token);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  });
};

export const editorProps = {
  height: 500,
  contentFormat: 'html',
  forceNewLine: true,
  media: {
    uploadFn: handleEditorupload,
  },
  imageControls: [],
  fontFamilies: [],
};

export const handleEditorChange = (name, form) => editorState => {
  const html = editorState.toHTML();
  if (htmlIsEmpty(html)) {
    form.setFieldsValue({ [name]: '' });
  } else {
    form.setFieldsValue({ [name]: html });
  }
  form.validateFields([name], { force: true });
};

export const BraftEditorV2 = props => {
  const { form, initialValue, name, label, required = true, editorOptions = {} } = props;
  const { getFieldDecorator } = form;
  const newProps = {
    ...editorProps,
    ...editorOptions,
    // initialContent: initialValue[name],
  };
  const layout = props.formItemLayout || formItemLayout;
  const defaultValue = EditorState.createFrom(initialValue[name]);
  const validateEditor = (rule, value, callback) => {
    if (required && htmlIsEmpty(value)) {
      callback(`${label}不能为空，请输入`);
    } else {
      callback();
    }
  };
  return (
    <FormItem {...layout} label={label}>
      {getFieldDecorator(name, {
        getValueFromEvent: editorState => editorState.toHTML(),
        rules: [
          {
            validator: validateEditor,
          },
        ],
        initialValue: defaultValue,
      })(<BraftEditor {...newProps} style={{ border: '1px solid #e8e8e8' }} />)}
    </FormItem>
  );
};
