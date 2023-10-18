

// set the dimensions and margins of the graph
const width = 600
const height = 600

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data
d3.csv("data2f.csv").then( function(data) {
    console.log(data.DR1FS);
  // Filter a bit the data ->
  data = data.filter(function(d){ return d.DR1IGRMS>2100 })

  // Color palette for continents?
  const color = d3.scaleOrdinal()
    .domain(["English", "Spanish", "English and Spanish", "Other", "Asian Languages","Asian Languages and English"])
    .range([ "#90EE90", "#FFB200","pink","red","orange","blue"])
    // .range(d3.schemeSet1);

  // Size scale for countries
  const size = d3.scaleLinear()
    .domain([0, 1400000000])
    .range([7,55])  // circle will be between 7 and 55 px wide

  // create a tooltip
  const Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    Tooltip
      .style("opacity", 1)
  }
  const mousemove = function(event, d) {
    Tooltip
      .html('<u>' + d.DR1FS + '</u>' +"<br>"+d.DR1LANG+ "<br>" + d.DR1IGRMS + "Grams")
      .style("left", (event.x/2+20) + "px")
      .style("top", (event.y/2-30) + "px")
  }
  var mouseleave = function(event, d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "node")
      .attr("r", d => size(d.DR1IGRMS))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", d => color(d.DR1LANG))
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  // Features of the forces applied to the nodes:
  const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.DR1IGRMS)+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      });

  // What happens when a circle is dragged?
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }
  const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(10,10");
  const legendData = [
    { color: "#90EE90",label: "English"},
    { color:  "#FFB200", label: "Spanish" },
    { color: "pink", label: "English and Spanish" },
    {color:"red",label:"Other"},
    {color:"orange",label:"Asian Languages"},
    {color:"blue",label:"Asian Languages and English"}
  ];
  const legendItems = legend.selectAll(".legend-item")
  .data(legendData)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);
  legendItems.append("rect")
  .attr("width", 10) // 设置矩形的宽度
  .attr("height", 10) // 设置矩形的高度
  .attr("fill", d => d.color);

// 添加图例文本
legendItems.append("text")
  .attr("x", 10) // 设置文本距离矩形的水平距离
  .attr("y", 10) // 设置文本距离矩形的垂直距离
  .text(d => d.label);
  
})

