import { useState, useEffect } from "react"
import axios from "axios"
import { Spinner, Heading3 } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

// API
import { checkUser } from "../../utils/api"

export default function CheckUser() {
    const navigate = useNavigate()
    const { isAuthenticated, user, logout } = useSession()

    const [userData, setUserData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const pid = user.pid
    const apiToken = window.sessionStorage.getItem('selvbetjening-Auth')
    
    const fetchData = async () => {
        const checkUserRequest = await checkUser(pid, apiToken)
        await axios.all([checkUserRequest]).then(
            axios.spread((...data) => {
                const userData = data[0]

                setUserData(userData)
                setIsLoading(false)
            })
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect (() => {
        setIsLoading(true)
        if(userData.length !== 0) {
            if(isAuthenticated && userData.status === 200 && userData.data.active !== false) {
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
                        // console.log(checkMFA)
                        setIsLoading(false)
                    }
                }
                checkMFA()
                return () => {
                    didCancel = true
                }
            } else if(userData.data?.active === false) {
                window.sessionStorage.removeItem('selvbetjening-Auth')
                window.sessionStorage.removeItem('IDPorten-AUTH')
                logout()
            } 
            else {
                navigate('/notfound')
            }
        }
    }, [userData])

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