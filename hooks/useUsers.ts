import {useQuery} from '@tanstack/react-query';
import { fetchUsers } from "@/lib/api";

export function useUsers(){
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        // Stability over surprise refetches
        staleTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
