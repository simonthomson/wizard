import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import CreateGameDialog from './create-game-dialog';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/createGame' element={<CreateGameDialog />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
