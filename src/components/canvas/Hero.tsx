'use client'

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CONFIG = {
    PARTICLE_COUNT: 1000,
    BROWNIAN_STRENGTH: 0.01,
    ATTRACTION_STRENGTH: 0.001,
    DAMPING: 0.98,
    PARTICLE_SIZE: 0.04,
    Z_DEPTH: 4, // How deep particles spread in Z
};

interface Particle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
}

export default function Hero() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const mouse3D = useRef(new THREE.Vector3(0, 0, 0));
    const isClicked = useRef(false);
    const clickPos = useRef(new THREE.Vector3());

    const { viewport, size } = useThree();

    // Half-bounds based on viewport
    const boundsX = viewport.width / 2;
    const boundsY = viewport.height / 2;

    // Track mouse position globally
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / size.width) * 2 - 1;
            const y = -(e.clientY / size.height) * 2 + 1;
            mouse3D.current.set(
                x * boundsX,
                y * boundsY,
                0
            );
        };

        const handleClick = (e: MouseEvent) => {
            const x = (e.clientX / size.width) * 2 - 1;
            const y = -(e.clientY / size.height) * 2 + 1;
            clickPos.current.set(
                x * boundsX,
                y * boundsY,
                0
            );
            isClicked.current = true;
            setTimeout(() => { isClicked.current = false; }, 1);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, [boundsX, boundsY, size]);

    const particles = useMemo<Particle[]>(() => {
        const temp: Particle[] = [];
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            // Initialize with normalized positions, will use current bounds
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * 2, // -1 to 1, will scale by boundsX
                (Math.random() - 0.5) * 2, // -1 to 1, will scale by boundsY
                (Math.random() - 0.5) * CONFIG.Z_DEPTH
            );
            temp.push({
                position: position,
                velocity: new THREE.Vector3(0, 0, 0),
            });
        }
        return temp;
    }, []);

    // Scale initial positions on first frame
    const initialized = useRef(false);
    
    const tempObject = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!meshRef.current) return;

        // Scale particles to viewport on first run
        if (!initialized.current) {
            particles.forEach((particle) => {
                particle.position.x *= boundsX;
                particle.position.y *= boundsY;
            });
            initialized.current = true;
        }

        particles.forEach((particle, index) => {
            // Brownian motion
            particle.velocity.x += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH;
            particle.velocity.y += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH;
            particle.velocity.z += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH * 0.5;

            // Mouse attraction
            const toMouse = mouse3D.current.clone().sub(particle.position);
            const distance = toMouse.length();

            if (distance > 0.1) {
                const force = Math.min(
                    CONFIG.ATTRACTION_STRENGTH / (distance * distance),
                    0.01
                );
                toMouse.normalize().multiplyScalar(force);
                particle.velocity.add(toMouse);
            }

            // Click repulsion (2D distance)
            if (isClicked.current) {
                const dx = particle.position.x - clickPos.current.x;
                const dy = particle.position.y - clickPos.current.y;
                const clickDist2D = Math.sqrt(dx * dx + dy * dy);

                if (clickDist2D > 0.1 && clickDist2D < Math.max(boundsX, boundsY)) {
                    const force = 0.8 / (clickDist2D + 0.5);
                    particle.velocity.x += (dx / clickDist2D) * force;
                    particle.velocity.y += (dy / clickDist2D) * force;
                    particle.velocity.z += (Math.random() - 0.5) * force * 0.3;
                }
            }

            // Damping
            particle.velocity.multiplyScalar(CONFIG.DAMPING);

            // Update position
            particle.position.add(particle.velocity);

            // Boundaries (use viewport-based bounds)
            if (Math.abs(particle.position.x) > boundsX) {
                particle.velocity.x *= -0.5;
                particle.position.x *= 0.99;
            }
            if (Math.abs(particle.position.y) > boundsY) {
                particle.velocity.y *= -0.5;
                particle.position.y *= 0.99;
            }
            if (Math.abs(particle.position.z) > CONFIG.Z_DEPTH / 2) {
                particle.velocity.z *= -0.5;
                particle.position.z *= 0.99;
            }

            // Update matrix
            tempObject.position.copy(particle.position);
            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(index, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, CONFIG.PARTICLE_COUNT]}
        >
            <sphereGeometry args={[CONFIG.PARTICLE_SIZE, 8, 8]} />
            <meshBasicMaterial color="#F0F0F0" transparent opacity={0.8} />
        </instancedMesh>
    );
}