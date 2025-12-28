import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, RotateCcw, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { StatusBadge as SharedStatusBadge } from '@/components/grid/cellRenderers/StatusBadge'

interface JobStatus {
  status: 'pending' | 'running' | 'completed' | 'failed'
}

// Re-export shared StatusBadge for job status
export function StatusBadge({ status }: JobStatus) {
  return <SharedStatusBadge value={status} type="job-status" />
}

interface MessageIdCellProps {
  messageId: string
}

export function MessageIdCell({ messageId }: MessageIdCellProps) {
  const shortId = messageId.substring(0, 8)
  return (
    <span className="font-mono text-sm" title={messageId}>
      {shortId}...
    </span>
  )
}

interface CompletedAtCellProps {
  completedAt: string | null
}

export function CompletedAtCell({ completedAt }: CompletedAtCellProps) {
  if (!completedAt) return <span className="text-muted-foreground">-</span>

  try {
    const formattedDate = format(new Date(completedAt), 'MM/dd/yyyy HH:mm:ss')
    return (
      <span className="text-sm font-mono" title={completedAt}>
        {formattedDate}
      </span>
    )
  } catch {
    return <span className="text-sm">{completedAt}</span>
  }
}

interface ActionButtonsProps {
  messageId: string
  status: string
  onViewDetails: (messageId: string) => void
  onRetry: (messageId: string) => void
  onCancel: (messageId: string) => void
}

export function ActionButtons({
  messageId,
  status,
  onViewDetails,
  onRetry,
  onCancel,
}: ActionButtonsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(messageId)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {status === 'failed' && (
          <DropdownMenuItem onClick={() => onRetry(messageId)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Job
          </DropdownMenuItem>
        )}
        {status === 'pending' && (
          <DropdownMenuItem onClick={() => onCancel(messageId)} className="text-destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Job
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}