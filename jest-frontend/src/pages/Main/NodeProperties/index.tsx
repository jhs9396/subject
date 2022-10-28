import React from 'react';
import { useMain } from 'hooks/pages/main-hooks';

function NodeProperties() {
  const { FetchNodeInfo } = useMain();
  return <pre>{JSON.stringify(FetchNodeInfo(), null, 2)}</pre>;
}

export default NodeProperties as React.FunctionComponent;
