import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-brand">Task Manager</Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/" className="nav-link">My Tasks</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin/tasks" className="nav-link">All Tasks</Link>
                            )}
                            <span className="nav-link" style={{ fontWeight: 600, cursor: 'default' }}>Hello, {user.username}</span>
                            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
