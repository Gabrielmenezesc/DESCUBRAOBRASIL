// Splash Screen 3D Logic

document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
});

function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const canvas = document.getElementById('splash-canvas');
    if (!splashScreen || !canvas || typeof THREE === 'undefined') return;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001529); // Dark blue background

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // --- Waving Flag Geometry ---
    // A plane with many segments to allow smooth waving
    const segmentsX = 40;
    const segmentsY = 30;
    const geometry = new THREE.PlaneGeometry(6, 4, segmentsX, segmentsY);

    // Load Brazilian Flag Texture (CORS friendly URL)
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = textureLoader.load('https://flagcdn.com/w1280/br.png');

    const material = new THREE.MeshPhongMaterial({
        map: flagTexture,
        side: THREE.DoubleSide,
        shininess: 30
    });

    const flagMesh = new THREE.Mesh(geometry, material);
    scene.add(flagMesh);

    // Initial position of vertices to manipulate later
    const positionAttribute = geometry.attributes.position;
    const initialZ = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        initialZ.push(positionAttribute.getZ(i));
    }

    // --- Animation Loop ---
    let frameId;
    const clock = new THREE.Clock();

    function animate() {
        frameId = requestAnimationFrame(animate);

        const time = clock.getElapsedTime() * 2; // Speed of the wave
        const positionAttribute = geometry.attributes.position;

        // Apply sine wave distortion based on X position and Time
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            // Wave formula: amplitude * sin(frequency * x + time)
            const wave = 0.3 * Math.sin(1.5 * x - time);
            positionAttribute.setZ(i, initialZ[i] + wave);
        }

        positionAttribute.needsUpdate = true;

        // Gentle tilt animation
        flagMesh.rotation.y = Math.sin(time * 0.5) * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Dismiss Splash Screen after 3.5 seconds ---
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        // Wait for CSS transition to finish before cleaning up
        setTimeout(() => {
            splashScreen.style.display = 'none';
            cancelAnimationFrame(frameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        }, 800);
    }, 3500);
}
