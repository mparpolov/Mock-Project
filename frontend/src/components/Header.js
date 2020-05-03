import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import '../styles/Header.scss';

const Header = () => {
  return (
    <div className="header">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="header-title">
            LionX Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;