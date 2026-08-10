export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'editor' | 'viewer';
  organizationId: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  requireNDA: boolean;
  defaultWatermark: boolean;
  watermarkText?: string;
  allowDownload: boolean;
  allowPrint: boolean;
  sessionTimeout: number; // minutes
  ipRestriction?: string[];
  domainRestriction?: string[];
  branding: {
    logoUrl?: string;
    primaryColor?: string;
    customDomain?: string;
  };
}

export interface VirtualDataRoom {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  ndaRequired: boolean;
  ndaTemplateId?: string;
  watermarkEnabled: boolean;
  watermarkText?: string;
  allowDownload: boolean;
  allowPrint: boolean;
  expirationDate?: Date;
  password?: string;
  ipRestriction?: string[];
  viewerRestrictions: ViewerRestrictions;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ViewerRestrictions {
  disableScreenshots: boolean;
  disableCopy: boolean;
  dynamicWatermark: boolean;
  viewOnly: boolean;
  expireAfterView?: number; // seconds
  maxViews?: number;
}

export interface Document {
  id: string;
  vdrId: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  version: number;
  parentId?: string; // for folder structure
  isFolder: boolean;
  path: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  checksum: string;
  virusScanStatus: 'pending' | 'clean' | 'infected';
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface NDATemplate {
  id: string;
  organizationId: string;
  name: string;
  content: string; // HTML or PDF content
  fields: NDAField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NDAField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'signature';
  required: boolean;
  placeholder?: string;
}

export interface NDAAgreement {
  id: string;
  templateId: string;
  vdrId: string;
  viewerEmail: string;
  viewerName: string;
  viewerCompany?: string;
  signedAt: Date;
  ipAddress: string;
  userAgent: string;
  fields: Record<string, string>;
  signatureImage?: string; // base64 encoded
  status: 'pending' | 'signed' | 'declined';
  expiresAt?: Date;
}

export interface AccessGrant {
  id: string;
  vdrId: string;
  userId?: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  status: 'pending' | 'active' | 'revoked';
  ndaSigned?: boolean;
  ndaAgreementId?: string;
  message?: string;
}

export interface ActivityLog {
  id: string;
  organizationId: string;
  vdrId?: string;
  documentId?: string;
  userId?: string;
  userEmail: string;
  action: ActivityAction;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export type ActivityAction =
  | 'vdr_created'
  | 'vdr_updated'
  | 'vdr_archived'
  | 'document_uploaded'
  | 'document_downloaded'
  | 'document_viewed'
  | 'document_printed'
  | 'nda_signed'
  | 'nda_declined'
  | 'access_granted'
  | 'access_revoked'
  | 'access_requested'
  | 'watermark_applied'
  | 'screenshot_blocked'
  | 'copy_blocked'
  | 'login'
  | 'logout'
  | 'password_changed'
  | 'settings_updated';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  limits: PlanLimits;
  stripePriceId: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PlanLimits {
  maxVDRs: number;
  maxDocuments: number;
  maxStorageGB: number;
  maxUsers: number;
  watermarking: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  ssoIntegration: boolean;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface UsageMetrics {
  organizationId: string;
  period: string; // YYYY-MM
  vdrCount: number;
  documentCount: number;
  storageUsed: number; // bytes
  userCount: number;
  viewsCount: number;
  downloadsCount: number;
  ndaCount: number;
}

export interface AnalyticsEvent {
  id: string;
  vdrId: string;
  documentId: string;
  userId?: string;
  userEmail: string;
  eventType: 'view' | 'download' | 'print' | 'share' | 'revoke';
  timestamp: Date;
  duration?: number; // seconds viewed
  pageNumber?: number;
  ipAddress: string;
  country?: string;
  city?: string;
  device: string;
  browser: string;
  os: string;
}

export interface Notification {
  id: string;
  organizationId: string;
  userId?: string;
  type: 'email' | 'in_app' | 'webhook';
  event: string;
  recipients: string[];
  template: string;
  data: Record<string, any>;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
}

export interface AuditTrail {
  id: string;
  vdrId: string;
  action: string;
  performedBy: string;
  performedByEmail: string;
  timestamp: Date;
  ipAddress: string;
  details: Record<string, any>;
}
