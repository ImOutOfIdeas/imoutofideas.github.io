// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const TRACK_START_Z = 200; // z-position where track begins
const TRACK_END_Z = -280; // z-position where track ends
const TRACK_TOTAL_SPAN = TRACK_START_Z - TRACK_END_Z; // 480 units
const FORK_Z = -55; // z-position where the tracks diverge
const DIVERT_X_OFFSET = -8; // how far left the diverted track shifts
const TROLLEY_EYE_Y = 1.72; // height of the driver's eye point

const MAX_SPEED = 18; // maximum trolley speed (m/s)
const ACCELERATION = 0.215; // base acceleration per second

const LEVER_ANGLE_REST = 0.65; // lever rotation when not pulled
const LEVER_ANGLE_PULLED = -0.65; // lever rotation when pulled

// ─────────────────────────────────────────────────────────────────────────────
// RENDERER  &  SCENE  SETUP
// ─────────────────────────────────────────────────────────────────────────────
class SceneSetup {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        document.body.insertBefore(this.renderer.domElement, document.getElementById('title-screen'));

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0d0b18);
        this.scene.fog = new THREE.FogExp2(0x0d0b18, 0.006);

        this.camera = new THREE.PerspectiveCamera(82, window.innerWidth / window.innerHeight, 0.05, 600);
        this.scene.add(this.camera);

        window.addEventListener('resize', () => this._onResize());
    }

    _onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTING
// ─────────────────────────────────────────────────────────────────────────────
class SceneLighting {
    constructor(scene, trolleyPivot) {
        this.scene = scene;
        this.trolleyPivot = trolleyPivot;

        this._addAmbient();
        this._addMoonDirectional();
        this._addFillLight();
        this._addHeadlamp();
        this._addCabinGlow();
        this._addDangerLights();
    }

    _addAmbient() {
        this.scene.add(new THREE.AmbientLight(0x2a2040, 2.5));
    }

    _addMoonDirectional() {
        const moonDirectional = new THREE.DirectionalLight(0xaabbee, 1.2);
        moonDirectional.position.set(-30, 60, 30);
        this.scene.add(moonDirectional);
    }

    _addFillLight() {
        const fillLight = new THREE.DirectionalLight(0x334466, 0.5);
        fillLight.position.set(30, 20, -10);
        this.scene.add(fillLight);
    }

    _addHeadlamp() {
        this.headlamp = new THREE.SpotLight(0xfff0d0, 10, 180, Math.PI / 8, 0.25, 0.8);
        this.headlamp.castShadow = false;
        this.scene.add(this.headlamp);
        this.scene.add(this.headlamp.target);
    }

    _addCabinGlow() {
        this.cabinGlow = new THREE.PointLight(0xff7722, 1.2, 8);
        this.scene.add(this.cabinGlow);
    }

    _addDangerLights() {
        // Pulsing red light near the 5 people on the straight track
        this.dangerLightStraight = new THREE.PointLight(0xff2200, 0, 20);
        this.dangerLightStraight.position.set(0, 2, -92);
        this.scene.add(this.dangerLightStraight);

        // Pulsing red light near the 1 person on the diverted track
        this.dangerLightDiverted = new THREE.PointLight(0xff2200, 0, 20);
        this.dangerLightDiverted.position.set(-8, 2, -150);
        this.scene.add(this.dangerLightDiverted);
    }

