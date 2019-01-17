import React from 'react';
import { Form } from 'antd';
import ReactUeditor from 'ifanrx-react-ueditor';
import { BaseImgUrl, getQiniuToken } from '@/common/config';
import styles from './style.less';

const FormItem = Form.Item;

const itemLayout = {
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

const uploadImage = e =>
  new Promise((resolve, reject) => {
    const file = e.target.files[0];
    getQiniuToken().then(token => {
      const serverURL = 'http://up-z2.qiniu.com';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      const successFn = () => {
        const blkRet = JSON.parse(xhr.responseText);
        resolve(BaseImgUrl + blkRet.key);
      };

      /* const progressFn = event => {
        param.progress(event.loaded / event.total * 100);
      }; */

      const errorFn = () => {
        reject(new Error('上传失败'));
      };

      // xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);

      fd.append('file', file);
      fd.append('token', token);
      xhr.open('POST', serverURL, true);
      xhr.send(fd);
    });
  });
export const Ueditor = props => {
  const {
    form,
    initialValue = '',
    name = '',
    label,
    required = true,
    editorOptions = {},
    formItemLayout = itemLayout,
  } = props;
  const { getFieldDecorator } = form;
  const layout = formItemLayout;
  let timer = null;
  const updateEditorContent = content => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      form.setFieldsValue({ [name]: content });
      form.validateFields([name], { force: true });
    }, 1000);
  };

  const editorConfig = {
    zIndex: 1001,
    autoHeightEnabled: false,
    autoFloatEnabled: false,
    initialFrameHeight: 500,
    initialFrameWidth: 500,
    lang: 'zh-cn',
    langPath: '/ueditor/lang/',
    ...editorOptions,
    UEDITOR_HOME_URL: `http://${location.host}/ueditor/`,
  };

  return (
    <FormItem {...layout} label={label}>
      {getFieldDecorator(name, {
        rules: [
          {
            required,
            message: `请输入${label}`,
          },
        ],
        initialValue,
      })(
        <div style={{ width: '100%' }} className={styles.editWrap}>
          <ReactUeditor
            config={editorConfig}
            onChange={updateEditorContent}
            uploadImage={uploadImage}
            plugins={['uploadImage', 'insertCode']}
            ueditorPath="/ueditor"
            value={initialValue}
          />
        </div>
      )}
    </FormItem>
  );
};
