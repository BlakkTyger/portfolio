'use client'

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from './WorldlineScene';

// More prominent particle configuration
const CONFIG = {
    PARTICLE_COUNT: 300,
    BROWNIAN_STRENGTH: 0.008,
    Z_DEPTH: 8,
    MIN_SIZE: 0.02,
    MAX_SIZE: 0.06,
    CLICK_RIPPLE_SPEED: 8,
    CLICK_RIPPLE_FORCE: 2,
};

// Brighter, more visible colors
const COLORS = [
    new THREE.Color('#00FF9D'), // Bright cyan
    new THREE.Color('#8F00FF'), // Bright purple
    new THREE.Color('#00D4FF'), // Electric blue
    new THREE.Color('#FF6B00'), // Orange
];

interface Particle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    basePosition: THREE.Vector3;
    phase: number;
    size: number;
    colorIndex: number;
}

interface ClickRipple {
    position: THREE.Vector3;
    radius: number;
    startTime: number;
    maxRadius: number;
}

export default function Hero() {
    useEffect(() => {
        console.log('[Hero] mounted')
    }, [])
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const mouse3D = useRef(new THREE.Vector3(0, 0, 0));
    const clickRipples = useRef<ClickRipple[]>([]);
    const currentOpacity = useRef(0.4);                 //opacity
    const collapseProgress = useRef(0.0);               // collapse animation progress
    const time = useRef(0);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colorArray = useRef<Float32Array | null>(null);

    const { viewport, size } = useThree();
    const boundsX = viewport.width / 2;
    const boundsY = viewport.height / 2;

    // Create particles
    const particles = useMemo<Particle[]>(() => {
        const temp: Particle[] = [];
        
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            // More uniform distribution across entire screen
            let x = (Math.random() - 0.5) * boundsX * 2.5;
            let y = (Math.random() - 0.5) * boundsY * 2.5;
            let z = (Math.random() - 0.5) * CONFIG.Z_DEPTH;
            
            // Push away from center text area (approx 4 units radius)
            let distToCenter = Math.sqrt(x*x + y*y);
            if (distToCenter < 4) {
                let pushScale = 4 / distToCenter;
                x *= pushScale;
                y *= pushScale;
            }
            
            const position = new THREE.Vector3(x, y, z);
            
            temp.push({
                position: position.clone(),
                velocity: new THREE.Vector3(0, 0, 0),
                basePosition: position.clone(),
                phase: Math.random() * Math.PI * 2,
                size: CONFIG.MIN_SIZE + Math.random() * (CONFIG.MAX_SIZE - CONFIG.MIN_SIZE),
                colorIndex: Math.floor(Math.random() * COLORS.length),
            });
        }
        return temp;
    }, [boundsX, boundsY]);

    // Initialize instance colors
    useEffect(() => {
        if (!meshRef.current) return;
        
        colorArray.current = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        particles.forEach((p, i) => {
            const color = COLORS[p.colorIndex];
            colorArray.current![i * 3] = color.r;
            colorArray.current![i * 3 + 1] = color.g;
            colorArray.current![i * 3 + 2] = color.b;
        });
        
        meshRef.current.geometry.setAttribute(
            'color',
            new THREE.InstancedBufferAttribute(colorArray.current, 3)
        );
    }, [particles]);

    // Track mouse and clicks
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / size.width) * 2 - 1;
            const y = -(e.clientY / size.height) * 2 + 1;
            mouse3D.current.set(x * boundsX, y * boundsY, 0);
        };

        const handleClick = (e: MouseEvent) => {
            const x = (e.clientX / size.width) * 2 - 1;
            const y = -(e.clientY / size.height) * 2 + 1;
            
            // Create ripple effect at click position
            clickRipples.current.push({
                position: new THREE.Vector3(x * boundsX, y * boundsY, 0),
                radius: 0,
                startTime: time.current,
                maxRadius: Math.max(boundsX, boundsY) * 1.5,
            });
            
            // Limit stored ripples
            if (clickRipples.current.length > 5) {
                clickRipples.current.shift();
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, [boundsX, boundsY, size]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        
        time.current += delta;

        // ── Dynamic Section Fade & Collapse ──
        let targetOpacity = 0.4;
        let targetCollapse = 0.0;
        
        if (typeof document !== 'undefined') {
            const whoamiEl = document.getElementById('whoami');
            const worldlineEl = document.getElementById('worldline');
            const contactEl = document.getElementById('contact');
            
            if (whoamiEl) {
                const wRect = whoamiEl.getBoundingClientRect();
                const vh = window.innerHeight;
                if (wRect.top < vh * 0.8 && wRect.bottom > vh * 0.2) {
                    targetCollapse = 1.0;
                    targetOpacity = 0.0;
                }
            }
            
            if (worldlineEl) {
                const wRect = worldlineEl.getBoundingClientRect();
                if (wRect.top < window.innerHeight && wRect.bottom > 0) {
                    const fadeProgress = Math.min(1, Math.max(0, (window.innerHeight - wRect.top) / 400));
                    if (fadeProgress > 0) {
                       targetOpacity = 0.4 * (1 - fadeProgress);
                       targetCollapse = fadeProgress;
                    }
                } else if (wRect.bottom <= 0) {
                    targetOpacity = 0.0;
                    targetCollapse = 1.0;
                }
            }
            
            if (contactEl) {
                const cRect = contactEl.getBoundingClientRect();
                if (cRect.top < window.innerHeight) {
                    // Keep the Hero particle field hidden in the Contact section
                    // (the cosmic lattice backdrop carries the visuals there).
                    targetOpacity = 0.0;
                    targetCollapse = 1.0;
                }
            }
        }
        
        currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, 0.08);
        collapseProgress.current = THREE.MathUtils.lerp(collapseProgress.current, targetCollapse, 0.05);
        
        if (materialRef.current) {
            materialRef.current.opacity = currentOpacity.current;
        }

        // Update ripples
        clickRipples.current = clickRipples.current.filter(ripple => {
            ripple.radius += CONFIG.CLICK_RIPPLE_SPEED * delta;
            return ripple.radius < ripple.maxRadius;
        });

        // Update particles
        particles.forEach((particle, index) => {
            // Brownian motion
            particle.velocity.x += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH;
            particle.velocity.y += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH;
            particle.velocity.z += (Math.random() - 0.5) * CONFIG.BROWNIAN_STRENGTH * 0.3;

            // Gentle drift back to base position
            const toBase = new THREE.Vector3().subVectors(particle.basePosition, particle.position);
            particle.velocity.add(toBase.multiplyScalar(0.002));

            // Center repulsion to keep text clear
            const distCenter = Math.sqrt(particle.position.x * particle.position.x + particle.position.y * particle.position.y);
            if (distCenter < 4.5 && Math.abs(particle.position.z) < 2) {
                const repulsion = (4.5 - distCenter) * 0.02;
                const dir = new THREE.Vector3(particle.position.x, particle.position.y, 0).normalize();
                particle.velocity.add(dir.multiplyScalar(repulsion));
            }

            // Mouse attraction (subtle)
            const toMouse = new THREE.Vector3().subVectors(mouse3D.current, particle.position);
            const mouseDist = toMouse.length();
            if (mouseDist < 4 && mouseDist > 0.1) {
                const attraction = (1 - mouseDist / 4) * 0.015;
                toMouse.normalize().multiplyScalar(attraction);
                particle.velocity.add(toMouse);
            }

            // Click ripple effects - particles get pushed outward by expanding ripple
            clickRipples.current.forEach(ripple => {
                const toParticle = new THREE.Vector3().subVectors(particle.position, ripple.position);
                const dist = toParticle.length();
                const rippleWidth = 1.5;
                
                // Particle is hit by ripple wave
                if (Math.abs(dist - ripple.radius) < rippleWidth) {
                    const force = (1 - Math.abs(dist - ripple.radius) / rippleWidth) * CONFIG.CLICK_RIPPLE_FORCE;
                    toParticle.normalize().multiplyScalar(force * delta);
                    particle.velocity.add(toParticle);
                }
            });

            // Damping
            particle.velocity.multiplyScalar(0.96);
            
            // Collapse effect
            if (collapseProgress.current > 0.01) {
                const pullStrength = collapseProgress.current * 0.15;
                const toCenter = new THREE.Vector3().subVectors(new THREE.Vector3(0,0,0), particle.position);
                particle.velocity.lerp(toCenter.multiplyScalar(pullStrength), 0.1);
            }

            // Update position
            particle.position.add(particle.velocity);

            // Soft boundaries
            if (Math.abs(particle.position.x) > boundsX * 1.3) {
                particle.velocity.x *= -0.5;
            }
            if (Math.abs(particle.position.y) > boundsY * 1.3) {
                particle.velocity.y *= -0.5;
            }
            if (Math.abs(particle.position.z) > CONFIG.Z_DEPTH / 2) {
                particle.velocity.z *= -0.5;
            }

            // Update instance matrix with size variation and collapse scale
            dummy.position.copy(particle.position);
            const baseScale = particle.size / CONFIG.MIN_SIZE;
            const collapseScale = baseScale * (1.0 - collapseProgress.current * 0.95);
            dummy.scale.setScalar(collapseScale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, CONFIG.PARTICLE_COUNT]}
            >
                <sphereGeometry args={[CONFIG.MIN_SIZE, 8, 8]} />
                <meshBasicMaterial 
                    ref={materialRef}
                    vertexColors
                    transparent 
                    opacity={0.4}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    toneMapped={false}
                />
            </instancedMesh>
            
            {/* Connection lines */}
            <ParticleConnections 
                particles={particles} 
                opacity={currentOpacity} 
                boundsX={boundsX}
                boundsY={boundsY}
            />
        </group>
    );
}

