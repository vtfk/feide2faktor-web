//React Query
import { useQuery } from "react-query";

// API
import { getName, validateToken, checkUser } from "./api";

export function Name(pid) {
    const {isLoading, isError, data, error} = useQuery(['name', pid], () => getName(pid))
    return {isLoading, isError, data, error}
}

export function ValidateAPIToken(token) {
    const {isLoading, isError, data, error} = useQuery (['apitoken', token], () => validateToken(token))
    return {isLoading, isError, data, error}
}

export function CheckUser(pid) {
    const {isLoading, isError, data, error} = useQuery (['userstatus', pid], () => checkUser(pid))
    return {isLoading, isError, data, error}
}