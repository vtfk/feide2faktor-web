import { Button, Heading3, Heading2, Spinner } from '@vtfk/components'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@vtfk/react-oidc';
import styles from './styles.module.css'
import React from "react";

export default function Login() {
    const navigate = useNavigate()


    const { isAuthenticated, login, authStatus, loginError } = useSession()

    if(['pending'].includes(authStatus)) {
        return  <div className={styles.center}>
                    <Spinner size='medium' transparent />
                </div>
    }
    
    if (isAuthenticated && authStatus === 'finished') {
        return navigate('/authenticated')
    }

    const onLogin = () => {
        try{
            login()
        } catch(error) {
            console.log(error)
            console.log(loginError())
        }
    }

    return(
        <div className={styles.center}>
            <div className={styles.heading}>
                <div className={styles.heading2}>
                <Heading2>
                    Velg innloggingsmetode.
                </Heading2>
                </div>
                <div>
                <Heading3>
                    For at du skal kunne opprette 2-faktor for din feidekonto forutsetter det at du har en feidekonto og mulighet til å bruke Google Authenticator. Du kan også bruke den andre metoden, hvor du skriver inn koden.  
                </Heading3>
                </div>
            </div>
            <div className={styles.button}>
                <div className={styles.rejected}>
                    <Button onClick={onLogin} >
                        Login med ID-Porten
                    </Button>
                </div>
                <div className={styles.authenticated}> 
                    <Button onClick={ () => navigate('/authenticated')}>
                        Microsoft
                    </Button>
                </div>
            </div>
        </div>
    )
}

  