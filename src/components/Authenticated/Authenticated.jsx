import { useState, useEffect } from "react"
import { Spinner } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

export default function Authenticated() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSession()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(isAuthenticated === true) {
            navigate('/checkuser')
            setIsLoading(false)
        }
    })

    if(isLoading) {
        return (
            <div className={styles.center}>
                <Spinner size='medium' transparent />
            </div>
        )
        
    }  
}
