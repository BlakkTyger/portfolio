// ============================================================
// STAR PARTICLE SHADERS
// Handles: pulsation, fuel depletion (color shift + turbulence),
// gravitational collapse, supernova explosion
// ============================================================

export const starVertexShader = /* glsl */ `
uniform float uTime;
uniform float uColorPhase;    // 0=living blue-white, 1=depleted red
uniform float uCollapse;      // 0=normal, 1=fully collapsed
uniform float uExplosion;     // 0=not exploding, 1=fully expanded
uniform float uFadeOut;       // 0=visible, 1=faded
uniform float uShrink;        // 0=full size, 1=pre-collapse shrink
uniform float uFadeIn;        // Tie particles directly to star's fade-in curve!

attribute vec3 aDirection;
attribute float aSpeed;
attribute float aOffset;
attribute float aBaseSize;

varying float vDistFromCenter;
varying float vColorPhase;
varying float vExplosion;
varying float vAlpha;
varying float vDepth;

void main() {
    vec3 pos = position;
    float r = length(pos);

    // ── Super lightweight pulsation (NO heavy trig convection loops) ──
    float pulse = 1.0 + sin(uTime * 1.5 + aOffset * 6.28) * 0.04;

    // Pre-collapse shrink
    float shrinkFactor = 1.0 - uShrink * 0.35;
    pos *= pulse * shrinkFactor;

    // ── Gravitational collapse ──
    float col = uCollapse * uCollapse * uCollapse;
    float bounce = sin(uCollapse * 3.14159) * 0.08 * step(0.7, uCollapse);
    float colFactor = col - bounce;
    pos = mix(pos, pos * 0.02, colFactor);

    // ── Supernova explosion ──
    float expEased = 1.0 - pow(1.0 - uExplosion, 2.5);
    float radialBoost = 1.0 + r * 0.5;
    pos += aDirection * aSpeed * expEased * 20.0 * radialBoost;

    // ── Varyings ──
    vDistFromCenter = r / 1.5;
    vColorPhase = uColorPhase;
    vExplosion = uExplosion;
    
    // Perfectly synchronized fade-in and fade-out
    vAlpha = (1.0 - uFadeOut) * uFadeIn;
    vDepth = r;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // ── Point size ──
    float sizeScale = aBaseSize;
    sizeScale *= mix(1.0, 0.15, colFactor);
    sizeScale *= mix(1.0, 0.3 + aSpeed * 0.5, uExplosion);

    gl_PointSize = sizeScale * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const starFragmentShader = /* glsl */ `
varying float vDistFromCenter;
varying float vColorPhase;
varying float vExplosion;
varying float vAlpha;
varying float vDepth;