    updateHeadlamp(trolleyWorldPos, trolleyYaw) {
        const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, trolleyYaw, 0));
        this.headlamp.position.copy(trolleyWorldPos).addScaledVector(forward, 2).add(new THREE.Vector3(0, 2.4, 0));
        this.headlamp.target.position.copy(trolleyWorldPos).addScaledVector(forward, 38).add(new THREE.Vector3(0, -1, 0));
        this.headlamp.target.updateMatrixWorld();
        this.cabinGlow.position.copy(trolleyWorldPos).add(new THREE.Vector3(0, 0.4, 0));
    }

    updateDangerLights(trolleyZ, leverPulled, elapsedTime) {
        const distanceToFork = Math.abs(trolleyZ - FORK_Z);
        if (distanceToFork < 80) {
            const pulse = Math.max(0, Math.sin(elapsedTime * 4) * 0.5 + 0.5);
            const intensity = (1 - distanceToFork / 80) * 2.5 * pulse;
            this.dangerLightStraight.intensity = leverPulled ? 0 : intensity;
            this.dangerLightDiverted.intensity = leverPulled ? intensity : 0;
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK SPLINES
// ─────────────────────────────────────────────────────────────────────────────
class TrackSplines {
    constructor() {
        this.straightCurve = this._buildStraightCurve();
        this.divertCurve = this._buildDivertCurve();
    }

    _buildStraightCurve() {
        const points = [];
        for (let z = TRACK_START_Z; z >= TRACK_END_Z; z -= 4) {
            points.push(new THREE.Vector3(0, 0, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }

    _buildDivertCurve() {
        const points = [];
        for (let z = TRACK_START_Z; z >= TRACK_END_Z; z -= 4) {
            let x = 0;
            if (z < FORK_Z) {
                const progress = Math.min(1, (FORK_Z - z) / 80);
                // Smoothstep easing so the curve transitions gracefully
                x = DIVERT_X_OFFSET * (3 * progress * progress - 2 * progress * progress * progress);
            }
            points.push(new THREE.Vector3(x, 0, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }

    // Convert a travelled distance to a 0-1 curve parameter
    distanceToT(distance) {
        return Math.min(0.9999, distance / TRACK_TOTAL_SPAN);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK MESH  (rails + sleepers)
// ─────────────────────────────────────────────────────────────────────────────
class TrackMesh {
    constructor(scene, curve, segmentCount = 320) {
        this.scene = scene;
        this.curve = curve;
        this.segmentCount = segmentCount;
        this.group = new THREE.Group();

        this.railMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            metalness: 0.85,
            roughness: 0.25
        });
        this.tieMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a2718,
            roughness: 0.95
        });

        this._build();
        scene.add(this.group);
    }

    _build() {
        for (let i = 0; i < this.segmentCount; i++) {
            const pointA = this.curve.getPoint(i / this.segmentCount);
            const pointB = this.curve.getPoint((i + 1) / this.segmentCount);
            const segLen = pointA.distanceTo(pointB) + 0.02;
            const midpoint = pointA.clone().lerp(pointB, 0.5);
            const dir = pointB.clone().sub(pointA).normalize();
            const yaw = Math.atan2(dir.x, dir.z);

            // Left and right rails, offset from track centerline
            for (const sideOffset of [-0.75, 0.75]) {
                const rail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, segLen), this.railMaterial);
                rail.position.set(
                    midpoint.x + sideOffset * Math.cos(yaw),
                    0.045,
                    midpoint.z - sideOffset * Math.sin(yaw)
                );
                rail.rotation.y = -yaw;
                this.group.add(rail);
            }

            // Sleepers (ties) every 3rd segment
            if (i % 3 === 0) {
                const sleeper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.07, 0.22), this.tieMaterial);
                sleeper.position.set(midpoint.x, 0.025, midpoint.z);
                sleeper.rotation.y = -yaw;
                this.group.add(sleeper);
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUND
// ─────────────────────────────────────────────────────────────────────────────
class Ground {
    constructor(scene) {
        const groundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(350, 700),
            new THREE.MeshStandardMaterial({
                color: 0x1a1508,
                roughness: 1
            })
        );
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.set(0, -0.06, -120);
        scene.add(groundMesh);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSON (a single bystander figure)
// ─────────────────────────────────────────────────────────────────────────────
class Person {
    constructor(scene, bodyColor, skinColor, positionX, positionZ) {
        this.scene = scene;
        this.group = new THREE.Group();

        this.isDead = false;
        this.velocityY = 0;
        this.velocityX = 0;
        this.velocityZ = 0;

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: bodyColor,
            roughness: 0.9
        });
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: skinColor,
            roughness: 0.8
        });
        const legsMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.9
        });

        // Torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.65, 0.28), bodyMaterial);
        torso.position.y = 0.9;
        torso.castShadow = true;
        this.group.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.28), skinMaterial);
        head.position.y = 1.45;
        head.castShadow = true;
        this.group.add(head);

        // Arms and legs (left = -1, right = +1)
        for (const side of [-1, 1]) {
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.48, 0.11), bodyMaterial);
            arm.position.set(side * 0.26, 0.88, 0);
            arm.castShadow = true;
            this.group.add(arm);

            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.5, 0.13), legsMaterial);
            leg.position.set(side * 0.1, 0.3, 0);
            leg.castShadow = true;
            this.group.add(leg);
        }

        this.group.position.set(positionX, 0, positionZ);
        this.group.rotation.y = 0; // Face +Z (toward the oncoming trolley)
        scene.add(this.group);
    }

    get position() {
        return this.group.position;
    }
    get rotation() {
        return this.group.rotation;
    }

    // Called when the trolley hits this person
    die() {
        this.isDead = true;
        this.velocityY = 0.28;
        this.velocityX = (Math.random() - 0.5) * 0.18;
        this.velocityZ = -0.09;
    }

    update() {
        if (!this.isDead) return;
        this.group.position.y += this.velocityY;
        this.group.position.x += this.velocityX;
        this.group.position.z += this.velocityZ;
        this.velocityY -= 0.013;
        this.group.rotation.z += 0.09;
        this.group.rotation.x += 0.05;
        if (this.group.position.y < -0.8) this.group.position.y = -0.8;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PEOPLE GROUPS  (straight track: 5 people / diverted track: 1 person)
// ─────────────────────────────────────────────────────────────────────────────
class PeopleGroups {
    constructor(scene) {
        // Body/skin colour pairs for the 5 people on the main track
        const mainTrackAppearances = [
            [0x2980b9, 0xe8c99a],
            [0x8e44ad, 0xf5cba7],
            [0x27ae60, 0xd4874a],
            [0xc0392b, 0xc8a882],
            [0x2c3e50, 0xf2d9bb],
        ];

        this.mainTrackPeople = mainTrackAppearances.map(([bodyCol, skinCol], index) => {
            const xPos = -0.5 + (index % 3) * 0.5;
            const zPos = -150 - index * 2.5;
            return new Person(scene, bodyCol, skinCol, xPos, zPos);
        });

        // Single person on the diverted (left) track
        this.divertedTrackPeople = [
            new Person(scene, 0x16a085, 0xf5d6b0, DIVERT_X_OFFSET, -150),
        ];
    }

    // Returns the group of people who are in the trolley's path
    getTargetGroup(leverPulled) {
        return leverPulled ? this.divertedTrackPeople : this.mainTrackPeople;
    }

    // Check if the trolley has hit anyone and update physics
    checkCollisionsAndUpdate(trolleyWorldPos, leverPulled) {
        const targets = this.getTargetGroup(leverPulled);

        targets.forEach(person => {
            if (!person.isDead) {
                const closeEnoughZ = Math.abs(trolleyWorldPos.z - person.position.z) < 3.5;
                const closeEnoughX = Math.abs(trolleyWorldPos.x - person.position.x) < 2.8;
                if (closeEnoughZ && closeEnoughX) {
                    person.die();
                }
            }
        });

        // Update physics for all people (dead ones tumble)
        [...this.mainTrackPeople, ...this.divertedTrackPeople].forEach(p => p.update());
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TREE
// ─────────────────────────────────────────────────────────────────────────────
class Tree {
    constructor(scene, x, z, scale = 1) {
        const group = new THREE.Group();

        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a2010,
            roughness: 1
        });
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x0d2410,
            roughness: 1
        });

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15 * scale, 0.22 * scale, 2.2 * scale, 6),
            trunkMaterial
        );
        trunk.position.y = 1.1 * scale;
        trunk.castShadow = true;
        group.add(trunk);

        // Three stacked cones form the canopy
        for (let tier = 0; tier < 3; tier++) {
            const canopyTier = new THREE.Mesh(
                new THREE.ConeGeometry((1.3 - tier * 0.22) * scale, 1.6 * scale, 7),
                foliageMaterial
            );
            canopyTier.position.y = (2.5 + tier * 1.1) * scale;
            canopyTier.castShadow = true;
            group.add(canopyTier);
        }

        group.position.set(x, 0, z);
        scene.add(group);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// LANTERN  (track-side gas lamp)
