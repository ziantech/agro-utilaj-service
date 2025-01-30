export interface IGeneralMessage {
  message: string;
  type: 'success' | 'error' | '';
}
export interface IErrorResponse {
  message: string;
  field?: string;
}