void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // Gaussian soft edge (much smoother than hard smoothstep)
    float alpha = exp(-d * d * 18.0);

    // ── Living star colors: blue-white core → yellow surface ──
    vec3 coreAlive = vec3(0.95, 0.95, 1.0);      // blue-white
    vec3 midAlive  = vec3(1.0, 0.95, 0.7);        // warm yellow
    vec3 edgeAlive = vec3(1.0, 0.7, 0.25);         // orange edge

    float t = clamp(vDistFromCenter, 0.0, 1.0);
    vec3 alive = mix(coreAlive, midAlive, smoothstep(0.0, 0.4, t));
    alive = mix(alive, edgeAlive, smoothstep(0.4, 1.0, t));

    // ── Depleted star colors: orange → deep crimson ──
    vec3 coreDepleted = vec3(1.0, 0.45, 0.1);     // hot orange
    vec3 midDepleted  = vec3(0.85, 0.2, 0.05);    // deep red-orange
    vec3 edgeDepleted = vec3(0.5, 0.05, 0.0);     // dark crimson

    vec3 depleted = mix(coreDepleted, midDepleted, smoothstep(0.0, 0.5, t));
    depleted = mix(depleted, edgeDepleted, smoothstep(0.5, 1.0, t));

    // ── Collapse flash: blue-white compression heating ──
    vec3 collapseColor = vec3(0.7, 0.8, 1.0);

    // ── Explosion colors: white-hot → yellow → orange → red ──
    vec3 explosionHot  = vec3(1.0, 1.0, 0.95);
    vec3 explosionWarm = vec3(1.0, 0.7, 0.2);
    vec3 explosionCool = vec3(0.9, 0.2, 0.05);
    vec3 explosionColor = mix(explosionHot, explosionWarm, smoothstep(0.0, 0.4, vExplosion));
    explosionColor = mix(explosionColor, explosionCool, smoothstep(0.4, 1.0, vExplosion));

    // ── Final color composition ──
    vec3 color;
    if (vExplosion > 0.01) {
        color = explosionColor;
    } else {
        // Blend living → depleted
        vec3 livingColor = mix(alive, depleted, vColorPhase);
        // Add blue-white tint as collapse intensifies
        float collapseVis = vColorPhase * vColorPhase * 0.6;
        color = mix(livingColor, collapseColor, collapseVis);
        
        // Drastically reduce brightness of particles when not exploding
        // so they don't blow out the detailed StarGlowCore texture
        color *= 0.15;
    }

    // Brighten core particles slightly, but keep them tame
    color += vec3(0.05, 0.04, 0.02) * (1.0 - t) * (1.0 - vExplosion);

    alpha *= vAlpha;
    gl_FragColor = vec4(color, alpha);
}
`;

// ============================================================
// STAR GLOW CORE SHADER
// Billboard sprite for the star's central volumetric glow
// ============================================================

export const glowVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const glowFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uColorPhase;
uniform float uCollapse;
uniform float uExplosion;
uniform float uIntensity;

varying vec2 vUv;

// ── Noise & Cellular Functions ──
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += noise(p) * a;
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

// ── Smooth Voronoi for Granulation ──
// Returns distance to closest cell border (v.y) and cell center ID (v.x)
float voronoiBorder(vec2 x, float time) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    vec2 mg, mr;
    float md = 8.0;
    
    // First pass: find closest cell
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            // Animate cell positions to simulate boiling plasma motion
            o = 0.5 + 0.5 * sin(time + o * 6.2831);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < md) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // Second pass: find border distance
    md = 8.0;
    for (int j = -2; j <= 2; j++) {
        for (int i = -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            o = 0.5 + 0.5 * sin(time + o * 6.2831);
            vec2 r = g + o - f;
            if (dot(mr - r, mr - r) > 0.00001) {
                md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
            }
        }
    }
    return md;
}

void main() {
    vec2 center = vUv - 0.5;
    float d = length(center);
    float angle = atan(center.y, center.x);
    
    // Physical size of the star core
    float radius = 0.22; 
    
    // ── 3D Spherical Normal Mapping ──
    float z = sqrt(max(0.0, radius * radius - d * d));
    vec3 normal = normalize(vec3(center.x, center.y, z + 0.0001));
    
    // Spherical UV projection with slow rotation on its axis
    float rotationSpeed = uTime * 0.04; 
    vec2 sphereUv = vec2(atan(normal.x, normal.z) + rotationSpeed, asin(normal.y));
    
    // Internal plasma convective churning/distortion
    float churn = fbm(sphereUv * 2.0 + uTime * 0.1) * 0.08 * sin(uTime * 0.2);
    sphereUv += vec2(churn, -churn * 0.5);
    
    // ── 1. Granulation (Cell-like patterns) ──
    float granTime = uTime * (1.2 + uColorPhase * 1.5); // Boiling speed
    // Higher frequency for realistic small granules
    float cellBorder = voronoiBorder(sphereUv * 45.0, granTime);
    
    // 70-80% bright yellow-white regions, soft boundaries, thin dark channels
    float granulation = smoothstep(0.01, 0.16, cellBorder);
    
    // ── 2. Large-scale Convection (Supergranules) ──
    float superConvection = fbm(sphereUv * 3.5 + uTime * 0.15);
    // Subtle influence: 5-10% brightness variance
    float supergranules = 0.9 + 0.15 * superConvection;
    
    // ── 3. Limb Darkening (Cooler at edges, brighter in center) ──
    // Highly gradual, no sharp cutoff
    float limbDarkening = pow(max(0.0, normal.z), 0.75);
    
    // ── 4. Sunspots & Active Regions ──
    // Grouped irregular spots
    float spotNoise = fbm(sphereUv * 6.0 - uTime * 0.05);
    // Umbra (dark core)
    float umbra = smoothstep(0.74, 0.79, spotNoise);
    // Penumbra (lighter surrounding ring)
    float penumbra = smoothstep(0.66, 0.74, spotNoise) * (1.0 - umbra);
    
    // ── 5. Magnetic Bright Regions (Faculae) ──
    // Bright streaks around sunspots/active zones
    float faculaeNoise = fbm(sphereUv * 16.0 + uTime * 0.4);
    float faculae = smoothstep(0.55, 0.7, faculaeNoise) * (penumbra + umbra * 0.5) * 1.5;
    
    // ── 6. Color Variation ──
    // Real star palettes (Sun-like → Depleted)
    vec3 colWhiteHot   = vec3(1.0, 0.98, 0.85); // Granule center
    vec3 colPaleYellow = vec3(0.95, 0.65, 0.15); // Granule body
    vec3 colDarkOrange = vec3(0.55, 0.08, 0.0);  // Plasma channels
    vec3 colSunspot    = vec3(0.05, 0.02, 0.01); // Umbra almost black
    vec3 colPenumbra   = vec3(0.3, 0.1, 0.02);   // Penumbra dark brown
    
    // Color depletion shifts (Living → Crimson Red giant)
    colWhiteHot   = mix(colWhiteHot,   vec3(0.85, 0.25, 0.0), uColorPhase);
    colPaleYellow = mix(colPaleYellow, vec3(0.5, 0.05, 0.0),  uColorPhase);
    colDarkOrange = mix(colDarkOrange, vec3(0.18, 0.0, 0.0),   uColorPhase);
    colPenumbra   = mix(colPenumbra,   vec3(0.08, 0.0, 0.0),   uColorPhase);
    
    // Blend granulation color
    vec3 starColor = mix(colDarkOrange, colPaleYellow, granulation);
    starColor = mix(starColor, colWhiteHot, granulation * granulation * 0.8);
    
    // Apply Sunspots (overwrite surface color)
    starColor = mix(starColor, colPenumbra, penumbra);
    starColor = mix(starColor, colSunspot, umbra);
    
    // Apply Faculae (bright streaks)
    starColor = mix(starColor, colWhiteHot * 1.3, faculae);
    
    // Apply Supergranules & Limb Darkening to complete 3D feel
    starColor *= supergranules * limbDarkening;
    
    // ── Flares and Corona (Edge) ──
    float flareNoise = fbm(vec2(angle * 12.0, uTime * 0.7));
    float flareDist = d - radius;
    // Spiky prominences shooting out
    float flareMask = smoothstep(0.07 * flareNoise, 0.0, flareDist) * smoothstep(0.0, 0.015, flareDist);
    vec3 flareColor = mix(colPaleYellow, colWhiteHot, flareNoise) * flareMask * flareNoise * 2.0;
    
    // Dynamic, wispy corona glow
    float coronaGlow = exp(-flareDist * 22.0) * 0.65;
    coronaGlow += exp(-flareDist * 7.0) * 0.3;
    coronaGlow += exp(-flareDist * 2.2) * 0.15;
    float coronaTurb = fbm(vec2(angle * 5.0, d * 8.0 - uTime)) * 0.4 * uColorPhase;
    vec3 coronaColor = colPaleYellow * (coronaGlow + coronaTurb);
    
    // Final Composite (Body + Flares + Corona)
    // Extremely soft, continuous gaseous boundary (0.06 instead of 0.025)
    float bodyMask = smoothstep(radius + 0.06, radius - 0.06, d);
    vec3 finalColor = mix(coronaColor, starColor, bodyMask) + flareColor;
    float alpha = mix(coronaGlow, 1.0, bodyMask) + flareMask;
    
    // Vignette to fade out all outer glow before the edge of the 6x6 plane quad!
    // This absolutely prevents any discrete box lines at the boundary of the canvas mesh
    float edgeVignette = smoothstep(0.48, 0.38, d);
    alpha *= edgeVignette;
    finalColor *= edgeVignette;
    
    // Keep it within visual boundaries (dim slightly for bloom safety)
    finalColor *= 0.85;

    // ── Collapse & Explosion Overrides ──
    vec3 collapseBlue = vec3(0.5, 0.7, 1.0);
    finalColor = mix(finalColor, collapseBlue, uCollapse * 0.8);
    alpha *= mix(1.0, 3.5, uCollapse * uCollapse);

    float expBright = uExplosion * (1.0 - uExplosion) * 4.0;
    alpha *= mix(1.0, 5.0, expBright);
    finalColor = mix(finalColor, vec3(1.0, 1.0, 0.95), expBright * 0.85);

    // Geometry shrink for collapse
    float colScale = mix(1.0, 0.05, uCollapse * uCollapse * uCollapse);
    float scaledD = d / colScale;
    float mask = smoothstep(0.5, 0.48, scaledD * colScale);

    alpha *= uIntensity * mask;
    
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
}
`;