// ─────────────────────────────────────────────────────────────────────────────
class Lantern {
    constructor(scene, x, z) {
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: 0.7
        });

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.5, 6), postMaterial);
        post.position.set(x, 1.75, z);
        scene.add(post);

        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.13, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0xffeebb,
                emissive: 0xffaa33,
                emissiveIntensity: 2.0,
                transparent: true,
                opacity: 0.9,
            })
        );
        bulb.position.set(x, 3.6, z);
        scene.add(bulb);

        const glowLight = new THREE.PointLight(0xff9933, 1.8, 14);
        glowLight.position.set(x, 3.5, z);
        scene.add(glowLight);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TELEPHONE POLE
// ─────────────────────────────────────────────────────────────────────────────
class TelephonePole {
    constructor(scene, z) {
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3020,
            roughness: 1
        });

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 7, 6), woodMaterial);
        pole.position.set(5.5, 3.5, z);
        pole.castShadow = true;
        scene.add(pole);

        const crossarm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.09, 0.09), woodMaterial);
        crossarm.position.set(5.5, 6.8, z);
        scene.add(crossarm);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// FORK WARNING SIGN
// ─────────────────────────────────────────────────────────────────────────────
class ForkWarningSign {
    constructor(scene) {
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: 0.5
        });
        const boardMaterial = new THREE.MeshStandardMaterial({
            color: 0xf39c12,
            roughness: 0.6,
            emissive: 0x221000,
            emissiveIntensity: 0.4,
        });

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.8, 6), postMaterial);
        post.position.set(2.5, 1.9, FORK_Z);
        scene.add(post);

        const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.07), boardMaterial);
        board.position.set(2.5, 3.9, FORK_Z);
        board.rotation.y = -0.35;
        scene.add(board);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// STARS  &  MOON
