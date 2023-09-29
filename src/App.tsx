import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { TaskTable } from './components/TaskTable';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TaskTable></TaskTable>
      <TaskForm></TaskForm>
    </>
  );
}

export default App;
