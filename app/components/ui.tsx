import clsx from 'clsx'
import type { ComponentProps } from 'react'

export function Button({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium',
        'bg-white/10 hover:bg-white/15 border border-white/10',
        'transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  )
}

export function PrimaryButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium',
        'bg-white text-black hover:bg-white/90',
        'transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={clsx(
        'w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm',
        'placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/25',
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm min-h-[120px]',
        'placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/25',
        className
      )}
      {...props}
    />
  )
}

export function Chip({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80',
        className
      )}
      {...props}
    />
  )
}
