import React from 'react'
import * as d3 from 'd3'

import {ChartPropsType} from '../ChartProps.type'
import style from '../Charts.module.scss'
import {AXIS_TYPE} from '../../../constants'

export class DotsChart1D extends React.Component<ChartPropsType> {
  buildChart() {
    const canvasWidth = 1024
    const canvasHeight = 100
    const margins = {top: 20, right: 20, bottom: 40, left: 70}
    const width = canvasWidth - margins.top - margins.left
    const height = canvasHeight - margins.top - margins.bottom

    const popupWidth = 200
    const popupHeight = 30

    const xValueName = this.props.xAxisMetricName

    const completedTrials = this.props.trials
      .map((t, index) => ({...t, index}))
      .filter(t => t.status === 'completed')

    const filteredTrials = completedTrials.filter(
      ({labels = {}}) =>
        this.props.labelsFilter.length === 0 ||
        this.props.labelsFilter.reduce((acc, l) => acc || l in labels, false),
    )

    const maxCost = d3.max(
      completedTrials.map(
        v => v.values.filter(c => c.metricName === xValueName)[0].value,
      ),
    )

    const xScale = d3
      .scaleLinear()
      .domain([0, maxCost])
      .range([0, width])

    d3.select('#chart svg').remove()

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)

    const xAxis = d3.axisBottom(xScale).ticks(10)

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + 40})`)
      .attr('font-size', '1.5em')
      .style('text-anchor', 'middle')
      .style('fill', '#000')
      .text(xValueName)

    const makeXGridlines = () => {
      return d3.axisBottom(xScale).ticks(10)
    }

    svg
      .append('g')
      .attr('class', style.grid)
      .attr('transform', `translate(0, ${height})`)
      .call(
        makeXGridlines()
          .tickSize(-20)
          .tickFormat(''),
      )

    const circleOver = ({hoverTrialHandler, xAxisMetricName}) =>
      function _circleOver(dataPoint) {
        var xValue = dataPoint.values.filter(
          v => v.metricName === xValueName,
        )[0].value

        d3.select(this)
          .classed(style.active, true)
          .attr('r', 6)

        const domBox = d3
          .select(this)
          .node()
          .getBoundingClientRect()

        const hoverData = {
          trial: dataPoint,
          domBox,
          index: dataPoint.index,
          xData: {name: xAxisMetricName, type: AXIS_TYPE.METRIC, value: xValue},
        }

        hoverTrialHandler(hoverData)
      }

    const circleOut = ({activeTrial, hoverTrialHandler}) =>
      function _circleOut(dataPoint) {
        d3.select(this)
          .classed(style.active, false)
          .attr(
            'r',
            activeTrial && dataPoint.index === activeTrial.index ? 6 : 3,
          )
        hoverTrialHandler({trial: null, domBox: null, index: -1})
      }

    const circleClick = selectTrialHandler =>
      function _circleClick(dataPoint) {
        selectTrialHandler({
          index: dataPoint.index,
          trial: dataPoint,
        })
      }

    svg
      .selectAll('g.point')
      .data(filteredTrials)
      .enter()
      .append('g')
      .attr('transform', d => {
        const [cost] = d.values.reduce((acc, v) => {
          if (v.metricName === xValueName) acc[0] = v
          return acc
        }, [])
        return `translate(${xScale(cost.value)}, ${height})`
      })
      .append('circle')
      .attr('class', 'point')
      .attr('r', d =>
        this.props.activeTrial && d.index === this.props.activeTrial.index
          ? 6
          : 3,
      )
      .attr('class', style.circle)
      .classed(style.best, d => {
        if (d.labels && 'best' in d.labels) {
          return true
        }
        return false
      })
      .classed(
        style.selected,
        d => this.props.activeTrial && d.index === this.props.activeTrial.index,
      )
      .on(
        'mouseover',
        circleOver({
          xAxisMetricName: this.props.xAxisMetricName,
          hoverTrialHandler: this.props.hoverTrialHandler,
        }),
      )
      .on(
        'mouseout',
        circleOut({
          activeTrial: this.props.activeTrial,
          hoverTrialHandler: this.props.hoverTrialHandler,
        }),
      )
      .on('click', circleClick(this.props.selectTrialHandler))

    svg
      .append('g')
      .attr('id', 'popup')
      .attr('class', style.popup)
      .classed(style.hidden, true)
      .append('rect')
      .attr('transform', 'translate(5, 5)')
      .style('filter', 'url(#dropshadow)')
      .attr('class', style.popupRect)
      .attr('width', popupWidth)
      .attr('height', popupHeight)
  }

  componentDidMount() {
    this.buildChart()
  }

  componentDidUpdate() {
    this.buildChart()
  }

  render() {
    return (
      <div className={style.trials}>
        <div id="chart" />
      </div>
    )
  }
}

export default DotsChart1D
