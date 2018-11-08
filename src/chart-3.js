import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 60, bottom: 30 }
const height = 900
const width = 900

const svg = d3
  .select('#chart-3')
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
  .domain([1, 145250649])
  .range([2, 35])

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

// var positions = {
//   'SPORTS': { x: 200, y: 200 },
//   'INSTITUTIONS': { x: 200, y: 400 },
//   'ARTS': { x: 200, y: 600 },
//   'PUBLIC FIGURE': { x: 600, y: 200 },
//   'HUMANITIES': { x: 600, y: 400 },
//   'SCIENCE AND TECHNOLOGY': { x: 600, y: 600 }
// }

var forceXSeparate = d3
  .forceX(function(d) {
    if (d.domain === 'SPORTS') {
      return 200
    } else if (d.domain === 'ARTS') {
      return 200
    } else if (d.domain === 'INSTITUTIONS') {
      return 400
    } else if (d.domain === 'PUBLIC FIGURE') {
      return 400
    } else if (d.domain === 'HUMANITIES') {
      return 600
    } else if (d.domain === 'SCIENCE & TECHNOLOGY') {
      return 600
    } else {
      return 600
    }
  })
  .strength(0.07)

var forceYSeparate = d3
  .forceY(function(d) {
    if (d.domain === 'SPORTS') {
      return 450
    } else if (d.domain === 'ARTS') {
      return 250
    } else if (d.domain === 'INSTITUTIONS') {
      return 450
    } else if (d.domain === 'PUBLIC FIGURE') {
      return 250
    } else if (d.domain === 'HUMANITIES') {
      return 250
    } else if (d.domain === 'SCIENCE & TECHNOLOGY') {
      return 600
    } else {
      return 450
    }
  })
  .strength(0.07)

var forceXSeparateGender = d3
  .forceX(function(d) {
    if (d.gender === 'Male') {
      return 200
    } else if (d.gender === 'Female') {
      return 600
    }
  })
  .strength(0.07)

var forceYSeparateGender = d3
  .forceY(function(d) {
    if (d.gender === 'Male') {
      return 300
    } else if (d.gender === 'Female') {
      return 300
    }
  })
  .strength(0.07)

var forceXCombine = d3.forceX(width / 2.5).strength(0.05)
var forceYCombine = d3.forceY(height / 3).strength(0.05)

var forceCollide = d3.forceCollide(function(d) {
  return radiusScale(d.TotalPageViews) + 0.5
})

var simulation = d3
  .forceSimulation()
  .force('x', forceXCombine)
  .force('y', d3.forceY(height / 2).strength(0.06))
  .force('collide', forceCollide)
  .force('charge', d3.forceManyBody().strength(-20))

