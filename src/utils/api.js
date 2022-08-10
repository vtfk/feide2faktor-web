import axios from "axios"
const baseURL = process.env.REACT_APP_API_URL
const key = process.env.REACT_APP_API_KEY_AZF
const ocpApimSubKey = process.env.REACT_APP_OCP_APIM_SUBSCRIPTION_KEY

// Ditt personlige fnr. Da det ikke er mulig å lage reele test personer til ViS må du bruke deg selv eller noen du kjenner som test person. 
// NB! Du vil slette og opprete 2 faktor til feide ved å bruke ditt fnr i denne applikasjonen om du har en feide bruker.
const personalPidTestValue = process.env.REACT_APP_PERSONAL_PID_TEST_VALUE

const headersBody = {
    'x-api-key': key,
    'Ocp-Apim-Subscription-Key': ocpApimSubKey
}

export async function checkUser(pid) {
    pid = personalPidTestValue
    return await axios.get(`${baseURL}checkuser/${pid}`, {headers: headersBody}).then(res => res).catch((error) => {
        if(error.res) {
            return error.res
        } else if(error.request) {
            return error.request
        } else {
            return ('Error:', error.message )
        }
    })
}

export async function getQrCode(pid) {
    pid = personalPidTestValue
    return await axios.get(`${baseURL}qrcode/${pid}`, {headers: headersBody}).then(res => res).catch((error) => {
        if(error.res) {
            return error.res
        } else if(error.request) {
            return error.request
        } else {
            return ('Error:', error.message )
        }
    })
}

export async function getSecret(pid) {
    pid = personalPidTestValue
    return await axios.get(`${baseURL}secret2faktor/${pid}`, {headers:headersBody}).then(res => res).catch((error) => {
        if(error.res) {
            return error.res
        } else if(error.request) {
            return error.request
        } else {
            return ('Error:', error.message )
        }
    })
}

export async function postMFA(pid) {
    pid = personalPidTestValue
    let mfaBody = {
        userID: pid
    }
    return await axios.post(`${baseURL}mfaCreated`, mfaBody, {headers:headersBody}).then(res => res).catch((error) => {
        if(error.res) {
            return error.res
        } else if(error.request) {
            return error.request
        } else {
            return ('Error:', error.message )
        }
    })
}

export async function verifyToken(token, pid) {
    pid = personalPidTestValue
    let tokenBody = {
        token: token
    }
    return await axios.post(`${baseURL}verifyToken/${pid}`, tokenBody, {headers:headersBody}).then(res => res).catch((error) => {
        if(error.res) {
            return error.res
        } else if(error.request) {
            return error.request
        } else {
            return ('Error:', error.message )
        }
    })
}

export async function deleteMFA(pid) {
    pid = personalPidTestValue
    return await axios.delete(`${baseURL}delete/${pid}`, {headers:headersBody}).then(res => res).catch((error) => {
        if(error.res) {
            return error.res
        } else if(error.request) {
            return error.request
        } else {
            return ('Error:', error.message )
        }
    })
}

export async function getName(pid) {
    pid = personalPidTestValue
    if(pid === undefined) {
        return undefined
    } else {
        const mail = await axios.get(`${baseURL}checkuser/${pid}`, {headers: headersBody}).then(res => res.data.userAzureAD.mail).catch((error) => {
            console.log(mail)
            if(error.res) {
                return error.res
            } else if(error.request) {
                return error.request
            } else {
                return ('Error:', error.message )
            }
        })
        
        let name = mail.substring(0, mail.indexOf('@'))
        name = name.replace('.', ' ')
    
        let splitName = name.toLowerCase().split(' ');
        for (let i = 0; i < splitName.length; i++) {
            splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1);     
        }
       return splitName.join(' ');
    } 
}