// ─────────────────────────────────────────────────────────────────────────────
class NightSky {
    constructor(scene) {
        this._addStars(scene);
        this._addMoon(scene);
        this._addGroundMist(scene);
    }

    _addStars(scene) {
        const starPositions = [];
        for (let i = 0; i < 3500; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = 270 + Math.random() * 80;
            starPositions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                Math.abs(radius * Math.cos(phi)) + 8,
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            sizeAttenuation: true
        })));
    }

    _addMoon(scene) {
        const moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(12, 16, 16),
            new THREE.MeshStandardMaterial({
                color: 0xfffce0,
                emissive: 0x887733,
                emissiveIntensity: 1.2
            })
        );
        moonMesh.position.set(-90, 110, -220);
        scene.add(moonMesh);

        const moonHalo = new THREE.Mesh(
            new THREE.SphereGeometry(18, 16, 16),
            new THREE.MeshStandardMaterial({
                color: 0x445577,
                transparent: true,
                opacity: 0.08,
                side: THREE.BackSide
            })
        );
        moonHalo.position.copy(moonMesh.position);
        scene.add(moonHalo);

        const moonGlowLight = new THREE.PointLight(0xaabbdd, 2.0, 300);
        moonGlowLight.position.set(-90, 110, -220);
        scene.add(moonGlowLight);
    }

    _addGroundMist(scene) {
        const mistPositions = [];
        for (let i = 0; i < 600; i++) {
            mistPositions.push(
                (Math.random() - 0.5) * 80,
                Math.random() * 0.8,
                -Math.random() * 280
            );
        }
        const mistGeometry = new THREE.BufferGeometry();
        mistGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mistPositions, 3));
        scene.add(new THREE.Points(mistGeometry, new THREE.PointsMaterial({
            color: 0x99aacc,
            size: 1.2,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.18,
        })));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENERY  (trees, lanterns, poles, sign)
// ─────────────────────────────────────────────────────────────────────────────
class Scenery {
    constructor(scene) {
        this._addLanterns(scene);
        this._addTrees(scene);
        this._addTelephonePoles(scene);
        new ForkWarningSign(scene);
        new NightSky(scene);
        new Ground(scene);
    }

    _addLanterns(scene) {
        for (let i = 0; i < 14; i++) {
            new Lantern(scene, 3.2, -i * 18 + 10);
        }
    }

    _addTrees(scene) {
        const treePositions = [
            [-9, -5],
            [-13, -18],
            [-8, -33],
            [-14, -46],
            [-10, -60],
            [-9, -76],
            [-12, -92],
            [-8, -109],
            [-14, -126],
            [-10, -143],
            [-15, -160],
            [-13, -177],
            [9, -10],
            [14, -24],
            [10, -38],
            [13, -52],
            [9, -68],
            [12, -84],
            [10, -100],
            [14, -116],
            [9, -133],
            [13, -150],
        ];
        treePositions.forEach(([x, z]) => {
            new Tree(scene, x, z, 0.8 + Math.random() * 0.5);
        });
    }

