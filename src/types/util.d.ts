export type SingleApiResponse<T = unknown> = {
  data: T;
  message: string;
  status: number;
};
