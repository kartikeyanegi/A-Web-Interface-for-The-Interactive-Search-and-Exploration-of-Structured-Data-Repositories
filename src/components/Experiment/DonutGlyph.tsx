import React from 'react';
import * as d3 from 'd3';

interface DonutGlyphProps {
  color?: string;
  size?: number;
  percent?: number;
  className?: string;
}

class DonutGlyph extends React.PureComponent<DonutGlyphProps> {
  static defaultProps = {
    color: 'rgba(0,0,0,0.75)',
    size: 18,
    percent: 0.25,
  };
  render() {
    const innerRadius = 40;
    const arcGenerator = d3.arc();
    const fullArcPathData = arcGenerator({
      startAngle: 0,
      endAngle: 2 * Math.PI,
      innerRadius: innerRadius,
      outerRadius: 100,
    }) as string;
    const coloredArcPathData = arcGenerator({
      startAngle: 0,
      endAngle: this.props.percent! * 2 * Math.PI,
      innerRadius: innerRadius,
      outerRadius: 100,
    }) as string;
    const size = this.props.size!;
    const translate = `translate(${size / 2}, ${size / 2}) scale(${size /
      200})`;

    const percent = this.props.percent!;

    const color = d3.scaleSequential(d3.interpolatePuBu).domain([0, 1.1])(
      percent
    );

    return (
      <svg width={size} height={size} className={this.props.className}>
        <g transform={translate}>
          <path d={fullArcPathData} fill="#f0f0f0" />
          <path d={coloredArcPathData} fill={color} />
        </g>
      </svg>
    );
  }
}

export { DonutGlyph };