// Dynamic connection lines between particles
function ParticleConnections({ 
    particles, 
    opacity,
    boundsX,
    boundsY,
}: { 
    particles: Particle[];
    opacity: React.MutableRefObject<number>;
    boundsX: number;
    boundsY: number;
}) {
    const lineRef = useRef<THREE.LineSegments>(null);
    const maxConnections = 80;
    
    const geometry = useMemo(() => {
        const positions = new Float32Array(maxConnections * 6);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame(() => {
        if (!lineRef.current) return;
        
        const positions = geometry.attributes.position.array as Float32Array;
        let connectionCount = 0;
        
        // Find nearby particle pairs dynamically
        for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
            for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
                const dist = particles[i].position.distanceTo(particles[j].position);
                
                if (dist < 1.5) {
                    const idx = connectionCount * 6;
                    positions[idx] = particles[i].position.x;
                    positions[idx + 1] = particles[i].position.y;
                    positions[idx + 2] = particles[i].position.z;
                    positions[idx + 3] = particles[j].position.x;
                    positions[idx + 4] = particles[j].position.y;
                    positions[idx + 5] = particles[j].position.z;
                    connectionCount++;
                }
            }
        }
        
        // Clear unused connections
        for (let i = connectionCount * 6; i < positions.length; i++) {
            positions[i] = 0;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.setDrawRange(0, connectionCount * 2);
        
        (lineRef.current.material as THREE.LineBasicMaterial).opacity = opacity.current * 0.3;
    });

    return (
        <lineSegments ref={lineRef} geometry={geometry}>
            <lineBasicMaterial 
                color="#00FF9D" 
                transparent 
                opacity={0.2}
                depthWrite={false}
            />
        </lineSegments>
    );
}