import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

function Select<T = any>({ ...props }: SelectPrimitive.Root.Props<T>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <CaretDownIcon className="text-slate-500" />
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectPortal({ ...props }: SelectPrimitive.Portal.Props) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />
}

function SelectContent({
  className,
  children,
  ...props
}: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Positioner data-slot="select-positioner" className="z-50">
      <SelectPrimitive.Popup
        data-slot="select-content"
        className={cn(
          "min-w-[var(--trigger-width)] max-h-[var(--available-height)] overflow-y-auto rounded-lg border border-border bg-white p-1 text-slate-900 shadow-md outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        <SelectPrimitive.List className="outline-none">
          {children}
        </SelectPrimitive.List>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 hover:text-slate-950 transition-colors focus:bg-slate-50 focus:text-slate-950 data-selected:bg-slate-50 data-selected:text-slate-950 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4 text-emerald-600" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectItem,
}
