// Importações do projeto
import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'


// Translação - position
// Escala - scale   
// Rotações - rotation


//Texture loader
const loader = new THREE.TextureLoader()
const height = loader.load('4.png') //Relevo
const texture = loader.load('/texture.jpg') //Textura
const alpha = loader.load('alpha.png') //Luz


// Debug
const gui = new dat.GUI() //Utilizado para o controle manual dos objetos


// Canvas
const canvas = document.querySelector('canvas.webgl') //Seleciona o canvas


// Scene
const scene = new THREE.Scene() //Renderizar 


// Objects
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64) //Cria um objeto plano


// Materials
const material = new THREE.MeshStandardMaterial({ 
    color: 'gray',  //Define a cor
    map: texture,  //Define a textura
    displacementMap: height,  //Alteração dos vértices da malha
    displacementScale: .1, //Quanto o deslocamento afeta a malha?
    alphaMap: alpha, //Opacidade da textura
    transparent: true, // Define o material como transparente
    depthTest: false, // Não realizar teste de profundidade
})

const plane = new THREE.Mesh(geometry, material) //Cria o material
scene.add(plane) // Adiciona o objeto na cena
plane.rotation.x=181 //Define o valor padrão da posição X do objeto
gui.add(plane.rotation, 'x').min(0).max(600) //Adiciona um controle manual para a rotação do objeto


// Lights
const pointLight = new THREE.PointLight('#00b3ff', 3) //Cria uma luz pontual
pointLight.position.x = .2 //Define a posição da luz
pointLight.position.y = 10 //Define a posição da luz
pointLight.position.z = 4.4 //Define a posição da luz
scene.add(pointLight) //Adiciona a luz na cena

gui.add(pointLight.position, 'x') //Adiciona um controle manual para a posição da luz
gui.add(pointLight.position, 'y') //Adiciona um controle manual para a posição da luz
gui.add(pointLight.position, 'z') //Adiciona um controle manual para a posição da luz

const col = {color:'#00ff00'} //Define a cor padrão do objeto
gui.addColor(col, 'color').onChange(()=>{ //Adiciona um controle manual para a cor do objeto
    pointLight.color.set(col.color) //Define a cor da luz
})


/// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)


//Render
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, //Define o canvas
    alpha: true //Par fundo da tela 'transparente'
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Animate
//Para realizar animação de scale conforme movimento do mouse na Y
document.addEventListener('mousemove', animateTerrain)
let mouseY = 0

function animateTerrain(event){
    mouseY = event.clientY
}

const clock = new THREE.Clock() //Controlar o tempo

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime() //Tempo de execução

    // Update objects
    plane.rotation.z = .4 * elapsedTime  //Rotação do objeto em animação
    plane.material.displacementScale = .6 + mouseY * 0.0008  // Alteração de scale conforme movimento do mouse na Y

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()