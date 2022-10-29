import React, { useCallback } from 'react';
import { Button } from 'antd';
import { uniqueId } from 'lodash';
import { useMain } from 'hooks/pages/main/main-hooks';

function NodeClustering() {
  const { SearchNodeClustering, FetchNodeInfo, FetchNodeClusterInfo } = useMain();
  const onClustering = useCallback(() => {
    SearchNodeClustering(FetchNodeInfo().edges);
  }, [FetchNodeInfo, SearchNodeClustering]);

  return (
    <div className="main__node-clustering">
      <Button onClick={onClustering}>clustering</Button>
      {FetchNodeClusterInfo()?.members && (
        <>
          <div>클러스터 정보: {FetchNodeClusterInfo().clusterKey}</div>
          <div>클러스터 맴버</div>
          {FetchNodeClusterInfo().members.map((member: string) => (
            <li key={uniqueId()}>{member}</li>
          ))}
        </>
      )}
    </div>
  );
}

export default NodeClustering as React.FunctionComponent;
