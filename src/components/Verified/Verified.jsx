// React
import { useState, useEffect } from "react"
import { Button, Heading3, Spinner, Heading2 } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import BasicSnackbar from "../../utils/BasicSnackbar"

// API
import { checkUser, deleteMFA, getName } from "../../utils/api"

export default function Verified() {
    const { isAuthenticated } = useSession()
    const navigate = useNavigate()

    // Get the pid
    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]

    // States
    const [isLoading, setIsLoading] = useState(true)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [userStatus, setUserStatus] = useState([])
    const [userName, setUserName] = useState([])
    const [deleteData, setDeleteData] = useState([])
    const [deleteState, setDeleteState] = useState([])
    const [checkedUser, setCheckedUSer] = useState({})
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
                setIsButtonLoading(false)
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

    const handleClose = (event, reason) => {
        setIsButtonLoading(false)
        if(reason === 'clickaway') {
            return
        }
        if(deleteData.status === 200) {
            setSnackOpen(false)
            navigate('/verifyMFA')
        }
        if((deleteData.status === 400 || deleteData.status === 404) && isButtonLoading === false) {
            setSnackOpen(false)
        }
    }

    // Delete the current mfa
    useEffect(() => {
        if(deleteState === true) {
            setIsButtonLoading(true)
        }
        let didCancel = false

        async function deleteMFARequest() {
            if(!didCancel && deleteState === true) {
                const deleteMFAData = await deleteMFA(pid)
                const data = await deleteMFAData

                setDeleteData(data)
                // setIsModalOpen(true)
                setIsButtonLoading(false)
            }
        }

        deleteMFARequest()
        return() => {
            didCancel = true
        }
    }, [pid, deleteState])

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
    if((checkedUser.data?.userMongo[0]?.secret && !checkedUser.data?.userAzureAD?.norEduPersonAuthnMethod) || (!checkedUser.data?.userMongo[0]?.secret && checkedUser.data?.userAzureAD?.norEduPersonAuthnMethod)) {
        return (
            <div className={styles.center}>
                <div className={styles.heading}>
                    <Heading2>Hei {userName} </Heading2>
                </div>
                <div className={styles.heading}>
                    <Heading3>
                        Det ser ut som du allerede har aktivert tofaktor til din konto, men noe er galt. 
                        <br/>Tilbakestill din tofaktor og opprett en ny ved å trykke på knappen under. 
                    </Heading3>
                </div>    
                <div className={styles.btn}>
                    {isButtonLoading ? (<Button spinner>Tilbakestill Tofaktor</Button>) : (<Button onClick={() => { 
                        setDeleteState(true)
                        setSnackOpen(true)
                    }}
                    disabled={snackOpen}
                    >
                        Tilbakestill Tofaktor
                    </Button>)}
                </div>
                <BasicSnackbar 
                    open={snackOpen && deleteData.status === 200 && isButtonLoading === false}
                    onClose={handleClose}
                    autoHide={2000}
                    severity="success"
                    message="Tofaktor er tilbakestilt."
                />
                <BasicSnackbar 
                    open={snackOpen && (deleteData.status === 400 || deleteData.status === 404) && isButtonLoading === false}
                    onClose={handleClose}
                    autoHide={2000}
                    severity="error"
                    message="Oi, her gikk det galt. Prøv igjen."
                />
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
                        Du har allerede opprettet tofaktor til din konto, ønsker du å slette den gamle og opprette en ny? 
                    </Heading3>
                </div>    
                <div className={styles.btn}>
                    {isButtonLoading ? (<Button spinner> Opprett ny Tofaktor</Button>) : (<Button onClick={() => { 
                        setDeleteState(true)
                        setSnackOpen(true)
                    }}
                    disabled={snackOpen}
                    >
                        Opprett ny Tofaktor
                    </Button>)}
                </div>
                <BasicSnackbar 
                    open={snackOpen && deleteData.status === 200 && isButtonLoading === false}
                    onClose={handleClose}
                    autoHide={2000}
                    severity="success"
                    message="Tofaktor er tilbakestilt."
                />
                <BasicSnackbar 
                    open={snackOpen && (deleteData.status === 400 || deleteData.status === 404) && isButtonLoading === false}
                    onClose={handleClose}
                    autoHide={2000}
                    severity="error"
                    message="Oi, her gikk det galt. Prøv igjen."
                />
            </div>
        )
    }
    
} 