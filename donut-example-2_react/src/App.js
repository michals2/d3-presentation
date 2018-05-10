import React, { Component } from 'react';
import { scaleOrdinal, schemeCategory20, arc, pie, easeExpOut } from 'd3';
import NodeGroup from 'react-move/NodeGroup';

const width = 960;
const height = 500;
const outerRadius = Math.min(width, height) * .5 - 10;
const innerRadius = 0;

const colorCreator = scaleOrdinal(schemeCategory20);

const arcCreator = 
  arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)

const pieCreator = 
  pie()
  .sort(null);

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [
        { name: "Apples", qty: 3 },
        { name: "Coconuts", qty: 12 },
        { name: "Kumquats", qty: 9 }
      ]
    };
  }

  render() {
    const colors = this.state.items.map((item, i) => colorCreator(i));
    // modify this to index onto qty property instead of intermediate map
    const pieSlices = pieCreator(this.state.items.map(item => item.qty))
    const arcs = pieSlices.map(slice => arcCreator(slice))

    const chartData = {colors, pieSlices, arcs};

    return (
      <div>
        <svg width={width} height={height}>
          <g transform={`translate(${width/2}, ${height/2})`}>
          <NodeGroup
              data={chartData}
              keyAccessor={(d, i) => i}

              start={({ startAngle }) => ({
                startAngle,
                endAngle: startAngle,
              })}

              enter={({ endAngle }) => ({
                endAngle: [endAngle],
                timing: { duration: 500, delay: 350, ease: easeExpOut },
              })}

              update={({ startAngle, endAngle }) => ({
                startAngle: [startAngle],
                endAngle: [endAngle],
                timing: { duration: 350, ease: easeExpOut },
              })}
            >
              {/* {
                this.state.items.map((item, i) => 
                  <path key={i} fill={colors[i]} d={arcs[i]}></path>
                )
              } */}
            </NodeGroup>
          </g>
        </svg>
      </div>
    );
  }
}

export default App;
