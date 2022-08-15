//React Query
import { useQuery } from "react-query";

// API
import { getName } from "./api";

export function Name(pid) {
    const {isLoading, isError, data, error} = useQuery(['name', pid], () => getName(pid))
    return {isLoading, isError, data, error}
}

// export const useAddNewTempSecret = (pid) => {
//     return useMutation(postMFA(pid))
// }

