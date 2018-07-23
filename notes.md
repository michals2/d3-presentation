```javascript
const data = [
    { item: "Apples", qty: 3 },
    { item: "Coconuts", qty: 12 },
    { item: "Kumquats", qty: 9 }
]
```
```javascript
const chartData = {
  "pieSlices": [
    { "data": 3, "index": 0, "value": 3, "startAngle": 0, "endAngle": 0.7853981633974483, "padAngle": 0 },
    { "data": 12,"index": 1,"value": 12,"startAngle": 0.7853981633974483,"endAngle": 3.9269908169872414,"padAngle": 0 },
    { "data": 9,"index": 2,"value": 9,"startAngle": 3.9269908169872414,"endAngle": 6.283185307179586,"padAngle": 0 }
  ],
  "arcs": [
    "M1.469576158976824e-14,-240A240,240,0,0,1,169.7056274847714,-169.70562748477138L0,0Z",
    "M169.7056274847714,-169.70562748477138A240,240,0,1,1,-169.70562748477138,169.7056274847714L0,0Z",
    "M-169.70562748477138,169.7056274847714A240,240,0,0,1,-4.408728476930471e-14,-240L0,0Z"
  ],
  "colors": [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e"
  ]
}
```


# Todo
[x] change ordinal scale color to linear (so that more nodes can be added)
[x] recenter donut on SVG





# React Move Notes

* NodeGroup props
  * data
  * keyAccessor
  * start
  * enter
  * update
  * leave

## NodeGroup Lifecycle

start --> enter --> update --> leave