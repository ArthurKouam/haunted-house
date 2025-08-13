import { AmbientLight, BoxGeometry, Clock, ConeGeometry, Float32BufferAttribute, Fog, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/Addons.js'


//Scene
const scene = new Scene()

//Camera
const size = {width: window.innerWidth, height: window.innerHeight}
const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.set(4, 2, 5)

scene.add(camera)

//resize
window.addEventListener('resize', () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  renderer.setSize(size.width, size.height)
})

//Texture
const textureLoader = new TextureLoader()

//Door texture
const doorAlphaTexture = textureLoader.load('/static/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/static/textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('/static/textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('/static/textures/door/heigth.jpg')
const doorMetalnessTexture = textureLoader.load('/static/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/static/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/static/textures/door/roughness.jpg')

//Walls texture
const bricksAmbientOcclusionTexture = textureLoader.load('/static/textures/bricks/ambientOcclusion.jpg')
const bricksColorTexture = textureLoader.load('/static/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/static/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/static/textures/bricks/roughness.jpg')

//Grass Texture
const grassAmbientOcclusionTexture = textureLoader.load('/static/textures/grass/ambientOcclusion.jpg')
const grassColorTexture = textureLoader.load('/static/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/static/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/static/textures/grass/roughness.jpg')

//Plane
const plane = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshStandardMaterial({  
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAmbientOcclusionTexture,
    roughnessMap: grassRoughnessTexture
  })
)
grassColorTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = RepeatWrapping
grassNormalTexture.wrapS = RepeatWrapping
grassAmbientOcclusionTexture.wrapS = RepeatWrapping
grassRoughnessTexture.wrapS = RepeatWrapping

grassColorTexture.wrapT = RepeatWrapping
grassNormalTexture.wrapT = RepeatWrapping
grassAmbientOcclusionTexture.wrapT = RepeatWrapping
grassRoughnessTexture.wrapT = RepeatWrapping

plane.position.y = 0
plane.rotation.x = -(Math.PI * 0.5)
scene.add(plane)

// House
const house = new Group()
scene.add(house)

//Walks
const walks = new Mesh( 
  new BoxGeometry(4, 2.5, 4), 
  new MeshStandardMaterial({  
    aoMap: bricksAmbientOcclusionTexture,
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    roughness: bricksRoughnessTexture
  })
)
walks.position.y += 1.25 + 0.01
walks.geometry.setAttribute(
  'uv2',
  new Float32BufferAttribute(walks.geometry.attributes.uv.array, 2)
)
house.add(walks)

//roof
const roof = new Mesh(
  new ConeGeometry(3.5, 2, 4),
  new MeshStandardMaterial({ color: '#a72c5b' })
)
roof.position.y = 2.5 + 1 + 0.01
roof.rotation.y = Math.PI * 0.25

house.add(roof)

//Door
const door = new Mesh(
  new PlaneGeometry(1.5, 2, 100, 100),
  new MeshStandardMaterial({
    transparent: true, 
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    metalnessMap: doorMetalnessTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.8,
    roughnessMap: doorRoughnessTexture,
    alphaMap: doorAlphaTexture,
    normalMap: doorNormalTexture
    
  })
)
door.position.z = 2 + 0.01
door.position.y += 0.9 
door.geometry.setAttribute(
  'uv2',
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
house.add(door)

//floor
const floorGeometry = new SphereGeometry(0.4, 14, 16)
const floorMaterial = new MeshStandardMaterial({ color: '#29a604' })

const floor1 = new Mesh(floorGeometry, floorMaterial)
const floor2 = new Mesh(floorGeometry, floorMaterial)
const floor3 = new Mesh(floorGeometry, floorMaterial)
const floor4 = new Mesh(floorGeometry, floorMaterial)

floor1.position.set(1.1, 0.3, 2 + 0.2)
floor2.position.set(-1.4, 0.18, 2.2 + 0.2)
floor2.scale.set(0.6, 0.6, 0.6)
floor3.position.set(-1.2, 0.3, 2 + 0.2)
floor4.position.set(1.5, 0.25, 2 + 0.2)
floor4.scale.set(0.8, 0.8, 0.8)

scene.add(floor1, floor2, floor3, floor4)

// Graves
const graves = new Group()
scene.add(graves)
graves.position.y += 0.35

const graveGeometry = new BoxGeometry(0.6, 0.8, 0.2)
const graveMatrial = new MeshStandardMaterial({ color: "#b2b6b1" })

for(let i = 0; i<90; i++) {
  const grave = new Mesh(graveGeometry, graveMatrial)

  const angle = Math.PI * 2 * Math.random()
  const radius = 3.5 + Math.random() * 6
  grave.position.x = Math.sin(angle) * radius
  grave.position.z = Math.cos(angle) * radius

  graves.add(grave)
}

//Ligth
const ambientLigth = new AmbientLight('#ffffff', 0.5)
scene.add(ambientLigth)

//Door ligth
const doorLigth = new PointLight('#f11211', 20)
doorLigth.position.z = 2.2
doorLigth.position.y += 2.2
scene.add(doorLigth)

//Fantomes 
const fantome1 = new PointLight('#f11211', 20)
fantome1.position.z = -6
fantome1.position.x = 0
scene.add(fantome1)

const fantome2 = new PointLight('#f1ff11', 20)
fantome2.position.z = 0
fantome2.position.x = 6
scene.add(fantome2)

const fantome3 = new PointLight('#f112ff', 20)
fantome3.position.z = 0
fantome3.position.x = -6
scene.add(fantome3)

const fantome4 = new PointLight('#2112ff', 20)
fantome4.position.z = 6
fantome4.position.x = 0
scene.add(fantome4)

const fog = new Fog('#262837', 1, 15)
scene.fog = fog

const renderer = new WebGLRenderer({canvas: document.querySelector('.webgl')})
renderer.setSize(size.width, size.height)
renderer.render(scene, camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Control
const control = new OrbitControls(camera, renderer.domElement)
control.enableDamping = true

const clock = new Clock()

const tick = () => {
  control.update()
  renderer.render(scene, camera)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  //Animation fantomes
  const elapsedTime = clock.getElapsedTime()


  fantome1.position.y = -Math.sin(elapsedTime) * 1.5
  fantome2.position.y = -Math.sin(elapsedTime) * 1.5
  fantome3.position.y = Math.sin(elapsedTime) * 1.5
  fantome4.position.y = Math.sin(elapsedTime) * 1.5

  fantome1.position.x = Math.sin(elapsedTime + Math.PI * 0.5) * 6
  fantome2.position.x = Math.sin(elapsedTime - Math.PI * 0.5) * 6
  fantome3.position.x = Math.sin(elapsedTime + Math.PI) * 6
  fantome4.position.x = Math.sin(elapsedTime) * 6

  fantome1.position.z = Math.cos(elapsedTime + Math.PI * 0.5) * 6
  fantome2.position.z = Math.cos(elapsedTime - Math.PI * 0.5) * 6
  fantome3.position.z = Math.cos(elapsedTime + Math.PI) * 6
  fantome4.position.z = Math.cos(elapsedTime) * 6

  requestAnimationFrame(tick)
}

tick()