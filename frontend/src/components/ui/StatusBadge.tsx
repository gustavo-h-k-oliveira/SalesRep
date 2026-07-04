import type { BadgeTone } from '../../utils/status'

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-700',
}

interface StatusBadgeProps {
  label: string
  tone: BadgeTone
}

export default function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  )
}
