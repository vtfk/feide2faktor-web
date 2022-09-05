// React
import { useState, useEffect } from "react"
import { Button, Heading3, Spinner, TextField } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import BasicSnackbar from "../../utils/BasicSnackbar"

// API
import { checkUser, getSecret, getQrCode, verifyToken } from "../../utils/api"

export default function VerifyMFA() {
    const { isAuthenticated } = useSession()
    const navigate = useNavigate()

    // Get the pid
    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]

    // Get the amr value Eks: BankID
    const amr = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[3].split('"')[3]

    // get the acr value Eks: Level4
    const acr = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[7].split('"')[3]

    // States
    const [isLoading, setIsLoading] = useState(true)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [userStatus, setUserStatus] = useState([])
    const [qrCode, setQrCode] = useState([])
    const [secretCode, setSecretCode] = useState([])
    const [tokenInput, setTokenInput] = useState('')
    const [tokenData, setTokenData] = useState([])
    const [stateChange, setStateChange] = useState(false)
    const [mfaValidCheck, setMfaValidCheck] = useState(true)
    const [snackOpen, setSnackOpen] = useState(false)

    // Check userstatus
    useEffect(() => {
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
    useEffect(() => {
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
                setIsButtonLoading(false)
                setIsLoading(false)
            }
        }

        checkMFA()
        return () => {
            didCancel = true
        }
    }, [pid])

    const handleClose = (event, reason) => {
        setIsButtonLoading(false)
        if(reason === 'clickaway') {
            return
        }
        if(tokenData.length !== 0 && tokenData.data?.verified === 'Verified' && isButtonLoading === false) {
            setSnackOpen(false)
            setStateChange(false)
            setTokenInput('')
            navigate('/verified')
        }
        if(tokenData.length !== 0 && tokenData.data?.verified === 'Not verified' && isButtonLoading === false) {
            setSnackOpen(false)
            setStateChange(false)
            setTokenInput('')
            setMfaValidCheck(false)
        }
    }
     
    // Get user secret and the qr-code
    useEffect(() => {
        setIsLoading(true)
        let didCancel = false

        async function getUserSecret() {
            if(!didCancel) {
                const qrCode = await getQrCode(pid)
                const secret = await getSecret(pid)
                const dataQrCode = await qrCode.data
                const dataSecret = await secret.data

                setQrCode(await dataQrCode)
                setSecretCode(await dataSecret)
                setIsLoading(false)
            }
        }

        getUserSecret()
        return () => {
            didCancel = true
        }
    },[pid])

    // Try to verify the token input
    useEffect(() => {
        if(stateChange === true) {
            setIsButtonLoading(true)
        }
        let didCancel = false

        async function verifyMFA() {
            if(!didCancel && stateChange === true) {
                setTokenData([])
                const postVerifyToken = await verifyToken(tokenInput, pid, acr, amr)
                setTokenData(await postVerifyToken)
                setIsButtonLoading(false)
            }
        }

        verifyMFA()
        return() => {
            didCancel = true
        }
    }, [stateChange, pid, mfaValidCheck])

    if(isLoading || qrCode.length === 0) {
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
            <div>
                <Heading3>
                    Legg til din nøkkel ved å skanne QR-Koden eller skriv inn hemmeligheten som står under QR-Koden i din autentiserings applikasjon.
                </Heading3>
            </div>
            <div>
                <div className={styles.qrCode}>
                    <img alt="qrcode" src={`data:image/jpeg;base64,${qrCode}`} />
                </div>
                <div className={styles.heading}>
                    <Heading3>{secretCode}</Heading3>
                </div>
            </div>
            <div className={styles.TextField}>
                <TextField 
                    placeholder='Eks: 123456' 
                    type='number' 
                    rounded hint='Skriv inn din 6-sifrede kode som du finner i din autentiserings applikasjon.' 
                    alwaysHint
                    required
                    onChange={(e) => setTokenInput(e.target.value)} 
                />
            </div>
            <div className={styles.heading}>
                <Heading3>
                    Skriv inn din 6-sifrede kode som du finner i din autentiserings applikasjon og trykk på valider. 
                </Heading3>
            </div>
            <div className={styles.btn}>
                {isButtonLoading ? (<Button spinner> Valider</Button>) : (<Button onClick={() => {
                    setSnackOpen(true)
                    setMfaValidCheck(true) 
                    setStateChange(true);
                    }} 
                    disabled={tokenInput.length < 6 || snackOpen}
                    >
                        Valider
                </Button>)}
            </div>
            <BasicSnackbar 
                open={snackOpen && tokenData.length !== 0 && tokenData.data?.verified === 'Verified'}
                onClose={handleClose}
                autoHide={2000}
                severity="success"
                message="Validering vellykket."
            />
            <BasicSnackbar 
                open={snackOpen && tokenData.length !== 0 && tokenData.data?.verified === 'Not verified'}
                onClose={handleClose}
                autoHide={3000}
                severity="error"
                message="Validering feilet, prøv igjen."
            />
        </div> 
    )
}

