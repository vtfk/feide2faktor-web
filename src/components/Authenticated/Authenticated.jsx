import { useState } from "react"
import { Spinner, Heading3 } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

//Querries 
import { CheckUser, ValidateAPIToken } from '../../utils/queries'

export default function Authenticated() {
    const navigate = useNavigate()
    const { isAuthenticated, user, token } = useSession()

    const [isLoading, setIsLoading] = useState(true)
    
    const apiToken = window.sessionStorage.getItem('selvbetjening-Auth')
    
    const resultTokenValidation = ValidateAPIToken(token)
    const tokenTest = CheckUser(user.pid) 
    
    // Check if apiToken is pressent in the session storage, if token is present. Try to performe a request to check if it is valid.
    if(isAuthenticated && apiToken) {
        //Check the request
        if(tokenTest.data?.status === 200){
            navigate('/checkuser')
        }
    }
    //If no apiToken use the token from idporten to ask for a valid apitoken. If the token from idporten is valid an apiToken will be set in the session storage.
    if(isAuthenticated && !apiToken) {
        if(resultTokenValidation.isLoading) {
        }
        if(resultTokenValidation.error) {
            navigate('/notfound')
            console.log(resultTokenValidation.isError)
        }
        if(resultTokenValidation.data) {
            const name = 'selvbetjening-Auth'
            console.log(resultTokenValidation.data.data)
            window.sessionStorage.setItem(name, resultTokenValidation.data.data)
            setIsLoading(false)
            navigate('/checkuser')
        }
    }

    if(isLoading) {
        return (
            <div className={styles.center}>
                <div className={styles.heading}>
                    <Heading3>Du logges inn, venligst vent</Heading3>
                </div>
                <div className={styles.qrCode}>
                    <Spinner size='medium' transparent />
                </div>
            </div>
        )
    }  
}

