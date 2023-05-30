import { useState } from 'react'
import reactLogo from './assets/react.svg'
// import './App.css'
import Scene from './components/Scene.js';

function App() {
  const [count, setCount] = useState(0)

  return <Scene />
}

export default App
