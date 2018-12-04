import React, { Component } from 'react';
import SerachForm from './SearchForm';

export default class FormGeneraotrDemo extends Component {
  items = [
    {
      type: 'text',
      parse: 'default',
      key: 'text',
      label: 'text',
    },
    {
      type: 'text',
      parse: 'like',
      key: 'textlike',
      label: 'textlike',
    },
    {
      type: 'number',
      parse: 'money',
      key: 'money',
      label: 'momey',
    },
    {
      type: 'number',
      parse: 'default',
      key: 'number',
      label: 'number',
    },
    {
      type: 'number',
      parse: 'default',
      key: 'number@min',
      label: 'number@min',
    },
    {
      type: 'number',
      parse: 'default',
      key: 'number@max',
      label: 'number@max',
    },
    {
      type: 'date',
      parse: 'date',
      key: 'date',
      label: 'date',
    },
    {
      type: 'date',
      parse: 'dateIn',
      key: 'dateIn',
      label: 'dateIn',
    },
    {
      type: 'date',
      parse: 'dateLike',
      key: 'dateLike',
      label: 'dateLike',
    },
    {
      type: 'dateRange',
      parse: 'dateRange',
      key: 'dateRange',
      label: 'dateRange',
    },
    /* {
      type: 'textarea',
      parse: 'defualt',
      key: 'textarea',
      label: 'textara',
    }, */
    {
      type: 'select',
      parse: 'in',
      key: 'selectArray',
      label: 'selectArray',
      selectMode: 'multiple',
      selectOptions: [
        {
          text: 'op1',
          value: 'op1',
        },
        {
          text: 'op2',
          value: 'op2',
        },
      ],
    },
    {
      type: 'select',
      parse: 'in',
      key: 'selectObject',
      label: 'selecObject',
      selectMode: 'multiple',
      selectOptions: {
        op1: 'op1',
        op2: 'op2',
        op3: 'op3',
      },
    },
  ];
  handleOnSubmit = () => {
    // console.log(fields);
  };
  render() {
    return (
      <SerachForm
        items={this.items}
        values={{}}
        onSubmit={this.handleOnSubmit}
        onReset={() => {}}
        extra={<a style={{ marginLeft: 8 }}>导出</a>}
      />
    );
  }
}
