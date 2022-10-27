import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Detail from 'pages/Detail';
import Main from 'pages/Main';
import { RouteType } from 'types/router';

const routes: RouteType[] = [
  {
    path: '/',
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

function Router() {
  return (
    <Suspense>
      <HashRouter>
        <Routes>
          {routes.map((route: RouteType) => {
            return <Route key={route.name} path={route.path} element={<route.page />} />;
          })}
        </Routes>
      </HashRouter>
    </Suspense>
  );
}

export default Router as React.FunctionComponent;
