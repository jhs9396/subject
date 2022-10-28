import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ICON_DICT } from 'assets/icon';
import { cloneDeep } from 'lodash';
import { GraphOptionsType, IGraphEvent } from 'types/components/widget/graph';
import { GraphType } from 'stores/pages/main/main-interface';

interface IGraph {
  datum: GraphType;
  options: GraphOptionsType;
  events: IGraphEvent;
}

function Graph(props: IGraph) {
  const { datum, options, events } = props;
  const [svg, setSvg] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [nodeSvg, setNodeSvg] = useState(null);
  const [edgeSvg, setEdgeSvg] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const svgRef = useRef(null);
  const radius = options.node ? options.node.radius || 15 : 15;
  const strokeWidth = options.edge ? options.edge.strokeWidth || 2 : 2;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const draw = useCallback(() => {
    setSimulation(d3.forceSimulation().nodes(nodes));
    setEdgeSvg(svg.select('.edges').selectAll('g.edge').data(edges).enter().append('g').attr('class', 'edge'));
    setNodeSvg(svg.select('.nodes').selectAll('g.node').data(nodes).enter().append('g').attr('class', 'node'));
  }, [edges, nodes, svg]);

  const remove = useCallback(() => {
    svg.selectAll('g.node').remove();
    svg.selectAll('g.edge').remove();
    svg.selectAll('g.legend').remove();
  }, [svg]);

  const zoomHandler = d3
    .zoom()
    .extent([
      [0, 0],
      [window.innerWidth, window.innerHeight]
    ])
    .on('zoom', event => {
      svg.select('g.main').attr('transform', event.transform);
    });

  const getPointAtLengthMinusNodeRadius = useCallback((pathString, radius, strokeWidth) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', pathString);
    const totLen = p.getTotalLength();

    const l = totLen > radius ? totLen - radius - strokeWidth * 4 - 1 : totLen;
    return p.getPointAtLength(Math.abs(l));
  }, []);

  const makeEdgePathString = useCallback(
    (s, t) => {
      const dx = t.x - s.x;
      const dy = t.y - s.y;

      const endPoint = getPointAtLengthMinusNodeRadius(`m0 0 l${dx} ${dy}`, radius, strokeWidth);
      return `m0 0 l${endPoint.x} ${endPoint.y}`;
    },
    [getPointAtLengthMinusNodeRadius, radius, strokeWidth]
  );

  const tick = useCallback(() => {
    nodeSvg.attr('transform', d => {
      // d.x = Math.min(width - radius, d.x);
      // d.y = Math.min(height - radius, d.y);
      return `translate(${d.x},${d.y})`;
    });
    edgeSvg.attr('transform', d => `translate(${d.source.x},${d.source.y})`);
    edgeSvg.selectAll('path').attr('d', d => makeEdgePathString(d.source, d.target));
  }, [edgeSvg, makeEdgePathString, nodeSvg]);

  const initIcon = useCallback(() => {
    svg
      .select('#icon_path')
      .selectAll('path.icon')
      .data(Object.keys(ICON_DICT))
      .enter()
      .append('path')
      .classed('icon', true)
      .attr('d', d => ICON_DICT[d].path)
      .attr('id', d => `icon_${d}`)
      .attr('transform', d => `scale(0.03, 0.03) translate(-${ICON_DICT[d].iw / 2},-${ICON_DICT[d].ih / 2})`);
  }, [svg]);

  useEffect(() => {
    if (datum.nodes.length > 0) {
      setGraphData(cloneDeep({ ...datum }));
      // setGraphData(JSON.parse(JSON.stringify(datum)));
    }
  }, [datum]);

  useEffect(() => {
    const aborted = { stat: false };
    if (graphData === undefined || aborted.stat) return;
    if (svg) remove();
    setNodes(Object.keys(graphData.nodes).map(key => graphData.nodes[key]));
    setEdges(Object.keys(graphData.edges).map(key => graphData.edges[key]));
    setSvg(d3.select(svgRef.current));

    // eslint-disable-next-line consistent-return
    return () => {
      aborted.stat = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  useEffect(() => {
    const aborted = { stat: false };
    if (svg === null || aborted.stat) return;

    svg.style('cursor', 'hand');
    svg.on('click', event => {
      event.stopPropagation();
      if (events?.nodeClick) {
        events.nodeClick(false, {});
      }
    });
    svg.call(zoomHandler);
    initIcon();
    draw();

    // eslint-disable-next-line consistent-return
    return () => {
      aborted.stat = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svg]);

  useEffect(() => {
    const aborted = { stat: false };
    if (simulation === null || aborted.stat) return;
    const check = simulation.nodes() || [];
    if (check.length > 0) {
      simulation
        .force('charge', d3.forceManyBody().strength(-200))
        .force(
          'links',
          d3.forceLink(edges).id((d: any) => (options.edge.id ? d[options.edge.id] : d.id))
        )
        .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
      simulation.on('tick', tick);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      aborted.stat = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulation]);

  useEffect(() => {
    const aborted = { stat: false };

    if (edgeSvg === null || aborted.stat) return;
    edgeSvg
      .append('path')
      .attr('d', 'm0 0')
      .attr('stroke-width', strokeWidth)
      .attr('stroke', options.edge ? options.edge.color || 'red' : 'red')
      .attr('marker-end', 'url(#arrowhead2)');

    // eslint-disable-next-line consistent-return
    return () => {
      aborted.stat = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeSvg]);

  useEffect(() => {
    const aborted = { stat: false };
    if (nodeSvg === null || aborted.stat) return;

    nodeSvg.style('cursor', 'grab');
    nodeSvg
      .classed('non-select', true)
      .append('circle')
      .attr('r', d => d.radius || radius)
      .attr('fill', d => {
        if (d?.important === 2) return '#e98f28';
        if (d?.important > 2) return '#d35c5f';
        return d?.color ? d.color : '#fbf8f1';
      })
      .attr('opacity', 1)
      .attr('stroke', 'black');

    nodeSvg
      .call(
        d3
          .drag()
          .on('start', (event, d: any) => {
            d.fixed = true;
            nodeSvg.style('stroke', node => {
              if (node?.fixed) return '#d35c5f';
              return '';
            });
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = event.x;
            d.fy = event.y;
          })
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        if (events?.nodeClick) {
          events.nodeClick(true, { ...d });
        }
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation();
        if (events?.nodeClick) {
          events.nodeClick(false, {});
        }
        if (events?.nodeExpend) {
          events.nodeExpend({ ...d });
        }
      })
      .on('mouseenter', (event, d) => {
        edgeSvg
          .select('path')
          .style('stroke', edge => (edge.source.name === d.name || edge.target.name === d.name ? 'red' : '#b2b2b2'));
      });

    nodeSvg.append('use').attr('xlink:xlink:href', d => `#icon_${d.label}`);
    nodeSvg
      .append('text')
      .attr('x', 20)
      .attr('y', 5)
      .text(d => d.name);

    // eslint-disable-next-line consistent-return
    return () => {
      aborted.stat = true;
    };
  }, [edgeSvg, events, graphData.edges, graphData.nodes, nodeSvg, radius, simulation]);

  useEffect(() => {
    if (options?.node?.lookAt) {
      const findNode = nodes.find(node => node.name === options?.node?.lookAt);
      if (findNode) {
        const left = -(width / 2 - 700);
        const transform = d3.zoomTransform(nodeSvg);

        const invCenterPoint = transform.invert([width / 2 + left, height / 2]);
        const newTranslate = transform.translate(invCenterPoint[0] - findNode.x, invCenterPoint[1] - findNode.y);
        svg
          .select('g.main')
          .transition()
          .duration(750)
          .call(zoomHandler.transform, newTranslate)
          .end()
          .then(() => {
            // eslint-disable-next-line no-underscore-dangle
            svg.node().__zoom = newTranslate;
          });
        nodeSvg.style('stroke', node => (node.name === findNode.name ? 'red' : ''));
      }
    }
  }, [options?.node?.lookAt]);

  return (
    <svg
      style={{
        width: options.width ? options.width || width : '100%',
        height: options.height ? options.height || height : '100%',
        shapeRendering: 'geometricPrecision'
      }}
      ref={svgRef}>
      <g className="main">
        <g className="category" />
        <g className="edges" />
        <g className="nodes" />
      </g>
      <defs>
        <marker
          id="arrowhead2"
          refX="0"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="4">
          <path d="M 0,1 V 3 L3,2 Z" fill="#337" stroke="#337" />
        </marker>
        <g id="icon_path" />
      </defs>
    </svg>
  );
}

export default Graph as React.FunctionComponent<IGraph>;
