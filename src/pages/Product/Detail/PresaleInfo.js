import React from 'react';
import { Card } from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const feeLevels = ['一级', '二级', '三级', '四级', '五级'];

const PresaleInfo = props => {
  const { item } = props;
  const [feeP, feeT] = item.fee;
  return (
    <>
      <Card title="预售信息">
        <DescriptionList size="small" style={{ marginBottom: 16 }} col={4}>
          <Description term="价格">{item.price / 100}</Description>
          <Description term="库存">{item.stock}</Description>
          <Description term="开始时间">{item.presales_begin_time}</Description>
          <Description term="结束时间">{item.presales_begin_time}</Description>
        </DescriptionList>
      </Card>
      <Card title="佣金计划" style={{ marginTop: 16 }}>
        <DescriptionList title="店返" size="small" style={{ marginBottom: 16 }} col={6}>
          {feeP.map((fee, index) => (
            <Description term={feeLevels[index]} key={`feeP${feeLevels[index]}`}>
              {fee / 100}
            </Description>
          ))}
        </DescriptionList>
        <DescriptionList title="团返" size="small" style={{ marginBottom: 16 }} col={6}>
          {feeT.map((fee, index) => (
            <Description term={feeLevels[index]} key={`feeT${feeLevels[index]}`}>
              {fee / 100}
            </Description>
          ))}
        </DescriptionList>
      </Card>
    </>
  );
};

export default PresaleInfo;
