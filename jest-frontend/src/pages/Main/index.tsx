import React, { useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import DetailInfo from 'components/widget/DetailInfo';
import Graph from 'components/widget/Graph';
import { useMain } from 'hooks/pages/main-hooks';
import NodeProperties from 'pages/Main/NodeProperties';

const { Search } = Input;

function Main() {
  const { FetchIsNodeClick, MutationIsNodeClick, MutationNodeInfo, FetchGraph, SearchGraph, SearchExpandGraph } =
    useMain();
  const [searchNodeName, setSearchNodeName] = useState<string>('');

  const onSearch = useCallback((value: string) => setSearchNodeName(value), []);

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
      <DetailInfo
        contents={[
          {
            title: '속성정보',
            component: NodeProperties
          }
        ]}
        isOpen={FetchIsNodeClick()}
      />
    </div>
  );
}

export default Main;
