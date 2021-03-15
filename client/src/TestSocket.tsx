import { useEffect, useRef } from "react"

const useSocket = () => {
    const socketRef = useRef<WebSocket>();

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080');

        socketRef.current.addEventListener('open', console.log);
        socketRef.current.addEventListener('message', console.log);
        socketRef.current.addEventListener('error', console.error);
        socketRef.current.addEventListener('close', console.warn);

        return () => {
            socketRef.current?.close();
        }
    }, [])

    return socketRef;
}


export default function TestSocket() {
    const testSocket = useSocket();

    return <div>Hey</div>
}