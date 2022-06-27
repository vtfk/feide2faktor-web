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
    return console.log(checkMFA)
}

 
