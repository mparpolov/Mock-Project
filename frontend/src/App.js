import React from 'react';

import Store from './store/Store';

import Home from './pages/Home';

import './global.scss';

function App() {
  return (
    <Store>
      <Home />
    </Store>
  );
}

export default App;
