import { useState, useEffect } from 'react';
import { TaskTable } from './components/TaskTable';
import TaskForm from './components/TaskForm';
import './App.css';
import { db, ITask } from './db';

function App() {
  const [tags, setTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    db.getTags().then((t) => {
      setTags(t);
    });
    db.tasks.toArray().then((results) => {
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
    refreshTable();
  };

  /**
   * Trigger a refresh of the table by reloading records
   * from database.
   */
  const refreshTable = async () => {
    db.tasks.toArray().then((results) => {
      setTasks(results);
      return;
    });
  };

  return (
    <>
      <TaskTable tasks={tasks} refresh={refreshTable}></TaskTable>
      <TaskForm tags={tags} formSubmitHandler={formSubmitHandler}></TaskForm>
    </>
  );
}

export default App;
