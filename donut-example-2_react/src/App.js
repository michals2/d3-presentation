import React, { Component } from "react";
import { arc, pie, easeExpOut } from "d3";
import NodeGroup from "react-move/NodeGroup";

/****************** SVG Layout ******************/
const view = [510, 510];
const margins = [10, 10, 10, 10];
const dims = [
  view[0] - margins[1] - margins[3],
  view[1] - margins[0] - margins[2]
];
const radius = dims[1] / 2 * 0.7;

/****************** D3 methods ******************/
const pieLayout = pie()
  .value(d => d.qty)
  .sort(null);
const arcPath = arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius * 1.0);

/************** React-Move methods **************/
const start = ({ startAngle }) => {
  // console.log("Start!");
  return {
    startAngle: startAngle,
    endAngle: startAngle
  };
};
const enter = ({ endAngle }) => {
  // console.log("Enter!");
  return {
    endAngle: [endAngle],
    timing: { duration: 2000, ease: easeExpOut }
  };
};
const update = ({ startAngle, endAngle }) => {
  // console.log("Update!");
  return {
    startAngle: [startAngle],
    endAngle: [endAngle],
    timing: { duration: 2000, ease: easeExpOut }
  };
};

/** Other helper methods **/
const generateRandomColor = () => `hsl(${Math.random() * 360},100%,50%)`;

class App extends Component {
  constructor() {
    super();
    const initData = {
      445: {
        name: "apple",
        qty: 2,
        id: 445,
        color: generateRandomColor()
      },
      446: {
        name: "orange",
        qty: 6,
        id: 446,
        color: generateRandomColor()
      },
      447: {
        name: "banana",
        qty: 3,
        id: 447,
        color: generateRandomColor()
      }
    };

    this.state = {
      cart: pieLayout(Object.values(initData)),
      data: initData,
      form: { name: null, qty: null, id: null }
    };
  }

  incrementItem = id => {
    const { data } = this.state;
    const item = data[id];

    const newData = { ...data };
    newData[id] = {
      ...item,
      qty: item.qty + 1
    };

    this.setState({
      cart: pieLayout(Object.values(newData)),
      data: newData
    });
  };

  decrementItem = id => {
    const { data } = this.state;
    const item = data[id];

    const newData = { ...data };
    newData[id] = {
      ...item,
      qty: item.qty - 1
    };

    this.setState({
      cart: pieLayout(Object.values(newData)),
      data: newData
    });
  };

  removeItem = id => {
    const { data } = this.state;

    const newData = { ...data };
    delete newData[id];

    this.setState({
      cart: pieLayout(Object.values(newData)),
      data: newData
    });
  };

  addItem = () => {
    const { data } = this.state;
    const { name, qty, id } = this.state.form;

    const newData = { ...data };
    newData[id] = { name, qty, id };

    this.setState({
      cart: pieLayout(Object.values(newData)),
      data: newData
    });
  };

  handleChange = event => {
    const { form } = this.state;

    const newForm = { ...form };
    newForm[event.target.id] = event.target.value;

    this.setState({ form: newForm });
  };

  render() {
    const { cart } = this.state;
    const { incrementItem, decrementItem, removeItem, addItem } = this;
    const { name, qty, id } = this.state.form;

    return (
      <div>
        <input
          type="text"
          id="name"
          placeholder="name"
          value={name}
          onChange={this.handleChange}
        />
        <input
          type="text"
          id="qty"
          placeholder="qty"
          value={qty}
          onChange={this.handleChange}
        />
        <input
          type="text"
          id="id"
          placeholder="id"
          value={id}
          onChange={this.handleChange}
        />
        <button onClick={addItem}>add item</button>
        <table>
          <tbody>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
            {cart.map((e, i) => {
              return (
                <tr key={i}>
                  <td>{e.data.name}</td>
                  <td>{e.data.qty}</td>
                  <td>
                    <button onClick={() => incrementItem(e.data.id)}>+</button>
                    <button onClick={() => decrementItem(e.data.id)}>-</button>
                    <button onClick={() => removeItem(e.data.id)}>x</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <svg height={dims[0]} width={dims[1]}>
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>
            <NodeGroup
              data={cart}
              keyAccessor={d => d.data.id}
              start={start}
              enter={enter}
              update={update}
            >
              {nodes => {
                return (
                  <g>
                    {nodes.map(({ key, data, state }) => {
                      console.log({ data });
                      return (
                        <path
                          d={arcPath(state)}
                          fill={data.data.color}
                          key={key}
                        />
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
