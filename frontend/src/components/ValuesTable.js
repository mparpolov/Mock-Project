import React, { useState, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { api } from '../config/config';
import { Context } from '../store/Store';

import {
  COULD_NOT_RETRIEVE_DATA_FROM_SERVER,
  DATA_UPDATED_SUCCESSFULLY,
  TAB_DELETED_SUCCESSFULLY
} from '../contants/messages';

import '../styles/ValuesTable.scss';

const ValuesTable = props => {
  const [state, dispatch] = useContext(Context);
  const [data, setData] = useState(props.data);

  const deleteTab = () => {
    // Remove tab and data from store
    const updatedOpenTabs = state.openTabs.filter(tab => tab.symbol !== data['01. symbol']);
    const updatedlastValuesList = state.lastValuesList.filter(values => values['01. symbol'] !== data['01. symbol']);

    dispatch({ type: 'DELETE_COMPANY_TAB', payload: {
      lastValuesList: updatedlastValuesList,
      openTabs: updatedOpenTabs,
    }});
    dispatch({ type: 'OPEN_SNACK', payload: {
      message: TAB_DELETED_SUCCESSFULLY,
      severity: 'success'
    }});
  };

  const getNumberStyle = numString => {
    const num = parseFloat(numString.replace(/%/, ''));
    if ( num > 0 ) {
      return 'price-up';
    } else if ( num < 0 ) {
      return 'price-down';
    }
    return '';
  };

  const updateData = () => {
    const symbol = data['01. symbol'];

    axios.get(`${api.baseUrl}/latestprice?symbol=${symbol}`)
    .then(res => {
      const { data } = res.data;
      setData(data);

      dispatch({ type: 'OPEN_SNACK', payload: {
        message: DATA_UPDATED_SUCCESSFULLY,
        severity: 'success'
      }});

    })
    .catch(err => {
      dispatch({ type: 'OPEN_SNACK', payload: {
        message: COULD_NOT_RETRIEVE_DATA_FROM_SERVER,
        severity: 'error'
      }});
    });
  };

  return (
    <>
      <div className="info-container">
        <div>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {data['01. symbol']}
            </Typography>
            <Typography variant="caption">
              {props.name}
            </Typography>
          </Box>
          <Box className="price-info-container">
            <Typography variant="h5" fontWeight="bold">
              {data['05. price']}
            </Typography>
            <Typography variant="h6" className={getNumberStyle(data['09. change'])}>
              {data['09. change']}
            </Typography>
            <Typography variant="h6" className={getNumberStyle(data['09. change'])}>
              ({data['10. change percent']})
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Último fechamento: {data['08. previous close']} em {moment(data['07. latest trading day']).format('DD/MM/YY')}
            </Typography>
          </Box>
        </div>
        <div className="update-button-container">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={updateData}
          >
            Atualizar Tabela
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} className="table">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="left">Abertura</TableCell>
              <TableCell align="left">{data['02. open']}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Alta</TableCell>
              <TableCell align="left">{data['03. high']}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Baixa</TableCell>
              <TableCell align="left">{data['04. low']}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Volume</TableCell>
              <TableCell align="left">{data['06. volume']}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="left">Preço Atual</TableCell>
              <TableCell align="left">{data['05. price']}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Variação</TableCell>
              <TableCell align="left">{data['09. change']}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Variação Percentual</TableCell>
              <TableCell align="left">{data['10. change percent']}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Último Fechamento</TableCell>
              <TableCell align="left">{data['08. previous close']}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className="delete-button-container">
        <Button variant="contained" onClick={deleteTab}>
          Deletar Aba
        </Button>
      </div>
    </>
  );
};

export default ValuesTable;