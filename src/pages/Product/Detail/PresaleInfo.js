import React from 'react';
import { Card, Descriptions } from 'antd';

const feeLevels = ['一级', '二级', '三级', '四级', '五级'];

const PresaleInfo = props => {
  const { item } = props;
  const [feeP, feeT] = item.fee;
  return (
    <>
      <Card title="预售信息">
        <Descriptions size="small" column={4}>
          <Descriptions.Item label="价格">{item.price / 100}</Descriptions.Item>
          <Descriptions.Item label="库存">{item.stock}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{item.presales_begin_time}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{item.presales_end_time}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="佣金计划" style={{ marginTop: 16 }}>
        <Descriptions title="店返" size="small" column={6}>
          {feeP.map((fee, index) => (
            <Descriptions.Item label={feeLevels[index]} key={`feeP${feeLevels[index]}`}>
              {fee / 100}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Descriptions title="团返" size="small" column={6}>
          {feeT.map((fee, index) => (
            <Descriptions.Item label={feeLevels[index]} key={`feeT${feeLevels[index]}`}>
              {fee / 100}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    </>
  );
};

export default PresaleInfo;
