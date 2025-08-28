import './index.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, ScrollControls, useScroll } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function Planet() {
	const group = useRef<any>(null)
	const satellite = useRef<any>(null)
	useFrame((_, delta) => {
		if (group.current) group.current.rotation.y += delta * 0.35
		if (satellite.current) satellite.current.rotation.z += delta * 0.9
	})
	return (
		<group ref={group}>
			<mesh castShadow receiveShadow>
				<sphereGeometry args={[1.6, 64, 64]} />
				<meshStandardMaterial color="#1b1f3b" metalness={0.2} roughness={0.6} />
			</mesh>
			<mesh ref={satellite} position={[3, 0.4, 0]}>
				<sphereGeometry args={[0.25, 32, 32]} />
				<meshStandardMaterial color="#00f7ff" emissive="#00f7ff" emissiveIntensity={0.8} />
			</mesh>
		</group>
	)
}

function FloatingCubes() {
	const cubes = useMemo(() => [[-4,1,-3],[4,2,-2],[0,-1,-4]] as const, [])
	return (
		<group>
			{cubes.map((p, i) => (
				<InteractiveCube key={i} position={p as any} highlight={i===1} floatSpeed={1 + i * 0.2} />
			))}
		</group>
	)
}

function InteractiveCube({ position, highlight, floatSpeed = 1 }: { position: [number, number, number]; highlight?: boolean; floatSpeed?: number }) {
	const meshRef = useRef<any>(null)
	const [hovered, setHovered] = useState(false)
	const baseY = useRef<number>(position[1])
	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.6)
			const t = state.clock.getElapsedTime() * floatSpeed
			meshRef.current.position.y = baseY.current + Math.sin(t) * 0.6
		}
	})
	return (
		<mesh ref={meshRef} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={hovered ? 1.2 : 1}>
			<boxGeometry args={[0.8,0.8,0.8]} />
			<meshStandardMaterial color={highlight ? "#00f7ff" : "#ff1cf7"} emissive={highlight ? "#00f7ff" : "#ff1cf7"} emissiveIntensity={0.5} />
		</mesh>
	)
}

function ParallaxCamera() {
	const { camera } = useThree()
	const scroll = useScroll()
	useFrame(() => {
		const o = scroll.offset // 0..1
		camera.position.z = 6 + o * 2
		camera.position.y = -o * 0.5
		camera.lookAt(0, 0, 0)
	})
	return null
}

function Section({ id, children }: { id: string; children: any }) {
	return (
		<section id={id} className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{children}
		</section>
	)
}

function RingsBackdrop() {
	const group = useRef<any>(null)
	useFrame((_, delta) => {
		if (group.current) group.current.rotation.y += delta * 0.1
	})
	return (
		<group ref={group}>
			{Array.from({ length: 30 }).map((_, i) => (
				<mesh key={i} position={[Math.sin(i)*4, Math.cos(i*1.7)*2, -3 - (i%4)]}>
					<torusGeometry args={[0.15, 0.05, 16, 64]} />
					<meshStandardMaterial color="#00f7ff" emissive="#00f7ff" emissiveIntensity={0.5} />
				</mesh>
			))}
		</group>
	)
}

function InteractiveIcosahedron({ position, highlight }: { position: [number, number, number]; highlight?: boolean }) {
	const ref = useRef<any>(null)
	const [hover, setHover] = useState(false)
	useFrame((_, delta) => {
		if (ref.current) ref.current.rotation.y += delta * (hover ? 1.4 : 0.6)
	})
	return (
		<mesh ref={ref} position={position} scale={hover?1.1:1} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)}>
			<icosahedronGeometry args={[0.9, 1]} />
			<meshStandardMaterial color={highlight?"#00f7ff":"#39ff14"} emissive={highlight?"#00f7ff":"#39ff14"} emissiveIntensity={0.6} />
		</mesh>
	)
}

function FloatingPanel() {
	const ref = useRef<any>(null)
	useFrame(() => {
		if (ref.current) ref.current.position.y = Math.sin(Date.now()/1200) * 0.2
	})
	return (
		<group ref={ref}>
			<mesh position={[0,0,-2]}>
				<planeGeometry args={[20,20]} />
				<meshBasicMaterial color="#0a0b12" />
			</mesh>
		</group>
	)
}

