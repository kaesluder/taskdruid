import * as React from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ITask } from '../db';

export interface ITaskFormProps {
  task?: ITask;
  tags?: string[];
  formSubmitHandler(arg1: ITask): void;
}

export default function TaskForm(props: ITaskFormProps) {
  const defaultTask: ITask = {
    summary: '',
    status: 'PENDING',
    dateCreated: new Date().valueOf(),
  };
  const [open, setOpen] = React.useState(false);

  const [task, setTask] = React.useState(props.task || { ...defaultTask });

  const onSummaryChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setTask({ ...task, summary: value });
  };

  const onDueDateChangeHandler = (value: DateTime | null) => {
    // console.log(value.toUnixInteger());

    const convertedValue = value ? value.toMillis() : undefined;
    console.log(convertedValue);
    setTask({ ...task, dateDue: convertedValue });
  };

  const onStatusChangeHandler = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setTask({ ...task, status: value });
  };

  const onTagsChangeHandler = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: string[] | null
  ) => {
    console.log(newValue);
    setTask({ ...task, tags: newValue || [] });
  };

  const handleClickOpen = () => {
    const t = { ...defaultTask };
    setTask(t);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // TODO pressing escape should cancel rather than close.
    props.formSubmitHandler(task);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <div>
        <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
          Add Task
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add/Edit Task</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin={'normal'}>
              <TextField
                autoFocus
                margin="normal"
                value={task.summary}
                id="summary"
                label="Summary"
                type="text"
                fullWidth
                variant="standard"
                onChange={onSummaryChangeHandler}
              />
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={task.status}
                label="Status"
                onChange={onStatusChangeHandler}
                variant="standard"
              >
                <MenuItem value={'PENDING'}>PENDING</MenuItem>
                <MenuItem value={'DONE'}>DONE</MenuItem>
                <MenuItem value={'HOLD'}>HOLD</MenuItem>
              </Select>
              <Autocomplete
                multiple
                id="tags-filled"
                options={props.tags || []}
                value={task.tags || []}
                onChange={onTagsChangeHandler}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="standard" label="Tags" />
                )}
              />
              <DatePicker
                sx={{ marginTop: '1ex' }}
                label={'Due Date'}
                value={task.dateDue ? DateTime.fromMillis(task.dateDue) : null}
                onChange={onDueDateChangeHandler}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}
