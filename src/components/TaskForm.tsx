import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ITask } from '../db';

export default function TaskForm(props) {
  const defaultTask: ITask = {
    summary: '',
    status: 'PENDING',
    dateCreated: new Date().valueOf(),
  };
  const [open, setOpen] = React.useState(false);

  const [task, setTask] = React.useState(props.task || defaultTask);

  const onSummaryChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setTask({ ...task, summary: value });
  };

  const onStatusChangeHandler = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setTask({ ...task, status: value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="normal"
              id="summary"
              label="Summary"
              type="text"
              fullWidth
              variant="standard"
              onChange={onSummaryChangeHandler}
            />
            <TextField
              margin="normal"
              id="tags"
              label="Tags"
              type="text"
              fullWidth
              variant="standard"
            />
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={task.status}
              label="Status"
              onChange={onStatusChangeHandler}
            >
              <MenuItem value={'PENDING'}>PENDING</MenuItem>
              <MenuItem value={'DONE'}>DONE</MenuItem>
              <MenuItem value={'HOLD'}>HOLD</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
