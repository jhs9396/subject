import React from 'react';
import Router from 'router';
import { ConfigProvider } from 'antd';
import koKR from 'antd/lib/locale/ko_KR';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      // refetchInterval: 1000,
      staleTime: 1000,
      cacheTime: Infinity
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <ConfigProvider locale={koKR}>
        <Router />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App as React.FunctionComponent;
