import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<TaskList />} />
           <Route path="/tasks/new" element={<TaskForm />} />
           <Route path="/tasks/edit/:id" element={<TaskForm />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
           <Route path="/admin/tasks" element={<TaskList adminView={true} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
