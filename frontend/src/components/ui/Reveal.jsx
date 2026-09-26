import { Children, cloneElement, isValidElement } from 'react';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';

/** How many items still get an increasing delay before it flattens out. */
const MAX_STAGGER_INDEX = 11;

/**
 * Fades and un-blurs a block up the first time it scrolls into view, so long
 * pages unfold as you read instead of everything animating off-screen at once.
 * `delay` is in milliseconds.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...props }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      data-inview={inView}
      className={cn('reveal-on-scroll', className)}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals a grid's children one after another once the grid is on screen. The
 * delay index is written onto each child as a CSS variable (see `.stagger`),
 * so no extra wrapper elements are inserted and the grid layout stays intact.
 */
export function Stagger({ as: Tag = 'div', step = 60, className, children, ...props }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={cn(inView ? 'stagger' : '[&>*]:opacity-0', className)}
      style={{ '--stagger-step': `${step}ms` }}
      {...props}
    >
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
