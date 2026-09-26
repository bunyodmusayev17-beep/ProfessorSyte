import { Bot, CheckCircle2, CircuitBoard, Cpu, Drone, Printer, ShoppingBag } from 'lucide-react';

/** Icons riding the two orbits around the central chip. */
const ORBIT_ICONS = [
  { icon: Bot, orbit: 'outer', angle: 0 },
  { icon: Drone, orbit: 'outer', angle: 120 },
  { icon: Printer, orbit: 'outer', angle: 240 },
  { icon: CircuitBoard, orbit: 'inner', angle: 60 },
];

const ORBITS = {
  inner: { size: 200, duration: '22s' },
  outer: { size: 330, duration: '36s' },
};

/** Circuit traces leaving the chip, drawn with a travelling dash of light. */
const TRACES = [
  'M200 200 H120 V110 H60',
  'M200 200 H300 V90 H350',
  'M200 200 V310 H90',
  'M200 200 H320 V300 H360',
];

/**
 * The decorative right half of the hero: a glowing microcontroller with
 * components in orbit and a couple of floating "product" chips. Pure CSS
 * animation, aria-hidden — it carries no content.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[420px] select-none">
      {/* Circuit traces */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="trace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {TRACES.map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="rgb(148 163 184 / 0.12)" strokeWidth="1.5" />
            <path
              d={d}
              fill="none"
              stroke="url(#trace)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="14 186"
              className="animate-dash"
            />
          </g>
        ))}
      </svg>

      {/* Orbits */}
      {Object.entries(ORBITS).map(([name, { size, duration }]) => (
        <div
          key={name}
          className="animate-spin-slow absolute top-1/2 left-1/2 rounded-full border border-dashed border-white/10"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            animationDuration: duration,
            animationDirection: name === 'inner' ? 'reverse' : 'normal',
          }}
        >
          {ORBIT_ICONS.filter((item) => item.orbit === name).map(({ icon: Icon, angle }) => (
            <span
              key={angle}
              className="absolute top-1/2 left-1/2"
              style={{ transform: `rotate(${angle}deg) translateY(${-size / 2}px)` }}
            >
              {/* Counter-rotate so the icon stays upright while orbiting. */}
              <span
                className="animate-spin-slow -mt-5 -ml-5 block size-10"
                style={{
                  animationDuration: duration,
                  animationDirection: name === 'inner' ? 'normal' : 'reverse',
                }}
              >
                <span
                  className="glass border-line text-primary-light flex size-10 items-center justify-center rounded-xl border shadow-lg"
                  style={{ transform: `rotate(${-angle}deg)` }}
                >
                  <Icon size={18} />
                </span>
              </span>
            </span>
          ))}
        </div>
      ))}

      {/* Central chip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="bg-brand animate-ping-slow absolute inset-0 rounded-3xl opacity-30" />
        <span className="bg-brand absolute -inset-6 rounded-full opacity-40 blur-2xl" />
        <div className="bg-brand animate-gradient relative flex size-24 items-center justify-center rounded-3xl bg-[length:200%_200%] shadow-2xl">
          <div className="bg-bg/85 flex size-[88px] items-center justify-center rounded-[20px]">
            <Cpu size={44} className="text-primary-light" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Floating info chips */}
      <div className="animate-float glass border-line absolute top-[6%] -left-2 flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 shadow-xl sm:-left-6">
        <span className="bg-success/20 text-success flex size-8 items-center justify-center rounded-lg">
          <CheckCircle2 size={16} />
        </span>
        <span>
          <span className="text-fg block text-xs font-semibold">Lesson complete</span>
          <span className="text-subtle block text-[10px]">Line-follower robot</span>
        </span>
      </div>

      <div
        className="animate-float glass border-line absolute -right-2 bottom-[8%] flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 shadow-xl sm:-right-6"
        style={{ animationDelay: '-3s' }}
      >
        <span className="bg-warning/20 text-warning flex size-8 items-center justify-center rounded-lg">
          <ShoppingBag size={16} />
        </span>
        <span>
          <span className="text-fg block text-xs font-semibold">Gear list included</span>
          <span className="text-subtle block text-[10px]">Every part, one click away</span>
        </span>
      </div>
    </div>
  );
}
