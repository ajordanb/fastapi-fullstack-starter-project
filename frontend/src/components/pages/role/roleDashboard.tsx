import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RoleGrid } from './roleGrid'
import { RoleFormDialog } from './roleFormDialog'
import { RefreshCw, Plus } from 'lucide-react'
import { useApi } from '@/api/api'
import { useToast } from '@/hooks/useToast'

export function RoleDashboard() {
  const { role } = useApi()
  const { setLoading } = useToast()
  const { data: roles, isLoading, refetch } = role.useAllRolesQuery()
  setLoading('Loading roles', isLoading)
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage system roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <RoleFormDialog
            mode="create"
            triggerComponent={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4"/>
                Add Role
              </Button> as React["JSX.Element"]
            }
            onSuccess={() => refetch()}
          />
        </div>
      </div>


      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
          <CardDescription>
            View and manage all roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleGrid
            roles={roles || []}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
    </div>
  )
}
