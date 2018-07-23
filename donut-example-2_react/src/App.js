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

/************* Other helper methods ************/
const generateRandomColor = () => `hsl(${Math.random() * 360},100%,50%)`;
const findItemIndexByName = (name, items) => items.findIndex(item => item.name === name);

class App extends Component {
  constructor() {
    super();
    const initData = [
      {
        name: "apple",
        qty: 2,
        color: generateRandomColor()
      },
      {
        name: "orange",
        qty: 6,
        color: generateRandomColor()
      },
      {
        name: "banana",
        qty: 3,
        color: generateRandomColor()
      }
    ];

    this.state = {
      cart: pieLayout(initData),
      data: initData,
      form: { name: "", qty: "" }
    };
  }

  incrementItem = name => {
    const { data } = this.state;
    const itemIndex = findItemIndexByName(name, data);

    const newItem = {
      ...data[itemIndex],
      qty: +data[itemIndex].qty + 1
    };
    
    const newData = [
      ...data.slice(0, itemIndex),
      newItem,
      ...data.slice(itemIndex + 1),
    ];

    this.setState({
      cart: pieLayout(newData),
      data: newData
    });
  };

  decrementItem = name => {
    const { data } = this.state;
    const itemIndex = findItemIndexByName(name, data);

    const newItem = {
      ...data[itemIndex],
      qty: +data[itemIndex].qty - 1
    };
    
    const newData = [
      ...data.slice(0, itemIndex),
      newItem,
      ...data.slice(itemIndex + 1),
    ];

    this.setState({
      cart: pieLayout(newData),
      data: newData
    });
  };

  removeItem = name => {
    const { data } = this.state;
    const itemIndex = findItemIndexByName(name, data);

    const newData = [
      ...data.slice(0, itemIndex),
      ...data.slice(itemIndex + 1),
    ]
    
    this.setState({
      cart: pieLayout(newData),
      data: newData
    });
  };

  addItem = () => {
    const { data } = this.state;
    const { name, qty } = this.state.form;

    const newData = [ 
      ...data,
      { name, qty, color: generateRandomColor() }
    ];

    this.setState({
      cart: pieLayout(newData),
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
    const { name, qty } = this.state.form;

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
                    <button onClick={() => incrementItem(e.data.name)}>+</button>
                    <button onClick={() => decrementItem(e.data.name)}>-</button>
                    <button onClick={() => removeItem(e.data.name)}>x</button>
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
              keyAccessor={d => d.data.name}
              start={start}
              enter={enter}
              update={update}
            >
              {nodes => {
                return (
                  <g>
                    {nodes.map(({ key, data, state }) => {
                      {/* console.log({ key, data, state });
                      debugger */}
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
