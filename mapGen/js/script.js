console.log("Use:  mapGen(map, unit);  to make a map.")
console.log("map: a list whose length is a perfect square.")
console.log("unit: integer that specifies the size of each square.")
console.log("######################################################")
console.log("Use:  clearThree(scene);  to clear the current render.")

// Setup
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);
camera.position.x = 5;
camera.position.y = 0;
camera.position.z = 15;

var light = new THREE.DirectionalLight(0xffffff, 1);
scene.add( light );

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
$('body').append(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

function clearThree(obj){
    while(obj.children.length > 0){
        clearThree(obj.children[0])
        obj.remove(obj.children[0]);
    }
    if(obj.geometry) obj.geometry.dispose()

    if(obj.material){
        //in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if(!obj.material[prop])
                return
            if(typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose()
        })
        obj.material.dispose()
    }
}

// Input Examples (map must be a perfect square)
var map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
           1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var unit = 2; // Size of Each Cube

function mapGen(map, unit) {
    // Map Generation
    var blockNum = 0;
    var mapSize = Math.sqrt(map.length);
    var i = 0;

    class wallBlock {
        constructor (_x, _y, _z) {
            var geometry = new THREE.BoxGeometry(unit, unit, unit); // Define Main Geometry
            var material = new THREE.MeshToonMaterial({color: 0xff0000}); // Material for Main Geometry
            var cube = new THREE.Mesh(geometry,material); // Mesh for Main Geometry
            var edges = new THREE.EdgesGeometry(geometry); // Finds the Edges of Main Geometry
            var lineMat = new THREE.LineBasicMaterial({color: 0x000000}); // Material for lines connecting edges
            var lines = new THREE.LineSegments(edges, lineMat) // Lines Connecting Edges
            scene.add(cube);
            scene.add(lines);
            //scene.add(lines);
            cube.position.x = _x;
            lines.position.x = _x;
            cube.position.y = _y;
            lines.position.y = _y;
            cube.position.z = _z;
            lines.position.z = _z;
        }
    };

    class floorBlock {
        constructor (_x, _y, _z) {
            var geometry = new THREE.BoxGeometry(unit, 0.01, unit); // Define Main Geometry
            var material = new THREE.MeshToonMaterial({color: 0xffffff}); // Material for Main Geometry
            var cube = new THREE.Mesh(geometry,material); // Mesh for Main Geometry
            var edges = new THREE.EdgesGeometry(geometry); // Finds the Edges of Main Geometry
            var lineMat = new THREE.LineBasicMaterial({color: 0x000000}); // Material for lines connecting edges
            var lines = new THREE.LineSegments(edges, lineMat) // Lines Connecting Edges
            scene.add(cube);
            scene.add(lines);
            cube.position.x = _x;
            lines.position.x = _x;
            cube.position.y = _y;
            lines.position.y = _y;
            cube.position.z = _z;
            lines.position.z = _z;
        }
    };

    for (i; i < map.length; i++) {
        if (map[i] == 1) {
            eval("let block" + i + " = new wallBlock(" + unit * (i%mapSize) + ", 0, " + unit * Math.floor(i/mapSize)  + ")");
            //makeWall();
            blockNum ++;
        }
        else if (map[i] == 0) {
            eval("let block" + i + " = new floorBlock(" + unit * (i%mapSize) + "," + -1 * unit / 2 + ", " + unit * Math.floor(i/mapSize)  + ")");
            //makeFloor();
            blockNum ++;
        }
    }
    camera.position.set(mapSize / 2, 20, mapSize / 2);
    animate();
};

var animate = function() {
    renderer.render(scene,camera);
    // Code to Run Every Frame Goes Here
    requestAnimationFrame(animate);
};
