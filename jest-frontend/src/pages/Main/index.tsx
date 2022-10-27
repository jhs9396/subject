import React, { useEffect } from 'react';
import Graph from 'components/widget/Graph';
import { useMain } from 'hooks/pages/main-hooks';
import { Link, useNavigate } from 'react-router-dom';

const expandedData = {
  nodes: [
    { label: 'skill', name: 'Java', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Javascript', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Typescript', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Python', radius: 10, color: 'orange' },
    { label: 'skill', name: 'GraphDB', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Oracle', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Node.js', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Nest.js', radius: 10, color: 'orange' },
    { label: 'skill', name: 'GraphQL', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Prisma', radius: 10, color: 'orange' },
    { label: 'skill', name: 'React', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Elasticsearch', radius: 10, color: 'orange' },
    { label: 'skill', name: 'Redis', radius: 10, color: 'orange' },
    { label: 'skill', name: 'React-Native', radius: 10, color: 'orange' }
  ],
  edges: [
    { source: '인사이드정보', target: 'Java' },
    { source: '인사이드정보', target: 'Oracle' },
    { source: '비트나인', target: 'Java' },
    { source: '비트나인', target: 'GraphDB' },
    { source: '비트나인', target: 'Javascript' },
    { source: '비트나인', target: 'Oracle' },
    { source: '비트나인', target: 'React' },
    { source: '비트나인', target: 'Python' },
    { source: '비트나인', target: 'Node.js' },
    { source: '뱅크웨어글로벌', target: 'Python' },
    { source: '뱅크웨어글로벌', target: 'Oracle' },
    { source: '티피소프트코리아', target: 'Java' },
    { source: '티피소프트코리아', target: 'Javascript' },
    { source: '티피소프트코리아', target: 'Python' },
    { source: '티피소프트코리아', target: 'Elasticsearch' },
    { source: '티피소프트코리아', target: 'Redis' },
    { source: '티피소프트코리아', target: 'Node.js' },
    { source: '티피소프트코리아', target: 'React' },
    { source: '피어나인', target: 'Java' },
    { source: '피어나인', target: 'Javascript' },
    { source: '피어나인', target: 'Typescript' },
    { source: '피어나인', target: 'React' },
    { source: '피어나인', target: 'Oracle' },
    { source: '피어나인', target: 'Node.js' },
    { source: '피어나인', target: 'Nest.js' },
    { source: '피어나인', target: 'GraphQL' },
    { source: '피어나인', target: 'Prisma' },
    { source: '피어나인', target: 'React-Native' }
  ]
};

const dummy = {
  nodes: [
    { label: 'worker', name: '전현수' },
    { label: 'organization', name: '뱅크웨어글로벌' },
    { label: 'organization', name: '비트나인' },
    { label: 'organization', name: '인사이드정보' },
    { label: 'organization', name: '티피소프트코리아' },
    { label: 'organization', name: '피어나인' }
  ],
  edges: [
    { source: '전현수', target: '뱅크웨어글로벌' },
    { source: '전현수', target: '비트나인' },
    { source: '전현수', target: '인사이드정보' },
    { source: '전현수', target: '티피소프트코리아' },
    { source: '전현수', target: '피어나인' }
  ]
};

function Main() {
  const { FetchIsNodeClick, MutationIsNodeClick, FetchNodeInfo, MutationNodeInfo, FetchGraph, SearchGraph } = useMain();
  console.log('', FetchGraph());
  const navigate = useNavigate();

  useEffect(() => {
    SearchGraph();
  }, []);

  return (
    <div className="main">
      <Graph
        datum={FetchGraph()}
        options={{
          /* widget width */
          width: '100%',
          /* svg height inside widget */
          height: '100vh',
          /* node options */
          node: {
            radius: 15 // node radius size
          },
          edge: {
            color: '#b2b2b2', // edge color
            strokeWidth: 1, // edge stroke width size
            id: 'name' // edge attribute name to use as ID
          }
        }}
        events={{
          nodeClick(isClick: boolean, nodeInfo: JavascriptObject) {
            MutationIsNodeClick(isClick);
            MutationNodeInfo(nodeInfo);
          },
          nodeExpend(selectedNode: JavascriptObject) {
            const edges = expandedData.edges.filter(edge => edge.source === selectedNode.name);
            const nodes = expandedData.nodes.filter(node => edges.map(edge => edge.target).includes(node.name));
            return { nodes, edges };
          }
        }}
      />
      <div className={FetchIsNodeClick() ? 'properties-display on' : 'properties-display off'}>
        <nav>
          <Link
            to="/detail"
            onClick={() => {
              navigate('/');
            }}>
            상세
          </Link>
        </nav>
        {JSON.stringify(FetchNodeInfo(), null, 2)}
      </div>
    </div>
  );
}

export default Main;
