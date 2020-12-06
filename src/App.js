import './App.css';
import{ BrowserRouter as Router, 
  Switch,
  Route
  } from "react-router-dom";
import Home from "./Components/Home/Home";
import Result from "./Components/Result/Result";
import Gallery from "./Components/Gallery/Gallery"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/result/:dog">
          <Result/>
        </Route>
        <Route path="/gallery">
          <Gallery/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
