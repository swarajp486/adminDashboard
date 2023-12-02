

import { useState } from 'react';
import './App.css';
import MemberTable from './Component/MemberTable';
import { Modal } from './Component/Form';

function App() {
  
  return (
  <>
    <div className="App">
      <h2>Admin Dashboard</h2>
    </div>
    <div className='main'>
      <MemberTable/>
    </div>
   
  </>
  );
}

export default App;