// ============================================================
// SHOCKWAVE RING SHADER
// Expanding toroidal shockwave during supernova
// ============================================================

export const shockwaveVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const shockwaveFragmentShader = /* glsl */ `
uniform float uProgress;  // 0→1 expansion
uniform float uOpacity;

varying vec2 vUv;

void main() {
    vec2 center = vUv - 0.5;
    float d = length(center);

    // Ring radius expands with progress
    float ringRadius = uProgress * 0.45;
    float ringWidth = 0.02 + uProgress * 0.03; // widens as it expands

    // Ring shape with soft edges
    float ring = smoothstep(ringWidth, 0.0, abs(d - ringRadius));

    // Leading edge is brighter
    float edge = smoothstep(ringWidth * 0.5, 0.0, abs(d - ringRadius - ringWidth * 0.3));

    // Color: blue-white leading edge → orange trailing
    vec3 leadColor = vec3(0.7, 0.85, 1.0);
    vec3 trailColor = vec3(1.0, 0.5, 0.1);
    vec3 color = mix(trailColor, leadColor, edge);

    float alpha = ring * uOpacity * (1.0 - uProgress * 0.6); // fades as expands
    gl_FragColor = vec4(color, alpha);
}
`;

// ============================================================
// BACKGROUND STARS SHADER
// Simple static starfield with twinkle
// ============================================================

