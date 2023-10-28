import { useState } from 'react';
import { ITask, db } from '../db';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { Chip } from '@mui/material';
import { totalUrgency } from '../urgency';
import { defaultStatusUrgencyMap, defaultTagUrgencyMap } from '../defaults';

export const urgencySortComp = function (aTask: ITask, bTask: ITask) {
  return (
    totalUrgency(bTask, defaultTagUrgencyMap, defaultStatusUrgencyMap) -
    totalUrgency(aTask, defaultTagUrgencyMap, defaultStatusUrgencyMap)
  );
};

export const TaskTableRow = function (
  task: ITask,
  refresh: () => Promise<void>
) {
  const isDone: boolean = task.status === 'DONE' || task.status === 'CANCELED';

  /**
   * Handler for PENDING/DONE toggle.
   * @param event checkbox change event
   * @returns 1 if successful, 0 if not, -1 if something is really wrong and no db call.
   */
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // setChecked(event.target.checked);
    let queryResult = -1;
    if (event.target.checked === true) {
      queryResult = await db.markDone(task.id || -1);
    } else {
      queryResult = await db.markPending(task.id || -1);
    }

    refresh();
    return queryResult;
  };

  return (
    <TableRow key={task.id}>
      <TableCell>
        {totalUrgency(task, defaultTagUrgencyMap, defaultStatusUrgencyMap)}{' '}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={isDone}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>
      <TableCell>{task.summary || ''}</TableCell>
      <TableCell>
        {task.tags?.map((tag) => {
          return <Chip label={tag} key={tag}></Chip>;
        })}
      </TableCell>
      <TableCell>{task.status || ''}</TableCell>
      <TableCell>Due: {task.dateDue || ''}</TableCell>
    </TableRow>
  );
};

interface ITaskTableProps {
  tasks: ITask[];
  refresh: () => Promise<void>;
}

export const TaskTable = function (props: ITaskTableProps) {
  props.tasks.sort(urgencySortComp);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {props.tasks.map((t) => TaskTableRow(t, props.refresh))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
