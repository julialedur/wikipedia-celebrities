import * as d3 from 'd3'
// import { format } from 'd3-format'

const margin = { top: 90, left: 60, right: 80, bottom: 100 }
const height = 600 - margin.top - margin.bottom
const width = 800 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// <defs>
// <pattern id="ronaldinho" height="100%" width="100%" patternContentUnits="objectBoundingBox">
//   <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="ronaldinho.jpg"></image>
// </pattern>
// </defs>

var defs = svg.append('defs')

// defs
//   .append('pattern')
//   .attr('id', 'ronaldinho')
//   .attr('height', '100%')
//   .attr('width', '100%')
//   .attr('patternContentUnits', 'objectBoundingBox')
//   .append('image')
//   .attr('height', '1')
//   .attr('width', '1')
//   .attr('preserveAspectRatio', 'none')
//   .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
//   .attr('xlink:href', require('./ronaldinho.jpg'))

var radiusScale = d3
  .scaleSqrt()
  .domain([1, 40000000])
  .range([5, 60])

var xPositionScale = d3
  .scaleLinear()
  .domain([1800, 2018])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 40000000])
  .range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range(['#A6759B', '#992317', '#306BB9', '#F3B247', '#BCBCDB'])
// .range(['#BF4F95', '#EB606D', '#F6A65C', '#500C4E', '#057098'])
// .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9'])

// the simulation is a collection of forces
// about where we want our circles to go
// and how we want our circles to interact
// STEP 1: move them to the middle
// STEP 2: make them not collide

var forceXSeparate = d3.forceX(width / 2).strength(0.1)

var forceYSeparate = d3
  .forceY(function(d) {
    return yPositionScale(d.TotalPageViews)
  })
  .strength(0.3)

var forceYCombine = d3.forceY(width / 2).strength(0.04)

var forceCollide = d3.forceCollide(15)

var simulation = d3
  .forceSimulation()
  .force('x', forceXSeparate)
  .force('y', forceYSeparate)
  .force('collide', forceCollide)

// Read in data with multiple countries
d3.csv(require('./brasil50new.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  // console.log('Chart 3 data looks like', datapoints)

  // adding the circles to each person

  var circles = svg
    .selectAll('.people')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'people')
    .attr('r', 15)
    .attr('stroke', 'grey')
    .attr('stroke-width', 2)
    .attr('fill', function(d) {
      return 'url(#' + d.name.toLowerCase().replace(/ /g, '-') + ')'
    })
    .call(
      d3
        .drag()
        .on('drag', dragged)
        .on('end', dragended)
    )
    // .attr('fill', function(d) {
    //   return colorScale(d.domain)
    // })
    .on('click', function(d) {
      console.log(d)
    })
    .on('mouseover', function(d) {
      //var number = d.TotalPageViews
      d3.select(this)
        .raise()
        .transition()
        .duration(200)
        .attr('r', 45)
        .attr('stroke', 'purple')
        .attr('stroke-width', 3)

      d3.select('#name2').text(d.name)
      d3.select('#number').text(parseInt(d.TotalPageViews).toLocaleString())
      d3.select('#occupation2').text(d.occupation.toLowerCase())
      d3.select('#info2').style('display', 'block')
    })
    .on('mouseout', function(d) {
      // Change the color to the correct color
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 15)
        .attr('stroke', 'grey')
        .attr('stroke-width', 2)
      d3.select('#info2').style('display', 'none')
    })

  // putting each person's picture on the graph

  defs
    .selectAll('.person-pattern')
    .data(datapoints)
    .enter()
    .append('pattern')
    .attr('class', 'artist-pattern')
    .append('pattern')
    .attr('id', function(d) {
      return d.name.toLowerCase().replace(/ /g, '-')
    })
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('patternContentUnits', 'objectBoundingBox')
    .append('image')
    .attr('height', '1')
    .attr('width', '1')
    .attr('preserveAspectRatio', 'none')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    // .attr('xlink:href', require('./ronaldinho.jpg'))
    .attr('xlink:href', function(d) {
      return d.image_path
    })

  // Code for clicking the buttons

  svg
    .append('filter')
    .attr('id', 'desaturate')
    .append('feColorMatrix')
    .attr('type', 'matrix')
    .attr('fill-opacity', 1)
    .attr('brightness', '500%')
    .attr('contrast', '20%')
    .attr('values', '0.7 0.7 0.7 0 0 0.7 0.7 0.7 0 0 0.7 0.7 0.7 0 0 0 0 0 1 0')

  d3.select('#soccerplayer2').on('click', function() {
    svg
      .selectAll('circle')
      .attr('stroke-width', 2)
      //     .attr('stroke', function(d) {
      //       if (d.occupation === 'SOCCER PLAYER') {
      //         return 'lightgreen'
      //       } else {
      //         return 'none'
      //       }
      //     })
      // })
      .attr('filter', function(d) {
        if (d.occupation === 'SOCCER PLAYER') {
          return 'none'
        } else {
          return 'url(#desaturate)'
        }
      })
  })

  d3.select('#others2').on('click', function() {
    svg
      .selectAll('circle')
      .attr('stroke-width', 2)
      //     .attr('stroke', function(d) {
      //       if (d.occupation !== 'SOCCER PLAYER') {
      //         return 'orange'
      //       } else {
      //         return 'none'
      //       }
      //     })
      // })

      .attr('filter', function(d) {
        if (d.occupation !== 'SOCCER PLAYER') {
          return 'none'
        } else {
          return 'url(#desaturate)'
        }
      })
  })

  d3.select('#male2').on('click', function() {
    svg
      .selectAll('circle')
      .attr('stroke-width', 2)
      //     .attr('stroke', function(d) {
      //       if (d.gender === 'Male') {
      //         return 'yellow'
      //       } else {
      //         return 'none'
      //       }
      //     })
      // })
      .attr('filter', function(d) {
        if (d.gender === 'Male') {
          return 'none'
        } else {
          return 'url(#desaturate)'
        }
      })
  })

  d3.select('#female2').on('click', function() {
    svg
      .selectAll('circle')
      .attr('stroke-width', 2)
      //     .attr('stroke', function(d) {
      //       if (d.gender === 'Female') {
      //         return 'lightblue'
      //       } else {
      //         return 'none'
      //       }
      //     })
      // })

      .attr('filter', function(d) {
        if (d.gender === 'Female') {
          return 'none'
        } else {
          return 'url(#desaturate)'
        }
      })
  })

  d3.select('#reset2').on('click', function() {
    svg.selectAll('circle').attr('filter', 'none')
    // .attr('stroke', 'none')
  })

  simulation.nodes(datapoints).on('tick', ticked)

  function ticked() {
    circles
      .attr('cx', function(d) {
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      })
  }

  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  // Y-axis

  const yAxis = d3
    .axisLeft(yPositionScale)
    .ticks(5)
    .tickSize(-width)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .attr('stroke-dasharray', '2,4')
    .lower()

  const yAxisRight = d3.axisRight(yPositionScale).ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', `translate(${width},0)`)
    .call(yAxisRight)

  svg.selectAll('.domain').remove()

  function fixPositions() {
    circles.forEach(function(circle) {
      circle.y = circle.yPos ? parseInt(circle.yPos) : circle.y
      circle.x = circle.xPos ? parseInt(circle.Pos) : circle.x
    })
  }
}
