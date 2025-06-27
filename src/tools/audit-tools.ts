import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function auditTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_audit_logs: {
      name: 'abp_get_audit_logs',
      description: 'Get ABP audit logs with optional filtering',
      inputSchema: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            description: 'Start date filter (ISO 8601 format)',
          },
          endDate: {
            type: 'string',
            description: 'End date filter (ISO 8601 format)',
          },
          userId: {
            type: 'string',
            description: 'Filter by user ID',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { startDate, endDate, userId } = z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          userId: z.string().optional(),
        }).parse(args);
        
        const auditLogs = await apiClient.getAuditLogs(startDate, endDate, userId);
        return {
          success: true,
          data: auditLogs,
          count: auditLogs.length,
          dateRange: startDate && endDate ? { startDate, endDate } : null,
          uniqueUsers: [...new Set(auditLogs.map(log => log.userId).filter(Boolean))].length,
          uniqueServices: [...new Set(auditLogs.map(log => log.serviceName).filter(Boolean))].length,
        };
      },
    } as ToolHandler,

    abp_get_audit_log: {
      name: 'abp_get_audit_log',
      description: 'Get a specific ABP audit log by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The audit log ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const auditLog = await apiClient.getAuditLog(id);
        return {
          success: true,
          data: auditLog,
        };
      },
    } as ToolHandler,

    abp_get_audit_summary: {
      name: 'abp_get_audit_summary',
      description: 'Get a summary of audit log statistics',
      inputSchema: {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Number of days to look back for statistics',
            default: 7,
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { days } = z.object({ days: z.number().default(7) }).parse(args);
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        const auditLogs = await apiClient.getAuditLogs(
          startDate.toISOString(),
          endDate.toISOString()
        );
        
        // Calculate statistics
        const totalLogs = auditLogs.length;
        const uniqueUsers = [...new Set(auditLogs.map(log => log.userId).filter(Boolean))];
        const uniqueServices = [...new Set(auditLogs.map(log => log.serviceName).filter(Boolean))];
        const errorLogs = auditLogs.filter(log => log.exception);
        const averageExecutionTime = auditLogs.reduce((sum, log) => sum + log.executionDuration, 0) / totalLogs;
        
        // Top services by usage
        const serviceUsage = auditLogs.reduce((acc, log) => {
          if (log.serviceName) {
            acc[log.serviceName] = (acc[log.serviceName] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        
        const topServices = Object.entries(serviceUsage)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([service, count]) => ({ service, count }));
        
        return {
          success: true,
          data: {
            period: {
              days,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
            summary: {
              totalLogs,
              uniqueUsers: uniqueUsers.length,
              uniqueServices: uniqueServices.length,
              errorLogs: errorLogs.length,
              errorRate: totalLogs > 0 ? (errorLogs.length / totalLogs * 100).toFixed(2) + '%' : '0%',
              averageExecutionTime: Math.round(averageExecutionTime),
            },
            topServices,
            recentErrors: errorLogs.slice(0, 5).map(log => ({
              id: log.id,
              serviceName: log.serviceName,
              methodName: log.methodName,
              executionTime: log.executionTime,
              exception: log.exception?.substring(0, 200) + (log.exception && log.exception.length > 200 ? '...' : ''),
            })),
          },
        };
      },
    } as ToolHandler,
  };
} 