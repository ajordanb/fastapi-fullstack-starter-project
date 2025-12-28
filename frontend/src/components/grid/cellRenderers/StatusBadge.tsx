import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import type { ICellRendererParams } from 'ag-grid-community'

type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

interface StatusBadgeProps {
  value: boolean | JobStatus
  type?: 'boolean' | 'job-status'
  showIcon?: boolean
}

const jobStatusConfig: Record<JobStatus, { label: string; variant: 'secondary' | 'default' | 'destructive'; className: string }> = {
  pending: { label: 'Pending', variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
  running: { label: 'Running', variant: 'default', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', variant: 'default', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', variant: 'destructive', className: 'bg-red-100 text-red-800' },
}

export function StatusBadge({ value, type = 'boolean', showIcon = true }: StatusBadgeProps) {
  if (type === 'job-status') {
    const status = value as JobStatus
    const config = jobStatusConfig[status] || jobStatusConfig.pending
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const isActive = Boolean(value)

  if (showIcon) {
    return isActive ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3.5 w-3.5 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="h-3.5 w-3.5 mr-1" />
        Inactive
      </Badge>
    )
  }

  return (
    <Badge variant={isActive ? 'default' : 'secondary'} className="capitalize">
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )
}

export const StatusBadgeCellRenderer: React.FC<ICellRendererParams & { type?: 'boolean' | 'job-status'; showIcon?: boolean }> = (params) => {
  return <StatusBadge value={params.value} type={params.type} showIcon={params.showIcon} />
}
