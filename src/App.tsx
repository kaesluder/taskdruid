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

  const formSubmitHandler = async (task: ITask) => {
    console.log(task);
    const id = await db.tasks.put(task);
    console.log(id);
  };

  return (
    <>
      <TaskTable tasks={tasks}></TaskTable>
      <TaskForm tags={tags} formSubmitHandler={formSubmitHandler}></TaskForm>
    </>
  );
}

export default App;
