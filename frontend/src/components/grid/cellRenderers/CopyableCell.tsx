import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import type { ICellRendererParams } from 'ag-grid-community'

interface CopyableCellProps {
  value: string
  truncate?: boolean
  maxWidth?: string
  monospace?: boolean
}

export function CopyableCell({
  value,
  truncate = true,
  maxWidth = '200px',
  monospace = true,
}: CopyableCellProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs ${monospace ? 'font-mono' : ''} ${truncate ? 'truncate' : ''}`}
        style={truncate ? { maxWidth } : undefined}
        title={value}
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 flex-shrink-0"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  )
}

export const CopyableCellRenderer: React.FC<ICellRendererParams & { truncate?: boolean; maxWidth?: string; monospace?: boolean }> = (params) => {
  return (
    <CopyableCell
      value={params.value}
      truncate={params.truncate}
      maxWidth={params.maxWidth}
      monospace={params.monospace}
    />
  )
}
