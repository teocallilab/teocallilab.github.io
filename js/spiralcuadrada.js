

		function createPrehispanicSpiral(canvasId, size = 100, scale = 1) {
		const canvas = document.getElementById(canvasId);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		camera.position.z = 200 / scale;

		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.setSize(size, size);
		renderer.setPixelRatio(window.devicePixelRatio);

		const group = new THREE.Group();
		group.scale.set(scale, scale, scale);
		scene.add(group);

		const material = new THREE.LineBasicMaterial({
			color: 0xac1122,
			transparent: true,
			opacity: 1
		});

		const points = [];
		const steps = 60;
		let x = 0, y = 0;
		let step = 10;
		let dir = 0;

		for (let i = 1; i <= steps; i++) {
			switch (dir % 4) {
			case 0: x += step; break;
			case 1: y += step; break;
			case 2: x -= step; break;
			case 3: y -= step; break;
			}
			points.push(new THREE.Vector3(x, y, 0));
			if (i % 2 === 0) step += 10;
			dir++;
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		geometry.setDrawRange(0, 0);
		const line = new THREE.Line(geometry, material);
		group.add(line);

		let drawCount = 0;
		const maxDraw = points.length;

		function animate() {
			requestAnimationFrame(animate);
			if (drawCount < maxDraw) {
			drawCount += 0.5;
			geometry.setDrawRange(0, Math.floor(drawCount));
			}
			group.rotation.z += 0.0025;
			renderer.render(scene, camera);
		}

		animate();
		}
		createPrehispanicSpiral("spiralCanvas",60);
		createPrehispanicSpiral("spiralCanvas2", 370);