    _addTelephonePoles(scene) {
        for (let i = 0; i < 22; i++) {
            new TelephonePole(scene, -i * 13 + 8);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SMOKE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
class SmokeSystem {
    constructor(scene, trolleyPivot) {
        this.scene = scene;
        this.trolleyPivot = trolleyPivot;
        this.activePuffs = [];
        this.spawnTimer = 0;
        this.SPAWN_INTERVAL = 0.14;
        this.MAX_PUFFS = 40;
    }

    _spawnPuff() {
        if (this.activePuffs.length > this.MAX_PUFFS) {
            this.scene.remove(this.activePuffs.shift());
        }

        const puff = new THREE.Mesh(
            new THREE.SphereGeometry(0.22 + Math.random() * 0.3, 6, 6),
            new THREE.MeshStandardMaterial({
                color: 0x999999,
                transparent: true,
                opacity: 0.22
            })
        );

        const trolleyWorldPos = new THREE.Vector3();
        this.trolleyPivot.getWorldPosition(trolleyWorldPos);

        const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.trolleyPivot.quaternion);

        puff.position
            .copy(trolleyWorldPos)
            .addScaledVector(forwardDir, 1.5)
            .add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 4.5, 0));

        puff.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.03,
            0.06,
            (Math.random() - 0.5) * 0.02
        );
        puff.userData.life = 1.0;

