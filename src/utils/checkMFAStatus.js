// React
import { useNavigate } from 'react-router-dom'

// API
import { checkUser } from "./api"

export async function CheckMFAStatus(pid) {

    const navigate = useNavigate()
    // const pid = window.sessionStorage.getItem('IDPorten-AUTH').split(',')[4].split('"')[3]

      // Check if the user already have MFA activated
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
    return console.log(checkMFA)
}

 
