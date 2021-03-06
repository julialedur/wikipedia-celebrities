import * as d3 from 'd3'

const margin = { top: 10, left: 50, right: 20, bottom: 50 }
const height = 600 - margin.top - margin.bottom
const width = 900 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Build the scales

var xPositionScale = d3
  .scaleLinear()
  .domain([0, 150000000])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([-2000, 2018])
  .range([height, 0])

// Read in the data

d3.csv(require('./alltop50.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  console.log('Data is', datapoints)

  d3.select('#all-countries').on('stepin', function() {
    svg
      .selectAll('circle')
      .attr('fill', '#660066')
      .attr('r', 4)
      .attr('opacity', 0.3)
  })

  d3.select('#highlight-brazil').on('stepin', function() {
    // console.log(d)
    svg
      .selectAll('circle')
      .attr('r', 4)
      .attr('fill', function(d) {
        if (d.countryCode === 'BR') {
          return '#a6759b'
        } else {
          return '#bfbfbf'
        }
      })
      .attr('opacity', function(d) {
        if (d.countryCode === 'BR') {
          return 0.8
        } else {
          return 0.5
        }
      })
      .sort(function(a, b) {
        if (a.countryCode === 'BR') {
          return 1
        } else {
          return -1
        }
      })
  })

  d3.select('#highlight-us').on('stepin', function() {
    svg
      .selectAll('circle')
      .attr('r', 4)
      .raise()
      .attr('fill', function(d) {
        if (d.countryCode === 'US') {
          return '#992317'
        } else {
          return '#bfbfbf'
        }
      })
      .attr('opacity', function(d) {
        if (d.countryCode === 'US') {
          return 0.7
        } else {
          return 0.5
        }
      })
      .sort(function(a, b) {
        if (a.countryCode === 'US') {
          return 1
        } else {
          return -1
        }
      })
  })

  d3.select('#highlight-mj').on('stepin', function() {
    svg
      .selectAll('circle')
      .raise()
      .transition()
      .duration(400)
      .attr('fill', function(d) {
        if (d.name === 'Michael Jackson') {
          return '#F3B247'
        } else {
          return '#bfbfbf'
        }
      })
      .attr('opacity', function(d) {
        if (d.name === 'Michael Jackson') {
          return 1
        } else {
          return 0.5
        }
      })
      .attr('r', function(d) {
        if (d.name === 'Michael Jackson') {
          return 11
        } else {
          return 4
        }
      })
  })

  d3.select('#highlight-jesus').on('stepin', function() {
    svg
      .selectAll('circle')
      .raise()
      .transition()
      .duration(400)
      .attr('fill', function(d) {
        if (d.name === 'Jesus Christ') {
          return '#F3B247'
        } else {
          return '#bfbfbf'
        }
      })
      .attr('opacity', function(d) {
        if (d.name === 'Jesus Christ') {
          return 1
        } else {
          return 0.5
        }
      })
      .attr('r', function(d) {
        if (d.name === 'Jesus Christ') {
          return 11
        } else {
          return 4
        }
      })
  })

  // Group data

  let nested = d3
    .nest()
    .key(d => d.countryCode)
    .entries(datapoints)

  // Add circles

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'people')
    .attr('r', 4)
    .attr('cx', function(d) {
      return xPositionScale(d.TotalPageViews)
    })
    .attr('cy', function(d) {
      if (d.birthyear > -2000) {
        return yPositionScale(d.birthyear)
      }
    })
    .attr('fill', '#660066')
    .attr('opacity', 0.3)

  /* Add in your axes */

  const yAxis = d3.axisLeft(yPositionScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  var ticks = [
    '0',
    '20,000,000',
    '40,000,000',
    '60,000,000',
    '80,000,000',
    '100,000,000',
    '120,000,000',
    '140,000,000'
  ]

  var tickLabels = [0, 20, 40, 60, 80, 100, 120, 140]

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(function(d, i) {
      return tickLabels[i]
    })
    .tickSizeInner(-height)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)

  svg
    .append('text')
    .attr('class', 'text-y-axis')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('font-family', 'Open Sans')
    .attr('font-size', 12)
    .style('text-anchor', 'middle')
    .text('Year of birth')

  svg
    .append('text')
    .attr('class', 'text-x-axis')
    .attr('text-anchor', 'middle')
    .attr('y', height)
    .attr('dy', 85)
    .attr('x', width / 2)
    .attr('font-family', 'Open Sans')
    .attr('font-size', 12)
    .text('Total page views (in millions)')

  function render() {
    // console.log('something happened')
    // Calculate height/width
    let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    let screenHeight = window.innerHeight
    let newWidth = screenWidth - margin.left - margin.right
    let newHeight = screenHeight - margin.top - margin.bottom

    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    // Update scales (depends on your scales)
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Reposition/redraw your elements

    svg
      .selectAll('circle')
      .attr('cx', function(d) {
        return xPositionScale(d.TotalPageViews)
      })
      .attr('cy', function(d) {
        if (d.birthyear > -2000) {
          return yPositionScale(d.birthyear)
        }
      })

    svg
      .select('.text-y-axis')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - newHeight / 2)
      .attr('dy', '1em')
      .attr('font-size', 12)
      .style('text-anchor', 'middle')

    svg
      .select('.text-x-axis')
      .attr('text-anchor', 'middle')
      .attr('y', newHeight - margin.bottom)
      .attr('x', newWidth / 2)

      .text('Total page views (in millions)')

    // Update axes if necessary
    const xAxis = d3
      .axisBottom(xPositionScale)
      .tickFormat(function(d, i) {
        return tickLabels[i]
      })
      .tickSizeInner(-newHeight)

    svg
      .select('.x-axis')
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)

    svg.select('.y-axis').call(yAxis)
  }
  window.addEventListener('resize', render)
  render()
}
