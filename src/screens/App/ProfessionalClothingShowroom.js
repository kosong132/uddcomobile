import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced HTML template for the WebView with Three.js content
const threeJSTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>3D Clothing Viewer</title>
  <style>
    body { 
      margin: 0; 
      overflow: hidden; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    canvas { 
      display: block; 
      width: 100%; 
      height: 100%; 
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .loading-screen {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 18px;
      z-index: 1000;
    }
    .spinner {
      border: 3px solid rgba(255,255,255,0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading-screen" id="loadingScreen">
    <div>
      <div class="spinner"></div>
      <div>Loading 3D Model...</div>
    </div>
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  <script>
    let scene, camera, renderer, shirt, isRotating = false;
    let zoom = 1;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    let isDragging = false;
    
    const roomEnvironments = {
      modern: {
        backgroundColor: '#2c3540',
        floorColor: '#34495e',
        wallColor: '#3d4851',
        lightIntensity: 1.2,
        ambientIntensity: 0.4,
        fogColor: '#2c3540'
      },
      bright: {
        backgroundColor: '#f8f9fa',
        floorColor: '#e9ecef',
        wallColor: '#ffffff',
        lightIntensity: 1.8,
        ambientIntensity: 0.7,
        fogColor: '#f0f0f0'
      }
    };
    let selectedRoom = 'modern';

    function init() {
      // Hide loading screen after a moment
      setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
      }, 1500);

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(roomEnvironments[selectedRoom].backgroundColor);
      scene.fog = new THREE.Fog(roomEnvironments[selectedRoom].fogColor, 8, 25);

      // Camera with better positioning
      camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      camera.position.set(0, 1, 6);
      camera.lookAt(0, 0, 0);

      // Enhanced renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      document.body.appendChild(renderer.domElement);

      // Enhanced lighting
      setupLights();
      setupEnvironment();
      createEnhancedShirt();
      setupControls();

      // Handle window resize
      window.addEventListener('resize', onWindowResize);

      // Start animation loop
      animate();
    }
    function handleMessage(event) {
      try {
        console.log('Received message:', event.data);
        const data = JSON.parse(event.data);
        
        switch(data.type) {
          case 'SET_ROOM':
            console.log('Setting room to:', data.room);
            selectedRoom = data.room;
            if (scene) {
              scene.background = new THREE.Color(roomEnvironments[selectedRoom].backgroundColor);
              scene.fog = new THREE.Fog(roomEnvironments[selectedRoom].fogColor, 8, 25);
              setupLights();
              setupEnvironment();
            }
            break;
            
          case 'SET_ROTATION':
            console.log('Setting rotation to:', data.isRotating);
            isRotating = data.isRotating;
            if (isRotating && shirt) {
              targetRotationX = 0;
              targetRotationY = 0;
            }
            break;
            
          case 'SET_ZOOM':
            console.log('Setting zoom to:', data.zoom);
            zoom = data.zoom;
            break;
            
          case 'RESET_VIEW':
            console.log('Resetting view');
            zoom = 1;
            targetRotationX = 0;
            targetRotationY = 0;
            isRotating = false;
            break;
            
          case 'LOAD_MODEL':
            console.log('Loading model:', data.url);
            // Add GLB loading logic here
            loadCustomModel(data.url);
            break;
            
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    }
    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage);
    function setupLights() {
      // Clear existing lights
      scene.children = scene.children.filter(child => 
        !(child instanceof THREE.DirectionalLight) && 
        !(child instanceof THREE.AmbientLight) && 
        !(child instanceof THREE.HemisphereLight) &&
        !(child instanceof THREE.SpotLight)
      );

      const env = roomEnvironments[selectedRoom];
      
      // Main directional light (key light)
      const mainLight = new THREE.DirectionalLight(0xffffff, env.lightIntensity);
      mainLight.position.set(4, 8, 4);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.camera.left = -10;
      mainLight.shadow.camera.right = 10;
      mainLight.shadow.camera.top = 10;
      mainLight.shadow.camera.bottom = -10;
      mainLight.shadow.bias = -0.0001;
      scene.add(mainLight);

      // Secondary lights for better illumination
      const fillLight = new THREE.DirectionalLight(0xffffff, env.lightIntensity * 0.3);
      fillLight.position.set(-3, 4, 2);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, env.lightIntensity * 0.5);
      rimLight.position.set(0, 3, -6);
      scene.add(rimLight);

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, env.ambientIntensity);
      scene.add(ambientLight);

      // Hemisphere light for bright room
      if (selectedRoom === 'bright') {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);
      }

      // Spotlight for dramatic effect
      const spotlight = new THREE.SpotLight(0xffffff, env.lightIntensity * 0.8);
      spotlight.position.set(0, 10, 0);
      spotlight.target.position.set(0, 0, 0);
      spotlight.angle = Math.PI / 6;
      spotlight.penumbra = 0.3;
      spotlight.decay = 2;
      spotlight.distance = 20;
      spotlight.castShadow = true;
      scene.add(spotlight);
      scene.add(spotlight.target);
    }
