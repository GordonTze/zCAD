'use client';

import { useState, useEffect } from 'react';

interface LandingPageProps {
  onLaunch: (partId?: string) => void;
}

// Curated selection of 24 screenshots showcasing all features
const heroImages = [
  { src: '/screenshots/31-mega-cnc-machine.png', alt: 'Mega CNC Machine — super-detailed 5-axis machining center', caption: 'Mega CNC Machine', partId: 'part_mega_cnc' },
  { src: '/screenshots/64-great-pyramid.png', alt: 'Great Pyramid of Giza with realistic textures and shadows', caption: 'Great Pyramid of Giza', partId: 'part_pyramid' },
  { src: '/screenshots/62-la-mansion.png', alt: 'LA Hills luxury mansion with infinity pool', caption: 'LA Hills Mansion', partId: 'part_la_mansion' },
  { src: '/screenshots/33-chinese-building.png', alt: 'Chinese 3-story pagoda with traditional architecture', caption: 'Chinese Pagoda', partId: 'part_chinese_building' },
];

const featureImages = [
  { src: '/screenshots/15-engine-assembly.png', alt: 'Complete 4-cylinder engine assembly', caption: 'Engine Assembly', category: 'Mechanical Parts', partId: 'part_gearbox_complete' },
  { src: '/screenshots/16-engine-exploded-view.png', alt: 'Engine exploded view showing all internal components', caption: 'Engine Exploded View', category: 'Mechanical Parts', partId: 'part_engine_block' },
  { src: '/screenshots/20-turbine-blade.png', alt: 'Single-crystal turbine blade with cooling passages', caption: 'Turbine Blade', category: 'Aerospace', partId: 'part_turbine_blade' },
  { src: '/screenshots/21-rocket-injector.png', alt: 'Rocket engine injector with 18 elements', caption: 'Rocket Injector', category: 'Aerospace', partId: 'part_rocket_injector' },
  { src: '/screenshots/22-f1-upright.png', alt: 'Formula 1 wheel upright', caption: 'F1 Upright', category: 'Aerospace', partId: 'part_f1_upright' },
  { src: '/screenshots/25-cnc-machine.png', alt: '5-axis CNC machine with 14 components', caption: '5-Axis CNC', category: 'Manufacturing', partId: 'part_mega_cnc' },
  { src: '/screenshots/27-super-cnc-exploded.png', alt: 'CNC machine exploded view', caption: 'CNC Exploded', category: 'Manufacturing', partId: 'part_mega_cnc' },
  { src: '/screenshots/28-atc-magazine.png', alt: 'Automatic tool changer magazine', caption: 'ATC Magazine', category: 'Manufacturing', partId: 'part_cnc2_magazine' },
  { src: '/screenshots/24-gearbox-complete.png', alt: 'Complete gearbox assembly', caption: 'Gearbox', category: 'Power Transmission', partId: 'part_gearbox_complete' },
  { src: '/screenshots/10-propeller.png', alt: 'Detailed propeller', caption: 'Propeller', category: 'Mechanical Parts', partId: 'part_propeller' },
  { src: '/screenshots/11-cylinder-head.png', alt: 'Cylinder head with valves', caption: 'Cylinder Head', category: 'Engine Parts', partId: 'part_cylinder_head' },
  { src: '/screenshots/12-heat-sink.png', alt: 'Heat sink with cooling fins', caption: 'Heat Sink', category: 'Thermal', partId: 'part_heatsink' },
  { src: '/screenshots/13-impeller.png', alt: 'Centrifugal impeller', caption: 'Impeller', category: 'Mechanical Parts', partId: 'part_impeller' },
  { src: '/screenshots/23-injection-mold.png', alt: 'Injection mold core with cooling channels', caption: 'Injection Mold', category: 'Manufacturing', partId: 'part_injection_mold' },
  { src: '/screenshots/36-building-with-interior.png', alt: 'Building with full interior — furniture, walls, stairs', caption: 'Building Interior', category: 'Architecture', partId: 'part_chinese_building' },
  { src: '/screenshots/42-walk-mode.png', alt: 'First-person walk mode inside the building', caption: 'Walk Mode', category: 'Interactive', partId: 'part_chinese_building' },
  { src: '/screenshots/56-walk-mode-textures.png', alt: 'Bold procedural textures visible in walk mode', caption: 'Procedural Textures', category: 'Interactive', partId: 'part_chinese_building' },
  { src: '/screenshots/59-massive-stairs-walk-mode.png', alt: 'Physical stairs with railings in walk mode', caption: 'Stairs & Railings', category: 'Interactive', partId: 'part_chinese_building' },
  { src: '/screenshots/68-pyramid-realistic.png', alt: 'Pyramid with realistic shadows and lighting', caption: 'Dynamic Shadows', category: 'Architecture', partId: 'part_pyramid' },
  { src: '/screenshots/70-pyramid-non-uniform.png', alt: 'Non-uniform pyramid textures — each block is unique', caption: 'Non-Uniform Textures', category: 'Architecture', partId: 'part_pyramid' },
  { src: '/screenshots/06-command-palette.png', alt: 'Command palette (Cmd+K)', caption: 'Command Palette', category: 'UI Features', partId: 'part_gearbox_housing' },
  { src: '/screenshots/01-part-studio-dark.png', alt: 'Part studio in dark mode', caption: 'Dark Mode', category: 'UI Features', partId: 'part_gearbox_housing' },
  { src: '/screenshots/02-part-studio-light.png', alt: 'Part studio in light mode', caption: 'Light Mode', category: 'UI Features', partId: 'part_gearbox_housing' },
  { src: '/screenshots/03-assembly.png', alt: 'Assembly workspace', caption: 'Assembly Mode', category: 'UI Features', partId: 'part_gearbox_complete' },
  { src: '/screenshots/04-drawing.png', alt: 'Drawing workspace', caption: 'Drawing Mode', category: 'UI Features', partId: 'part_gearbox_housing' },
];