        this.scene.add(puff);
        this.activePuffs.push(puff);
    }

    update(deltaTime) {
        this.spawnTimer += deltaTime;
        if (this.spawnTimer > this.SPAWN_INTERVAL) {
            this._spawnPuff();
            this.spawnTimer = 0;
        }

        this.activePuffs.forEach(puff => {
            puff.position.add(puff.userData.velocity);
            puff.userData.life -= deltaTime * 0.45;
            puff.material.opacity = Math.max(0, puff.userData.life * 0.22);
            puff.scale.setScalar(1 + (1 - puff.userData.life) * 3.5);
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// COCKPIT  (the trolley driver's cab interior and lever)
// ─────────────────────────────────────────────────────────────────────────────
class Cockpit {
    constructor(trolleyPivot) {
        this.trolleyPivot = trolleyPivot;

        // Shared materials
        this.materials = {
            dashboard: new THREE.MeshStandardMaterial({
                color: 0x1c1208,
                roughness: 0.9
            }),
            trim: new THREE.MeshStandardMaterial({
                color: 0xaa2e1e,
                metalness: 0.3,
                roughness: 0.6
            }),
            metal: new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.88,
                roughness: 0.22
            }),
            glass: new THREE.MeshStandardMaterial({
                color: 0x334455,
                transparent: true,
                opacity: 0.18
            }),
            wall: new THREE.MeshStandardMaterial({
                color: 0x120d07,
                roughness: 1
            }),
            floor: new THREE.MeshStandardMaterial({
                color: 0x0d0a05,
                roughness: 1
            }),
        };

        this._buildCabin();
        this._buildDashboard();
        this._buildWindows();
        this._buildLever();
    }

    // Shorthand: add a box mesh to the trolleyPivot at a given position
    _addBox(width, height, depth, material, x, y, z) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
        mesh.position.set(x, y, z);
        this.trolleyPivot.add(mesh);
        return mesh;
    }

    _buildCabin() {
        // Floor, ceiling, three walls (front is the windshield)
        this._addBox(3.3, 0.08, 5.0, this.materials.floor, 0, -0.88, -1.5); // floor
        this._addBox(3.3, 0.08, 5.0, this.materials.wall, 0, 1.05, 1.0); // ceiling
        this._addBox(0.09, 2.0, 5.0, this.materials.wall, -1.65, 0.08, 1.0); // left wall
        this._addBox(0.09, 2.0, 5.0, this.materials.wall, 1.65, 0.08, 1.0); // right wall
        this._addBox(3.3, 2.0, 0.09, this.materials.wall, 0, 0.08, 1.8); // rear wall
    }

    _buildDashboard() {
        this._addBox(3.3, 0.55, 0.28, this.materials.dashboard, 0, -0.52, -1.3); // main panel
    }

    _buildWindows() {
        // Front window frame
        this._addBox(3.3, 0.16, 0.12, this.materials.trim, 0, 1.02, -1.42); // top bar
        this._addBox(3.3, 0.12, 0.12, this.materials.trim, 0, -0.68, -1.42); // bottom bar
        this._addBox(0.13, 1.7, 0.12, this.materials.trim, -1.57, 0.2, -1.42); // left pillar
        this._addBox(0.13, 1.7, 0.12, this.materials.trim, 1.57, 0.2, -1.42); // right pillar

        // Main windshield glass
        const windshield = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.58), this.materials.glass);
        windshield.position.set(0, 0.2, -1.38);
        this.trolleyPivot.add(windshield);

        // Side windows
        for (const side of [-1, 1]) {
            const sideGlassMaterial = new THREE.MeshStandardMaterial({
                color: 0x223344,
                transparent: true,
                opacity: 0.15,
            });
            const sideWindow = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6), sideGlassMaterial);
            sideWindow.position.set(side * 1.60, 0.15, -0.9);
            sideWindow.rotation.y = side * Math.PI / 2;
            this.trolleyPivot.add(sideWindow);

            this._addBox(0.06, 0.7, 1.1, this.materials.trim, side * 1.62, 0.15, -0.9); // side window frame
        }
    }

    _buildLever() {
        this.leverGroup = new THREE.Group();
        this.leverGroup.position.set(0.82, -0.46, -1.0);
        this.trolleyPivot.add(this.leverGroup);

        // Base plate
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.28), this.materials.metal);
        base.position.y = 0;
        this.leverGroup.add(base);

        // Gate slot in the base
        const gateSlot = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.025, 0.32),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 1
            })
        );
        gateSlot.position.set(0, 0.045, 0);
        this.leverGroup.add(gateSlot);

        // The arm that rotates when the lever is pulled
        this.leverArmGroup = new THREE.Group();
        this.leverArmGroup.position.set(0, 0.045, 0);
        this.leverGroup.add(this.leverArmGroup);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.62, 10), this.materials.metal);
        shaft.position.y = 0.31;
        this.leverArmGroup.add(shaft);

        this.leverKnob = new THREE.Mesh(
            new THREE.SphereGeometry(0.072, 14, 14),
            new THREE.MeshStandardMaterial({
                color: 0xdd2200,
                metalness: 0.3,
                roughness: 0.4,
                emissive: 0x330000,
                emissiveIntensity: 0.6,
            })
        );
        this.leverKnob.position.y = 0.65;
        this.leverArmGroup.add(this.leverKnob);

        // Yellow identification tag
        const idTag = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.07, 0.045),
            new THREE.MeshStandardMaterial({
                color: 0xf1c40f,
                roughness: 0.6
            })
        );
        idTag.position.set(0, -0.065, 0.14);
        this.leverGroup.add(idTag);

        // Orange accent light near the lever
        this.leverAccentLight = new THREE.PointLight(0xff5500, 0.5, 1.5);
        this.leverAccentLight.position.set(0.82, 0.15, -1.0);
        this.trolleyPivot.add(this.leverAccentLight);

        this.leverArmGroup.rotation.x = LEVER_ANGLE_REST;
        this.leverAnimationProgress = 0;
    }

    update(deltaTime, speedNormalized, leverPulled, elapsedTime) {
        // Animate lever being pulled
        if (leverPulled) {
            this.leverAnimationProgress = Math.min(1, this.leverAnimationProgress + deltaTime * 5);
            this.leverArmGroup.rotation.x = THREE.MathUtils.lerp(
                LEVER_ANGLE_REST, LEVER_ANGLE_PULLED, this.leverAnimationProgress
            );
            const knobGlowColor = this.leverAnimationProgress > 0.5 ? 0x991100 : 0x330000;
            this.leverKnob.material.emissive.setHex(knobGlowColor);
            this.leverKnob.material.emissiveIntensity = 0.6 + this.leverAnimationProgress * 0.5;
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TROLLEY  (the pivot that travels along the track; contains the cockpit+camera)
// ─────────────────────────────────────────────────────────────────────────────
class Trolley {
    constructor(scene, camera) {
        this.pivot = new THREE.Group();
        this.pivot.position.set(0, TROLLEY_EYE_Y, TRACK_START_Z);
        scene.add(this.pivot);

        // Camera sits slightly back from the front of the cab, faces -Z (forward)
        camera.position.set(0, 0, -0.2);
        camera.rotation.set(0, 0, 0);
        this.pivot.add(camera);

        this.cockpit = new Cockpit(this.pivot);
        this.smokeSystem = new SmokeSystem(scene, this.pivot);
    }

    getWorldPosition() {
        const pos = new THREE.Vector3();
        this.pivot.getWorldPosition(pos);
        return pos;
    }

    // Move the trolley to a new position on the given curve at travel distance
    moveTo(curve, travelDist) {
        const t = Math.min(0.9999, travelDist / TRACK_TOTAL_SPAN);
        const curvePos = curve.getPoint(t);
        const curveTan = curve.getTangent(t);

        // Camera shake increases with speed
        const speedNorm = Math.min(1, travelDist / (TRACK_TOTAL_SPAN * 0.5));
        const shakeAmt = speedNorm * 0.015;
        const shakeX = (Math.random() - 0.5) * shakeAmt;
        const shakeY = (Math.random() - 0.5) * shakeAmt * 0.5;

        this.pivot.position.set(curvePos.x + shakeX, curvePos.y + TROLLEY_EYE_Y + shakeY, curvePos.z);

        // Camera faces -Z by default; we want pivot's -Z to match the travel tangent
        const yaw = Math.atan2(-curveTan.x, -curveTan.z);
        this.pivot.rotation.y = yaw;

        return {
            curvePos,
            yaw
        };
    }

    update(deltaTime, speedNormalized, leverPulled, elapsedTime) {
        this.cockpit.update(deltaTime, speedNormalized, leverPulled, elapsedTime);
        this.smokeSystem.update(deltaTime);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD  (on-screen text and speed bar)
// ─────────────────────────────────────────────────────────────────────────────
class HUD {
    constructor() {
        this.promptTextEl = document.getElementById('prompt-text');
        this.spaceHintEl = document.getElementById('spacebar-hint');
        this.lastPrompt = '';
    }

    setPrompt(text, color = '#fff') {
        if (text === this.lastPrompt) return;
        this.lastPrompt = text;
        this.promptTextEl.textContent = text;
        this.promptTextEl.style.color = color;
    }

    setSpaceHintVisible(visible) {
        this.spaceHintEl.style.display = visible ? 'flex' : 'none';
    }

    updatePromptForTrolleyPosition(trolleyZ, decisionMade, leverPulled) {
        if (trolleyZ > FORK_Z + 140) {
            this.setPrompt('Five people are tied to the track ahead...');
            this.setSpaceHintVisible(false);

        } else if (trolleyZ > FORK_Z + 40) {
            this.setPrompt('A fork approaches — one person on the left track.');
            this.setSpaceHintVisible(true);

        } else if (trolleyZ > FORK_Z + 2) {
            if (!decisionMade) {
                this.setPrompt('⚠  LAST CHANCE  ⚠', '#ff2200');
                this.setSpaceHintVisible(true);
            } else {
                const text = leverPulled ? 'Lever pulled. Diverting…' : 'No action taken.';
                const color = leverPulled ? '#2ecc71' : '#e74c3c';
                this.setPrompt(text, color);
                this.setSpaceHintVisible(false);
            }
        } else {
            this.setPrompt('', '#fff');
            this.setSpaceHintVisible(false);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTCOME  SCREEN
// ─────────────────────────────────────────────────────────────────────────────
class OutcomeScreen {
    constructor() {
        this.overlay = document.getElementById('outcome-overlay');
        this.titleEl = document.getElementById('outcome-title');
        this.bodyEl = document.getElementById('outcome-body');
    }

    show(leverWasPulled) {
        this.overlay.classList.add('show');

        if (leverWasPulled) {
            this.titleEl.style.color = '#e8d5b0';
            this.titleEl.textContent = 'YOU PULLED THE LEVER';
            this.bodyEl.innerHTML = `
        The trolley veered onto the left track.<br><br>
        <strong style="color:#e74c3c">1 person</strong> was struck and killed.<br><br>
        You acted. You chose who lived and who died. The numbers favour you —
        but you made an active decision to end a life. Can philosophy absolve you of that?
      `;
        } else {
            this.titleEl.style.color = '#e74c3c';
            this.titleEl.textContent = 'YOU DID NOTHING';
            this.bodyEl.innerHTML = `
        The trolley continued straight ahead.<br><br>
        <strong style="color:#e74c3c">5 people</strong> were struck and killed.<br><br>
        You stood at the lever and did not act. Is the distinction between action
        and inaction morally meaningful — or just a comfort we tell ourselves?
      `;
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME  (orchestrates everything)
// ─────────────────────────────────────────────────────────────────────────────
class Game {
    constructor() {
        // Core Three.js setup
        this.sceneSetup = new SceneSetup();
        const {
            scene,
            camera
        } = this.sceneSetup;

        // Track splines
        this.trackSplines = new TrackSplines();

        // Build track meshes (both branches are always visible)
        new TrackMesh(scene, this.trackSplines.straightCurve);
        new TrackMesh(scene, this.trackSplines.divertCurve);

        // Environment
        new Scenery(scene);

        // Trolley (contains cockpit, camera, smoke)
        this.trolley = new Trolley(scene, camera);

        // Lighting (needs trolleyPivot reference for headlamp updates)
        this.lighting = new SceneLighting(scene, this.trolley.pivot);

        // People
        this.peopleGroups = new PeopleGroups(scene);

        // UI
        this.hud = new HUD();
        this.outcomeScreen = new OutcomeScreen();

        // Physics state
        this.currentSpeed = 0;
        this.travelDistance = 0;

        // Decision state
        this.leverPulled = false;
        this.decisionMade = false;

        // Game flow state
        this.gameState = 'title'; // 'title' | 'running' | 'outcome-pending' | 'done'
        this.outcomeTimer = 0;

        this.clock = new THREE.Clock();
        this._bindInput();
        this._animate();
    }

    _bindInput() {
        window.addEventListener('keydown', e => {
            if (e.code !== 'Space') return;
            e.preventDefault();
            if (this.gameState === 'title') {
                this._startGame();
                return;
            }

            const pastFork = this.trolley.getWorldPosition().z < FORK_Z;
            if (this.gameState === 'running' && !this.decisionMade && !pastFork) {
                this.leverPulled = true;
                this.decisionMade = true;
            }
        });
    }

    _startGame() {
        const titleScreen = document.getElementById('title-screen');
        titleScreen.style.opacity = '0';
        setTimeout(() => titleScreen.style.display = 'none', 1200);
        this.gameState = 'running';
        this.hud.setPrompt('Five people are tied to the track ahead...');
    }

    _update(deltaTime) {
        const elapsedTime = this.clock.getElapsedTime();

        if (this.gameState === 'running') {
            // Accelerate toward max speed
            this.currentSpeed = Math.min(
                MAX_SPEED,
                this.currentSpeed + ACCELERATION * (1 + this.currentSpeed * 0.045)
            );
            this.travelDistance += this.currentSpeed * deltaTime;

            const speedNormalized = this.currentSpeed / MAX_SPEED;

            // Choose which track to follow
            const activeCurve = this.leverPulled ?
                this.trackSplines.divertCurve :
                this.trackSplines.straightCurve;

            const {
                curvePos,
                yaw
            } = this.trolley.moveTo(activeCurve, this.travelDistance);
            const trolleyWorldPos = this.trolley.getWorldPosition();

            this.trolley.update(deltaTime, speedNormalized, this.leverPulled, elapsedTime);
            this.lighting.updateHeadlamp(trolleyWorldPos, yaw);
            this.lighting.updateDangerLights(curvePos.z, this.leverPulled, elapsedTime);
            this.peopleGroups.checkCollisionsAndUpdate(trolleyWorldPos, this.leverPulled);
            this.hud.updatePromptForTrolleyPosition(curvePos.z, this.decisionMade, this.leverPulled);

            // Trigger outcome once trolley is well past the people
            if (curvePos.z < -160) {
                this.gameState = 'outcome-pending';
                this.hud.setPrompt('');
            }
        }

        if (this.gameState === 'outcome-pending') {
            this.outcomeTimer += deltaTime;
            if (this.outcomeTimer > 0.1) {
                this.outcomeScreen.show(this.leverPulled);
                this.gameState = 'done';
            }
        }
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        const deltaTime = Math.min(this.clock.getDelta(), 0.05);

        // Don't simulate anything until the game starts
        if (this.gameState !== 'title') {
            this._update(deltaTime);
        }

        this.sceneSetup.render();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Start it up
// ─────────────────────────────────────────────────────────────────────────────
const game = new Game();
