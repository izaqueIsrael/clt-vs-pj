import '../styles/globals.css'
import React from 'react';

interface AppProps {
  Component: React.ElementType;
  pageProps: any;
}

class App extends React.Component<AppProps> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <main className="bg-gray-500 min-h-screen">
        <Component {...pageProps} />
      </main>
    );
  }
}

export default App;