const stats = [
  { value: '56+', label: '3D Models' },
  { value: '50+', label: 'Changes' },
  { value: '8', label: 'Phases' },
  { value: '100%', label: 'Procedural' },
];

export function LandingPage({ onLaunch }: LandingPageProps) {
  const [currentHero, setCurrentHero] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', 'Mechanical Parts', 'Aerospace', 'Manufacturing', 'Architecture', 'Interactive', 'UI Features', 'Engine Parts', 'Power Transmission', 'Thermal'];
  const filteredImages = selectedCategory === 'All'
    ? featureImages
    : featureImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-bold text-lg">
              Z
            </div>
            <span className="text-lg font-bold tracking-tight">Super Z CAD</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#gallery" className="hover:text-white transition">Gallery</a>
            <a href="#models" className="hover:text-white transition">Models</a>
            <a href="#tech" className="hover:text-white transition">Tech Stack</a>
          </div>
          <button
            onClick={() => onLaunch()}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 transition font-medium text-sm"
          >
            Launch Studio →
          </button>
        </div>
      </nav>

      {/* Hero Section with rotating screenshots */}
      <section className="relative h-screen flex items-center justify-center pt-16">
        {/* Background image carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: i === currentHero ? 0.35 : 0,
                backgroundImage: `url(${img.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium text-white/80 mb-6">
            56+ Procedural 3D Models · WebGL · Zero Assets
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Browser-Based CAD<br />Reimagined
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            A production-grade CAD platform inspired by Onshape, built with Next.js, Three.js, and TypeScript.
            Every model is procedurally generated at runtime — no external assets, no downloads, just pure code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onLaunch()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 transition font-semibold text-base shadow-lg shadow-orange-500/25"
            >
              Launch ZCAD Studio →
            </button>
            <a
              href="#gallery"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 transition font-medium text-base"
            >
              View Gallery
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Gallery — 24+ screenshots */}
      <section id="gallery" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Feature Gallery</h2>
            <p className="text-white/50 text-lg">24 screenshots showcasing every major feature and model</p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-orange-500/50 transition cursor-pointer"
                onClick={() => onLaunch(img.partId)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                {/* Single caption bar — always visible, brightens on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition group-hover:from-black group-hover:via-black/70">
                  <div className="text-xs text-orange-400 font-medium mb-0.5 opacity-70 group-hover:opacity-100 transition">{img.category}</div>
                  <div className="text-sm font-semibold text-white/80 group-hover:text-white transition">{img.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🏭', title: '50+ Mechanical Parts', desc: 'Gears, shafts, bearings, engines, CNC machines, turbine blades, rocket injectors, F1 uprights — all procedurally generated with engineering detail.' },
              { icon: '🏗️', title: '5 Architectural Models', desc: 'Chinese pagoda, LA mansion, Great Pyramid, Bay Area apartment, and desktop battlestation — each with full interiors and walk-mode support.' },
              { icon: '🚶', title: 'First-Person Walk Mode', desc: 'Walk through any architectural model with gravity, wall collision, stair climbing, jumping, and noclip flight mode. WASD + mouse drag look.' },
              { icon: '🎨', title: '30+ Procedural Textures', desc: 'Herringbone oak, chevron walnut, hex marble, subway tile, carbon fiber, brushed aluminum, fruit textures, price tags, product boxes, and more.' },
              { icon: '🎲', title: 'Interactive ViewCube', desc: 'Blender-style 3D navigation cube with drag-to-orbit, face snapping, and real-time camera sync. Dark color-coded faces with inset panels.' },
              { icon: '💡', title: 'Dynamic Lighting', desc: 'Directional sun with 2048×2048 shadow maps, point lights, hemisphere fills, RGB emissive elements, and warm golden-hour presets.' },
              { icon: '🏎️', title: 'F1 Car (Exploded + Assembled)', desc: '17 component groups with 250+ meshes — V6 turbo hybrid, suspension, halo, DRS, T-wing. Toggle between exploded and assembled views.' },
              { icon: '🛒', title: 'Grocery Store', desc: '60m × 40m supermarket with 8 aisles (1600+ products), produce section, bakery, deli, dairy wall, frozen foods, and 6 checkout lanes.' },
              { icon: '⚡', title: 'Optimized Performance', desc: 'Material hoisting, geometry sharing, GPU memory disposal, throttled event dispatching, and no double-rendering in walk mode.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Showcase — 4 large images */}
      <section id="models" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Model Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { src: '/screenshots/31-mega-cnc-machine.png', title: 'Mega CNC Machine', desc: 'Super-detailed 5-axis machining center with ATC, coolant system, trunnion table, and control cabinet — all in a single mesh group.', partId: 'part_mega_cnc' },
              { src: '/screenshots/68-pyramid-realistic.png', title: 'Great Pyramid of Giza', desc: '40-layer limestone pyramid with gold capstone, interior chambers, Sphinx, satellite pyramids, and 5-light dynamic system with 2048 shadow maps.', partId: 'part_pyramid' },
              { src: '/screenshots/62-la-mansion.png', title: 'LA Hills Mansion', desc: '3-level luxury home with infinity pool, glass walls, cantilevered sections, retaining walls, and panoramic city views.', partId: 'part_la_mansion' },
              { src: '/screenshots/36-building-with-interior.png', title: 'Chinese 3-Story Building', desc: 'Traditional pagoda with full interior across 3 floors — furniture, occupants, physical stairs, and 14 bold procedural textures.', partId: 'part_chinese_building' },
            ].map((model, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer" onClick={() => onLaunch(model.partId)}>
                <img src={model.src} alt={model.title} className="w-full aspect-video object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-bold mb-2">{model.title}</h3>
                  <p className="text-sm text-white/60">{model.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Built With Modern Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Next.js 16', desc: 'App Router + Turbopack' },
              { name: 'Three.js', desc: 'WebGL2 rendering' },
              { name: 'TypeScript 5', desc: 'Strict type safety' },
              { name: 'Tailwind CSS 4', desc: 'Utility-first styling' },
              { name: 'Zustand', desc: 'State management' },
              { name: 'shadcn/ui', desc: 'Component library' },
              { name: 'Radix UI', desc: 'Accessible primitives' },
              { name: 'Prisma', desc: 'ORM (optional)' },
            ].map((tech, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-base font-semibold text-orange-400">{tech.name}</div>
                <div className="text-xs text-white/40 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to explore?</h2>
          <p className="text-white/50 text-lg mb-10">
            Launch the studio and browse 56+ procedurally generated 3D models — from mechanical engineering parts
            to full architectural scenes you can walk through.
          </p>
          <button
            onClick={() => onLaunch()}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 transition font-bold text-lg shadow-xl shadow-orange-500/25"
          >
            Launch ZCAD Studio →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-xs font-bold">Z</div>
            <span>Super Z CAD — Browser-Based 3D Modeling Platform</span>
          </div>
          <div>Built with Next.js 16 · Three.js · TypeScript · 51 changes across 8 phases</div>
        </div>
      </footer>
    </div>
  );
}
