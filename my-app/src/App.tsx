import './App.css';
import { Outlet } from "react-router-dom";
import Header from './components/header/Header';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Outlet />
    </div>
  );
}

export default App;
