import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Detail from 'pages/Detail';
import Layout from 'components/layout';
import Main from 'pages/Main';
import { RouteType } from 'types/router';

const routes: RouteType[] = [
  {
    path: '/',
    name: 'layout',
    exact: true,
    page: Layout,
    modules: [
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
    ]
  }
];

function Router() {
  return (
    <Suspense>
      <HashRouter>
        <Routes>
          {routes.map((route: RouteType) => (
            <Route key={route.name} path={`${route.path}`} element={<route.page />}>
              {route?.modules &&
                route?.modules?.length > 0 &&
                route.modules.map((subRoute: RouteType) => (
                  <Route key={subRoute.name} path={subRoute.path} element={<subRoute.page />} />
                ))}
            </Route>
          ))}
        </Routes>
      </HashRouter>
    </Suspense>
  );
}

export default Router as React.FunctionComponent;
