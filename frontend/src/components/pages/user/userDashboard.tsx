import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserGrid } from './userGrid'
import { UserFormDialog } from './userFormDialog'
import { RefreshCw, UserPlus } from 'lucide-react'
import { useApi } from '@/api/api'
import { useToast } from '@/hooks/useToast'

export function UserDashboard() {
  const { user } = useApi()
  const { setLoading } = useToast()
  const { data: users, isLoading, refetch } = user.useAllUsersQuery()
  setLoading('Loading users', isLoading)
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <UserFormDialog
            mode="create"
            triggerComponent={
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4"/>
                Add User
              </Button> as React["JSX.Element"]
            }
            onSuccess={() => refetch()}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGrid
            users={users || []}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
    </div>
  )
}
