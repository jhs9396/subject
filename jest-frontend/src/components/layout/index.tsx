import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Bottom from 'components/layout/Bottom';
import Top from 'components/layout/Top';
import { useCommon } from 'hooks/common/common-hooks';
import Detail from 'pages/Detail';
import Main from 'pages/Main';
import { RouteType } from 'types/router';

const pages = [
  {
    path: '/main',
    name: 'main',
    exact: true,
    page: Main
  },
  {
    path: '/detail',
    name: 'detail',
    exact: true,
    page: Detail
  }
];

function Layout() {
  const { QueryToken, QueryIsRunningPythonServer } = useCommon();
  const navigate = useNavigate();
  const { isLoading: isSearchToken } = QueryToken('test');
  QueryIsRunningPythonServer();

  useEffect(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('exp');
    navigate('/main');
  }, [navigate]);

  return (
    <>
      <Top />
      <div className="layout__content">
        {!isSearchToken && (
          <Routes>
            {pages.map((route: RouteType) => (
              <Route key={route.name} path={route.path} element={<route.page />} />
            ))}
          </Routes>
        )}
      </div>
      <Bottom />
    </>
  );
}

export default Layout as React.FunctionComponent;
