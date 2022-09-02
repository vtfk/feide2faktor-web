import React from "react"
import styles from './styles.module.css'

//Animation
import { Heading3, Modal, Button } from "@vtfk/components"

export default function Help() {
    return (
        <div className={styles.center}>
            <Modal title="Guide">
                <Heading3>
                    Hva er dette?
                </Heading3>
                <Heading3>
                    Hvordan sette tofaktor på din konto.
                </Heading3>
                <Button>Close</Button>
            </Modal>
        </div>
    )
}