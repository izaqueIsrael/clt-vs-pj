import React, { useState } from 'react';

interface AppProps {
  Component: React.ElementType;
  pageProps: any;
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Component
        {...pageProps}
      />
    </>
  );
};

export default App;
