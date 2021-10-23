import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InvigMessageList from './InvigMessageList'
import InvigAlertList from './InvigLogList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 300, width: 500 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Logs" {...a11yProps(0)} style={{ padding: 0, minWidth: 90 }} />
        <Tab label="Messages" {...a11yProps(1)} style={{ padding: 0, minWidth: 90 }} />
      </Tabs>
      <div style={{ padding: 20 }}>
        {value === 0 ?
          <div>
            <InvigAlertList />
          </div>
          :
          <div>
            <InvigMessageList image={props.image} />
          </div>
        }
      </div>
    </Box>
  );
}