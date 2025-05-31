
		import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

		const canvas = document.getElementById("squareSpiralCanvas");
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 300;

		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		const colors = [0xac1122, 0x96789f, 0x535353];

		function createSquareSpiral(xOffset, yOffset, scale = 1, color = 0xac1122) {
			const points = [];
			let x = 0, y = 0, step = 10 * scale, dir = 0;
			for (let i = 1; i <= 60; i++) {
			switch (dir % 4) {
				case 0: x += step; break;
				case 1: y += step; break;
				case 2: x -= step; break;
				case 3: y -= step; break;
			}
			points.push(new THREE.Vector3(x + xOffset, y + yOffset, 0));
			if (i % 2 === 0) step += 10 * scale;
			dir++;
			}

			const geometry = new THREE.BufferGeometry().setFromPoints(points);
			geometry.setDrawRange(0, points.length);

			const material = new THREE.LineBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.3
			});

			return new THREE.Line(geometry, material);
		}

		const group = new THREE.Group();
		const spacing = 150;

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
			const color = colors[Math.floor(Math.random() * colors.length)];
			const spiral = createSquareSpiral(x * spacing, y * spacing, 0.5 + Math.random() * 0.5, color);
			group.add(spiral);
			}
		}

		scene.add(group);

		window.addEventListener("resize", () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});

		function animate() {
			requestAnimationFrame(animate);
			group.rotation.z += 0.001;
			group.rotation.x += 0.0005;
			renderer.render(scene, camera);
		}

		animate();
