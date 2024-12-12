import {
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type GenericUseQueryProps<T = unknown> = Partial<
  Omit<
    UndefinedInitialDataOptions<AxiosResponse<T>>,
    "queryKey" | "placeholderData" | "queryFn"
  >
>;

// export type GenericUseQueryWithSelectProps<T = unknown> = Partial<
//   Omit<
//     UndefinedInitialDataOptions<AxiosResponse<T>>,
//     "queryKey" | "placeholderData" | "queryFn"
//   >
// >;

export type GenericUseMutationProps<T = unknown, U = void> = Partial<
  Omit<UseMutationOptions<AxiosResponse<T>, Error, U, unknown>, "mutationFn">
>;
