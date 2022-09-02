import { Button, Heading3, Heading2, Spinner } from '@vtfk/components'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@vtfk/react-oidc';
import styles from './styles.module.css'
import React, {useState} from "react";
import GuideModal from '../../utils/Guide';

export default function Login() {
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)
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
                For å kunne benytte deg av selvbetjeningsportalen må du logge deg inn ved bruk av ID-Porten. 
                Her kan du velge BankID, BuyPass ID eller Commfides som innlogginsmetode. 
                <br/>
                <br/>
                Om du skulle lure på noe kan du trykke på «Hjelp» knappen. Denne vil du også finne igjen etter at du har logget inn i menyen som du finner oppe i høyre hjørne av applikasjonen.                </Heading3>
                </div>
            </div>
            <div className={styles.button}>
                <div className={styles.rejected}>
                    <Button onClick={onLogin} >
                        Login med ID-Porten
                    </Button>
                </div>
                <div className={styles.button}> 
                    <Button onClick={ () => setShowModal(true)}>
                        Hjelp
                    </Button>
                </div>
            </div>
            <GuideModal open={showModal} close={() => {setShowModal(false)}} />
        </div>
    )
}

  