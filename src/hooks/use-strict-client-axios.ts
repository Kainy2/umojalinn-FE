import { strictClientAxios } from '@/lib/axios';
import { useSession } from 'next-auth/react';


export const useStrictClientAxios = () => {
	const { data } = useSession();
	if (!data?.accessToken) return;

	strictClientAxios.interceptors.request.use(
		(config) => {
			config.headers.Authorization = `Bearer ${data?.accessToken}`;
			return config
		}
	)

	return ({
		strictClientAxios,
		token: data?.accessToken
	})
}

