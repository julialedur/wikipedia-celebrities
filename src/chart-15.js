import * as d3 from 'd3'

const margin = { top: 70, left: 50, right: 50, bottom: 50 }
const height = 700 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Build the scales

var xPositionScale = d3
  .scaleLinear()
  .domain([0, 40000000])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([1800, 2018])
  .range([height, 0])

// var pointScale = d3.scalePoint().range([0, height])

// Read in the data

d3.csv(require('./brasil100.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  console.log('Data is', datapoints)

  // var names = datapoints.map(function(d) {
  //   return d.name
  // })

  // var pointScale = d3.scalePoint().domain(names)

  // Click buttons

  d3.select('#soccerplayer').on('click', function() {
    svg.selectAll('circle').attr('fill', function(d) {
      if (d.occupation === 'SOCCER PLAYER') {
        return '#306BB9'
      } else {
        return '#BCBCDB'
      }
    })
  })

  d3.select('#others').on('click', function() {
    svg.selectAll('circle').attr('fill', function(d) {
      if (d.occupation !== 'SOCCER PLAYER') {
        return '#306BB9'
      } else {
        return '#BCBCDB'
      }
    })
  })

  d3.select('#male').on('click', function() {
    svg.selectAll('circle').attr('fill', function(d) {
      if (d.gender === 'Male') {
        return '#992317'
      } else {
        return '#BCBCDB'
      }
    })
  })

  d3.select('#female').on('click', function() {
    svg.selectAll('circle').attr('fill', function(d) {
      if (d.gender === 'Female') {
        return '#992317'
      } else {
        return '#BCBCDB'
      }
    })
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('circle').attr('fill', '#A6759B')
  })

  // Add circles

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'people')
    .attr('r', 20)
    // .attr('stroke-width', 1)
    // .attr('stroke-fill', '#F5B7B1')
    .attr('cx', function(d) {
      return xPositionScale(d.TotalPageViews)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.birthyear)
    })
    .attr('fill', 'url(#ronaldinho)')
    //.attr('opacity', 0.4)
    .on('mouseover', function(d) {
      // Make the circle black
      d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', 'black')
        .attr('r', 40)

      d3.select('#name').text(d.name)
      d3.select('#pageviews').text(d.TotalPageViews)
      d3.select('#occupation').text(d.occupation)

      // Be sure you're using .style
      // to change CSS rules
      d3.select('#info').style('display', 'block')
    })
    .on('mouseout', function(d) {
      // Change the color to the correct color
      d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', '#A6759B')
        .attr('r', 20)
      d3.select('#info').style('display', 'none')
    })

  /* Add in your axes */

  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
