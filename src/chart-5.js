import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 500
const width = 500

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .append('g')
  .attr('transform', 'translate(0,0)')

// <defs>
// <pattern id="ronaldinho" height="100%" width="100%" patternContentUnits="objectBoundingBox">
//   <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="ronaldinho.jpg"></image>
// </pattern>
// </defs>

var radiusScale = d3
  .scaleSqrt()
  .domain([1, 69])
  .range([5, 80])

var colorScale = d3
  .scaleOrdinal()
  .range(['#A6759B', '#992317', '#306BB9', '#F3B247', '#BCBCDB'])
// .range(['#BF4F95', '#EB606D', '#F6A65C', '#500C4E', '#057098'])
//.range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9'])

// the simulation is a collection of forces
// about where we want our circles to go
// and how we want our circles to interact
// STEP 1: move them to the middle
// STEP 2: make them not collide

// var forceXSeparate = d3
//   .forceX(function(d) {
//     if (d.gender === 'Male') {
//       return 300
//     } else {
//       return 750
//     }
//   })
//   .strength(0.05)

var forceXCombine = d3.forceX(width / 2).strength(0.05)

var forceCollide = d3.forceCollide(function(d) {
  return radiusScale(d.count) + 0.5
})

var simulation = d3
  .forceSimulation()
  .force('x', forceXCombine)
  .force('y', d3.forceY(height / 2).strength(0.05))
  .force('collide', forceCollide)

// Read in data with multiple countries
d3.csv(require('./MTA_accidents_2017.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  // console.log('Chart 3 data looks like', datapoints)

  var circles = svg
    .selectAll('.accidents')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'accidents')
    .attr('r', function(d) {
      return radiusScale(d.count)
    })
    // .attr('fill', 'url(#ronaldinho)')
    .attr('fill', function(d) {
      return colorScale(d.accident_type)
    })
    // .on('click', function(d) {
    //   console.log(d)
    // })
    // .on('mouseover', function(d) {
    //   d3.select('#name').text(d.name)
    //   d3.select('#pageviews').text(d.TotalPageViews)
    //   d3.select('#occupation').text(d.occupation)
    //   d3.select('#info')
    // })

  // Code to combine and separate the bubbles

  // d3.select('#industry').on('click', function() {
  //   simulation
  //     .force('x', forceXSeparate)
  //     .alphaTarget(0.7)
  //     .restart()
  // })

  // d3.select('#combine').on('click', function() {
  //   simulation
  //     .force('x', forceXCombine)
  //     .alphaTarget(0.7)
  //     .restart()
  // })

  simulation.nodes(datapoints).on('tick', ticked)

  function ticked() {
    circles.attr('cx', d => d.x).attr('cy', d => d.y)
  }
}