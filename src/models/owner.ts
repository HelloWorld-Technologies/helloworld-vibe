export interface UploadOwnerLeadPayload {
  name: string;
  phone: string;
  email: string;
  city: string;
  /** Free-text location / locality from the form (optional for older callers). */
  location?: string;
}

export type UploadOwnerLeadResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};
