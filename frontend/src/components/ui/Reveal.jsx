import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/lib/cn';

/** How many items still get an increasing delay before it flattens out. */
const MAX_STAGGER_INDEX = 11;

/**
 * Fades a block up as it mounts. Used for page sections so content arrives
 * instead of snapping in. `delay` is in milliseconds.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, ...props }) {
  return (
    <Tag
      className={cn('animate-reveal', className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals a grid's children one after another. The delay index is written onto
 * each child as a CSS variable (see the `.stagger` utility), so no extra
 * wrapper elements are inserted and the grid layout stays intact.
 */
export function Stagger({ as: Tag = 'div', step = 45, className, children, ...props }) {
  return (
    <Tag className={cn('stagger', className)} style={{ '--stagger-step': `${step}ms` }} {...props}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return cloneElement(child, {
          style: {
            ...child.props.style,
            '--i': Math.min(index, MAX_STAGGER_INDEX),
          },
        });
      })}
    </Tag>
  );
}
