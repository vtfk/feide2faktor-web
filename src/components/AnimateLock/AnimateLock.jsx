import styles from './styles.module.css'
import { useEffect, useRef } from "react"
import Lottie from "lottie-web"

import lockAnimation from "../../animations/lock.json"

const AnimateLock = () => {
    const lock = useRef(null)
    useEffect(() => {
        Lottie.loadAnimation({
            container: lock.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: lockAnimation,
        })
        Lottie.setDirection(-1)
        Lottie.play()
    }, [])
    return <div className={styles.lock} ref={lock}/>
}

export default AnimateLock