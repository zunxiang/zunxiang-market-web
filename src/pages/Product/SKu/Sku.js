import React, { PureComponent } from 'react';
import { Card, Calendar, Drawer, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SkuForm from './Edit';
import styles from './Sku.less';

export default class SkuManager extends PureComponent {
  state = {
    showDrawer: false,
  };

  handleDrawerVisiable = flag => {
    this.setState({
      showDrawer: !!flag,
    });
  };

  renderCell = () => (
    <div className={styles.cellWrap}>
      <div className={styles.btnWrap}>
        <a onClick={() => this.handleDrawerVisiable(true)}>设置</a>
        <a>清空</a>
      </div>
      <div className={styles.dailyInfo}>
        <div className={styles.baseWrap}>
          <div className={styles.halfWrap}>价格:1000</div>
          <div className={styles.halfWrap}>库存:100</div>
        </div>
        <div className={styles.feeWrap}>
          <div className={styles.fullWrap}>
            <span>店返:</span>
            <span>100;100;100;100;100</span>
          </div>
          <div className={styles.fullWrap}>
            <span>团返:</span>
            <span>100;100;100;100;100</span>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const { showDrawer } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.calendarWrap}>
            <div className={styles.operationBtnWrap}>
              <Button type="dfault" onClick={() => this.handleDrawerVisiable(true)}>
                区间设置
              </Button>
            </div>
            <Calendar dateCellRender={this.renderCell} />
          </div>
        </Card>
        <Drawer
          title="信息设置"
          width={600}
          closable
          placement="right"
          onClose={() => this.handleDrawerVisiable(false)}
          visible={showDrawer}
          destroyOnClose
        >
          <SkuForm />
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}
