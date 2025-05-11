export type SingleApiResponse<T = unknown> = {
  data: T;
  message: string;
  status: number;
};

export type ArrayApiResponse<T = unknown> = SingleApiResponse<T[]> &
  Partial<{
    lastId: string;
    total: number;
    limit: number;
  }>;

export type ServerActionOption = {
  isServerAction?: boolean;
};

export type PageProps<
  T = Record<string, string | string[] | undefined>,
  U = Record<string, string | string[] | undefined>
> = {
  params: Promise<T>;
  searchParams: Promise<U>;
};

export type UmojaLinnTimestamp = {
  createdAt: string;
  updatedAt: string;
};
