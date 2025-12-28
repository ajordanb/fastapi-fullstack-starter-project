import { useMemo, useState } from 'react'
import { type ColDef } from 'ag-grid-community'
import { type ApiKey } from '@/api/user/model'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import CustomGrid from '@/components/grid/customGrid'
import { useApi } from '@/api/api'
import { useToast } from '@/hooks/useToast'
import { StatusBadge } from '@/components/grid/cellRenderers/StatusBadge'
import { BadgeListRenderer } from '@/components/grid/cellRenderers/BadgeListRenderer'
import { CopyableCell } from '@/components/grid/cellRenderers/CopyableCell'
import { DeleteConfirmDialog } from '@/components/grid/cellRenderers/DeleteConfirmDialog'

interface ApiKeysGridProps {
  apiKeys: ApiKey[]
  isLoading: boolean
  onRefresh?: () => void
}

function ActionButtons({ data, onDelete }: { data: ApiKey; onDelete: (id: string) => void }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => onDelete(data.id)}
        title="Delete API Key"
        description="Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access for any applications using this key."
        confirmText="Delete"
      />
    </>
  )
}

export function ApiKeysGrid({ apiKeys, isLoading, onRefresh }: ApiKeysGridProps) {
  const { user } = useApi()
  const { toast, setLoading } = useToast()
  const deleteApiKeyMutation = user.deleteApiKey

  const handleDelete = async (id: string) => {
    try {
      await deleteApiKeyMutation.mutateAsync(id)
      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      })
      onRefresh?.()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete API key',
      })
    }
  }

  setLoading('Deleting API key', deleteApiKeyMutation.isPending)

  const columnDefs = useMemo<ColDef<ApiKey>[]>(
    () => [
      {
        headerName: 'Client ID',
        field: 'client_id',
        cellRenderer: (params: any) => <CopyableCell value={params.value} maxWidth="200px" />,
        filter: 'agTextColumnFilter',
        flex: 2,
        minWidth: 250,
      },
      {
        headerName: 'Status',
        field: 'active',
        cellRenderer: (params: any) => <StatusBadge value={params.value} type="boolean" showIcon={false} />,
        filter: 'agTextColumnFilter',
        width: 110,
      },
      {
        headerName: 'Scopes',
        field: 'scopes',
        cellRenderer: (params: any) => (
          <BadgeListRenderer
            value={params.value}
            maxDisplay={2}
            variant="outline"
            emptyText="No scopes"
          />
        ),
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: 'Actions',
        field: 'id',
        cellRenderer: (params: any) => (
          <ActionButtons {...params} onDelete={handleDelete} />
        ),
        width: 80,
        sortable: false,
        filter: false,
        pinned: 'right',
      },
    ],
    [handleDelete]
  )

  return (
    <CustomGrid<ApiKey>
      rowData={apiKeys}
      columnDefs={columnDefs}
      loading={isLoading}
      pagination={true}
      paginationPageSize={10}
      paginationPageSizeSelector={[5, 10, 20]}
      defaultColDef={{
        sortable: true,
        resizable: true,
        filter: true,
      }}
      domLayout="autoHeight"
      enableSearch={true}
    />
  )
}
