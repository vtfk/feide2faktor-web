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

    // const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]
    console.log('........')
    console.log('pid pos4')
    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[4]
    console.log(pid)
    console.log('........')
    console.log('pid pos3')
    const pid1 = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]
    console.log(pid1)

    const fetchData = async () => {
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
                        // console.log(checkMFA)
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