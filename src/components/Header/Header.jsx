import { Heading2, IconDropdownNavItem, TopBar, Skeleton } from "@vtfk/components";
import { useNavigate } from "react-router-dom";
import { useSession } from "@vtfk/react-oidc";
import { useState, useEffect } from "react"
import styles from './styles.module.css'
import vtfkLogo from '../../assets/VTFK.svg'

//Queries
import { Name } from "../../utils/queries";

export default function Header() {
    const navigate = useNavigate()

    const { logout, isAuthenticated } = useSession()
    
    const [showTopBar, setShowTopBar] = useState(false)

    let displayName = ''
    let firstName = ''
    let lastName = ''

    let pid = ''

    useEffect(() => {
        if(isAuthenticated){
            setShowTopBar(true)
        }
    }, [isAuthenticated])

    function nameLetter(fullName) {
        const letters = fullName.match(/\b(\w)/g)
        return letters
    }
    const IDPortenAUTH = window.sessionStorage.getItem('IDPorten-AUTH')
    if(isAuthenticated) {
        if(IDPortenAUTH !== undefined) {
            const pidCheck = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]
            if(pidCheck !== undefined) {
                pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]
            }
        }
    }
    
    const results = Name(pid)
    if(results.isLoading && pid !== '') {
        return (
            <div className={styles.header}>
                <div className={styles.logoText}>
                        <img src={vtfkLogo} alt="vtfkLogo" height={60}></img>
                        <Heading2 className={styles.text}>
                            Selvbetjeningsportal
                        </Heading2>
                    <TopBar 
                        displayName={<Skeleton variant='text'  width={100} height={20}/>}
                        firstName={firstName}
                        lastName={lastName}
                        className={styles.topBar}
                    />
                </div>
            </div>
        )
    }

    if(results.isError) {
        return <span>Error: {results.error}</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    }

    if(results.data) {
        const letters = nameLetter(results.data)

        displayName = results.data
        firstName = letters[0]
        lastName = letters[1]
    }

    return(
        <div className={styles.header}>
            <div className={styles.logoText}>
                <img src={vtfkLogo} alt="vtfkLogo" height={60}></img>
                <Heading2 className={styles.text}>
                    Selvbetjeningsportal
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
                    {/* <IconDropdownNavItem closeOnClick title='Admin' onClick={ () => navigate('/admin') }/> */}
            </TopBar>}
        </div> 
    )
    
}