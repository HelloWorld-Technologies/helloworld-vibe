export interface UploadOwnerLeadPayload {
  name: string;
  phone: string;
  email: string;
  city: string;
}

export type UploadOwnerLeadResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};
