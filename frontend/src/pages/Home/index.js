import React, { useState, useContext, useEffect } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import ValuesTable from '../../components/ValuesTable';
import SnackBar from '../../components/SnackBar';
import TabPanel from '../../components/TabPanel';

import { Context } from '../../store/Store';

import './styles.scss';

const Home = () => {  
  const [state,] = useContext(Context);
  const [openTabs, setOpenTabs] = useState([]); 
  const [lastValues, setLastValues] = useState([]); 
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, index) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    if ( state.openTabs.length > 0 ) {
      setOpenTabs(state.openTabs);
      setLastValues(state.lastValuesList);
    } else {
      setOpenTabs([]);
      setLastValues([]);
    }
    setSelectedTab(0);

  }, [state.openTabs, state.lastValuesList]);

  return (
    <div className='app'>
      <Header />
      <SnackBar />
      <div className="tabs-container">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={handleChange}
          className="tabs"
        >
          <Tab
            className="tab-label"
            label={
              <div>
                <Typography variant="body2" color="textPrimary">
                  Buscar
                </Typography>
              </div>
            } 
          />

          {openTabs.map((tab, index) => { 
            return(
              <Tab
                className="tab-label"
                index={index + 1}
                key={index}
                label={
                  <div >
                    <Typography variant="body2" color="textPrimary">
                      {tab.symbol}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {tab.name}
                    </Typography>
                  </div>
                }
              />
            );}
          )}

        </Tabs>
        <TabPanel value={selectedTab} index={0} className="tab-panel-search">
          <SearchBox />
        </TabPanel>

        {lastValues.map((lastValues, index) => {
          return (
            <TabPanel 
              key={index} 
              value={selectedTab} 
              index={index + 1}
              className="tab-panel"
            >
              <section className="table-container">
                <ValuesTable 
                  data={lastValues}
                  name={openTabs[index].name} 
                />
              </section>
            </TabPanel>
          );})
        }
      </div>
    </div>
  );
}

export default Home;