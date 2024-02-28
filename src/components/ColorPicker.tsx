import { Component } from 'react'
import { CompactPicker, ColorResult } from 'react-color'

interface ColorPickerProps {
  color?: string // Optional initial color
  onChange: (color: string) => void
}

interface ColorPickerState {
  color: ColorResult
}

class ColorPicker extends Component<ColorPickerProps, ColorPickerState> {
  state: ColorPickerState = {
    color: this.props.color
      ? {
          hex: this.props.color as any,
          rgb: { r: 0, g: 0, b: 0, a: 1 },
          hsl: { h: 0, s: 0, l: 0, a: 1 },
        }
      : {
          hex: '#000000',
          rgb: { r: 0, g: 0, b: 0, a: 1 },
          hsl: { h: 0, s: 0, l: 0, a: 1 },
        },
  }

  handleChange = (color: ColorResult) => {
    this.setState({ color })
    this.props.onChange(color.hex)
  }

  render() {
    return (
      <div>
        <CompactPicker
          color={this.state.color.rgb as any}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default ColorPicker
