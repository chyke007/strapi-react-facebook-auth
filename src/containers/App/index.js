
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import AuthPage from '../AuthPage';
import ConnectPage from '../ConnectPage';
import HomePage from '../HomePage';
import NotFoundPage from '../NotFoundPage';
import PrivateRoute from '../PrivateRoute';

// Design
import './styles.css';

const App = () => {
    return (
      <Router>
        <div className="App">
          <Routes>
            {/* A user can't go to the HomePage if is not authenticated */}
            <Route path="/auth/:authType/:id" element={<AuthPage/>} />
            <Route path="/auth/:authType" element={<AuthPage/>} />
            <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/' element={<HomePage/>}/>
            </Route>
            <Route exact path="/connect/:provider" element={<ConnectPage/>} />
            <Route path="*" element={<NotFoundPage/>} />

          </Routes>
        </div>
      </Router>
    );
}

export default App;