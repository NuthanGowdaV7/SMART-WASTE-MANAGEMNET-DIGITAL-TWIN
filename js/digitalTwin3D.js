/**
 * EcoTwin AI - 3D Digital Twin World
 * Three.js Spatial Campus Simulation with Live Telemetry, Smart Bins, and Autonomous Truck Routing
 */

class CampusDigitalTwin {
  constructor(canvasContainerId, onBinSelectCallback) {
    this.container = document.getElementById(canvasContainerId);
    this.onBinSelect = onBinSelectCallback;
    this.binObjects = new Map();
    this.routeLine = null;
    this.truck = null;
    this.truckTargetIndex = 0;
    this.truckPath = [];
    this.isTruckMoving = true;
    this.clock = new THREE.Clock();

    this.initScene();
    this.buildCampusEnvironment();
    this.buildSmartBins();
    this.buildAutonomousTruck();
    this.calculateDynamicRoute();
    this.setupInteractivity();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.009);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 95, 115);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.1;
      this.controls.minDistance = 25;
      this.controls.maxDistance = 220;
      this.controls.target.set(0, 5, 0);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa5f3fc, 1.5);
    dirLight.position.set(60, 100, 60);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 250;
    dirLight.shadow.camera.left = -90;
    dirLight.shadow.camera.right = 90;
    dirLight.shadow.camera.top = 90;
    dirLight.shadow.camera.bottom = -90;
    this.scene.add(dirLight);

    const cyberPointLight = new THREE.PointLight(0x10b981, 2.5, 150);
    cyberPointLight.position.set(-20, 25, -20);
    this.scene.add(cyberPointLight);
  }

  buildCampusEnvironment() {
    // Ground Grid & Plane
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0c1324,
      roughness: 0.85,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Glowing Cyber Grid
    const gridHelper = new THREE.GridHelper(240, 48, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0.05;
    this.scene.add(gridHelper);

    // Campus Roads
    this.roadNetworkGroup = new THREE.Group();
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x161e31, roughness: 0.9 });
    const roadLines = [
      { x: 0, z: 0, w: 200, h: 6, rot: 0 },
      { x: 0, z: 0, w: 6, h: 200, rot: 0 },
      { x: 0, z: -35, w: 180, h: 5, rot: 0 },
      { x: 0, z: 35, w: 180, h: 5, rot: 0 },
      { x: -35, z: 0, w: 5, h: 180, rot: 0 },
      { x: 35, z: 0, w: 5, h: 180, rot: 0 }
    ];

    roadLines.forEach(r => {
      const roadGeo = new THREE.PlaneGeometry(r.w, r.h);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(r.x, 0.08, r.z);
      road.receiveShadow = true;
      this.roadNetworkGroup.add(road);
    });
    this.scene.add(this.roadNetworkGroup);

    // Campus Buildings
    ECO_DATA.buildings.forEach(b => {
      const bldgGroup = new THREE.Group();
      bldgGroup.position.set(b.x, 0, b.z);

      // Main structure
      const geo = new THREE.BoxGeometry(b.width, b.height, b.depth);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.4,
        metalness: 0.6
      });
      const bldg = new THREE.Mesh(geo, mat);
      bldg.position.y = b.height / 2;
      bldg.castShadow = true;
      bldg.receiveShadow = true;
      bldgGroup.add(bldg);

      // Glowing roof accent edge
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: b.accentColor, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
      wireframe.position.y = b.height / 2;
      bldgGroup.add(wireframe);

      // Rooftop Helipad / Solar Array
      const solarGeo = new THREE.BoxGeometry(b.width * 0.7, 0.4, b.depth * 0.7);
      const solarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
      const solar = new THREE.Mesh(solarGeo, solarMat);
      solar.position.y = b.height + 0.2;
      bldgGroup.add(solar);

      // 3D holographic title marker
      this.addBuildingLabel(b.name, b.x, b.height + 4, b.z);

      this.scene.add(bldgGroup);
    });
  }

  addBuildingLabel(text, x, y, z) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect(0, 0, 256, 64, 8);
    ctx.fill();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.roundRect(0, 0, 256, 64, 8);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, y, z);
    sprite.scale.set(16, 4, 1);
    this.scene.add(sprite);
  }

  buildSmartBins() {
    this.binsGroup = new THREE.Group();

    ECO_DATA.bins.forEach(binData => {
      const binStation = new THREE.Group();
      binStation.position.set(binData.coords.x, 0, binData.coords.z);
      binStation.userData = { binId: binData.id, binData: binData };

      // Outer Smart Bin Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.5, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.8, roughness: 0.3 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.25;
      base.castShadow = true;
      binStation.add(base);

      // Glass Container Chassis (Transparent)
      const glassGeo = new THREE.CylinderGeometry(1.3, 1.3, 3.2, 16);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x94A3B8,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = 2.1;
      binStation.add(glass);

      // Inner Waste Volume (scales with fill percentage)
      const fillPct = binData.fillLevel / 100;
      const fillHeight = Math.max(0.1, 3.0 * fillPct);
      const fillGeo = new THREE.CylinderGeometry(1.2, 1.2, fillHeight, 16);
      
      let fillColor = 0x059669; // Forest green
      if (binData.fillLevel >= 80) fillColor = 0xDC2626; // Red
      else if (binData.fillLevel >= 60) fillColor = 0xD97706; // Amber

      const fillMat = new THREE.MeshStandardMaterial({
        color: fillColor,
        roughness: 0.7,
        emissive: fillColor,
        emissiveIntensity: binData.fillLevel >= 80 ? 0.35 : 0.05
      });
      const fillMesh = new THREE.Mesh(fillGeo, fillMat);
      fillMesh.position.y = 0.5 + fillHeight / 2;
      binStation.add(fillMesh);
      binStation.userData.fillMesh = fillMesh;

      // Smart Lid with Solar Cell & Camera Sensor Dome
      const lidGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 16);
      const lidMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.2 });
      const lid = new THREE.Mesh(lidGeo, lidMat);
      lid.position.y = 3.8;
      binStation.add(lid);

      // Sensor Camera Dome
      const domeGeo = new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, emissive: 0x2563EB, emissiveIntensity: 0.8 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 4.0;
      binStation.add(dome);

      // Status Ring Light (LED Pulse)
      const ringGeo = new THREE.TorusGeometry(1.4, 0.1, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: fillColor });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 3.65;
      binStation.add(ring);
      binStation.userData.statusRing = ring;

      // Floating Holographic Tag
      const tagSprite = this.createBinStatusSprite(binData);
      tagSprite.position.set(0, 6.2, 0);
      binStation.add(tagSprite);
      binStation.userData.tagSprite = tagSprite;

      this.scene.add(binStation);
      this.binObjects.set(binData.id, binStation);
    });
  }

  createBinStatusSprite(binData) {
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');

    const isCritical = binData.fillLevel >= 80;
    const isWarning = binData.fillLevel >= 60 && binData.fillLevel < 80;

    const badgeColor = isCritical ? '#DC2626' : isWarning ? '#D97706' : '#059669';

    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect(0, 0, 180, 70, 8);
    ctx.fill();
    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 2.5;
    ctx.roundRect(0, 0, 180, 70, 8);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${binData.id} • ${binData.fillLevel}%`, 90, 28);

    ctx.fillStyle = badgeColor;
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(binData.category.split('/')[0], 90, 52);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(7, 2.7, 1);
    return sprite;
  }

  buildAutonomousTruck() {
    this.truck = new THREE.Group();

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(3.5, 1.2, 6.5);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 1.2;
    chassis.castShadow = true;
    this.truck.add(chassis);

    // Cab
    const cabGeo = new THREE.BoxGeometry(3.2, 1.6, 2.2);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 2.2, 1.8);
    this.truck.add(cab);

    // Cargo Waste Compactor Box
    const compactorGeo = new THREE.BoxGeometry(3.4, 2.2, 3.8);
    const compactorMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5, metalness: 0.4 });
    const compactor = new THREE.Mesh(compactorGeo, compactorMat);
    compactor.position.set(0, 2.4, -1.2);
    this.truck.add(compactor);

    // Wheels (4)
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const wheelPositions = [
      { x: -1.8, z: 2 },
      { x: 1.8, z: 2 },
      { x: -1.8, z: -2 },
      { x: 1.8, z: -2 }
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.6, pos.z);
      wheel.castShadow = true;
      this.truck.add(wheel);
    });

    // Amber Rotating Hazard Light
    const beaconGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 3.2, 1.8);
    this.truck.add(beacon);
    this.truck.userData.beacon = beacon;

    // Start position
    this.truck.position.set(-10, 0, -45);
    this.scene.add(this.truck);
  }

  calculateDynamicRoute() {
    // Find all bins that need collection (Fill Level >= 75%)
    const urgentBins = ECO_DATA.bins
      .filter(b => b.fillLevel >= 75)
      .sort((a, b) => b.fillLevel - a.fillLevel);

    // If none are critical, fallback to top 3 fullest bins
    const targetBins = urgentBins.length > 0
      ? urgentBins
      : [...ECO_DATA.bins].sort((a, b) => b.fillLevel - a.fillLevel).slice(0, 3);

    // Build path coordinates connecting truck -> target bins -> depot
    const points = [
      new THREE.Vector3(this.truck.position.x, 0.8, this.truck.position.z)
    ];

    targetBins.forEach(b => {
      points.push(new THREE.Vector3(b.coords.x, 0.8, b.coords.z));
    });
    // Return to transit hub depot
    points.push(new THREE.Vector3(-10, 0.8, -45));

    this.truckPath = points;
    this.truckTargetIndex = 0;

    // Remove old route line
    if (this.routeLine) {
      this.scene.remove(this.routeLine);
      this.routeLine.geometry.dispose();
    }

    // Draw glowing dynamic laser path
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(80);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x06b6d4,
      dashSize: 2,
      gapSize: 1,
      linewidth: 3
    });
    this.routeLine = new THREE.Line(lineGeo, lineMat);
    this.routeLine.computeLineDistances();
    this.scene.add(this.routeLine);
  }

  setupInteractivity() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.container.addEventListener('click', (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      for (let hit of intersects) {
        let curr = hit.object;
        while (curr.parent && curr.parent !== this.scene) {
          if (curr.userData && curr.userData.binId) {
            this.selectBin(curr.userData.binId);
            return;
          }
          curr = curr.parent;
        }
      }
    });
  }

  selectBin(binId) {
    const binData = ECO_DATA.bins.find(b => b.id === binId);
    if (!binData) return;

    // Smoothly focus camera towards bin
    if (this.controls) {
      const targetPos = new THREE.Vector3(binData.coords.x, 15, binData.coords.z + 30);
      gsapAnimate(this.camera.position, targetPos, 1.2);
      gsapAnimate(this.controls.target, new THREE.Vector3(binData.coords.x, 3, binData.coords.z), 1.2);
    }

    if (this.onBinSelect) {
      this.onBinSelect(binData);
    }
  }

  focusCameraPreset(preset) {
    if (!this.controls) return;
    if (preset === 'campus') {
      gsapAnimate(this.camera.position, new THREE.Vector3(0, 95, 115), 1.2);
      gsapAnimate(this.controls.target, new THREE.Vector3(0, 5, 0), 1.2);
    } else if (preset === 'foodcourt') {
      gsapAnimate(this.camera.position, new THREE.Vector3(-35, 25, 10), 1.2);
      gsapAnimate(this.controls.target, new THREE.Vector3(-35, 3, -25), 1.2);
    } else if (preset === 'tech') {
      gsapAnimate(this.camera.position, new THREE.Vector3(45, 30, 50), 1.2);
      gsapAnimate(this.controls.target, new THREE.Vector3(45, 5, 15), 1.2);
    } else if (preset === 'overhead') {
      gsapAnimate(this.camera.position, new THREE.Vector3(0, 160, 5), 1.2);
      gsapAnimate(this.controls.target, new THREE.Vector3(0, 0, 0), 1.2);
    }
  }

  updateBinTelemetryVisual(binId) {
    const binData = ECO_DATA.bins.find(b => b.id === binId);
    const station = this.binObjects.get(binId);
    if (!binData || !station) return;

    const fillPct = binData.fillLevel / 100;
    const fillHeight = Math.max(0.1, 3.0 * fillPct);

    // Update fill mesh height & pos
    if (station.userData.fillMesh) {
      station.userData.fillMesh.geometry.dispose();
      station.userData.fillMesh.geometry = new THREE.CylinderGeometry(1.2, 1.2, fillHeight, 16);
      station.userData.fillMesh.position.y = 0.5 + fillHeight / 2;

      let color = 0x10b981;
      if (binData.fillLevel >= 80) color = 0xef4444;
      else if (binData.fillLevel >= 60) color = 0xf59e0b;

      station.userData.fillMesh.material.color.setHex(color);
      station.userData.fillMesh.material.emissive.setHex(color);
    }

    // Update Ring LED
    if (station.userData.statusRing) {
      let color = 0x10b981;
      if (binData.fillLevel >= 80) color = 0xef4444;
      else if (binData.fillLevel >= 60) color = 0xf59e0b;
      station.userData.statusRing.material.color.setHex(color);
    }

    // Refresh Sprite Tag
    if (station.userData.tagSprite) {
      station.remove(station.userData.tagSprite);
      station.userData.tagSprite.material.map.dispose();
      station.userData.tagSprite.material.dispose();

      const newSprite = this.createBinStatusSprite(binData);
      newSprite.position.set(0, 6.2, 0);
      station.add(newSprite);
      station.userData.tagSprite = newSprite;
    }

    this.calculateDynamicRoute();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (this.controls) this.controls.update();

    // Pulse critical bins
    ECO_DATA.bins.forEach(bin => {
      if (bin.fillLevel >= 80) {
        const station = this.binObjects.get(bin.id);
        if (station && station.userData.statusRing) {
          const pulse = 1.0 + 0.3 * Math.sin(elapsedTime * 6);
          station.userData.statusRing.scale.set(pulse, pulse, pulse);
        }
      }
    });

    // Autonomous Truck Movement along path
    if (this.isTruckMoving && this.truck && this.truckPath.length > 1) {
      const targetPoint = this.truckPath[this.truckTargetIndex];
      const currentPos = this.truck.position;
      const dist = currentPos.distanceTo(targetPoint);

      if (dist < 1.5) {
        // Arrived at waypoint
        const currBin = ECO_DATA.bins.find(b => 
          Math.abs(b.coords.x - targetPoint.x) < 2 && Math.abs(b.coords.z - targetPoint.z) < 2
        );

        if (currBin && currBin.fillLevel >= 75) {
          // Empty bin upon arrival!
          currBin.fillLevel = Math.floor(Math.random() * 8) + 8; // 8-15%
          currBin.currentWeightKg = Number((currBin.capacityKg * (currBin.fillLevel / 100)).toFixed(1));
          currBin.status = "NORMAL";
          currBin.lastEmptied = "Just now by EV-Truck";
          this.updateBinTelemetryVisual(currBin.id);
          if (window.onCampusBinAutoEmptied) {
            window.onCampusBinAutoEmptied(currBin);
          }
        }

        this.truckTargetIndex = (this.truckTargetIndex + 1) % this.truckPath.length;
      } else {
        // Move towards target
        const dir = new THREE.Vector3().subVectors(targetPoint, currentPos).normalize();
        this.truck.position.addScaledVector(dir, delta * 12);

        // Orient truck to face direction of travel
        const angle = Math.atan2(dir.x, dir.z);
        this.truck.rotation.y = angle;
      }

      // Blink beacon
      if (this.truck.userData.beacon) {
        const blink = (Math.sin(elapsedTime * 8) > 0);
        this.truck.userData.beacon.visible = blink;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

// Simple linear interpolation helper for camera transitions
function gsapAnimate(obj, target, durationSec = 1.0) {
  const start = { x: obj.x, y: obj.y, z: obj.z };
  const startTime = performance.now();
  const durMs = durationSec * 1000;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durMs, 1.0);
    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // easeInOutQuad

    obj.x = start.x + (target.x - start.x) * ease;
    obj.y = start.y + (target.y - start.y) * ease;
    obj.z = start.z + (target.z - start.z) * ease;

    if (progress < 1.0) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}
