var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
$('body').append(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function build()
    var geometry = new THREE.OctahedronGeometry(2,2,2); // Define Main Geometry
    var material = new THREE.MeshBasicMaterial({color: 0xff0000}); // Material for Main Geometry
    var cube = new THREE.Mesh(geometry,material); // Mesh for Main Geometry
    var edges = new THREE.EdgesGeometry(geometry); // Finds the Edges of Main Geometry
    var lineMat = new THREE.LineBasicMaterial({color: 0xffffff}); // Material for lines connecting edges
    var lines = new THREE.LineSegments(edges, lineMat) // Lines Connecting Edges
    scene.add(cube);
    scene.add(lines);

cube.position.z = 0;


lines.position.z = 0;

camera.position.z = 10;

renderer.render(scene,camera);
var animate = function(){
    lines.rotation.y += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
 }
animate();