export default function App() {
	return (
		<div className="dark bg-black text-white">
			{/* Hero */}
			<Section id="hero">
				<div className="absolute inset-0">
					<Canvas camera={{ position: [0, 0, 6], fov: 50 }} shadows>
						<ScrollControls pages={4} damping={0.2}>
							<ParallaxCamera />
							<color attach="background" args={["#07080f"]} />
							<ambientLight intensity={0.3} />
							<directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
							<pointLight position={[-6, -3, -4]} intensity={0.6} color={'#00f7ff'} />
							<Suspense fallback={null}>
								<Planet />
								<FloatingCubes />
								<Stars radius={60} depth={40} count={1000} factor={4} fade speed={1} />
								<Environment preset="city" />
							</Suspense>
							<OrbitControls enablePan={false} enableZoom={false} />
						</ScrollControls>
					</Canvas>
				</div>
				<div className="relative z-10 px-6 text-center max-w-3xl">
					<motion.h1
						className="text-5xl md:text-7xl font-extrabold tracking-tight neon-text"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						Immersive Neon Realities
					</motion.h1>
					<motion.p
						className="mt-4 text-neon-blue/90 text-lg md:text-xl"
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.1 }}
					>
						Explore a cinematic 3D web with motion, light, and depth.
					</motion.p>
					<div className="mt-8 flex items-center justify-center gap-4">
						<a href="#features" className="px-5 py-3 rounded-xl bg-neon-green text-black font-medium neon-btn">Explore</a>
						<a href="#contact" className="px-5 py-3 rounded-xl border border-neon-blue/60 text-neon-blue">Contact</a>
					</div>
				</div>
			</Section>

			{/* About */}
			<Section id="about">
				<div className="absolute inset-0 pointer-events-none">
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<ambientLight intensity={0.4} />
						<pointLight position={[0, 3, 2]} intensity={0.7} color={'#ff1cf7'} />
						<RingsBackdrop />
					</Canvas>
				</div>
				<div className="relative z-10 max-w-4xl px-6">
					<motion.h2 className="text-3xl md:text-5xl font-bold" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}>
						About
					</motion.h2>
					<motion.div className="mt-8 grid md:grid-cols-3 gap-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
						{['Origins','Vision','Tech'].map((title, i) => (
							<div key={i} className="bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 p-6">
								<h3 className="text-neon-blue font-semibold">{title}</h3>
								<p className="text-white/70 mt-2">Holographic card describing {title.toLowerCase()} with neon glow.</p>
							</div>
						))}
					</motion.div>
				</div>
			</Section>

			{/* Features */}
			<Section id="features">
				<div className="absolute inset-0">
					<Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
						<ambientLight intensity={0.5} />
						<directionalLight position={[4, 4, 4]} intensity={1} />
						{[[-2,0,0],[0,0,0],[2,0,0]].map((p, i) => (
							<InteractiveIcosahedron key={i} position={p as any} highlight={i===1} />
						))}
					</Canvas>
				</div>
				<div className="relative z-10 text-center px-6">
					<motion.h2 className="text-3xl md:text-5xl font-bold" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}>Features</motion.h2>
					<p className="text-white/70 mt-3">Interactive 3D objects that spin on hover.</p>
				</div>
			</Section>

			{/* Contact */}
			<Section id="contact">
				<div className="absolute inset-0">
					<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
						<ambientLight intensity={0.4} />
						<spotLight position={[5,5,5]} angle={0.3} penumbra={0.5} intensity={1} />
						<FloatingPanel />
					</Canvas>
				</div>
				<div className="relative z-10 w-full max-w-xl mx-auto px-6">
					<div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-8 shadow-neon-blue">
						<h2 className="text-3xl font-bold mb-4">Contact</h2>
						<form className="grid gap-4">
							<input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-neon-blue focus:shadow-neon-blue placeholder-white/50" placeholder="Your name" />
							<input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-neon-blue focus:shadow-neon-blue placeholder-white/50" placeholder="Email" />
							<textarea className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-neon-blue focus:shadow-neon-blue placeholder-white/50" rows={4} placeholder="Message" />
							<button className="px-5 py-3 rounded-xl bg-neon-green text-black font-semibold neon-btn">Send</button>
						</form>
					</div>
				</div>
			</Section>
		</div>
	)
}
