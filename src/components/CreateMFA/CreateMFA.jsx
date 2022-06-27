// React
import { useState, useEffect } from "react"
import { Button, Heading3, Spinner, TextField, Dialog, DialogTitle, DialogBody, DialogActions, Heading2, Heading4 } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

// API
import { checkUser, getSecret, getQrCode, postMFA, verifyToken, deleteMFA, getName } from "../../utils/api"

// Animations
import AnimateError from "../AnimateError"
import AnimateSuccess from "../AnimateSuccess"

export default function CreateMFA() {
    const { isAuthenticated } = useSession()
    const navigate = useNavigate()

    // Get the pid
    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]

    // States
    const [isLoading, setIsLoading] = useState(true)
    const [userStatus, setUserStatus] = useState([])
    const [mfaCreated, setMfaCreated] = useState([])
    const [stateChange, setStateChange] = useState([])
    const [userName, setUserName] = useState([])
    const [modalOpen, setIsModalOpen] = useState(false)

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
        
                if(checkMFA.status === 200 && checkMFA.data.userMongo[0]?.tempSecret) {
                    console.log('must verify')
                    navigate('/verifyMFA')
                }
                else if(checkMFA.status === 200 && !checkMFA.data.userMongo[0]?.tempSecret && !checkMFA.data.userMongo[0]?.secret && !checkMFA.data.userAzureAD?.norEduPersonAuthnMethod) {
                    console.log('User have no MFA, must create one.') 
                    navigate('/createmfa')
                } 
                else if(checkMFA.status === 200 && !checkMFA.data.userMongo[0]?.secret && checkMFA.data.userAzureAD?.norEduPersonAuthnMethod && !checkMFA.data.userMongo[0]?.tempSecret) {
                    console.log('must recreate mfa, user not i mongo')
                    navigate('/createmfa')
                } 
                else if(checkMFA.status === 200 && checkMFA.data.userMongo[0]?.secret && checkMFA.data.userAzureAD.norEduPersonAuthnMethod) {
                    console.log('User already have mfa, do you want to recreate?')
                    navigate('/verified') 
                }
                else if(checkMFA.status === 200 && checkMFA.data.userMongo[0]?.secret && !checkMFA.data.userAzureAD.norEduPersonAuthnMethod) {
                    console.log('recreate mfa')
                }
                else {
                    console.log(checkMFA.status)
                    console.log(checkMFA.data.userMongo[0]?.secret)
                    console.log(checkMFA.data.userAzureAD.norEduPersonAuthnMethod)
                }
                console.log(checkMFA)
                setIsLoading(false)
            }
        }

        checkMFA()
        return () => {
            didCancel = true
        }
    }, [pid])

     // Get the username when pid value changes. 
     useEffect(() => {
        setIsLoading(true)
        let didCancel = false
        
        async function getUserName() {
            if(!didCancel) {
                const userName = await getName(pid)
                const data = await userName
                
                setUserName(data)
                setIsLoading(false)
            }
        }

        getUserName()
        return () => {
            didCancel = true
        }
    }, [pid])

    // Create MFA
    useEffect(() => {
        setIsLoading(true)
        let didCancel = false

        async function createMFA() {
            if(!didCancel && stateChange === true) {
                const postMFAData = await postMFA(pid)
                const data = await postMFAData
                setMfaCreated(data)
                setIsLoading(false)
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
        setIsModalOpen(true)
    }

    if(isLoading) {
        return ( 
            <div className={styles.qrCode}>
                <Spinner size='medium' transparent />
            </div>
        )
    }
    if(mfaCreated.status === 201 && stateChange === true) {
        return (
        <Dialog
            isOpen={modalOpen}
            persistent
            draggable={false}
            resizeable={false}
            onDismiss={() => { setIsModalOpen(false)
        }}
        >
            <DialogTitle>
                <Heading2>
                    Vellykket    
                </Heading2>
            </DialogTitle>
            <DialogBody>
                <div className={styles.heading}>
                    <Heading4>Du har nå opprettet MFA. Trykk OK for å fortsette videre.</Heading4>
                </div>
                <div className={styles.qrCode}>
                    <AnimateSuccess />
                </div>   
            </DialogBody>
            <div className={styles.btn}>
                <DialogActions>
                    <Button size='small' onClick={ () => {
                        setIsModalOpen(false)
                        setStateChange(false)
                        navigate('/verifyMFA')
                    }}
                        >
                            OK
                        </Button>
                </DialogActions>
            </div>
        </Dialog>
        )
    } else if (mfaCreated.status !== 201 && stateChange === true) {
        return(
            <Dialog
                isOpen={modalOpen}
                persistent
                draggable={false}
                resizeable={false}
                onDismiss={() => { setIsModalOpen(false)}}
            >
                <DialogTitle>
                    <Heading2>Ikke vertifisert</Heading2>
                </DialogTitle>
                <DialogBody>
                    <div className={styles.heading}>
                        <Heading4>Oi, her gikk det galt. Prøv igjen.</Heading4>
                    </div>
                    <div className={styles.qrCode}>
                        <AnimateError />
                    </div>
                </DialogBody>
                <div className={styles.btn}>
                    <DialogActions>
                            <Button size='small' onClick={ () => {
                                setIsModalOpen(false)  
                                setStateChange(false)
                            }}
                                >
                                    OK
                                </Button>
                    </DialogActions>
                </div>
            </Dialog>
        )
    }else {
        return (
            <div className={styles.center}>
                <div className={styles.heading}>
                    <Heading2>Hei {userName} </Heading2>
                </div>
                <div className={styles.heading}>
                    <Heading3>Du har ikke opprettet MFA til din feinde konto, opprett MFA til din feidekonto ved å trykke på knappen under.</Heading3>
                </div>
                <div className={styles.btn}>
                    <Button onClick={() => {
                        handleClick() 
                        }}
                        >
                            Opprett MFA
                    </Button>
                </div>
            </div>
        )
    }
}