// Read in data with multiple countries
d3.csv(require('./brazilus50.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  // console.log('Chart 3 data looks like', datapoints)

  datapoints.forEach(d => {
    d.x = width * 0.25 + Math.random() * width * 0.5
    d.y = height * 0.25 + Math.random() * height * 0.5
  })

  // create tooltip

  var div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
  // .style('display', 'none')

  var circles = svg
    .selectAll('.people')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'people')
    .attr('r', function(d) {
      return radiusScale(d.TotalPageViews)
    })
    // .attr('fill', 'url(#ronaldinho)')
    .attr('fill', function(d) {
      return colorScale(d.countryCode)
    })
    // .on('click', function(d) {
    //   console.log(d)
    // })
    .on('mouseMove', function() {
      var infobox = d3.select('.infobox')
      var coord = d3.svg.mouse(this)
      // now we just position the infobox roughly where our mouse is
      infobox.style('left', coord[0] + 15 + 'px')
      infobox.style('top', coord[1] + 'px')
    })

    .on('mouseover', function(d) {
      div
        .transition()
        .duration(200)
        .style('opacity', 0.9)
      div
        .html(
          d.name.bold() +
            '<br/>' +
            d.occupation.charAt(0) +
            d.occupation.slice(1).toLowerCase() +
            '<br/>' +
            d3.format(',')(d.TotalPageViews) +
            ' pageviews'
        )
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('mouseout', function(d) {
      div
        .transition()
        .duration(500)
        .style('opacity', 0)
    })

  // appending labels for the clusters

  // industry labels

  var nestedIndustry = d3
    .nest()
    .key(d => d.domain)
    .entries(datapoints)

  svg
    .selectAll('label-industry')
    .data(nestedIndustry)
    .enter()
    .append('text')
    .text(d => d.key.charAt(0) + d.key.slice(1).toLowerCase())
    .attr('class', 'label-industry')
    .attr('font-family', 'Open Sans')
    .attr('font-weight', 'bold')
    .attr('x', function(d) {
      if (d.key === 'SPORTS') {
        return 150
      } else if (d.key === 'ARTS') {
        return 180
      } else if (d.key === 'INSTITUTIONS') {
        return 400
      } else if (d.key === 'PUBLIC FIGURE') {
        return 410
      } else if (d.key === 'HUMANITIES') {
        return 620
      } else if (d.key === 'SCIENCE & TECHNOLOGY') {
        return 550
      } else {
        return 600
      }
    })
    .attr('y', function(d) {
      if (d.key === 'SPORTS') {
        return 390
      } else if (d.key === 'ARTS') {
        return 35
      } else if (d.key === 'INSTITUTIONS') {
        return 390
      } else if (d.key === 'PUBLIC FIGURE') {
        return 160
      } else if (d.key === 'HUMANITIES') {
        return 190
      } else if (d.key === 'SCIENCE & TECHNOLOGY') {
        return 600
      } else {
        return 400
      }
    })
    .style('visibility', 'hidden')

  // gender labels

  var nestedGender = d3
    .nest()
    .key(d => d.gender)
    .entries(datapoints)

  svg
    .selectAll('label-gender')
    .data(nestedGender)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('class', 'label-gender')
    .attr('font-family', 'Open Sans')
    .attr('font-weight', 'bold')
    .attr('x', function(d) {
      if (d.key === 'Male') {
        return 170
      } else if (d.key === 'Female') {
        return 610
      }
    })
    .attr('y', function(d) {
      if (d.key === 'Male') {
        return 80
      } else if (d.key === 'Female') {
        return 150
      }
    })
    .style('visibility', 'hidden')

  // Code to combine and separate the bubbles - scrollytelling

  d3.select('#intro').on('stepin', () => {
    // console.log('something happened')
    svg.selectAll('.label-industry').style('visibility', 'hidden')
    svg.selectAll('.label-gender').style('visibility', 'hidden')
    div.style('display', 'inline')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.7)
      .restart()
  })

  d3.select('#split-industry').on('stepin', () => {
    svg.selectAll('.label-industry').style('visibility', 'visible')
    svg.selectAll('.label-gender').style('visibility', 'hidden')
    div.style('opacity', 1)

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      .alphaTarget(0.7)
      .restart()
  })

  d3.select('#split-gender').on('stepin', function() {
    svg.selectAll('.label-industry').style('visibility', 'hidden')
    svg.selectAll('.label-gender').style('visibility', 'visible')
    div.style('display', 'inline')

    simulation
      .force('x', forceXSeparateGender)
      .force('y', forceYSeparateGender)
      .alphaTarget(0.7)
      .restart()
  })

  d3.select('#recombine').on('stepin', function() {
    svg.selectAll('.label-industry').style('visibility', 'hidden')
    svg.selectAll('.label-gender').style('visibility', 'hidden')
    div.style('display', 'inline')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.7)
      .restart()
  })

  // buttons

  // d3.select('#industry').on('click', function() {
  //   console.log('something happened')
  //   simulation
  //     .force('x', forceXSeparate)
  //     .force('y', forceYSeparate)
  //     .alphaTarget(0.7)
  //     .append('text')
  //     .text(d => d.domain)
  //     .restart()
  // })

  // d3.select('#gender').on('click', function() {
  //   simulation
  //     .force('x', forceXSeparateGender)
  //     .force('y', forceYSeparateGender)
  //     .alphaTarget(0.7)
  //     .restart()
  // })

  // d3.select('#combine').on('click', function() {
  //   simulation
  //     .force('x', forceXCombine)
  //     .force('y', forceYCombine)
  //     .alphaTarget(0.7)
  //     .restart()
  // })

  simulation.nodes(datapoints).on('tick', ticked)

  function ticked() {
    circles.attr('cx', d => d.x).attr('cy', d => d.y)
  }

  // function render() {
  //   console.log('something happened')
  //   // Calculate height/width
  //   let screenHeight = window.innerHeight
  //   let screenWidth = (width / height) * screenHeight
  //   let newWidth = screenWidth - margin.left - margin.right
  //   let newHeight = screenHeight - margin.top - margin.bottom

  //   // Update your SVG
  //   let actualSvg = d3.select(svg.node().parentNode)
  //   actualSvg
  //     .attr('height', newHeight + margin.top + margin.bottom)
  //     .attr('width', newWidth + margin.left + margin.right)

  //   // Update scales (depends on your scales)
  //   // xPositionScale.range([0, newWidth])
  //   // yPositionScale.range([newHeight, 0])

  //   // Reposition/redraw your elements

  //   var forceXCombine = d3.forceX(newWidth / 2.5).strength(0.05)
  //   var forceYCombine = d3.forceY(newHeight / 3).strength(0.05)

  //   var simulation = d3
  //     .forceSimulation()
  //     .force('x', forceXCombine)
  //     .force('y', d3.forceY(newHeight / 2).strength(0.06))

  //   datapoints.forEach(d => {
  //     d.x = width * 0.25 + Math.random() * width * 0.5
  //     d.y = height * 0.25 + Math.random() * height * 0.5
  //   })
  // }
  // window.addEventListener('resize', render)
  // render()
}
