'use client';
import { useEffect, useState } from 'react'
import io from "socket.io-client"
import Steps from './Steps'
let socket;

export default function Home() {
  const [x,setX] = useState(0);
  const [y,setY] = useState(0);
  const [z,setZ] = useState(0);

  const [xinterval, setXinterval]=useState(0)
  useEffect(() => {
    // コンポーネントがマウントされたときに socket インスタンスを作成
    socket = io('https://2116-150-31-93-196.ngrok-free.app');

    // コンポーネントがアンマウントされるときに socket 接続を閉じる
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // 加速度センサーイベント処理
    console.log("start_sensor");
    let accX;
    let accY;
    let accZ;
    const handleDeviceAcceleration = function(e){
      accX = e.acceleration.x;
      accY = e.acceleration.y;
      accZ = e.acceleration.z;
    };
    const intervalId = setInterval(()=>{
      setX(accX); 
      setY(accY);
      setZ(accZ);
    },1000);

    window.addEventListener("devicemotion", handleDeviceAcceleration, false);
    
    // イベントリスナーをクリーンアップ
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceAcceleration, false);
    };
  }, []);

  useEffect(()=>{
    console.log(x,y,z)
  },[x,y,z]
  )
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p>加速度はこちらです</p>
        <p>x:{x}</p>
        <p>y:{y}</p>
        <p>z:{z}</p>

        <button 
          onClick={() => {
            // サーバーに加速度データを送信を送信
            console.log("sendAcceleration");
            const acc = {
              x: 1,
              y: 2,
              z: 3
            }
            socket.emit("sendAcceleration", acc)
          }}
          style={{ border: "1px solid black" }}
          >通信</button>
        <Steps />

        <button
          style={{ border: "1px solid black" }}
          onClick={() => {
            // サーバーに加速度データを送信を送信
            console.log("finishMeasure");
            const dummy = "ダミー";
            socket.emit("finishMeasure", dummy);
          }}
        >計測終了</button>
      </div>
    </main>
  );
}
