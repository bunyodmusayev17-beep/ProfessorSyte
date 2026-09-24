import { useId } from 'react';

import { cn } from '@/lib/cn';

const CONTROL_CLASSES =
  'border-line bg-raised text-fg placeholder:text-subtle w-full rounded-lg border px-3 py-2 text-sm ' +
  'transition-colors focus:border-primary focus:outline-none disabled:opacity-60';

/**
 * Label + control + error message, wired together with a generated id so every
 * field is announced correctly by screen readers. The control is rendered by a
 * child function that receives the wiring props.
 */
export function Field({ label, error, hint, required, children, className }) {
  const id = useId();

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-fg block text-sm font-medium">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
        className: cn(CONTROL_CLASSES, error && 'border-danger focus:border-danger'),
      })}

      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-subtle text-xs">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextInput({ label, error, hint, required, className, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {({ className: controlClassName, ...wiring }) => (
        <input
          {...wiring}
          required={required}
          {...props}
          className={cn(controlClassName, props.className)}
        />
      )}
    </Field>
  );
}

export function TextArea({ label, error, hint, required, rows = 3, className, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {({ className: controlClassName, ...wiring }) => (
        <textarea
          {...wiring}
          rows={rows}
          required={required}
          {...props}
          className={cn(controlClassName, 'resize-y', props.className)}
        />
      )}
    </Field>
  );
}

export function Select({ label, error, hint, required, children, className, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {({ className: controlClassName, ...wiring }) => (
        <select
          {...wiring}
          required={required}
          {...props}
          className={cn(controlClassName, props.className)}
        >
          {children}
        </select>
      )}
    </Field>
  );
}

export function Checkbox({ label, description, className, ...props }) {
  const id = useId();
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <input
        id={id}
        type="checkbox"
        className="border-line accent-primary mt-0.5 size-4 shrink-0 rounded border"
        {...props}
      />
      <label htmlFor={id} className="text-fg text-sm select-none">
        {label}
        {description && <span className="text-subtle block text-xs">{description}</span>}
      </label>
    </div>
  );
}
