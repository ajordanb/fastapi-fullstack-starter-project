import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { ICellRendererParams } from 'ag-grid-community'
import { Edit, MoreHorizontal, Trash2, Eye, Lock } from 'lucide-react'
import type { Role } from '@/api/role/model'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RoleFormDialog } from './roleFormDialog'
import { RoleDetailModal } from './roleDetailModal'
import { useApi } from '@/api/api'
import { useToast } from '@/hooks/useToast'
import { ScopesBadgeCellRenderer } from '@/components/grid/cellRenderers/BadgeListRenderer'
import { DeleteConfirmDialog } from '@/components/grid/cellRenderers/DeleteConfirmDialog'

// Re-export shared ScopesBadge for backward compatibility
export const ScopesBadge = ScopesBadgeCellRenderer

export const CreatedByBadge: React.FC<ICellRendererParams> = (params) => {
  const createdBy = params.value as string

  const isSystem = createdBy.toLowerCase() === 'system'

  return isSystem ? (
    <Badge
      variant="outline"
      className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50"
    >
      <Lock className="h-3 w-3 mr-1" />
      System
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50"
    >
      {createdBy}
    </Badge>
  )
}

export const ActionButtons: React.FC<ICellRendererParams> = (params) => {
  const { setSuccess, setError } = useToast()
  const role = params.data as Role
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const api = useApi()

  const isSystemRole = role.created_by.toLowerCase() === 'system'

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true)
      await api.role.deleteRole.mutateAsync((role.id || role._id) as string)
      setSuccess('Role deleted successfully')
      setIsDeleteAlertOpen(false)

      // Remove from grid
      params.api.applyTransaction({ remove: [role] })
    } catch (error: any) {
      setError(error.message || 'Failed to delete role')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View Details */}
          <RoleDetailModal
            role={role}
            triggerComponent={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
            }
          />

          {/* Edit Role - Disabled for system roles */}
          <RoleFormDialog
            role={role}
            mode="edit"
            triggerComponent={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={isSystemRole}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Role
              </DropdownMenuItem>
            }
            onSuccess={() => params.api.refreshCells({ force: true })}
          />

          <DropdownMenuSeparator />

          {/* Delete Role - Disabled for system roles */}
          <DropdownMenuItem
            onClick={() => !isSystemRole && setIsDeleteAlertOpen(true)}
            className="text-red-600 focus:text-red-600"
            disabled={isSystemRole || isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={confirmDelete}
        isSubmitting={isSubmitting}
        description={
          <>
            This action will permanently delete the role{' '}
            <strong>{role.name}</strong>. This action cannot be undone and may
            affect users with this role.
          </>
        }
      />
    </>
  )
}