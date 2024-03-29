// React
import { useState, useEffect } from "react"
import { Button, Heading3, Spinner, Heading2 } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import BasicSnackbar from "../../utils/BasicSnackbar"


// API
import { checkUser, postMFA} from "../../utils/api"

//Queries
import { Name } from "../../utils/queries"
import AnimateWarning from "../AnimateWarning"

export default function CreateMFA() {
    const { isAuthenticated, logout } = useSession()
    const navigate = useNavigate()

    let pid
    if(window.sessionStorage.getItem('IDPorten-AUTH') !== null) {
        // Get the pid
        pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]
    }

    // States
    const [isLoading, setIsLoading] = useState(true)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [userStatus, setUserStatus] = useState([])
    const [mfaCreated, setMfaCreated] = useState([])
    const [stateChange, setStateChange] = useState([])
    const [snackOpen, setSnackOpen] = useState(false)


    // Check userstatus
    useEffect (() => {
        let didCancel = false
        async function getUserStatus() {
            if(!didCancel && userStatus === []) {
                const userStatusRequest = await checkUser(pid)
                const userStatus = userStatusRequest.status
                setUserStatus(userStatus)
            }
        }
        getUserStatus()
        return () => {
            didCancel = true
        }
    }, [pid])

    // Redirect user if user is not allowed to be here.
    useEffect (() => {
        if(!isAuthenticated && userStatus !== 200) {
            navigate('/')
        }
    })

    // Check the mfa status of the user and redirect to the correct step. 
    useEffect(() => {
        setIsLoading(true)
        let didCancel = false

        async function checkMFA() {
            if(!didCancel) {
                // Get data from the mongoDB
                const checkMFA = await checkUser(pid)
                if(checkMFA.data?.active === false) {
                    window.sessionStorage.removeItem('selvbetjening-Auth')
                    window.sessionStorage.removeItem('IDPorten-AUTH')
                    logout()
                } 
        
                if(checkMFA.status === 200 && checkMFA.data.userMongo[0]?.tempSecret) {
                    navigate('/verifyMFA')
                }
                else if(checkMFA.status === 200 && !checkMFA.data.userMongo[0]?.tempSecret && !checkMFA.data.userMongo[0]?.secret && !checkMFA.data.userAzureAD?.norEduPersonAuthnMethod) { 
                    navigate('/createmfa')
                } 
                else if(checkMFA.status === 200 && !checkMFA.data.userMongo[0]?.secret && checkMFA.data.userAzureAD?.norEduPersonAuthnMethod && !checkMFA.data.userMongo[0]?.tempSecret) {
                    navigate('/createmfa')
                } 
                else if(checkMFA.status === 200 && checkMFA.data.userMongo[0]?.secret && checkMFA.data.userAzureAD.norEduPersonAuthnMethod) {
                    navigate('/verified') 
                }
                else if(checkMFA.status === 200 && checkMFA.data.userMongo[0]?.secret && !checkMFA.data.userAzureAD.norEduPersonAuthnMethod) {
                    navigate('/verified') 
                }
                setIsLoading(false)
                setIsButtonLoading(false)
            }
        }

        checkMFA()
        return () => {
            didCancel = true
        }
    }, [])

    const handleClose = (event, reason) => {
        setIsButtonLoading(false)
        if(reason === 'clickaway') {
            return
        }
        if(mfaCreated.status === 201 && stateChange === true && isButtonLoading === false) {
            setSnackOpen(false)
            setStateChange(false)
            navigate('/verifyMFA')
        }
        if(mfaCreated.status !== 201 && stateChange === true && isButtonLoading === false) {
            setSnackOpen(false)
            setStateChange(false)
        }
    }

    //Get the users name
    const name = Name(pid)

    // Create MFA
    useEffect(() => {
        if(stateChange === true) {
            setIsButtonLoading(true)
        }
        let didCancel = false

        async function createMFA() {
            if(!didCancel && stateChange === true) {
                const postMFAData = await postMFA(pid)
                const data = await postMFAData
                setMfaCreated(await data)
                if(postMFAData.data?.active === false) {
                    window.sessionStorage.removeItem('selvbetjening-Auth')
                    setTimeout(() => {  logout() }, 5000);
                    setSnackOpen(true)
                }
                setIsButtonLoading(false)
            }
        }
        createMFA()
        return () => {
            didCancel = true 
        }
    }, [stateChange, pid])
    
    // Handle the "Opprett MFA" button click
    const handleClick = () => {
        setStateChange(true)
        setSnackOpen(true)
    }

    if(isLoading) {
        return ( 
            <div className={styles.center}>
                <div className={styles.heading}>
                    <Heading3>Sjekker din tofaktor status, venligst vent</Heading3>
                </div>
                <div className={styles.qrCode}>
                    <Spinner size='medium' transparent />
                </div>
            </div>
        )
    }
    
    return (
        <div className={styles.center}>
            <div className={styles.heading}>
                <Heading2>Hei {name.data} </Heading2>
            </div>
            <div className={styles.heading}>
                <Heading3>Du har ikke opprettet tofaktor til din konto, opprett tofaktor til din feidekonto ved å trykke på knappen under.</Heading3>
            </div>
            <div className={styles.warn}>
                <AnimateWarning/>
            </div>
            <div className={styles.btn}>
                {isButtonLoading ? (<Button spinner> Opprett Tofaktor</Button>) : (
                    <Button onClick={() => {
                        handleClick()
                    }}
                    disabled={snackOpen}
                    >
                        Opprett Tofaktor
                </Button>
                )}
            </div>
            <BasicSnackbar 
                open={snackOpen && mfaCreated.status === 201 && stateChange === true}
                onClose={handleClose}
                autoHide={2000}
                severity="success"
                message="Du har nå opprettet tofaktor."
            />
            <BasicSnackbar 
                open={snackOpen && mfaCreated.status !== 201 && stateChange === true && isButtonLoading === false}
                onClose={handleClose}
                autoHide={2000}
                severity="error"
                message="Oi, her gikk det galt. Prøv igjen."
            />
             <BasicSnackbar 
                open={snackOpen && mfaCreated.data?.active === false}
                onClose={handleClose}
                autoHide={3000}
                severity="info"
                message="Du må logge inn på nytt, du blir nå logget ut"
            />
        </div>        
    )
}

