import axios from "axios"
const baseURL = process.env.REACT_APP_API_URL
const key = process.env.REACT_APP_API_KEY_AZF

const headersBody = {
    'x-api-key': key
}

console.log(key)

export async function checkUser(pid) {
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
    return await axios.delete(`${baseURL}delete/${pid}`, headersBody).then(res => res).catch((error) => {
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
    const mail = await axios.get(`${baseURL}checkuser/${pid}`, {headers: headersBody}).then(res => res.data.userAzureAD.mail).catch((error) => {
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