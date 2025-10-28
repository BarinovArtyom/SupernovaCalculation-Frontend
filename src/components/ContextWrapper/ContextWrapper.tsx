import {useState} from "react";
import App from "../../App.tsx";


const ContextWrapper = () => {
  const [, setMode] = useState('');
  return (
    <>
      <App setMode={setMode}/>
    </>
)
}

export default ContextWrapper;