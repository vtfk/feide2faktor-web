import styles from './styles.module.css'
import { useEffect, useRef } from "react"
import Lottie from "lottie-web"

import warnAnimation from "../../animations/warning.json"

const AnimateWarning = () => {
    const warn = useRef(null)
    useEffect(() => {
        Lottie.loadAnimation({
            container: warn.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: warnAnimation,
        })
    }, [])
    return <div className={styles.warn} ref={warn}/>
}

export default AnimateWarning