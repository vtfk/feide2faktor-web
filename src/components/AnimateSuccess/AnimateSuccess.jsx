import styles from './styles.module.css'
import { useEffect, useRef } from "react"
import Lottie from "lottie-web"

import successAnimation from "../../animations/success.json"

const AnimateSuccess = () => {
    const success = useRef(null)
    useEffect(() => {
        Lottie.loadAnimation({
            container: success.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: successAnimation
        })
        return () => Lottie.stop()
    }, [])
    return <div className={styles.success} ref={success}></div>
}

export default AnimateSuccess