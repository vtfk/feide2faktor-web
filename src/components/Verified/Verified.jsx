// React
import { useState, useEffect } from "react"
import { Button, Heading3, Spinner, Dialog, DialogTitle, DialogBody, DialogActions, Heading2, Heading4 } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

// API
import { checkUser, deleteMFA, getName } from "../../utils/api"

// Animations
import AnimateError from "../AnimateError"
import AnimateSuccess from "../AnimateSuccess"

export default function Verified() {
    const { isAuthenticated } = useSession()
    const navigate = useNavigate()

    // Get the pid
    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]

    // States
    const [isLoading, setIsLoading] = useState(true)
    const [userStatus, setUserStatus] = useState([])
    const [modalOpen, setIsModalOpen] = useState(false)
    const [userName, setUserName] = useState([])
    const [deleteData, setDeleteData] = useState([])
    const [deleteState, setDeleteState] = useState([])
    const [checkedUser, setCheckedUSer] = useState({})

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
                setCheckedUSer(await checkMFA)
        
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
                else {
                    // console.log(checkMFA.status)
                    // console.log(checkMFA.data.userMongo[0]?.secret)
                    // console.log(checkMFA.data.userAzureAD.norEduPersonAuthnMethod)
                }
                // console.log(checkedUser)
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

    // Delete the current mfa
    useEffect(() => {
        setIsLoading(true)
        let didCancel = false

        async function deleteMFARequest() {
            if(!didCancel && deleteState === true) {
                const deleteMFAData = await deleteMFA(pid)
                const data = await deleteMFAData

                setDeleteData(data)
                setIsModalOpen(true)
                setIsLoading(false)
            }
        }

        deleteMFARequest()
        return() => {
            didCancel = true
        }
    }, [pid, deleteState])

    if(isLoading) {
        return ( 
            <div className={styles.qrCode}>
                <Spinner size='medium' transparent />
            </div>
        )
    }
    if((checkedUser.data?.userMongo[0]?.secret && !checkedUser.data?.userAzureAD?.norEduPersonAuthnMethod) || (!checkedUser.data?.userMongo[0]?.secret && checkedUser.data?.userAzureAD?.norEduPersonAuthnMethod)) {
        return (
            <div className={styles.center}>
                <div className={styles.heading}>
                    <Heading2>Hei {userName} </Heading2>
                </div>
                <div className={styles.heading}>
                    <Heading3>
                        Det ser ut som du allerede har aktivert feide MFA til din feide konto, men noe er galt. 
                        <br/>Tilbakestill din MFA og opprett en ny ved å trykke på knappen under. 
                    </Heading3>
                </div>    
                <div className={styles.btn}>
                    <Button onClick={() => { 
                        if(window.confirm('Du vil nå tilbakestille din eksisterende MFA, du vil ikke ha ny MFA før du oppretter en ny og validerer denne!')) {   
                            setDeleteState(true)
                        }
                        
                    }}
                    >
                        Tilbakestill MFA
                    </Button>
                </div>
                <Dialog
                    isOpen={modalOpen && deleteData.status === 200}
                    persistent
                    draggable={false}
                    resizeable={false}
                    onDismiss={() => { setIsModalOpen(false)}}
                >
                    <DialogTitle>
                        <Heading2>
                        Tilbakestill MFA
                        </Heading2>
                    </DialogTitle>
                    <DialogBody>
                        <div className={styles.heading}>
                            <Heading4>MFA er tilbakestilt</Heading4>
                        </div>
                        <div className={styles.qrCode}>
                            <AnimateSuccess />
                        </div>
                    </DialogBody>
                    <div className={styles.btn}>
                        <DialogActions>
                            <Button size='small' onClick={ () => {
                                setIsModalOpen(false); 
                                navigate('/createmfa')
                                setIsLoading(true); 
                                }}
                            >
                            OK
                        </Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog
                    isOpen={modalOpen && (deleteData.status === 400 || deleteData.status === 404)}
                    persistent
                    draggable={false}
                    resizeable={false}
                    onDismiss={() => { setIsModalOpen(false)}}
                >
                    <DialogTitle>
                        <Heading2>Error</Heading2>
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
                                    window.location.reload() //Hacky, må fikses!
                                }}
                                    >
                                        OK
                                    </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        )
    } else {
        return (
            <div className={styles.center}>
                <div className={styles.heading}>
                    <Heading2>Hei {userName} </Heading2>
                </div>
                <div className={styles.heading}>
                    <Heading3>
                        Du har allerede opprettet MFA til din feide konto, ønsker du å slette den gamle og opprette en ny? 
                    </Heading3>
                </div>    
                <div className={styles.btn}>
                    <Button onClick={() => { 
                        if(window.confirm('Du vil nå slette din eksisterende MFA, du vil ikke ha ny MFA før du oppretter en ny og validerer denne!')) {   
                            setDeleteState(true)
                        }
                        
                    }}
                    >
                        Opprett ny MFA
                    </Button>
                </div>
                <Dialog
                    isOpen={modalOpen && deleteData.status === 200}
                    persistent
                    draggable={false}
                    resizeable={false}
                    onDismiss={() => { setIsModalOpen(false)}}
                >
                    <DialogTitle>
                        <Heading2>
                            Slett MFA
                        </Heading2>
                    </DialogTitle>
                    <DialogBody>
                        <div className={styles.heading}>
                            <Heading4>MFA er slettet</Heading4>
                        </div>
                        <div className={styles.qrCode}>
                            <AnimateSuccess />
                        </div>
                    </DialogBody>
                    <div className={styles.btn}>
                        <DialogActions>
                            <Button size='small' onClick={ () => {
                                setIsModalOpen(false); 
                                navigate('/createmfa')
                                setIsLoading(true); 
                                }}
                            >
                            OK
                        </Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog
                    isOpen={modalOpen && (deleteData.status === 400 || deleteData.status === 404)}
                    persistent
                    draggable={false}
                    resizeable={false}
                    onDismiss={() => { setIsModalOpen(false)}}
                >
                    <DialogTitle>
                        <Heading2>Error</Heading2>
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
                                    window.location.reload() //Hacky, må fikses!
                                }}
                                    >
                                        OK
                                    </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        )
    }
    
} 