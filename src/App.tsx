import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { AppBar } from '@mui/material';
import { TaskTable } from './components/TaskTable';
import TaskForm from './components/TaskForm';
import './App.css';
import { db, ITask } from './db';

function App() {
  const [tags, setTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [getTaskFn, setGetTaskFn] = useState('ACTIVE');

  useEffect(() => {
    db.getTags().then((t) => {
      setTags(t);
    });
    db.getActive().then((results) => {
      setTasks(results);
    });
  }, []);

  /**
   * Handle a submission from the TaskForm object, inserting/replacing tasks
   * into database.
   * @param task task object to insert into database
   */
  const formSubmitHandler = async (task: ITask) => {
    console.log(task);
    // This should do an *upsert*
    const id = await db.tasks.put(task);
    console.log(id);
    refreshTable(getTaskFn);
  };

  const handleViewChange = () => {
    const flag = getTaskFn === 'ACTIVE' ? 'ALL' : 'ACTIVE';
    refreshTable(flag);
    setGetTaskFn(flag);
  };

  /**
   * Trigger a refresh of the table by reloading records
   * from database.
   * @param flag: 'ACTIVE' | 'ALL'
   */
  const refreshTable = async (flag: string) => {
    if (flag === 'ACTIVE') {
      db.getActive().then((results) => {
        setTasks(results);
        return;
      });
    } else {
      db.getAll().then((results) => {
        setTasks(results);
        return;
      });
    }
  };

  return (
    <>
      <AppBar position="static">
        {' '}
        <Toolbar disableGutters>
          <TaskForm
            tags={tags}
            formSubmitHandler={formSubmitHandler}
          ></TaskForm>
          <Button variant="outlined" color="inherit" onClick={handleViewChange}>
            View {getTaskFn === 'ACTIVE' ? 'ALL' : 'ACTIVE'}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TaskTable
          tasks={tasks}
          refresh={refreshTable}
          viewState={getTaskFn}
        ></TaskTable>
      </Box>
    </>
  );
}

export default App;
