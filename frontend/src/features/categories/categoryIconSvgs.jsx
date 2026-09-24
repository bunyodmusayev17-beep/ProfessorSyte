/**
 * The four custom tech icons from the reference design, drawn in a matching
 * line style. Generic icons (folder, book, people, chart) come from lucide.
 *
 * This module exports components only, so fast refresh keeps working.
 */

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ children, ...props }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...strokeProps}>{children}</g>
    </svg>
  );
}

/**
 * Arduino — two joined rings with the - / + terminals, the recognisable part of
 * the logo. Kept to simple shapes so it still reads at 16px.
 */
export function ArduinoIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="7.6" cy="12" r="4.9" />
      <circle cx="16.4" cy="12" r="4.9" />
      <path d="M5.6 12h4" />
      <path d="M14.4 12h4M16.4 10v4" />
    </Svg>
  );
}

/** 3D printing — an isometric cube. */
export function PrinterCubeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2.8l8 4.6v9.2L12 21.2 4 16.6V7.4l8-4.6Z" />
      <path d="M4 7.4l8 4.6 8-4.6M12 12v9.2" />
    </Svg>
  );
}

/** Robotics — a jointed arm with a gripper. */
export function RobotArmIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 20.5h8M5.5 20.5v-3h4v3" />
      <path d="M7.5 17.5 10 10l6-2.2" />
      <path d="M15.2 5.2l3.6 1.3-1.3 3.6-3.6-1.3 1.3-3.6Z" />
      <path d="M18.8 6.5 21 5.7M17.5 10.1l.8 2.2" />
      <circle cx="10" cy="10" r="1.3" />
    </Svg>
  );
}

/** Drones — a quadcopter seen from above. */
export function DroneIcon(props) {
  return (
    <Svg {...props}>
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.4" />
      <path d="M9.2 9.2 6.2 6.2M14.8 9.2l3-3M9.2 14.8l-3 3M14.8 14.8l3 3" />
      <circle cx="4.6" cy="4.6" r="2.2" />
      <circle cx="19.4" cy="4.6" r="2.2" />
      <circle cx="4.6" cy="19.4" r="2.2" />
      <circle cx="19.4" cy="19.4" r="2.2" />
    </Svg>
  );
}
