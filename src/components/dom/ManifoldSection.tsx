'use client'

import { useEffect, useRef, useState, useCallback } from 'react';
import { nodes, edges, categoryColors, InterestNode, InterestEdge } from '@/data/interests';

// Export for potential 3D scene coordination
export const manifoldScrollState = { progress: 0, isVisible: false };

interface NodePosition {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  startX: number;
  startY: number;
}

// Improved force-directed layout - fills space, avoids overlaps
const calculatePositions = (width: number, height: number): Record<string, NodePosition> => {
  const positions: Record<string, NodePosition> = {};
  const padding = 60;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate node radius for collision detection
  const getRadius = (node: typeof nodes[0]) => {
    const baseRadius = node.isHub ? 32 : 12;
    return baseRadius + node.size * 14 + 35; // Good spacing between nodes
  };
  
  // Initialize with a spread-out grid pattern
  const cols = Math.ceil(Math.sqrt(nodes.length * (width / height)));
  const rows = Math.ceil(nodes.length / cols);
  const cellWidth = (width - padding * 2) / cols;
  const cellHeight = (height - padding * 2) / rows;
  
  // Sort nodes: hubs first, then by size
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.isHub && !b.isHub) return -1;
    if (!a.isHub && b.isHub) return 1;
    return b.size - a.size;
  });
  
  // Initial grid placement with some randomness
  sortedNodes.forEach((node, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions[node.id] = {
      x: padding + cellWidth * (col + 0.5) + (Math.random() - 0.5) * cellWidth * 0.3,
      y: padding + cellHeight * (row + 0.5) + (Math.random() - 0.5) * cellHeight * 0.3,
      baseX: 0, baseY: 0, startX: 0, startY: 0
    };
  });
  
  // Force simulation - enough iterations for good spread
  const iterations = 150;
  
  for (let iter = 0; iter < iterations; iter++) {
    const temp = 1 - iter / iterations; // Cooling
    const forces: Record<string, { fx: number; fy: number }> = {};
    nodes.forEach(n => forces[n.id] = { fx: 0, fy: 0 });
    
    // 1. Strong repulsion between ALL nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const a = positions[nodeA.id];
        const b = positions[nodeB.id];
        if (!a || !b) continue;
        
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        
        const minDist = getRadius(nodeA) + getRadius(nodeB);
        
        // Repulsion force - always active, strong when overlapping
        let force = 0;
        if (dist < minDist) {
          force = (minDist - dist) * 50; // Strong push when overlapping
        } else {
          force = 80000 / (dist * dist); // Balanced general repulsion
        }
        
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        forces[nodeA.id].fx -= fx;
        forces[nodeA.id].fy -= fy;
        forces[nodeB.id].fx += fx;
        forces[nodeB.id].fy += fy;
      }
    }
    
    // 2. Attraction along edges (but not too strong)
    edges.forEach(edge => {
      const a = positions[edge.from];
      const b = positions[edge.to];
      if (!a || !b) return;
      
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
      
      const nodeA = nodes.find(n => n.id === edge.from);
      const nodeB = nodes.find(n => n.id === edge.to);
      const idealDist = nodeA && nodeB 
        ? getRadius(nodeA) + getRadius(nodeB) + 60
        : 150;
      
      // Pull together if too far, push apart if too close
      const diff = dist - idealDist;
      const strength = diff * 0.01 * edge.strength;
      
      const fx = (dx / dist) * strength;
      const fy = (dy / dist) * strength;
      
      forces[edge.from].fx += fx;
      forces[edge.from].fy += fy;
      forces[edge.to].fx -= fx;
      forces[edge.to].fy -= fy;
    });
    
    // 3. Gentle push toward center to prevent drift
    nodes.forEach(node => {
      const pos = positions[node.id];
      if (!pos) return;
      
      const dx = centerX - pos.x;
      const dy = centerY - pos.y;
      
      // Very weak centering force
      forces[node.id].fx += dx * 0.005;
      forces[node.id].fy += dy * 0.005;
    });
    
    // Apply forces with temperature
    nodes.forEach(node => {
      const pos = positions[node.id];
      const f = forces[node.id];
      if (!pos || !f) return;
      
      const maxMove = 20 * temp;
      const mag = Math.sqrt(f.fx * f.fx + f.fy * f.fy) || 0.1;
      const scale = Math.min(maxMove / mag, 1);
      
      pos.x += f.fx * scale;
      pos.y += f.fy * scale;
      
      // Keep in bounds
      pos.x = Math.max(padding, Math.min(width - padding, pos.x));
      pos.y = Math.max(padding, Math.min(height - padding, pos.y));
    });
  }
  
  // Set base positions and flying-in start positions
  nodes.forEach(node => {
    const pos = positions[node.id];
    if (!pos) return;
    
    pos.baseX = pos.x;
    pos.baseY = pos.y;
    
    // Start from edge of screen in same direction
    const angleFromCenter = Math.atan2(pos.y - centerY, pos.x - centerX);
    const startDistance = Math.max(width, height) * 1.2;
    pos.startX = centerX + Math.cos(angleFromCenter) * startDistance;
    pos.startY = centerY + Math.sin(angleFromCenter) * startDistance;
  });
  
  return positions;
};

