import { AbpApiClient } from '../abp-api-client.js';
import { applicationTools } from './application-tools.js';
import { moduleTools } from './module-tools.js';
import { entityTools } from './entity-tools.js';
import { userTools } from './user-tools.js';
import { tenantTools } from './tenant-tools.js';
import { permissionTools } from './permission-tools.js';
import { auditTools } from './audit-tools.js';
import { backgroundJobTools } from './background-job-tools.js';
import { uiTools } from './ui-tools.js';

export interface ToolHandler {
  name: string;
  description: string;
  inputSchema: any;
  execute: (args: any) => Promise<any>;
}

export type ToolHandlers = Record<string, ToolHandler>;

export function abpTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    ...applicationTools(apiClient),
    ...moduleTools(apiClient),
    ...entityTools(apiClient),
    ...userTools(apiClient),
    ...tenantTools(apiClient),
    ...permissionTools(apiClient),
    ...auditTools(apiClient),
    ...backgroundJobTools(apiClient),
    ...uiTools(apiClient),
  };
} 