import React, {forwardRef} from "react";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const Notis = forwardRef(function Notis(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />
})

const BasicSnackbar = ({ open, severity, onClose, message, autoHide}) => {
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={autoHide}
                anchorOrigin={{
                    vertical: "top", 
                    horizontal: "center"
                }}
                onClose={onClose}                   
            >
                <Notis
                    onClose={onClose}
                    severity={severity}
                >
                    {message}
                </Notis>
            </Snackbar>
        </>
    )
}

export default BasicSnackbar