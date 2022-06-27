import react from "react"
import styles from './styles.module.css'
import { useEffect, useRef } from "react"
import Lottie from "lottie-web"

import errorAnimation from "../../animations/error.json"

const AnimateError = () => {
    const error = useRef(null)
    useEffect(() => {
        Lottie.loadAnimation({
            container: error.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: errorAnimation
        })
        return () => Lottie.stop()
    }, [])
    return <div className={styles.error} ref={error}></div>
}

export default AnimateError