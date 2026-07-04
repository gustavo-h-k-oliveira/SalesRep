import { ArrowUp, BarChart3, Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PriorityItem, PriorityLevel } from '../../types/dashboard'

interface LevelConfig {
  label: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  textColor: string
  buttonClass: string
}

const levelConfig: Record<PriorityLevel, LevelConfig> = {
  alta: {
    label: 'Alta',
    icon: ArrowUp,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
    buttonClass: 'bg-red-600 text-white hover:bg-red-700',
  },
  media: {
    label: 'Média',
    icon: BarChart3,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    textColor: 'text-orange-500',
    buttonClass: 'bg-orange-500 text-white hover:bg-orange-600',
  },
  atencao: {
    label: 'Atenção',
    icon: Bell,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-500',
    buttonClass: 'bg-amber-400 text-slate-900 hover:bg-amber-500',
  },
}

export default function PriorityList({ items }: { items: PriorityItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Prioridades de hoje</h2>

      <div className="mt-2 divide-y divide-slate-100">
        {items.map((item, index) => {
          const config = levelConfig[item.level]
          const Icon = config.icon

          return (
            <div
              key={index}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div>
                  <p className={`font-semibold ${config.textColor}`}>{config.label}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={item.onAction}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${config.buttonClass}`}
              >
                {item.actionLabel}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
