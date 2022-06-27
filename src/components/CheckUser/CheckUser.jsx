import { useState, useEffect } from "react"
import axios from "axios"
import { Spinner } from '@vtfk/components'
import { useSession } from "@vtfk/react-oidc"
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

// API
import { checkUser } from "../../utils/api"

export default function CheckUser() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSession()

    const [user, setUser] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]

    const fetchData = async () => {
        // const checkUser = `http://localhost:7071/api/checkuser/${pid}`
        
        // const checkuserRequest = await axios.request(checkUser)

        const checkUserRequest = await checkUser(pid)

        await axios.all([checkUserRequest]).then(
            axios.spread((...data) => {
                const userData = data[0]

                setUser(userData)
                setIsLoading(false)
            })
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect (() => {
        setIsLoading(true)
        if(user.length !== 0) {
            if(isAuthenticated && user.status === 200) {
                // navigate('/signedin')
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
            } else {
                navigate('/notfound')
            }
        }
    }, [user])

    if(isLoading) {
        return ( 
            <div className={styles.center}>
                <Spinner size='medium' transparent />
            </div>
        )
    }
}