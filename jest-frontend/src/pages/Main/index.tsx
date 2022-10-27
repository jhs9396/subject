import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import Graph from 'components/widget/Graph';
import { useMain } from 'hooks/pages/main-hooks';

const { Search } = Input;

function Main() {
  const {
    FetchIsNodeClick,
    MutationIsNodeClick,
    FetchNodeInfo,
    MutationNodeInfo,
    FetchGraph,
    SearchGraph,
    SearchExpandGraph
  } = useMain();
  const [searchNodeName, setSearchNodeName] = useState<string>('');

  const onSearch = (value: string) => setSearchNodeName(value);

  useEffect(() => {
    SearchGraph();
  }, [SearchGraph]);

  return (
    <div className="main">
      <div className="main__search">
        <div className="label">노드 검색</div>
        <Search placeholder="look at" onSearch={onSearch} enterButton />
      </div>
      <Graph
        datum={FetchGraph()}
        options={{
          /* widget width */
          width: '100%',
          /* svg height inside widget */
          height: '100vh',
          /* node options */
          node: {
            radius: 15, // node radius size,
            lookAt: searchNodeName
          },
          edge: {
            color: '#b2b2b2', // edge color
            strokeWidth: 1 // edge stroke width size
          }
        }}
        events={{
          nodeClick(isClick: boolean, nodeInfo: JavascriptObject) {
            MutationIsNodeClick(isClick);
            MutationNodeInfo(nodeInfo);
          },
          nodeExpend(selectedNode: JavascriptObject) {
            SearchExpandGraph({ id: selectedNode.id, name: selectedNode.name, label: selectedNode.label });
          }
        }}
      />
      <div className={FetchIsNodeClick() ? 'properties-display on' : 'properties-display off'}>
        {JSON.stringify(FetchNodeInfo(), null, 2)}
      </div>
    </div>
  );
}

export default Main;
