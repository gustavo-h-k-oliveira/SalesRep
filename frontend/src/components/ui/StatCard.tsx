import type { LucideIcon } from 'lucide-react'

export type StatCardTone = 'green' | 'amber' | 'orange' | 'red'

const toneStyles: Record<StatCardTone, { border: string; iconBg: string; iconColor: string }> = {
  green: { border: 'border-l-green-500', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  amber: { border: 'border-l-amber-400', iconBg: 'bg-amber-100', iconColor: 'text-amber-500' },
  orange: { border: 'border-l-orange-500', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
  red: { border: 'border-l-red-500', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
}

interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: LucideIcon
  tone: StatCardTone
}

export default function StatCard({ title, value, subtitle, icon: Icon, tone }: StatCardProps) {
  const styles = toneStyles[tone]

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${styles.border}`}
    >
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}>
        <Icon className={`h-6 w-6 ${styles.iconColor}`} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="truncate text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  )
}