export default function ManifoldSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });
  const [hoveredNode, setHoveredNode] = useState<InterestNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<InterestEdge | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState<Record<string, number>>({});
  const [edgesVisible, setEdgesVisible] = useState<Set<string>>(new Set());
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // Flying in + floating animation
  useEffect(() => {
    if (!isVisible) {
      setAnimationProgress({});
      setEdgesVisible(new Set());
      return;
    }
    
    // Start flying in animation for each node with stagger
    nodes.forEach((node, i) => {
      const delay = node.isHub ? i * 100 : 300 + i * 80;
      setTimeout(() => {
        const startTime = Date.now();
        const duration = 800;
        
        const animateIn = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          
          setAnimationProgress(prev => ({ ...prev, [node.id]: eased }));
          
          if (progress < 1) {
            requestAnimationFrame(animateIn);
          }
        };
        requestAnimationFrame(animateIn);
      }, delay);
    });

    // Reveal edges after nodes fly in
    const edgeDelay = nodes.length * 80 + 800;
    edges.forEach((edge, i) => {
      setTimeout(() => {
        setEdgesVisible(prev => new Set([...prev, `${edge.from}-${edge.to}`]));
      }, edgeDelay + i * 50);
    });
  }, [isVisible]);

  // Gentle floating animation
  useEffect(() => {
    if (!isVisible) return;
    
    const animate = () => {
      timeRef.current += 0.015;
      
      setPositions(prev => {
        const newPositions = { ...prev };
        nodes.forEach((node, i) => {
          const base = prev[node.id];
          if (base && draggingNode !== node.id) {
            const phase = i * 0.7;
            const floatAmount = node.isHub ? 2 : 4;
            const floatX = Math.sin(timeRef.current + phase) * floatAmount;
            const floatY = Math.cos(timeRef.current * 0.6 + phase) * floatAmount;
            newPositions[node.id] = {
              ...base,
              x: base.baseX + floatX,
              y: base.baseY + floatY,
            };
          }
        });
        return newPositions;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, draggingNode]);

  useEffect(() => {
    const updateDimensions = () => {
      // Fit graph with title visible - more width than height
      const width = window.innerWidth - 40;
      const height = window.innerHeight - 180; // More room for heading
      setDimensions({ width, height });
      setPositions(calculatePositions(width, height));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const inView = rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4;
      setIsVisible(inView);
      manifoldScrollState.isVisible = inView;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const pos = positions[nodeId];
    if (!pos) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    dragOffset.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    };
    setDraggingNode(nodeId);
  }, [positions]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    
    if (draggingNode) {
      const newX = x - dragOffset.current.x;
      const newY = y - dragOffset.current.y;
      
      // Only constrain to SVG bounds - allow free movement
      const constrainedX = Math.max(50, Math.min(dimensions.width - 50, newX));
      const constrainedY = Math.max(50, Math.min(dimensions.height - 50, newY));
      
      setPositions(prev => ({
        ...prev,
        [draggingNode]: {
          ...prev[draggingNode],
          x: constrainedX,
          y: constrainedY,
        },
      }));
    }
  }, [draggingNode, dimensions]);

  const handleMouseUp = useCallback(() => {
    if (draggingNode) {
      // Keep node at new position - update baseX/baseY to current position
      setPositions(prev => {
        const current = prev[draggingNode];
        if (!current) return prev;
        return {
          ...prev,
          [draggingNode]: {
            ...current,
            baseX: current.x,
            baseY: current.y,
          },
        };
      });
      setDraggingNode(null);
    }
  }, [draggingNode]);

  return (
    <section
      ref={sectionRef}
      id="manifold"
      className="relative min-h-screen py-8 flex flex-col items-center"
    >
      {/* Section heading */}
      <div 
        className={`text-center mb-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[var(--photon-white)]">
          The Interests Manifold
        </h2>
      </div>

      <div className="relative flex justify-center">
        <svg 
          ref={svgRef}
          width={dimensions.width} 
          height={dimensions.height}
          className="overflow-visible"
          style={{ maxWidth: '100%' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { handleMouseUp(); setHoveredEdge(null); }}
        >
          {/* Edges - rendered first so they're behind nodes */}
          {edges.map((edge) => {
            const startPos = positions[edge.from];
            const endPos = positions[edge.to];
            if (!startPos || !endPos) return null;
            
            const edgeKey = `${edge.from}-${edge.to}`;
            const isEdgeVisible = edgesVisible.has(edgeKey);
            const isEdgeHovered = hoveredEdge === edge;
            
            // Get animation progress for each endpoint
            const startProgress = animationProgress[edge.from] || 0;
            const endProgress = animationProgress[edge.to] || 0;
            
            // Calculate current positions (following nodes during drag/animation)
            const startX = startPos.startX + (startPos.x - startPos.startX) * startProgress;
            const startY = startPos.startY + (startPos.y - startPos.startY) * startProgress;
            const endX = endPos.startX + (endPos.x - endPos.startX) * endProgress;
            const endY = endPos.startY + (endPos.y - endPos.startY) * endProgress;
            
            // Calculate edge length
            const length = Math.sqrt(
              Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
            );
            
            // Get colors for gradient
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            const fromColor = fromNode ? categoryColors[fromNode.category] : '#888';
            const toColor = toNode ? categoryColors[toNode.category] : '#888';
            const gradientId = `edgeGrad-${edge.from}-${edge.to}`;
            
            return (
              <g key={edgeKey}>
                {/* Edge gradient definition */}
                <defs>
                  <linearGradient id={gradientId} x1={startX} y1={startY} x2={endX} y2={endY} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={fromColor} stopOpacity="0.6" />
                    <stop offset="50%" stopColor="rgba(150,150,150,0.4)" />
                    <stop offset="100%" stopColor={toColor} stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                
                {/* Invisible wider line for clicking */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="transparent"
                  strokeWidth={20}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredEdge(edge)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                
                {/* Glow line underneath */}
                {isEdgeVisible && (
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={isEdgeHovered ? 'rgba(255,255,255,0.3)' : `url(#${gradientId})`}
                    strokeWidth={isEdgeHovered ? edge.strength * 8 : edge.strength * 5}
                    strokeLinecap="round"
                    opacity={0.3}
                    filter="url(#edgeGlow)"
                    className="pointer-events-none"
                  />
                )}
                
                {/* Main visible edge */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={isEdgeHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(150, 150, 150, 0.5)'}
                  strokeWidth={isEdgeHovered ? edge.strength * 4 : edge.strength * 2.5}
                  strokeLinecap="round"
                  strokeDasharray={length}
                  strokeDashoffset={isEdgeVisible ? 0 : length}
                  className="transition-[stroke-dashoffset] duration-700 ease-out pointer-events-none"
                />
                
                {/* Vertex glow at start */}
                {isEdgeVisible && (
                  <circle
                    cx={startX}
                    cy={startY}
                    r={6}
                    fill={fromColor}
                    opacity={0.6}
                    filter="url(#edgeGlow)"
                    className="pointer-events-none animate-pulse"
                    style={{ animationDelay: '0ms' }}
                  />
                )}
                
                {/* Vertex glow at end */}
                {isEdgeVisible && (
                  <circle
                    cx={endX}
                    cy={endY}
                    r={6}
                    fill={toColor}
                    opacity={0.6}
                    filter="url(#edgeGlow)"
                    className="pointer-events-none animate-pulse"
                    style={{ animationDelay: '350ms' }}
                  />
                )}
              </g>
            );
          })}
          
          {/* Nodes */}
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;
            
            const color = categoryColors[node.category];
            const baseRadius = node.isHub ? 32 : 12;
            const radius = baseRadius + node.size * 14;
            const progress = animationProgress[node.id] || 0;
            const isHovered = hoveredNode?.id === node.id;
            const isDragging = draggingNode === node.id;
            
            const currentX = pos.startX + (pos.x - pos.startX) * progress;
            const currentY = pos.startY + (pos.y - pos.startY) * progress;
            
            if (progress === 0) return null;
            
            // Unique gradient ID for this node
            const gradientId = `nodeGradient-${node.id}`;
            const glowId = `nodeGlow-${node.id}`;
            
            return (
              <g 
                key={node.id} 
                className={`cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                onMouseEnter={() => !draggingNode && setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{ opacity: progress }}
              >
                {/* Ambient glow - large soft */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r={radius * 2.5}
                  fill={`url(#${glowId})`}
                  opacity={isHovered || isDragging ? 0.6 : 0.3}
                  className="transition-opacity duration-300"
                />
                
                {/* Medium glow ring */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r={radius * 1.5}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={isHovered || isDragging ? 0.5 : 0.2}
                  className="transition-opacity duration-300"
                />
                
                {/* Inner glow */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r={radius + 4}
                  fill={color}
                  opacity={isHovered || isDragging ? 0.5 : 0.25}
                  filter="url(#softGlow)"
                />
                
                {/* Main circle with gradient */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r={isHovered || isDragging ? radius + 2 : radius}
                  fill={`url(#${gradientId})`}
                  stroke={color}
                  strokeWidth={isHovered || isDragging ? 2 : 1}
                  strokeOpacity={0.8}
                  className="transition-all duration-200"
                  filter={isHovered || isDragging ? 'url(#brightGlow)' : undefined}
                />
                
                {/* Hub pulsing ring */}
                {node.isHub && (
                  <>
                    <circle
                      cx={currentX}
                      cy={currentY}
                      r={radius + 8}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.4}
                      className="animate-pulse"
                    />
                    <circle
                      cx={currentX}
                      cy={currentY}
                      r={radius + 14}
                      fill="none"
                      stroke={color}
                      strokeWidth={1}
                      opacity={0.2}
                    />
                  </>
                )}
                
                {/* Center highlight */}
                <circle
                  cx={currentX - radius * 0.25}
                  cy={currentY - radius * 0.25}
                  r={radius * 0.3}
                  fill="white"
                  opacity={0.15}
                />
                
                {/* Label with shadow */}
                <text
                  x={currentX}
                  y={currentY + radius + 20}
                  textAnchor="middle"
                  fill={isHovered || isDragging ? '#FFFFFF' : '#AAAAAA'}
                  fontSize={node.isHub ? '11' : '9'}
                  fontWeight={node.isHub ? '600' : '500'}
                  className="font-mono transition-colors duration-200 pointer-events-none select-none"
                  filter={isHovered ? 'url(#textGlow)' : undefined}
                >
                  {node.label}
                </text>
                
                {/* Node-specific gradient */}
                <defs>
                  <radialGradient id={gradientId} cx="30%" cy="30%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                  </radialGradient>
                  <radialGradient id={glowId} cx="50%" cy="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </radialGradient>
                </defs>
              </g>
            );
          })}
          
          {/* Global filters and gradients */}
          <defs>
            <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="brightGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="blur" in2="SourceGraphic" operator="over"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Node Tooltip */}
        {hoveredNode && !hoveredEdge && (
          <div
            className="absolute pointer-events-none z-50 animate-fade-in"
            style={{
              left: mousePos.x + 15,
              top: mousePos.y - 10,
              transform: mousePos.x > dimensions.width * 0.7 ? 'translateX(-110%)' : undefined,
            }}
          >
            <div className="bg-[var(--event-horizon)] border border-[var(--tungsten-gray)]/30 rounded-lg px-4 py-3 shadow-xl max-w-[220px]">
              <div 
                className="w-2 h-2 rounded-full mb-2"
                style={{ backgroundColor: categoryColors[hoveredNode.category] }}
              />
              <h4 className="font-heading text-[var(--photon-white)] text-sm mb-1">
                {hoveredNode.label}
              </h4>
              <p className="text-[var(--tungsten-gray)] text-xs leading-relaxed">
                {hoveredNode.description}
              </p>
              <span 
                className="text-[10px] uppercase tracking-wider mt-2 block"
                style={{ color: categoryColors[hoveredNode.category] }}
              >
                {hoveredNode.category}
              </span>
            </div>
          </div>
        )}

        {/* Edge Tooltip */}
        {hoveredEdge && hoveredEdge.description && (
          <div
            className="absolute pointer-events-none z-50 animate-fade-in"
            style={{
              left: mousePos.x + 15,
              top: mousePos.y - 10,
              transform: mousePos.x > dimensions.width * 0.7 ? 'translateX(-110%)' : undefined,
            }}
          >
            <div className="bg-[var(--event-horizon)] border border-[var(--tungsten-gray)]/30 rounded-lg px-4 py-3 shadow-xl max-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--photon-white)] text-xs font-mono">
                  {nodes.find(n => n.id === hoveredEdge.from)?.label}
                </span>
                <span className="text-[var(--tungsten-gray)]">↔</span>
                <span className="text-[var(--photon-white)] text-xs font-mono">
                  {nodes.find(n => n.id === hoveredEdge.to)?.label}
                </span>
              </div>
              <p className="text-[var(--tungsten-gray)] text-xs leading-relaxed">
                {hoveredEdge.description}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[10px] text-[var(--tungsten-gray)]">Connection strength:</span>
                <div className="flex-1 h-1 bg-[var(--tungsten-gray)]/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--terminal-cyan)] rounded-full"
                    style={{ width: `${hoveredEdge.strength * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
