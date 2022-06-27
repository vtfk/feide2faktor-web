export const config = {
    authority: process.env.REACT_APP_AUTHORITY,
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    silent_redirect_uri: process.env.REACT_APP_SILET_REDIRECT_URI,
    post_logout_redirect_uri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
    response_type: process.env.REACT_APP_RESPONSE_TYPE,
    scope: process.env.REACT_APP_SCOPE,
    loadUserInfo: process.env.REACT_APP_LOAD_USER_INFO,
    acr_values: process.env.REACT_APP_ACR_VALUES
}