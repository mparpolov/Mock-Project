import React, { 
  useState, 
  useRef, 
  useEffect, 
  useContext 
} from 'react';

import axios from 'axios';
import _ from 'lodash';

import { Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { api } from '../config/config';
import { Context } from '../store/Store';

import {
  COULD_NOT_RETRIEVE_DATA_FROM_SERVER, 
  PROVIDE_COMPANY_NAME,
  SELECT_FROM_OPTIONS,
  TAB_ALREADY_OPEN,
} from '../contants/messages';

import '../styles/SearchBox.scss';

const SearchBox = () => {
  const [state, dispatch] = useContext(Context);
  const [companySymbol, setCompanySymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [options, setOptions] = useState([]);

  const debouncedFetch = useRef(
    _.debounce(companySymbol => {
      axios.get(`${api.baseUrl}/symbolsearch?symbol=${companySymbol}`)
        .then(res => {
          const { data } = res.data;
          const sumarizedData = data.map(data => { 
            return ({
              'symbol': data['1. symbol'],
              'name': data['2. name']
            });
          });
          setOptions(sumarizedData);
        })
        .catch(err => {
          dispatch({ type: 'OPEN_SNACK', payload: {
            message: COULD_NOT_RETRIEVE_DATA_FROM_SERVER,
            severity: 'error'
          }});
        });
    }, 300)
  );

  const handleAutocompleteSelect = (event, option) => {
    if (option) {
      setCompanySymbol(option.symbol);
      setCompanyName(option.name);
    }
  };

  const handleChange = (event) => {
    setCompanySymbol(event.target.value);
  };

  useEffect(() => {
    if ( companySymbol === '' ) {
      setOptions([]);
      return undefined;
    } else {
      debouncedFetch.current(companySymbol);
    }
  }, [companySymbol]);

  const handleSubmit = event => {
    event.preventDefault();

    if ( companySymbol === '' ) {
      return dispatch({ type: 'OPEN_SNACK', payload: {
        message: PROVIDE_COMPANY_NAME,
        severity: 'error'
      }});
    }

    if ( companyName === '' ) {
      return dispatch({ type: 'OPEN_SNACK', payload: {
        message: SELECT_FROM_OPTIONS,
        severity: 'error'
      }});
    }

    // Check if company exists on state already
    for ( let tab of state.openTabs ) {
      if ( companySymbol === tab.symbol ) {
        return dispatch({ type: 'OPEN_SNACK', payload: {
          message: TAB_ALREADY_OPEN,
          severity: 'error'
        }});
      }
    }

    axios.get(`${api.baseUrl}/latestprice?symbol=${companySymbol}`)
      .then(res => {
        const { data } = res.data;

        const { lastValuesList, openTabs } = state;
        lastValuesList.push(data);
        openTabs.push({
          symbol: companySymbol,
          name: companyName
        });

        dispatch({ type: 'ADD_COMPANY_TAB', payload: {
          lastValuesList: _.clone(lastValuesList),
          openTabs: _.clone(openTabs)
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
    <div>
      <form 
        onSubmit={handleSubmit} 
        className="search-box"
      >
        <Autocomplete
          id="search-box"
          style={{ width: 300 }}
          getOptionLabel={option => option.symbol}
          filterOptions={option => option}
          options={options}
          inputValue={companySymbol}
          autoComplete
          getOptionSelected={(option, value) => option.symbol === value.symbol}
          onChange={handleAutocompleteSelect}
          noOptionsText="Nenhum resultado encontrado."
          renderInput={params => (
            <TextField
              {...params}
              label="Selecione uma Empresa"
              variant="outlined"
              fullWidth
              onChange={handleChange}
            />
          )}
          renderOption={option => {
            return (
              <Grid 
                container 
                alignItems="center"
              >
                <Grid item xs>
                  <Typography variant="body1" color="textPrimary">
                    {option.symbol}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {option.name}
                  </Typography>
                </Grid>
              </Grid>
            );
          }}
        />
        <Button 
          variant="contained" 
          color="primary"
          type="submit"
        >
          Buscar
        </Button>
      </form>
    </div>
  );
};

export default SearchBox;