import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PortalPos {
  top: number
  left: number
  width: number
  placement: 'bottom' | 'top'
}

/** Calculates fixed position for a portal dropdown relative to a trigger element. */
export function getPortalPosition(
  triggerEl: HTMLElement,
  dropdownHeight = 300,
  preferredPlacement: 'bottom' | 'top' = 'bottom'
): PortalPos {
  const r = triggerEl.getBoundingClientRect()
  const spaceBelow = window.innerHeight - r.bottom
  const spaceAbove = r.top
  const placement =
    preferredPlacement === 'bottom' && spaceBelow < dropdownHeight && spaceAbove > spaceBelow
      ? 'top'
      : preferredPlacement
  return {
    top: placement === 'bottom' ? r.bottom + 4 : r.top - 4,
    left: r.left,
    width: r.width,
    placement,
  }
}

/** Portal wrapper — renders children into document.body. */
export function FloatingPortal({ children }: { children: React.ReactNode }) {
  return ReactDOM.createPortal(children, document.body)
}
