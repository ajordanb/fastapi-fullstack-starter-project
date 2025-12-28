import { useMemo } from 'react'
import { type ColDef } from 'ag-grid-community'
import { type UserRole } from '@/api/user/model'
import { Badge } from '@/components/ui/badge'
import CustomGrid from '@/components/grid/customGrid'
import { BadgeListRenderer } from '@/components/grid/cellRenderers/BadgeListRenderer'

interface RolesGridProps {
  roles: UserRole[]
  isLoading: boolean
}

function RoleNameBadge({ value }: { value: string }) {
  if (!value) return null

  const colorMap: Record<string, string> = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    manager: 'bg-blue-50 text-blue-700 border-blue-200',
    user: 'bg-green-50 text-green-700 border-green-200',
  }

  const colorClass = colorMap[value.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <Badge variant="outline" className={`capitalize ${colorClass}`}>
      {value}
    </Badge>
  )
}

export function RolesGrid({ roles, isLoading }: RolesGridProps) {
  const columnDefs = useMemo<ColDef<UserRole>[]>(
    () => [
      {
        headerName: 'Role Name',
        field: 'name',
        cellRenderer: (params: any) => <RoleNameBadge {...params} />,
        filter: 'agTextColumnFilter',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Description',
        field: 'description',
        filter: 'agTextColumnFilter',
        flex: 2,
        minWidth: 200,
      },
      {
        headerName: 'Scopes',
        field: 'scopes',
        cellRenderer: (params: any) => (
          <BadgeListRenderer
            value={params.value}
            maxDisplay={3}
            variant="secondary"
            emptyText="No scopes"
          />
        ),
        minWidth: 250,
        flex: 2,
      },
      {
        headerName: 'Created By',
        field: 'created_by',
        filter: 'agTextColumnFilter',
        flex: 1,
        minWidth: 150,
      },
    ],
    []
  )

  return (
    <CustomGrid<UserRole>
      rowData={roles}
      columnDefs={columnDefs}
      pagination={true}
      paginationPageSize={10}
      defaultColDef={{
        sortable: true,
        resizable: true,
        filter: true,
      }}
      enableSearch={true}
    />
  )
}
