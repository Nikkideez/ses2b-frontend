import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function InvigAlertList() {
  return (
    <div>
      <List style={{ padding: 0 }}>
        <ListItem style={{ padding: 0 }}>
          <ListItemText
            primary="Two faces detected"
            secondary="12:30pm"
          />
        </ListItem>
        <ListItem style={{ padding: 0 }}>
          <ListItemText
            primary="Disconnection"
            secondary="12:50pm"
          />
        </ListItem>
        <ListItem style={{ padding: 0 }}>
          <ListItemText
            primary="Student not detected"
            secondary="1:30pm"
          />
        </ListItem>
        <ListItem style={{ padding: 0 }}>
          <ListItemText
            primary="Student reconnected"
            secondary="1:40pm"
          />
        </ListItem>
      </List>
    </div>
  )
}
