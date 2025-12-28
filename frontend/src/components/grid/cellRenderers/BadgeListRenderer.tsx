import { Badge } from '@/components/ui/badge'
import type { ICellRendererParams } from 'ag-grid-community'

interface BadgeListRendererProps {
  value: string[] | { name: string }[] | null | undefined
  maxDisplay?: number
  variant?: 'outline' | 'secondary' | 'default'
  colorClass?: string
  emptyText?: string
  centered?: boolean
}

function getItemName(item: string | { name: string }): string {
  return typeof item === 'string' ? item : item.name
}

export function BadgeListRenderer({
  value,
  maxDisplay,
  variant = 'outline',
  colorClass = 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50',
  emptyText = 'None',
  centered = false,
}: BadgeListRendererProps) {
  if (!value || value.length === 0) {
    return <span className="text-gray-400">{emptyText}</span>
  }

  const items = value as (string | { name: string })[]
  const displayItems = maxDisplay ? items.slice(0, maxDisplay) : items
  const remainingCount = maxDisplay && items.length > maxDisplay ? items.length - maxDisplay : 0

  return (
    <div className={`flex flex-wrap gap-1 ${centered ? 'justify-center items-center w-full' : ''}`}>
      {displayItems.map((item, index) => {
        const name = getItemName(item)
        return (
          <Badge
            key={`${name}-${index}`}
            variant={variant}
            className={`flex-shrink-0 ${variant === 'outline' ? colorClass : 'text-xs'}`}
          >
            {name}
          </Badge>
        )
      })}
      {remainingCount > 0 && (
        <Badge variant={variant} className={variant === 'outline' ? colorClass : 'text-xs'}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}

export const ScopesBadgeCellRenderer: React.FC<ICellRendererParams & { maxDisplay?: number }> = (params) => {
  return (
    <BadgeListRenderer
      value={params.value}
      maxDisplay={params.maxDisplay}
      emptyText="No scopes"
      centered={true}
    />
  )
}

export const RolesBadgeCellRenderer: React.FC<ICellRendererParams & { maxDisplay?: number }> = (params) => {
  return (
    <BadgeListRenderer
      value={params.value}
      maxDisplay={params.maxDisplay}
      emptyText="No roles"
      centered={true}
    />
  )
}
