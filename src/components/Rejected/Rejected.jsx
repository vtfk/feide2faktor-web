import React from "react"
import styles from './styles.module.css'

//Animation
import AnimateNotFound from "../AnimateNotFound/AnimateNotFound"
import { Heading2 } from "@vtfk/components"

export default function Admin() {
    return (
        <div className={styles.center}>
            <Heading2>
                Oi, her gikk det vist veldig galt.
                <br/>
                Prøv igjen senere. 
            </Heading2>
            <AnimateNotFound />
        </div>
    )
}
