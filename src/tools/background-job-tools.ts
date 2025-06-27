import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function backgroundJobTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_background_jobs: {
      name: 'abp_get_background_jobs',
      description: 'Get ABP background jobs with optional type filtering',
      inputSchema: {
        type: 'object',
        properties: {
          jobType: {
            type: 'string',
            description: 'Filter jobs by type (optional)',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { jobType } = z.object({ jobType: z.string().optional() }).parse(args);
        const jobs = await apiClient.getBackgroundJobs(jobType);
        
        return {
          success: true,
          data: jobs,
          count: jobs.length,
          pending: jobs.filter(j => !j.isAbandoned && j.tryCount < j.maxTryCount).length,
          completed: jobs.filter(j => !j.isAbandoned && j.tryCount >= j.maxTryCount).length,
          abandoned: jobs.filter(j => j.isAbandoned).length,
          jobTypes: [...new Set(jobs.map(j => j.jobType))],
        };
      },
    } as ToolHandler,

    abp_get_background_job: {
      name: 'abp_get_background_job',
      description: 'Get a specific ABP background job by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The background job ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const job = await apiClient.getBackgroundJob(id);
        return {
          success: true,
          data: job,
        };
      },
    } as ToolHandler,

    abp_enqueue_background_job: {
      name: 'abp_enqueue_background_job',
      description: 'Enqueue a new ABP background job',
      inputSchema: {
        type: 'object',
        properties: {
          jobType: {
            type: 'string',
            description: 'The fully qualified type name of the background job',
          },
          args: {
            type: 'object',
            description: 'Arguments for the background job',
          },
          priority: {
            type: 'string',
            description: 'Job priority',
            enum: ['Low', 'Normal', 'High'],
            default: 'Normal',
          },
        },
        required: ['jobType', 'args'],
      },
      execute: async (args) => {
        const { jobType, args: jobArgs, priority } = z.object({
          jobType: z.string(),
          args: z.any(),
          priority: z.enum(['Low', 'Normal', 'High']).default('Normal'),
        }).parse(args);
        
        const job = await apiClient.enqueueBackgroundJob(jobType, jobArgs, priority);
        return {
          success: true,
          data: job,
          message: `Background job '${jobType}' enqueued successfully`,
        };
      },
    } as ToolHandler,

    abp_delete_background_job: {
      name: 'abp_delete_background_job',
      description: 'Delete an ABP background job',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The background job ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        await apiClient.deleteBackgroundJob(id);
        return {
          success: true,
          message: `Background job deleted successfully`,
        };
      },
    } as ToolHandler,

    abp_get_common_job_types: {
      name: 'abp_get_common_job_types',
      description: 'Get list of common ABP background job types',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const commonJobTypes = [
          {
            name: 'Volo.Abp.Emailing.BackgroundJobs.BackgroundEmailSendingJob',
            displayName: 'Email Sending Job',
            description: 'Sends emails in the background',
            category: 'Communication',
          },
          {
            name: 'Volo.Abp.BackgroundJobs.BackgroundJobCleanupService',
            displayName: 'Background Job Cleanup',
            description: 'Cleans up completed background jobs',
            category: 'Maintenance',
          },
          {
            name: 'Volo.Abp.AuditLogging.BackgroundJobs.ExpiredAuditLogDeleterJob',
            displayName: 'Audit Log Cleanup',
            description: 'Deletes expired audit logs',
            category: 'Maintenance',
          },
          {
            name: 'Volo.Abp.Identity.BackgroundJobs.OrganizationUnitUserRemovalJob',
            displayName: 'Organization Unit User Removal',
            description: 'Removes users from organization units',
            category: 'Identity Management',
          },
          {
            name: 'Volo.Saas.Tenants.BackgroundJobs.TenantDatabaseMigrationJob',
            displayName: 'Tenant Database Migration',
            description: 'Migrates tenant databases',
            category: 'Multi-Tenancy',
          },
          {
            name: 'Volo.Chat.BackgroundJobs.ChatMessageCleanupJob',
            displayName: 'Chat Message Cleanup',
            description: 'Cleans up old chat messages',
            category: 'Communication',
          },
          {
            name: 'Volo.FileManagement.BackgroundJobs.FileCleanupJob',
            displayName: 'File Cleanup',
            description: 'Cleans up unused files',
            category: 'File Management',
          },
          {
            name: 'Volo.Payment.BackgroundJobs.PaymentWebhookJob',
            displayName: 'Payment Webhook Processing',
            description: 'Processes payment webhooks',
            category: 'Payment',
          },
        ];

        return {
          success: true,
          data: commonJobTypes,
          count: commonJobTypes.length,
          categories: [...new Set(commonJobTypes.map(j => j.category))],
        };
      },
    } as ToolHandler,
  };
} 