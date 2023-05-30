import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'; //Importamos para leer el archivo glb
import { MeshStandardMaterial } from 'three';
import { MeshLambertMaterial } from 'three';
import { CubeTextureLoader } from 'three';
import { PointLight } from 'three';

//let {PerspectiveCamera, Scene, WebGLRenderer, CubeTextureLoader, IcosahedronGeometry, Mesh, AmbientLight, OrbitControls} = THREE

  /*Arreglo de texturas*/

  let textures=[
    'https://assets.codepen.io/911796/px.jpeg',
    'https://assets.codepen.io/911796/nx.jpeg',
    'https://assets.codepen.io/911796/py.jpeg',
    'https://assets.codepen.io/911796/ny.jpeg',
    'https://assets.codepen.io/911796/pz.jpeg',
    'https://assets.codepen.io/911796/nz.jpeg'
  ]

class ThreeExperience { 

  //Variables Globales
  container= null
  camera= null
  scene= null
  controls= null
  loader= null
  
  actions =[]
  mixer= null
  prevAnimacion= null
  currentAnimation= null
  clock= null

  constructor() {
    this.container = document.createElement('div')

    /* Camera */
    this.camera = new THREE.PerspectiveCamera(70,window.innerWidth / window.innerHeight, 1,10000)
    this.camera.position.set(0, 1, 8)
    this.scene = new THREE.Scene()
    this.scene.add(this.camera)

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({antialias: true,alpha: true,})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setAnimationLoop(this.render.bind(this)) //
    this.container.appendChild(this.renderer.domElement) //Agregaci

    /*Cargar texturas del cubo*/
    let cubeLoader= new THREE.CubeTextureLoader()
    let cubeTexture = cubeLoader.load(textures)

    this.scene.background = cubeTexture
    
    
    /* Controles */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.target.y=1.3

    /*Loader*/
    this.loader= new GLTFLoader()
    this.loadModel() //Carga el modelo GLB


     /*Luces*/
    this.addLight()

    /*Reloj*/
    this.clock= new THREE.Clock()

    /*mixer*/
    this.mixer = new THREE.AnimationMixer()


    /**/ 
    /* Resize */
    window.addEventListener('resize', this.resize.bind(this))
  }
  
  moveCharacter(event) {
    const delta = 0.1; // Valor de desplazamiento
  
    switch (event.key) {
      case 'a': // Izquierda
        this.scene.position.x -= delta;
        break;
      case 'd': // Derecha
        this.scene.position.x += delta;
        break;
      case 'w': // Arriba
        this.scene.position.y += delta;
        break;
      case 's': // Abajo
        this.scene.position.y -= delta;
        break;
      default:
        break;
    }
  }

  initScene() {
    document.getElementById('container3D').appendChild(this.container) //
  }

  loadModel() {
    const cubeLoader = new CubeTextureLoader();
    cubeLoader.setPath('https://assets.codepen.io/911796');
  
    const cubeTexture = cubeLoader.load(textures);
    cubeTexture.format = THREE.RGBFormat;
  
    const material = new THREE.MeshStandardMaterial({
      envMap: cubeTexture,
      metalness: 0.3, // Ajusta el valor según el nivel de metal del objeto
      roughness: 0.8, // Ajusta el valor según la suavidad del objeto
    });
  
    this.loader.load('RobotExpressive.glb', (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
  
      this.scene.add(gltf.scene);
      this.mixer = new THREE.AnimationMixer(gltf.scene);
      for (const clip of gltf.animations) {
        const action = this.mixer.clipAction(clip);
        this.actions.push(action);
      }
    });
  }
/*
  loadModel(){
    this.loader.load('RobotExpressive.glb', (gltf)=>{
      const material = new MeshStandardMaterial({ envMap: this.scene.background }); 
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });   
     // const materi= new THREE.MeshLambertMaterial({envMap: cubeTexture})
      //const juntar= new THREE.Mesh(gltf, juntar)
      this.scene.add(gltf.scene) //Cargamos la figura/malla a la escena
      this.mixer= new THREE.AnimationMixer(gltf.scene)
      for(const clip of gltf.animations){
        const action = this.mixer.clipAction(clip)
        this.actions.push(action)
      }       
    })
  }
*/
  
  playAnimation(index, indefinidas){
    this.prevAnimacion = this.currentAnimation 
    this.currentAnimation = this.actions[index]
    if (this.prevAnimacion != this.currentAnimation && this.prevAnimacion){
      this.prevAnimacion.fadeOut(0.5)
    }
    if(indefinidas){
      this.currentAnimation.clampWhenFinished= true
      this.currentAnimation.loop = THREE.LoopOnce
    }
    this.currentAnimation.reset()
    this.currentAnimation.fadeIn(0.5)
    this.currentAnimation.play()
  }

  addLight(){
    const directional = new THREE.DirectionalLight(0xffffff,1)
    directional.position.set(0,10,10)
    // Luz puntual
    const pointLight = new PointLight(0xffffff, 1, 10);
    pointLight.position.set(0, 2, 0);
    this.scene.add(pointLight);
    this.scene.add(directional)
    const aoambiental= new THREE.AmbientLight(0xffffff,0.5)
    this.scene.add(aoambiental)
  }
 

  render() {
    const deltaTime = this.clock.getDelta()
    this.mixer.update(deltaTime)
    this.controls.update()
    this.renderer.render(this.scene, this.camera) //Pasamos escena y camara al render 
  }

  resize() {
    const { clientWidth: width, clientHeight: height } =
    document.getElementById('container3D')
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  cleanUp() {
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.dispose()
        child.geometry.dispose()
      }
    })

    document.getElementById('container3D').removeChild(this.container)
  }
}

export { ThreeExperience }