export const bgStarVertexShader = /* glsl */ `
attribute float aSize;
attribute float aPhase;

varying float vTwinkle;

uniform float uTime;

void main() {
    vTwinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase * 6.2832);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const bgStarFragmentShader = /* glsl */ `
varying float vTwinkle;
uniform float uCameraDistance;

void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = exp(-d * d * 20.0) * vTwinkle;
    vec3 color = vec3(0.85, 0.88, 1.0); // cool blue-white
    gl_FragColor = vec4(color, alpha * 0.7 * smoothstep(0.0, 0.2, uCameraDistance));
}
`;

// ============================================================
// BLACK HOLE SHADERS
// Full-screen quad: raymarched gravitational lensing,
// multi-layer accretion disk with Doppler shift,
// photon ring, Einstein ring, spaghettification
// ============================================================

export const blackholeVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const blackholeFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uFormation;
uniform float uCameraDistance;
uniform float uCameraAngle;
uniform vec2  uResolution;

varying vec2 vUv;

// ── Noise Functions ──
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) { v += noise(p) * a; p = rot * p * 2.1; a *= 0.5; }
    return v;
}

// ── Plasma Disk Generator ──
// Creates sweeping, swirling bands of auroral plasma
vec4 computeAccretionDisk(vec2 uv, float eh, float dist, float angle, float timeOffset) {
    // Flatten the disk mathematically to simulate a 3D tilted plane
    vec2 tiltedUV = uv;
    tiltedUV.y *= 2.5; // Squish Y to simulate viewing at an angle
    float tDist = length(tiltedUV);
    float tAngle = atan(tiltedUV.y, tiltedUV.x);
    
    // Spiral warp: The closer to the hole, the faster it spins and twists
    float twist = 1.2 / (tDist + 0.1) * uFormation;
    float twistedAngle = tAngle + twist - uTime * 0.6 + timeOffset;
    
    // Polar coordinates for noise sampling
    vec2 polarUV = vec2(twistedAngle * 2.0, tDist * 4.0 - uTime * 0.8);
    
    // Multiple layers of sweeping plasma
    float plasma1 = fbm(polarUV);
    float plasma2 = fbm(polarUV * 2.5 + vec2(uTime * 0.4, -uTime * 0.2));
    float plasma3 = fbm(polarUV * 5.0 - vec2(0.0, uTime * 0.5));
    
    // Combine into sweeping auroral bands
    float bands = sin(tDist * 12.0 - twistedAngle * 3.0) * 0.5 + 0.5;
    bands = pow(bands, 1.5) * (plasma1 * 0.6 + plasma2 * 0.4);
    
    // Add bright hot-spots
    float hotspots = pow(plasma3, 3.0) * 2.0;
    
    float density = (bands + hotspots * 0.3) * uFormation;
    
    // Density falloff (inner edge is sharp, outer edge fades slowly)
    float mask = smoothstep(eh * 0.9, eh * 1.5, tDist) * smoothstep(eh * 8.0, eh * 3.0, tDist);
    density *= mask;
    
    // Doppler Beaming (approaching side is brighter and bluer)
    float doppler = sin(angle - 0.5); // Offset angle for cinematic lighting
    float dopplerFactor = pow(max(0.0, doppler + 1.2) * 0.45, 2.0);
    
    // ── Extreme Relativistic Doppler/Redshift shift as we fall closer ──
    float camFall = 1.0 - uCameraDistance;
    vec3 colDeepBlue = mix(vec3(0.05, 0.2, 0.6), vec3(0.0, 0.4, 1.0), camFall);
    vec3 colPurple = mix(vec3(0.4, 0.1, 0.5), vec3(0.6, 0.0, 0.9), camFall);
    vec3 colOrange = mix(vec3(1.0, 0.4, 0.05), vec3(1.0, 0.95, 0.9), camFall * camFall);
    vec3 colWhite = mix(vec3(1.0, 0.95, 0.9), vec3(0.8, 0.95, 1.0), camFall);
    
    // Mix colors based on temperature (distance and density)
    vec3 color = mix(colPurple, colDeepBlue, plasma1);
    color = mix(color, colOrange, plasma2 * mask);
    color = mix(color, colWhite, hotspots * mask);
    
    // Apply Doppler shift to color and brightness (highly intense blue-shift during fall-in)
    color = mix(color, vec3(0.5, 0.8, 1.0), dopplerFactor * mix(0.4, 0.85, camFall));
    density *= (0.4 + dopplerFactor * (1.6 + 2.0 * camFall));
    
    return vec4(color, density);
}

void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 center = vec2(0.5);
    vec2 toCenter = center - uv;
    toCenter.x *= aspect;
    
    // ── Spacetime Swirl (Relativistic Kerr Frame-Dragging) ──
    // Spacetime bends and twists near a spinning black hole. 
    // This physically twists the light rays, creating a beautiful Einstein Ring swirl.
    float dist = length(toCenter);
    vec2 dir = dist > 0.001 ? normalize(toCenter) : vec2(0.0);
    float angle = atan(toCenter.y, toCenter.x);

    // Camera fall progress
    float camFall = 1.0 - uCameraDistance;
    
    // Relativistic Kerr Spacetime Swirl (intensifies exponentially as you get closer)
    float dragStrength = (0.05 * uFormation + 0.7 * pow(camFall, 2.5)) / (dist + 0.015);
    float twistedAngle = angle + dragStrength;
    
    // Twists the primary visual direction
    vec2 twistedCenter = vec2(cos(twistedAngle), sin(twistedAngle)) * dist;
    vec2 twistedDir = normalize(twistedCenter);

    // ── Event Horizon ──
    // Horizon grows exponentially right at the end to swallow the vision from the center
    float eh = 0.035 * uFormation + 0.65 * pow(camFall, 3.0);

    // ── Gravitational Lensing (Einstein Ring Effect) ──
    // Lensing becomes infinite, compressing background into a tiny ring at the edge
    float lensStrength = 0.02 * uFormation + 0.5 * pow(camFall, 2.5);
    float lens = lensStrength / (dist * dist + 0.002);
    
    // Einstein lensing bends the warped light paths
    vec2 lensedUV = twistedCenter + twistedDir * min(lens, 0.68);
    float lensedDist = length(lensedUV);
    float lensedAngle = atan(lensedUV.y, lensedUV.x);

    // ── Background Stars (Warped) ──
    float stars = 0.0;
    for (float i = 0.0; i < 3.0; i++) {
        vec2 sUV = (lensedUV + center) * (35.0 + i * 30.0);
        float h = hash21(floor(sUV));
        float sd = length(fract(sUV) - 0.5);
        float threshold = 0.96 - i * 0.005;
        if (h > threshold) {
            float brightness = (h - threshold) / (1.0 - threshold);
            stars += smoothstep(0.08, 0.0, sd) * (0.3 + brightness * 0.7);
        }
    }
    stars *= smoothstep(0.0, 0.25, uCameraDistance);
    vec3 color = vec3(stars * 0.85, stars * 0.9, stars);

    // ── Pseudo-3D Accretion Disk ──
    if (uFormation > 0.01) {
        // Render the FRONT of the disk
        vec4 frontDisk = computeAccretionDisk(twistedCenter, eh, dist, twistedAngle, 0.0);
        
        // Render the BACK of the disk (gravitationally lensed over the top/bottom)
        // We use the lensedUV but invert it to simulate looking "around" the black hole
        vec2 backUV = twistedCenter - twistedDir * min(lens * 1.5, 0.85);
        vec4 backDisk = computeAccretionDisk(backUV, eh, length(backUV), atan(backUV.y, backUV.x), 3.14);
        // Dim the back disk slightly
        backDisk.a *= 0.6 * smoothstep(eh * 0.9, eh * 1.2, dist);
        
        // Blend back disk, then front disk over the stars
        color = mix(color, backDisk.rgb, clamp(backDisk.a * 3.0, 0.0, 1.0));
        color = mix(color, frontDisk.rgb, clamp(frontDisk.a * 4.0, 0.0, 1.0));
        
        // ── Photon Ring (Trapped Light) ──
        float pRingR = eh * 1.35;
        float pRingWidth = 0.006 + 0.004 * fbm(vec2(angle * 10.0, uTime * 2.0));
        float pRingMask = smoothstep(pRingWidth, 0.0, abs(dist - pRingR)) * uFormation;
        // Make it patchy and glowing
        float pRingGlow = pRingMask * (0.5 + 0.5 * fbm(vec2(angle * 5.0, -uTime)));
        color += vec3(0.9, 0.8, 1.0) * pRingGlow * 4.0;
    }

    // ── Event Horizon (The Void) ──
    // Singularity swallows center of the screen
    float ehMask = 1.0 - smoothstep(eh - 0.005, eh + 0.005, dist);
    color = mix(color, vec3(0.0), ehMask);

    // ── Spaghettification & Fall-in Fade ──
    // Highly dramatic edge warping and vignette before crossing
    float vignette = smoothstep(0.0, 0.65, dist) * camFall;
    color *= 1.0 - vignette;
    
    // Smooth mathematical transition into 100% black as you cross the event horizon
    float crossingFade = smoothstep(0.02, 0.2, uCameraDistance);
    color *= crossingFade;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;


