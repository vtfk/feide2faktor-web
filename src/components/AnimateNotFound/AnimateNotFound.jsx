import styles from './styles.module.css'
import { useEffect, useRef } from "react"
import Lottie from "lottie-web"

import notFoundAnimation from "../../animations/notfound.json"

const AnimateNotFound = () => {
    const notFound = useRef(null)
    useEffect(() => {
        Lottie.loadAnimation({
            container: notFound.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: notFoundAnimation
        })
        return () => Lottie.stop()
    }, [])
    return <div className={styles.notFound} ref={notFound}></div>
}

export default AnimateNotFound