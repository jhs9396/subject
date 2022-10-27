import React from 'react';

export type RouteType = {
  path: string;
  name: string;
  exact: boolean;
  page?: React.FunctionComponent;
  modules?: RouteType[];
};
