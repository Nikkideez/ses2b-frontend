import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button'
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemAvatar } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { TextField } from '@material-ui/core';

export default function AlignItemsList(props) {
  return (
    <div>

      <List style={{ width: 350, bgcolor: 'background.paper', padding: 0 }}>
        <ListItem alignItems="flex-start" style={{ padding: 0 }}>
          <ListItemAvatar>
            <Avatar alt="McLOVIN" src={props.image} />
          </ListItemAvatar>
          <ListItemText
            primary="Hello I am having problems"
            secondary="11:40"
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start" style={{ padding: 0 }}>
          <ListItemAvatar>
            <Avatar alt="McLOVIN" src={props.image} />
          </ListItemAvatar>
          <ListItemText
            primary="Plz help"
            secondary="12:00"
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start" style={{ padding: 0 }}>
          <ListItemAvatar>
            <Avatar alt="McLOVIN">INVIG</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Hey you should be all sorted now"
            secondary="12:02"
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
      <List>
        <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
          <ListItemAvatar>
            <Avatar alt="McLOVIN">INVIG</Avatar>
          </ListItemAvatar>
          <TextField fullWidth />
          <Button>
            Send
          </Button>
        </ListItem>
      </List>
    </div>
  );
}