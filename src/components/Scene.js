import { useEffect } from 'react'
import { ThreeExperience } from './Script.js'

import './Scene.css'

export default function Scene() {
  const three = new ThreeExperience()

  useEffect(() => {
    three.initScene();

    const handleKeyDown = (event) => {
      three.moveCharacter(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      three.cleanUp();
    };
  }, []);

  
  return (
    <>
      <div id="container3D" className="scene_container"></div>
      <div className="button_container">
        <div className="button_wrapper">
          <button onClick={() => three.playAnimation(0,false)}>Bailar</button> 
          <button onClick={() => three.playAnimation(1,true)}>Muerto</button>
          <button onClick={() => three.playAnimation(2,false)}>Levitar</button>
          <button onClick={() => three.playAnimation(3,true)}>Saltar</button>
          <button onClick={() => three.playAnimation(4,true)}>No</button>
          <button onClick={() => three.playAnimation(5,true)}>Puño</button>
          <button onClick={() => three.playAnimation(6,false)}>Correr</button> 
          <button onClick={() => three.playAnimation(7,true)}>Sentarse</button>
          <button onClick={() => three.playAnimation(8,true)}>Despierto</button>
          <button onClick={() => three.playAnimation(9,true)}>ok</button>
          <button onClick={() => three.playAnimation(10,false)}>Caminar</button>
          <button onClick={() => three.playAnimation(11,true)}>Correr/Saltar</button>
          <button onClick={() => three.playAnimation(12,true)}>Saludar</button> 
          <button onClick={() => three.playAnimation(13,true)}>Si</button>            
        </div>
      </div>       
    </>
  )
  
}
