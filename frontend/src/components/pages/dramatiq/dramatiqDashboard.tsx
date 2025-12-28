import React, { useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { JobsGrid } from './jobsGrid'
import { JobDetailModal } from './jobDetailModal'
import { RefreshCw } from 'lucide-react'
import { type Job } from '@/api/dramatiq/model'
import { useApi } from '@/api/api'
import { useToast } from '@/hooks/useToast'
import useModalContext from '@/hooks/useModal'

export function DramatiqDashboard() {
  const { dramatiq } = useApi()
  const { setLoading } = useToast()
  const { openModal } = useModalContext()
  const [selectedQueue, setSelectedQueue] = useState('default')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const { data: queues } = dramatiq.useAllQueuesQuery()

  const { data: jobs, isLoading: isJobsLoading, refetch: refetchJobs } = dramatiq.useAllJobsQuery(
    selectedQueue,
    100
  )

  const retryJobMutation = dramatiq.retryJob
  const cancelJobMutation = dramatiq.cancelJob

  setLoading("Loading jobs", isJobsLoading)

  const handleViewDetails = async (messageId: string) => {
    const job = jobs?.find((j) => j.message_id === messageId)
    if (job) {
      setSelectedJob(job)
      openModal('job-detail-modal')
    }
  }

  const handleRetryJob = async (messageId: string) => {
    try {
      await retryJobMutation.mutateAsync(messageId)
      refetchJobs()
    } catch (error) {
      console.error('Failed to retry job:', error)
    }
  }

  const handleCancelJob = async (messageId: string) => {
    try {
      await cancelJobMutation.mutateAsync(messageId)
      refetchJobs()
    } catch (error) {
      console.error('Failed to cancel job:', error)
    }
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Monitoring</h1>
          <p className="text-muted-foreground">Monitor and manage background jobs</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchJobs()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>


      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>View and manage all background jobs</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select queue" />
                </SelectTrigger>
                <SelectContent>
                  {queues?.map((queue) => (
                    <SelectItem key={queue} value={queue}>
                      {queue}
                    </SelectItem>  as React["JSX.Element"]
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <JobsGrid
            jobs={jobs || []}
            isLoading={isJobsLoading}
            onViewDetails={handleViewDetails}
            onRetry={handleRetryJob}
            onCancel={handleCancelJob}
          />
        </CardContent>
      </Card>

      <div className="hidden">
        <JobDetailModal
          job={selectedJob}
          onRetry={handleRetryJob}
          triggerComponent={<div />}
        />
      </div>
    </div>
  )
}
