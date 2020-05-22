import React, { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, message, Modal, Button } from 'antd';
import ReactQMap from 'react-qmap';
import { mapKey } from '@/common/config';
import { formItemLayout } from './common';

const { Search } = Input;
const FormItem = Form.Item;

export default class MapForm extends PureComponent {
  constructor(props) {
    super(props);
    const { initialValue } = props;
    this.state = {
      searchService: null,
      infoWin: null,
      markers: [],
      geocoder: null,
      initAdrress: initialValue.origin_address,
      visible: false,
    };
  }

  componentDidMount() {
    const { form, initialValue } = this.props;
    const { address, city, country, province, initLoaction: location, model } = initialValue;
    if (model === 'edit') {
      const value = {
        address,
        addressComponents: { city, country, province },
        location,
      };
      form.setFieldsValue({ map: value });
    }
  }

  /* eslint no-underscore-dangle: ["error", { "allow": ["__map__"] }] */
  handleCreated = (smap, gmap) => {
    const markers = [];
    let infoWin = null;
    const geocoder = new gmap.Geocoder({
      complete: result => {
        if (infoWin) {
          infoWin.close();
        } else {
          infoWin = new gmap.InfoWindow({
            map: smap,
          });
        }
        let overlay;
        /* eslint no-cond-assign: 0 */
        while ((overlay = markers.pop())) {
          overlay.setMap(null);
        }
        const marker = new gmap.Marker({
          position: result.detail.location,
          map: smap,
        });
        markers.push(marker);
        infoWin.open();
        infoWin.setContent(`<div style="width:100px;height:auto;">${result.detail.address}</div>`);
        infoWin.setPosition(result.detail.location);
        this.setState({
          initAdrress: result.detail.address,
        });
        this.props.form.setFieldsValue({ map: result.detail });
      },
    });
    const searchService = new gmap.SearchService({
      location: '中国',
      complete: results => {
        if (!results.detail.pois) {
          message.error('未找到相关地点，请调整关键字搜索');
          return;
        }
        const { pois } = results.detail;
        if (infoWin) {
          infoWin.close();
        } else {
          infoWin = new gmap.InfoWindow({
            map: smap,
          });
        }
        const latlngBounds = new gmap.LatLngBounds();
        for (let n = 0, l = pois.length; n < l; n += 1) {
          const poi = pois[n];
          latlngBounds.extend(poi.latLng);
          const marker = new gmap.Marker({
            map: smap,
          });
          marker.setPosition(poi.latLng);

          marker.setTitle(n + 1);
          markers.push(marker);
          infoWin.open();
          infoWin.setContent(
            `<div style="width:100px;height:auto;">${poi.address || poi.name}--'点击选择'</div>`
          );
          infoWin.setPosition(poi.latLng);
          gmap.event.addListener(marker, 'click', () => {
            this.handleMarkerClick(poi.latLng);
          });
        }
        smap.fitBounds(latlngBounds);
        this.setState({
          infoWin,
        });
      },
    });
    gmap.event.addListener(smap, 'click', event => {
      this.handleMarkerClick(event.latLng);
    });
    const {
      initialValue: { initLoaction },
    } = this.props;
    if (initLoaction) {
      geocoder.getAddress(new gmap.LatLng(initLoaction.lat, initLoaction.lng));
    }
    this.setState({
      searchService,
      markers,
      geocoder,
    });
  };

  handleMarkerClick = latlng => {
    const { geocoder } = this.state;
    geocoder.getAddress(latlng);
  };

  handleSearch = value => {
    const { infoWin, markers, searchService } = this.state;
    if (infoWin) {
      infoWin.close();
    }
    let overlay;
    while ((overlay = markers.pop())) {
      overlay.setMap(null);
    }
    searchService.setPageCapacity(1);
    searchService.search(value);
  };

  handleMapModalVisible = flag => {
    this.input.blur();
    this.setState({
      visible: !!flag,
    });
  };

  render() {
    const { initAdrress, visible } = this.state;
    const { form, label, fieldName } = this.props;
    const { getFieldDecorator } = form;
    const initCenter = {
      latitude: 23.12908,
      longitude: 113.26436,
    };
    return (
      <Fragment>
        <FormItem {...formItemLayout} label={label}>
          {getFieldDecorator(fieldName, {
            rules: [
              {
                required: true,
                message: '请在地图选择产品地址',
              },
            ],
          })(<Input style={{ display: 'none' }} />)}
          <Search
            placeholder="请输在地图上选择地址"
            value={initAdrress}
            enterButton="显示地图"
            ref={c => {
              this.input = c;
            }}
            onFocus={() => this.handleMapModalVisible(true)}
            onSearch={() => this.handleMapModalVisible(true)}
          />
        </FormItem>
        <Modal
          title="地址选择"
          visible={visible}
          onCancel={() => this.handleMapModalVisible(false)}
          width={900}
          footer={
            <div>
              <span>已选地址：{initAdrress}</span>
              <Button
                type="primary"
                onClick={() => this.handleMapModalVisible(false)}
                style={{ marginLeft: 8 }}
              >
                确定
              </Button>
            </div>
          }
          zIndex={1002}
        >
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <ReactQMap
              getMap={this.handleCreated}
              center={initCenter}
              initialOptions={{ zoomControl: true, mapTypeControl: false, zoom: 10 }}
              apiKey={mapKey}
            />
            <Search
              placeholder="请输入您需要搜索的地址"
              onSearch={this.handleSearch}
              style={{
                width: 300,
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: -150,
              }}
              enterButton
              defaultValue={initAdrress}
              size="default"
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}
