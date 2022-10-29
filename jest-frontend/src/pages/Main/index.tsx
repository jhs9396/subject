import React, { useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import DetailInfo from 'components/widget/DetailInfo';
import Graph from 'components/widget/Graph';
import { useCommon } from 'hooks/common/common-hooks';
import { useMain } from 'hooks/pages/main/main-hooks';
import NodeProperties from 'pages/Main/NodeProperties';
import NodeClustering from 'pages/Main/NodeClustering';
import { ContentType } from 'types/components/widget/detail-info';

const { Search } = Input;

function Main() {
  const { QueryIsRunningPythonServer } = useCommon();
  const {
    FetchIsNodeClick,
    MutationIsNodeClick,
    MutationNodeInfo,
    FetchGraph,
    SearchGraph,
    SearchExpandGraph,
    MutationNodeClusterInfo
  } = useMain();
  const { data: PythonServerStatus } = QueryIsRunningPythonServer();
  const [searchNodeName, setSearchNodeName] = useState<string>('');
  const [detailInfoContents, setDetailInfoContents] = useState<ContentType[]>([
    {
      title: '속성정보',
      component: NodeProperties
    }
  ]);

  const onSearch = useCallback((value: string) => setSearchNodeName(value), []);

  useEffect(() => {
    SearchGraph();
  }, [SearchGraph]);

  useEffect(() => {
    if (PythonServerStatus === 3) {
      setDetailInfoContents([
        ...detailInfoContents,
        {
          title: '클러스터링',
          component: NodeClustering
        }
      ]);
    }
  }, [PythonServerStatus]);

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
            MutationNodeClusterInfo('init');
          },
          nodeExpend(selectedNode: JavascriptObject) {
            SearchExpandGraph({ id: selectedNode.id, name: selectedNode.name, label: selectedNode.label });
          }
        }}
      />
      <DetailInfo contents={detailInfoContents} isOpen={FetchIsNodeClick()} />
    </div>
  );
}

export default Main;
