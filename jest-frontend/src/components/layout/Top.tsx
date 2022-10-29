import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, MenuFoldOutlined } from '@ant-design/icons';

function Top() {
  const navigate = useNavigate();

  const onGoHome = useCallback(() => {
    navigate('/detail');
  }, [navigate]);

  const onDetail = useCallback(() => {
    navigate('/detail');
  }, [navigate]);

  return (
    <div className="layout__top">
      <HomeOutlined style={{ fontSize: '2rem' }} onClick={onGoHome} />
      {/* <MenuFoldOutlined style={{ fontSize: '2rem' }} onClick={onDetail} /> */}
    </div>
  );
}

export default Top as React.FunctionComponent;
