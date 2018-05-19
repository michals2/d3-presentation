import React, { Component } from "react";
import {
  scaleOrdinal,
  arc,
  pie,
  easeExpOut,
  shuffle,
  schemeCategory20
} from "d3";
import NodeGroup from "react-move/NodeGroup";
import { sortBy } from "lodash";

const colors = scaleOrdinal(schemeCategory20);

//  SVG Layout
const view = [510, 510]; // [width, height]
const margins = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [
  view[0] - margins[1] - margins[3],
  view[1] - margins[0] - margins[2]
];

const mockData = [
  {
    name: "Linktype"
  },
  {
    name: "Quaxo"
  },
  {
    name: "Skynoodle"
  },
  {
    name: "Realmix"
  },
  {
    name: "Jetpulse"
  },
  {
    name: "Chatterbridge"
  },
  {
    name: "Riffpedia"
  },
  {
    name: "Layo"
  },
  {
    name: "Oyoba"
  },
  {
    name: "Ntags"
  }
];

const radius = dims[1] / 2 * 0.7;

const pieLayout = pie()
  .value(d => d.value)
  .sort(null);

const arcPath = arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius * 1.0);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

function getArcs() {
  const data = shuffle(mockData).map(({ name }) => ({
    name,
    value: getRandom(10, 100)
  }));

  return pieLayout(sortBy(data, d => d.name));
}

class App extends Component {
  state = {
    arcs: getArcs()
  };

  update = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState(() => ({
      arcs: getArcs()
    }));
  };

  render() {
    const { arcs } = this.state;

    return (
      <div>
        <button onClick={this.update}>Update</button>
        <svg height={dims[0]} width={dims[1]}>
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>

            <NodeGroup
              data={arcs}
              keyAccessor={d => d.data.name}
              start={({ startAngle }) => ({
                startAngle,
                endAngle: startAngle
              })}
              enter={({ endAngle }) => ({
                endAngle: [endAngle],
                timing: { duration: 500, delay: 350, ease: easeExpOut }
              })}
              update={({ startAngle, endAngle }) => ({
                startAngle: [startAngle],
                endAngle: [endAngle],
                timing: { duration: 2000, ease: easeExpOut }
              })}
            >
              {nodes => {
                return (
                  <g>
                    {nodes.map(({ key, data, state }) => {
                      // if ( key === "Skynoodle") console.log({ key, data, state })
                      return (
                        <g key={key}>
                          <path
                            d={arcPath(state)}
                            fill={colors(data.data.name)}
                            opacity={0.9}
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              }}
            </NodeGroup>

          </g>
        </svg>
      </div>
    );
  }
}

export default App;