function loadCustomModel(url) {
  // Remove existing shirt - MODIFY THIS PART
  if (shirt) {
    scene.remove(shirt);
    shirt = null; // Add this line to clear reference
  }
  
  const loader = new THREE.GLTFLoader();
  loader.load(url, function(gltf) {
    shirt = gltf.scene;
    
    // MODIFY THESE LINES - Better positioning and scaling
    // Calculate bounding box for proper sizing
    const box = new THREE.Box3().setFromObject(shirt);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale to match default shirt size (approximately 3 units tall)
    const targetSize = 3;
    const scale = targetSize / maxDim;
    shirt.scale.set(scale, scale, scale);
    
    // Center the model
    box.setFromObject(shirt);
    const center = box.getCenter(new THREE.Vector3());
    shirt.position.set(-center.x, 0.2 - center.y, -center.z);
    
    scene.add(shirt);
  }, undefined, function(error) {
    console.error('Error loading GLB:', error);
    // REMOVE THIS LINE - don't create fallback default shirt
    // createEnhancedShirt(); 
  });
}
    function setupEnvironment() {
      // Clear existing environment objects
      scene.children = scene.children.filter(child => 
        !child.userData.isEnvironment
      );

      const env = roomEnvironments[selectedRoom];
      
      // Enhanced floor with reflection
      const floorGeometry = new THREE.PlaneGeometry(25, 25);
      const floorMaterial = new THREE.MeshPhysicalMaterial({ 
        color: new THREE.Color(env.floorColor),
        metalness: 0.1,
        roughness: 0.3,
        reflectivity: 0.2,
        transparent: true,
        opacity: 0.9
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -2.5;
      floor.receiveShadow = true;
      floor.userData.isEnvironment = true;
      scene.add(floor);

      // Back wall with subtle texture
      const wallGeometry = new THREE.PlaneGeometry(18, 15);
      const wallMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(env.wallColor),
        transparent: true,
        opacity: 0.95
      });
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(0, 4, -9);
      wall.receiveShadow = true;
      wall.userData.isEnvironment = true;
      scene.add(wall);

      // Enhanced pedestal with better materials
      const pedestalGeometry = new THREE.CylinderGeometry(1.8, 2.2, 0.4, 24);
      const pedestalMaterial = new THREE.MeshPhysicalMaterial({ 
        color: selectedRoom === 'modern' ? 0x2c3e50 : 0xbdc3c7,
        metalness: 0.3,
        roughness: 0.7,
        clearcoat: 0.3,
        clearcoatRoughness: 0.7
      });
      const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
      pedestal.position.set(0, -2.3, 0);
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      pedestal.userData.isEnvironment = true;
      scene.add(pedestal);

      // Add subtle environment particles for atmosphere
      if (selectedRoom === 'modern') {
        createAtmosphereParticles();
      }
    }

    function createAtmosphereParticles() {
      const particleCount = 50;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = Math.random() * 10;
        positions[i + 2] = (Math.random() - 0.5) * 20;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      particleSystem.userData.isEnvironment = true;
      scene.add(particleSystem);
    }

    function createEnhancedShirt() {
      // Remove existing shirt
      if (shirt) {
        scene.remove(shirt);
      }

      const group = new THREE.Group();
      
      // Enhanced shirt body with better geometry
      const bodyGeometry = new THREE.BoxGeometry(2.4, 3.2, 0.5);
      // Round the edges
      bodyGeometry.parameters = { width: 2.4, height: 3.2, depth: 0.5 };
      
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4a90e2,
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.2,
        clearcoatRoughness: 0.8,
        transmission: 0.02
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Enhanced sleeves with better shape
      const sleeveGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.6, 12);
      const sleeveMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4a90e2,
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.2,
        clearcoatRoughness: 0.8
      });
      
      const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      leftSleeve.position.set(-1.45, 0.5, 0);
      leftSleeve.rotation.z = Math.PI / 2;
      leftSleeve.castShadow = true;
      leftSleeve.receiveShadow = true;
      group.add(leftSleeve);

      const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      rightSleeve.position.set(1.45, 0.5, 0);
      rightSleeve.rotation.z = -Math.PI / 2;
      rightSleeve.castShadow = true;
      rightSleeve.receiveShadow = true;
      group.add(rightSleeve);

      // Enhanced collar
      const collarGeometry = new THREE.TorusGeometry(0.8, 0.15, 8, 16, Math.PI);
      const collarMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2c3e50,
        roughness: 0.7,
        metalness: 0.2,
        clearcoat: 0.3
      });
      const collar = new THREE.Mesh(collarGeometry, collarMaterial);
      collar.position.set(0, 1.3, 0.3);
      collar.rotation.x = Math.PI;
      collar.castShadow = true;
      collar.receiveShadow = true;
      group.add(collar);

      // Enhanced buttons with better materials
      const buttonGeometry = new THREE.SphereGeometry(0.08, 12, 12);
      const buttonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      
      for (let i = 0; i < 6; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0.15, 1.2 - i * 0.4, 0.26);
        button.castShadow = true;
        button.receiveShadow = true;
        group.add(button);
      }

      // Add shirt details (pocket)
      const pocketGeometry = new THREE.PlaneGeometry(0.6, 0.6);
      const pocketMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3d7bc6,
        roughness: 0.8,
        metalness: 0.05
      });
      const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
      pocket.position.set(-0.6, 0.3, 0.26);
      pocket.castShadow = true;
      pocket.receiveShadow = true;
      group.add(pocket);

      shirt = group;
      shirt.position.y = 0.1;
      scene.add(shirt);
    }

    function setupControls() {
      let previousMousePosition = { x: 0, y: 0 };
      
      // Mouse/touch controls
      renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging && shirt) {
          const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
          };

          targetRotationY += deltaMove.x * 0.01;
          targetRotationX += deltaMove.y * 0.01;
          
          previousMousePosition = { x: e.clientX, y: e.clientY };
        }
      });

      renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch controls
      renderer.domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
          };
        }
      });

      renderer.domElement.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1 && shirt) {
          const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
          };

          targetRotationY += deltaMove.x * 0.01;
          targetRotationX += deltaMove.y * 0.01;
          
          previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
          };
        }
      });

      renderer.domElement.addEventListener('touchend', () => {
        isDragging = false;
      });
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      
      if (shirt) {
        // Auto rotation
        if (isRotating) {
          shirt.rotation.y += 0.008;
        }
        
        // Manual rotation with smooth interpolation
        if (!isRotating) {
          shirt.rotation.y += (targetRotationY - shirt.rotation.y) * 0.1;
          shirt.rotation.x += (targetRotationX - shirt.rotation.x) * 0.1;
          
          // Limit vertical rotation
          shirt.rotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, shirt.rotation.x));
        }
        
        // Subtle floating animation
        shirt.position.y = -3 + Math.sin(Date.now() * 0.001) * 0.05;
      }
      
      // Update camera zoom
      camera.position.z = 24 / zoom;
      
      renderer.render(scene, camera);
    }

    // Handle messages from React Native
    window.addEventListener('message', function(event) {
      const data = JSON.parse(event.data);
      
      if (data.type === 'SET_ROOM') {
        selectedRoom = data.room;
        scene.background = new THREE.Color(roomEnvironments[selectedRoom].backgroundColor);
        scene.fog = new THREE.Fog(roomEnvironments[selectedRoom].fogColor, 8, 25);
        setupLights();
        setupEnvironment();
      }
      else if (data.type === 'SET_ROTATION') {
        isRotating = data.isRotating;
        if (isRotating) {
          targetRotationX = 0;
          targetRotationY = 0;
        }
      }
      else if (data.type === 'SET_ZOOM') {
        zoom = data.zoom;
      }
      else if (data.type === 'RESET_VIEW') {
        zoom = 1;
        targetRotationX = 0;
        targetRotationY = 0;
        isRotating = false;
      }
    });

    // Initialize when loaded
    window.onload = init;
  </script>
