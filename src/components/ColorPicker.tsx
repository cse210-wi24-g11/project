import {  Component } from 'react'
import { CompactPicker, ColorResult } from 'react-color'



interface ColorPickerProps {
  color?: string; // Optional initial color
  onChange: (color: string) => void;
}

class ColorPicker extends Component<ColorPickerProps> {
  state = {
    color: this.props.color || {
      r: 241,
      g: 112,
      b: 19,
      a: 1,
    },
  };

  handleChange = (color: ColorResult) => {
    this.setState({ color: color.rgb });
    this.props.onChange(color.hex);
  };

  render() {
    return (
      <div>
        <CompactPicker color={this.state.color} onChange={this.handleChange} />
      </div>
    );
  }
}

export default ColorPicker