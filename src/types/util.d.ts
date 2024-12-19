export type SingleApiResponse<T = unknown> = {
  data: T;
  message: string;
  status: number;
};

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