</body>
</html>
`;

const ProfessionalClothingShowroom = () => {
  const route = useRoute();
  const { productId, modelUrl, productName } = route.params || {};
  const [isRotating, setIsRotating] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('modern');
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clothingData, setClothingData] = useState({
    name: productName || 'Professional Shirt',
    material: 'Premium Cotton',
    environment: 'Modern Studio',
    fabric: '100% Organic Cotton',
    modelUrl: modelUrl || null
  });

  const webViewRef = useRef(null);

  // Professional showroom environments
  const roomEnvironments = {
    modern: {
      name: 'Modern Studio',
      backgroundColor: '#2c3540',
      description: 'Dark, professional atmosphere'
    },
    bright: {
      name: 'Bright Showroom',
      backgroundColor: '#f8f9fa',
      description: 'Clean, bright environment'
    }
  };

  // Send commands to WebView
  const sendToWebView = (data) => {
    if (webViewRef.current) {
      try {
        const message = JSON.stringify(data);
        webViewRef.current.postMessage(message);
        console.log('Sent to WebView:', message);
      } catch (error) {
        console.error('Error sending to WebView:', error);
      }
    } else {
      console.warn('WebView ref not available');
    }
  };
  const switchRoom = (newRoom) => {
    setSelectedRoom(newRoom);
    setTimeout(() => {
      sendToWebView({ type: 'SET_ROOM', room: newRoom });
    }, 100);
  };

  // Update zoom
  const updateZoom = (newZoom) => {
    const clampedZoom = Math.max(0.5, Math.min(3, newZoom));
    setZoom(clampedZoom);
    setTimeout(() => {
      sendToWebView({ type: 'SET_ZOOM', zoom: clampedZoom });
    }, 50);
  };
  //rotation toggle
const toggleRotation = () => {
    const newRotating = !isRotating;
    setIsRotating(newRotating);
    setTimeout(() => {
      sendToWebView({ type: 'SET_ROTATION', isRotating: newRotating });
    }, 50);
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setIsRotating(false);
    setTimeout(() => {
      sendToWebView({ type: 'RESET_VIEW' });
    }, 50);
  };

  // Update clothing data
  const updateClothingData = (field, value) => {
    setClothingData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Professional Showroom</Text>
          <Text style={styles.subtitle}>Interactive 3D Clothing Display</Text>
        </View>

        {/* Room Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏢 Showroom Environment</Text>
          <View style={styles.roomSelection}>
            {Object.entries(roomEnvironments).map(([key, room]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.roomButton,
                  selectedRoom === key && styles.roomButtonActive
                ]}
                onPress={() => switchRoom(key)} // Changed from setSelectedRoom
              >

                <View
                  style={[
                    styles.roomColorIndicator,
                    { backgroundColor: room.backgroundColor },
                    selectedRoom === key && styles.roomColorIndicatorActive
                  ]}
                />
                <Text style={[
                  styles.roomButtonText,
                  selectedRoom === key && styles.roomButtonTextActive
                ]}>
                  {room.name}
                </Text>
                <Text style={styles.roomDescription}>
                  {room.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3D Viewer */}
        <View style={styles.section}>
          <View style={styles.viewerContainer}>
            <View style={styles.canvasContainer}>
              <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: threeJSTemplate }}
                style={styles.canvas}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => {
                  setIsLoading(false);
                  // Send initial data after WebView loads
                  setTimeout(() => {
                    sendToWebView({ type: 'SET_ROOM', room: selectedRoom });
                    sendToWebView({ type: 'SET_ROTATION', isRotating });
                    sendToWebView({ type: 'SET_ZOOM', zoom });
                    if (modelUrl) {
                      sendToWebView({ type: 'LOAD_MODEL', url: modelUrl });
                    }
                  }, 1000);
                }}
                onMessage={(event) => {
                  // Handle messages from WebView if needed
                  console.log('WebView message:', event.nativeEvent.data);
                }}
                mixedContentMode="always"
                allowsInlineMediaPlaybook={true}
                mediaPlaybackRequiresUserAction={false}
              />

              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.loadingText}>Loading 3D Model...</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.viewerInstructions}>
            <Text style={styles.instructionText}>
              <Text style={styles.instructionBold}>Drag</Text> to rotate • <Text style={styles.instructionBold}>Controls</Text> below to zoom
            </Text>
            <Text style={styles.instructionSubtext}>
              Professional lighting • Real-time shadows
            </Text>
          </View>
        </View>

        {/* Enhanced Controls */}
        <View style={styles.section}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                isRotating ? styles.controlButtonStop : styles.controlButtonStart
              ]}
              onPress={toggleRotation} // Changed from setIsRotating(!isRotating)
            >
              <Text style={styles.controlButtonText}>
                {isRotating ? '⏹️ Stop Rotate' : '🔄 Auto-Rotate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.controlButtonReset]}
              onPress={resetView}
            >
              <Text style={styles.controlButtonText}>↻ Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={[styles.zoomButton, zoom <= 0.5 && styles.zoomButtonDisabled]}
              onPress={() => updateZoom(zoom - 0.25)} // This stays the same but uses enhanced function
              disabled={zoom <= 0.5}
            >
              <Text style={styles.zoomButtonText}>🔍‒ Zoom Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoomButton, zoom >= 3 && styles.zoomButtonDisabled]}
              onPress={() => updateZoom(zoom + 0.25)} // This stays the same but uses enhanced function
              disabled={zoom >= 3}
            >
              <Text style={styles.zoomButtonText}>🔍+ Zoom In</Text>
            </TouchableOpacity>
          </View>
        </View>
<View style={styles.debugInfo}>
  <Text style={styles.debugText}>
    Status: {isLoading ? 'Loading...' : 'Ready'} | 
    Room: {selectedRoom} | 
    Zoom: {Math.round(zoom * 100)}% | 
    Rotate: {isRotating ? 'ON' : 'OFF'}
  </Text>
  {modelUrl && (
    <Text style={styles.debugText}>Model: {modelUrl.substring(0, 50)}...</Text>
  )}
</View>
        {/* Product Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Product Information</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <TextInput
                style={styles.detailInput}
                value={clothingData.name}
                onChangeText={(text) => updateClothingData('name', text)}
                placeholder="Enter product name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Material:</Text>
              <TextInput
                style={styles.detailInput}
                value={clothingData.material}
                onChangeText={(text) => updateClothingData('material', text)}
                placeholder="Enter material type"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Environment:</Text>
              <View style={styles.environmentBadge}>
                <Text style={styles.environmentText}>{clothingData.environment}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fabric:</Text>
              <TextInput
                style={styles.detailInput}
                value={clothingData.fabric}
                onChangeText={(text) => updateClothingData('fabric', text)}
                placeholder="Enter fabric details"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  roomSelection: {
    flexDirection: 'row',
    gap: 12,
  },
  roomButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  roomButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  roomColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  roomColorIndicatorActive: {
    borderColor: '#3b82f6',
  },
  roomButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  roomButtonTextActive: {
    color: '#3b82f6',
  },
  roomDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  viewerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  canvasContainer: {
    position: 'relative',
    height: screenHeight * 0.5,
    backgroundColor: '#2c3540',
    borderRadius: 16,
  },
  canvas: {
    flex: 1,
    borderRadius: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 53, 64, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  viewerInstructions: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionBold: {
    fontWeight: '700',
    color: '#1f2937',
  },
  instructionSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonStart: {
    backgroundColor: '#10b981',
  },
  controlButtonStop: {
    backgroundColor: '#ef4444',
  },
  controlButtonReset: {
    backgroundColor: '#6b7280',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zoomButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  zoomButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  zoomIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
    debugInfo: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  debugText: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
  },

  detailsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 100,
  },
  detailInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  environmentBadge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    flex: 1,
  },
  environmentText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
  },
});
export default ProfessionalClothingShowroom;