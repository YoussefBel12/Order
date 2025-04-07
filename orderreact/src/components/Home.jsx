import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>This is the Home Page To Test</h1>
            <div>
                <Link to="/Order">
                    <button>Go to Order Management</button>
                </Link>
                <Link to="/Rules">
                    <button>Go to Rules Management</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
