import { extractErrorMessage } from '@helpers';

export type State<T> = {
  data: T,
  loading: boolean;
  errorMessage: string;
}

export const createState = <T>(data: T, loading = false, error?: unknown): State<T> => ({
  data,
  loading,
  errorMessage: error ? extractErrorMessage(error) : '',
});

export const stateSuccess = <T>(data: T): State<T> => createState(data);

export const stateLoading = <T>(loading = true): Partial<State<T>> => ({ loading });

export const stateError = <T>(error: unknown, resetData?: T): Partial<State<T>> => {
  const errorMessage = extractErrorMessage(error);

  return resetData
    ? createState(resetData, false, error)
    : { loading: false, errorMessage };
};
