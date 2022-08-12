import axios from "axios"
const baseURL = process.env.REACT_APP_API_URL
const key = process.env.REACT_APP_API_KEY_AZF
const ocpApimSubKey = process.env.REACT_APP_OCP_APIM_SUBSCRIPTION_KEY

// Ditt personlige fnr. Da det ikke er mulig å lage reele test personer til ViS må du bruke deg selv eller noen du kjenner som test person. 
// NB! Du vil slette og opprete 2 faktor til feide ved å bruke ditt fnr i denne applikasjonen om du har en feide bruker.
const personalPidTestValue = process.env.REACT_APP_PERSONAL_PID_TEST_VALUE

const headersBody = {
    'x-api-key': key,
    'Ocp-Apim-Subscription-Key': ocpApimSubKey,
    
}

// Get the user information from mongodb(if exist) and from azureAD by passing username(per1234) or fnr/pid(12345678910)
export async function checkUser(pid) {
    // For local testing
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

// Get the QR-Code for the user to scan and add to a selected authenticator app. Where a valid 6-digit code is displayed. Pass the username(per1234) or fnr/pid(12345678910)
export async function getQrCode(pid) {
    // For local testing
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

// Get the TOTP-Feide secret. Pass the username(per1234) or fnr/pid(12345678910)
export async function getSecret(pid) {
    // For local testing
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

// Set a tempSecret object on the user in the mongodb. This tempSecret has to verified before the secret is posted to the azuread object.
export async function postMFA(pid) {
    // For local testing
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

// Verify that the 6 digit code that the user is showed in the selected application is a match with the 6 digit code expected. If its a success a secret will be posted to the azuread object.
export async function verifyToken(token, pid) {
    // For local testing
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

// Remove the MFA from the user in mongodb and in azuread.
export async function deleteMFA(pid) {
    // For local testing
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

// Get the name of the user signed in to the application. 
export async function getName(pid) {
    // For local testing
    pid = personalPidTestValue
    if(pid === undefined) {
        return undefined
    } else {
        // Get the mailadress
        const mail = await axios.get(`${baseURL}checkuser/${pid}`, {headers: headersBody}).then(res => res.data.userAzureAD.mail).catch((error) => {
            if(error.res) {
                return error.res
            } else if(error.request) {
                return error.request
            } else {
                return ('Error:', error.message )
            }
        })
        // Get the name from the mailadress and return the name
        let name = mail.substring(0, mail.indexOf('@'))
        name = name.replace('.', ' ')
    
        let splitName = name.toLowerCase().split(' ');
        for (let i = 0; i < splitName.length; i++) {
            splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1);     
        }
       return splitName.join(' ');
    } 
}