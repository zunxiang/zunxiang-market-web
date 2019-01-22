import React from 'react';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
  };

  handleClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({ displayColorPicker: !displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    const { onChange } = this.props;
    onChange(color.hex);
  };

  render() {
    const { color } = this.props;
    const styles = reactCSS({
      default: {
        color: {
          width: '80px',
          height: '20px',
          borderRadius: '2px',
          backgroundColor: color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
        wrap: {
          marginTop: 5,
        },
      },
    });

    return (
      <div style={styles.wrap}>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <ChromePicker color={color} onChange={this.handleChange} disableAlpha width={250} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SketchExample;
