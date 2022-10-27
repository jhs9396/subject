import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Detail() {
  const navigate = useNavigate();
  return (
    <div>
      <Link
        to="/"
        onClick={() => {
          navigate('/detail');
        }}>
        <div>Home</div>
      </Link>
    </div>
  );
}

export default Detail as React.FunctionComponent;
