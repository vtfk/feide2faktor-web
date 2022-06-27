import { Heading2, IconDropdownNavItem, TopBar } from "@vtfk/components";
import { useNavigate } from "react-router-dom";
import { useSession } from "@vtfk/react-oidc";
import { useState, useEffect } from "react"
import styles from './styles.module.css'
import vtfkLogo from '../../assets/VTFK.svg'

// API
import { getName } from "../../utils/api";

export default function Header() {
    const navigate = useNavigate()
    const { logout, isAuthenticated } = useSession()
    
    const [showTopBar, setShowTopBar] = useState(false)
    const [userName, setUserName] = useState([])

    let displayName = ''
    let firstName = ''
    let lastName = ''

    useEffect(() => {
        if(isAuthenticated){
            setShowTopBar(true)
        }
    }, [isAuthenticated])


    useEffect(() => {
        let didCancel = false

        async function userNameRequest() {
            if(!didCancel) {
                if(isAuthenticated) {
                    const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]
                    const userName = await getName(pid)
                    setUserName(userName)
                }
            }
        }

        userNameRequest()

        displayName = 'Feide'
        firstName = 'Feide'

        return () => {
            didCancel = true
        }
    }, [isAuthenticated])


    if(userName.length !== 0) {
        displayName = userName
        firstName = userName[0]
    }

    return(
        <div className={styles.header}>
            <div className={styles.logoText}>
                <img src={vtfkLogo} alt="vtfkLogo" height={60}></img>
                <Heading2 className={styles.text}>
                    Feide MFA
                </Heading2>
            </div>
            {showTopBar && <TopBar
                displayName={displayName} 
                firstName={firstName} 
                lastName={lastName}
                className={styles.topBar}
                >
                    <IconDropdownNavItem closeOnClick title='Hjem' onClick={ () => navigate('/signedin') }/>
                    {isAuthenticated && <IconDropdownNavItem closeOnClick title='Logg ut' onClick={ logout } />}
                    <IconDropdownNavItem closeOnClick title='Admin' onClick={ () => navigate('/admin') }/>
            </TopBar>}
        </div> 
    )
}