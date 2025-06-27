import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface AbpApiClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

export interface AbpApplication {
  id: string;
  name: string;
  displayName: string;
  url: string;
  status: 'Running' | 'Stopped' | 'Error';
  version: string;
  framework: string;
  template: string;
  createdAt: string;
  lastModified: string;
}

export interface AbpModule {
  id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  dependencies: string[];
  isInstalled: boolean;
  packageName: string;
}

export interface AbpEntity {
  id: string;
  name: string;
  namespace: string;
  properties: AbpEntityProperty[];
  relationships: AbpEntityRelationship[];
  baseClass?: string;
  isAuditedEntity: boolean;
  isMultiTenant: boolean;
}

export interface AbpEntityProperty {
  name: string;
  type: string;
  isRequired: boolean;
  maxLength?: number;
  isNullable: boolean;
  defaultValue?: any;
}

export interface AbpEntityRelationship {
  name: string;
  targetEntity: string;
  type: 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany';
  navigationProperty?: string;
}

export interface AbpPermission {
  name: string;
  displayName: string;
  parentName?: string;
  isGrantedByDefault: boolean;
  multiTenancySide: 'Both' | 'Host' | 'Tenant';
  groupName: string;
}

export interface AbpUser {
  id: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  isActive: boolean;
  roleNames: string[];
  tenantId?: string;
  creationTime: string;
  lastLoginTime?: string;
}

export interface AbpTenant {
  id: string;
  name: string;
  isActive: boolean;
  editionId?: string;
  editionDisplayName?: string;
  connectionString?: string;
  creationTime: string;
  subscriptionEndDateUtc?: string;
}

export interface AbpAuditLog {
  id: string;
  userId?: string;
  userName?: string;
  tenantId?: string;
  tenantName?: string;
  serviceName?: string;
  methodName?: string;
  parameters?: string;
  returnValue?: string;
  executionTime: string;
  executionDuration: number;
  clientIpAddress?: string;
  browserInfo?: string;
  httpStatusCode?: number;
  exception?: string;
}

export interface AbpBackgroundJob {
  id: string;
  jobType: string;
  jobArgs: string;
  tryCount: number;
  maxTryCount: number;
  priority: 'Low' | 'Normal' | 'High';
  creationTime: string;
  nextTryTime: string;
  lastTryTime?: string;
  isAbandoned: boolean;
}

export interface AbpTheme {
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  customCss?: string;
}

export interface AbpLayout {
  name: string;
  displayName: string;
  description?: string;
  template?: string;
}

export interface AbpMenu {
  name: string;
  displayName: string;
  items: AbpMenuItem[];
}

export interface AbpMenuItem {
  name: string;
  displayName: string;
  url?: string;
  icon?: string;
  order?: number;
  requiredPermissionName?: string;
  target?: string;
  parentName?: string;
}

export interface AbpWidget {
  name: string;
  displayName: string;
  description?: string;
  type: 'chart' | 'table' | 'card' | 'custom';
  configuration?: any;
  permissions?: string[];
  refreshInterval?: number;
}

export interface AbpLocalizationResource {
  name: string;
  culture: string;
  key: string;
  value: string;
}

export interface AbpCulture {
  name: string;
  displayName: string;
}

export class AbpApiClient {
  private client: AxiosInstance;
  private config: AbpApiClientConfig;

