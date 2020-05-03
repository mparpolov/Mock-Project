import React, { useState, useEffect, useContext } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Context } from '../store/Store';

 const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackBar = () => {
  const [state, dispatch] = useContext(Context);
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    setOpen(false);
    dispatch({ type: 'CLOSE_SNACK' });
  };

  useEffect(() => {
    if ( state.snackOpen && state.snackMessage !== '' ) {
      setOpen(true);
    }
  }, [state.snackOpen, state.snackMessage]);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={state.snackSeverity}>
          {state.snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackBar;