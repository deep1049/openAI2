import logo from "./logo.svg";
import "./App.css";
import TextGeneration from "./components/TextGeneration";
import { FileUpload } from "./components/FileUpload";
import Feelings from "./components/Feelings";

function App() {
  return (
    <div className="App">
      {" "}
      <TextGeneration />
      <Feelings />
      <FileUpload />
    </div>
  );
}

export default App;