  constructor(config: AbpApiClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for debugging
    this.client.interceptors.request.use(
      (config) => {
        console.error(`ABP API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('ABP API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('ABP API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/app/configuration');
      return response.status === 200;
    } catch (error) {
      throw new Error(`Connection test failed: ${error}`);
    }
  }

  // Application Management
  async getApplications(): Promise<AbpApplication[]> {
    const response = await this.client.get('/api/app/applications');
    return response.data.items || response.data;
  }

  async getApplication(id: string): Promise<AbpApplication> {
    const response = await this.client.get(`/api/app/applications/${id}`);
    return response.data;
  }

  async createApplication(application: Partial<AbpApplication>): Promise<AbpApplication> {
    const response = await this.client.post('/api/app/applications', application);
    return response.data;
  }

  async updateApplication(id: string, application: Partial<AbpApplication>): Promise<AbpApplication> {
    const response = await this.client.put(`/api/app/applications/${id}`, application);
    return response.data;
  }

  async deleteApplication(id: string): Promise<void> {
    await this.client.delete(`/api/app/applications/${id}`);
  }

  // Module Management
  async getModules(): Promise<AbpModule[]> {
    const response = await this.client.get('/api/app/modules');
    return response.data.items || response.data;
  }

  async getModule(id: string): Promise<AbpModule> {
    const response = await this.client.get(`/api/app/modules/${id}`);
    return response.data;
  }

  async installModule(packageName: string): Promise<AbpModule> {
    const response = await this.client.post('/api/app/modules/install', { packageName });
    return response.data;
  }

  async uninstallModule(id: string): Promise<void> {
    await this.client.delete(`/api/app/modules/${id}`);
  }

  // Entity Management
  async getEntities(namespace?: string): Promise<AbpEntity[]> {
    const params = namespace ? { namespace } : {};
    const response = await this.client.get('/api/app/entities', { params });
    return response.data.items || response.data;
  }

  async getEntity(id: string): Promise<AbpEntity> {
    const response = await this.client.get(`/api/app/entities/${id}`);
    return response.data;
  }

  async createEntity(entity: Partial<AbpEntity>): Promise<AbpEntity> {
    const response = await this.client.post('/api/app/entities', entity);
    return response.data;
  }

  async updateEntity(id: string, entity: Partial<AbpEntity>): Promise<AbpEntity> {
    const response = await this.client.put(`/api/app/entities/${id}`, entity);
    return response.data;
  }

  async deleteEntity(id: string): Promise<void> {
    await this.client.delete(`/api/app/entities/${id}`);
  }

  async generateCrud(entityId: string, options: any = {}): Promise<any> {
    const response = await this.client.post(`/api/app/entities/${entityId}/generate-crud`, options);
    return response.data;
  }

  // Permission Management
  async getPermissions(providerName?: string, providerKey?: string): Promise<AbpPermission[]> {
    const params: any = {};
    if (providerName) params.providerName = providerName;
    if (providerKey) params.providerKey = providerKey;
    
    const response = await this.client.get('/api/app/permissions', { params });
    return response.data.items || response.data;
  }

  async getPermissionsByGroup(groupName: string): Promise<AbpPermission[]> {
    const response = await this.client.get(`/api/app/permissions/groups/${groupName}`);
    return response.data.items || response.data;
  }

  async grantPermission(providerName: string, providerKey: string, permissionName: string): Promise<void> {
    await this.client.post('/api/app/permissions/grant', {
      providerName,
      providerKey,
      permissionName,
    });
  }

  async revokePermission(providerName: string, providerKey: string, permissionName: string): Promise<void> {
    await this.client.post('/api/app/permissions/revoke', {
      providerName,
      providerKey,
      permissionName,
    });
  }

  // User Management
  async getUsers(filter?: string, maxResultCount?: number): Promise<AbpUser[]> {
    const params: any = {};
    if (filter) params.filter = filter;
    if (maxResultCount) params.maxResultCount = maxResultCount;
    
    const response = await this.client.get('/api/identity/users', { params });
    return response.data.items || response.data;
  }

  async getUser(id: string): Promise<AbpUser> {
    const response = await this.client.get(`/api/identity/users/${id}`);
    return response.data;
  }

  async createUser(user: Partial<AbpUser> & { password: string }): Promise<AbpUser> {
    const response = await this.client.post('/api/identity/users', user);
    return response.data;
  }

  async updateUser(id: string, user: Partial<AbpUser>): Promise<AbpUser> {
    const response = await this.client.put(`/api/identity/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/api/identity/users/${id}`);
  }

  // Tenant Management (for multi-tenant apps)
  async getTenants(filter?: string): Promise<AbpTenant[]> {
    const params = filter ? { filter } : {};
    const response = await this.client.get('/api/saas/tenants', { params });
    return response.data.items || response.data;
  }

  async getTenant(id: string): Promise<AbpTenant> {
    const response = await this.client.get(`/api/saas/tenants/${id}`);
    return response.data;
  }

  async createTenant(tenant: Partial<AbpTenant>): Promise<AbpTenant> {
    const response = await this.client.post('/api/saas/tenants', tenant);
    return response.data;
  }

  async updateTenant(id: string, tenant: Partial<AbpTenant>): Promise<AbpTenant> {
    const response = await this.client.put(`/api/saas/tenants/${id}`, tenant);
    return response.data;
  }

  async deleteTenant(id: string): Promise<void> {
    await this.client.delete(`/api/saas/tenants/${id}`);
  }

  // Audit Logs
  async getAuditLogs(startDate?: string, endDate?: string, userId?: string): Promise<AbpAuditLog[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (userId) params.userId = userId;
    
    const response = await this.client.get('/api/audit-logging/audit-logs', { params });
    return response.data.items || response.data;
  }

  async getAuditLog(id: string): Promise<AbpAuditLog> {
    const response = await this.client.get(`/api/audit-logging/audit-logs/${id}`);
    return response.data;
  }

  // Background Jobs
  async getBackgroundJobs(jobType?: string): Promise<AbpBackgroundJob[]> {
    const params = jobType ? { jobType } : {};
    const response = await this.client.get('/api/background-jobs', { params });
    return response.data.items || response.data;
  }

  async getBackgroundJob(id: string): Promise<AbpBackgroundJob> {
    const response = await this.client.get(`/api/background-jobs/${id}`);
    return response.data;
  }

  async enqueueBackgroundJob(jobType: string, args: any, priority: 'Low' | 'Normal' | 'High' = 'Normal'): Promise<AbpBackgroundJob> {
    const response = await this.client.post('/api/background-jobs', {
      jobType,
      args: JSON.stringify(args),
      priority,
    });
    return response.data;
  }

  async deleteBackgroundJob(id: string): Promise<void> {
    await this.client.delete(`/api/background-jobs/${id}`);
  }

  async getBackgroundJobStats(): Promise<any> {
    const response = await this.client.get('/api/background-jobs/stats');
    return response.data;
  }

  // UI Development Methods
  async generatePage(pageData: {
    name: string;
    type: 'list' | 'detail' | 'create' | 'edit' | 'modal';
    entityId?: string;
    framework: 'mvc' | 'angular' | 'blazor' | 'blazor-server';
    route?: string;
    permissions?: string[];
    includeSearch?: boolean;
    includePaging?: boolean;
    includeExport?: boolean;
  }): Promise<any> {
    const response = await this.client.post('/api/suite/pages', pageData);
    return response.data;
  }

  async getThemes(): Promise<AbpTheme[]> {
    const response = await this.client.get('/api/themes');
    return response.data.items || [];
  }

  async getTheme(name: string): Promise<AbpTheme> {
    const response = await this.client.get(`/api/themes/${name}`);
    return response.data;
  }

  async applyTheme(themeData: {
    name: string;
    primaryColor?: string;
    secondaryColor?: string;
    customCss?: string;
  }): Promise<any> {
    const response = await this.client.post('/api/themes/apply', themeData);
    return response.data;
  }

  async generateComponent(componentData: {
    name: string;
    type: 'widget' | 'modal' | 'partial' | 'directive' | 'pipe';
    framework: 'mvc' | 'angular' | 'blazor' | 'blazor-server';
    properties?: Array<{
      name: string;
      type: string;
      required?: boolean;
      defaultValue?: any;
    }>;
    template?: string;
  }): Promise<any> {
    const response = await this.client.post('/api/suite/components', componentData);
    return response.data;
  }

  async getLayouts(): Promise<AbpLayout[]> {
    const response = await this.client.get('/api/ui/layouts');
    return response.data.items || [];
  }

  async getLayout(name: string): Promise<AbpLayout> {
    const response = await this.client.get(`/api/ui/layouts/${name}`);
    return response.data;
  }

  async updateLayout(name: string, layoutData: Partial<AbpLayout>): Promise<AbpLayout> {
    const response = await this.client.put(`/api/ui/layouts/${name}`, layoutData);
    return response.data;
  }

  async getMenus(): Promise<AbpMenu[]> {
    const response = await this.client.get('/api/ui/navigation/menus');
    return response.data.items || [];
  }

  async getMenu(name: string): Promise<AbpMenu> {
    const response = await this.client.get(`/api/ui/navigation/menus/${name}`);
    return response.data;
  }

  async updateMenu(name: string, menuData: Partial<AbpMenu>): Promise<AbpMenu> {
    const response = await this.client.put(`/api/ui/navigation/menus/${name}`, menuData);
    return response.data;
  }

  async addMenuItem(menuName: string, itemData: {
    name: string;
    displayName: string;
    url?: string;
    icon?: string;
    order?: number;
    requiredPermissionName?: string;
    target?: string;
    parentName?: string;
  }): Promise<any> {
    const response = await this.client.post(`/api/ui/navigation/menus/${menuName}/items`, itemData);
    return response.data;
  }

  async removeMenuItem(menuName: string, itemName: string): Promise<void> {
    await this.client.delete(`/api/ui/navigation/menus/${menuName}/items/${itemName}`);
  }

  async getWidgets(): Promise<AbpWidget[]> {
    const response = await this.client.get('/api/ui/widgets');
    return response.data.items || [];
  }

  async getWidget(name: string): Promise<AbpWidget> {
    const response = await this.client.get(`/api/ui/widgets/${name}`);
    return response.data;
  }

  async createWidget(widgetData: {
    name: string;
    displayName: string;
    description?: string;
    type: 'chart' | 'table' | 'card' | 'custom';
    configuration?: any;
    permissions?: string[];
    refreshInterval?: number;
  }): Promise<AbpWidget> {
    const response = await this.client.post('/api/ui/widgets', widgetData);
    return response.data;
  }

  async updateWidget(name: string, widgetData: Partial<AbpWidget>): Promise<AbpWidget> {
    const response = await this.client.put(`/api/ui/widgets/${name}`, widgetData);
    return response.data;
  }

  async deleteWidget(name: string): Promise<void> {
    await this.client.delete(`/api/ui/widgets/${name}`);
  }

  async generateForm(formData: {
    name: string;
    entityId?: string;
    fields: Array<{
      name: string;
      type: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'textarea' | 'file';
      label: string;
      required?: boolean;
      validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        min?: number;
        max?: number;
      };
      options?: Array<{ value: any; label: string }>;
      defaultValue?: any;
    }>;
    layout?: 'horizontal' | 'vertical' | 'inline';
    submitAction?: string;
    cancelAction?: string;
  }): Promise<any> {
    const response = await this.client.post('/api/suite/forms', formData);
    return response.data;
  }

  async getLocalizationResources(): Promise<AbpLocalizationResource[]> {
    const response = await this.client.get('/api/localization/resources');
    return response.data.items || [];
  }

  async getLocalizationResource(name: string, culture?: string): Promise<AbpLocalizationResource> {
    const url = culture 
      ? `/api/localization/resources/${name}?culture=${culture}`
      : `/api/localization/resources/${name}`;
    const response = await this.client.get(url);
    return response.data;
  }

  async updateLocalizationText(resourceName: string, data: {
    culture: string;
    key: string;
    value: string;
  }): Promise<any> {
    const response = await this.client.post(`/api/localization/resources/${resourceName}/texts`, data);
    return response.data;
  }

  async getSupportedCultures(): Promise<AbpCulture[]> {
    const response = await this.client.get('/api/localization/cultures');
    return response.data.items || [];
  }
} 