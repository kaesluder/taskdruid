import { ITask } from '../db';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip } from '@mui/material';

export const TaskTableRow = function (task: ITask) {
  return (
    <TableRow key={task.id}>
      <TableCell>{task.id} </TableCell>
      <TableCell>{task.summary || ''}</TableCell>
      <TableCell>
        {task.tags?.map((tag) => {
          return <Chip label={tag} key={tag}></Chip>;
        })}
      </TableCell>
      <TableCell>{JSON.stringify(task.tags || '')}</TableCell>
      <TableCell>{task.status || ''}</TableCell>
      <TableCell>Due: {task.dateDue || ''}</TableCell>
    </TableRow>
  );
};

export const TaskTable = function (props) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>{props.tasks.map(TaskTableRow)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
