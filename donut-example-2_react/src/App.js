import React, { Component } from "react";
import {
  scaleOrdinal,
  arc,
  pie,
  easeExpOut,
  shuffle
} from "d3";
import NodeGroup from "react-move/NodeGroup";
import { sortBy } from "lodash";

const colors = scaleOrdinal().range([
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a"
]);

//  SVG Layout
const view = [510, 510]; // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

// Adjusted dimensions [width, height]
const dims = [
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2]
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

let counter = 0;

const radius = dims[1] / 2 * 0.7;

const pieLayout = pie()
  .value(d => d.value)
  .sort(null);

const innerArcPath = arc()
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

    // console.log({arcs})

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
                console.log(++counter)
                return (
                  <g>
                    {nodes.map(({ key, data, state }) => {
                      return (
                        <g key={key}>
                          <path
                            d={innerArcPath(state)}
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
