import React, { useEffect, useState, useRef } from 'react'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Matter from 'matter-js'
import { Button, Slider, Checkbox, FormGroup, FormControlLabel } from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const STATIC_DENSITY = 9
const PARTICLE_SIZE = 20

export default function Index() {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [MacBookOptimized, setMacBookOptimized] = useState(null)

  const [constraints, setContraints] = useState()
  const [scene, setScene] = useState()

  const [someStateValue, setSomeStateValue] = useState(false)
  const [resetStateValue, setResetStateValue] = useState(false)
  const [gravityStateValue, setGravityStateValue] = useState(false)
  const [ballFrictionStateValue, setBallFrictionStateValue] = useState(true)

  const [pusherStateValue, setPusherStateValue] = useState(false)
  const [ballSpeedStateValue, setBallSpeedStateValue] = useState(false)
  const [pusherSpeedStateValue, setPusherSpeedStateValue] = useState(false)
  const [ballMassStateValue, setBallMassStateValue] = useState(10)
  const [pusherMassStateValue, setPusherMassStateValue] = useState(1)
  const [pusherForceStateValue, setPusherForceStateValue] = useState(0.1)

  const NotMobileSupprot = () => {
    toast.info("해당 웹 사이트는 단순 학교 발표를 위한 프로젝트이며, 모바일 버전에는 완벽하게 최적화 되어있지 않습니다.", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 5000,
    });
  }
  const Notification = () => {
    toast.info("발표용 프로젝트로써, 실제 Production 급의 디자인이나 완성도를 보장하지 않습니다.", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 5000,
    });
  }

  const MainNotification = () => {
    NotMobileSupprot();
    Notification();
    return null;
  };

  const resetWorld = () => {
    setResetStateValue(!resetStateValue)
  }

  const handleClick = () => {
    setSomeStateValue(!someStateValue)
  }

  const handlePusherClick = () => {
    setPusherStateValue(!pusherStateValue)
  }

  const MacBookOptimization = () => {
    setMacBookOptimized(!MacBookOptimized)
  }
  
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Dashboard',
      },
    },
  };
  const labels = ['BallMass', 'BallSpeed', 'PusherMass', 'PusherForce'];
  const data = {
    labels,
    datasets: [
      {
        label: '물리 시뮬레이터',
        data: [
          ballMassStateValue,
          ballSpeedStateValue,
          pusherMassStateValue,
          pusherForceStateValue * pusherMassStateValue,
        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ]
  };
  
  // MacBook Optimization

  useEffect(() => {
    if (localStorage.getItem('MacBookOptimized') == 'true') {
      setMacBookOptimized(true)
    }
    else if (localStorage.getItem('MacBookOptimized') == 'false') {
      setMacBookOptimized(false)
    }
  }, [])

  useEffect(() => {
    if (MacBookOptimized != null) {
    localStorage.setItem('MacBookOptimized', MacBookOptimized)
    }
  }, [MacBookOptimized])


  // Mobile Notification
  useEffect(() => {
    if (loading) {
      if (window.innerWidth < 768) {
        NotMobileSupprot()
        toast.clearWaitingQueue();
      }
      setLoading(false)
    }
  }, [])
  // Config Matter.js
  useEffect(() => {
    // Sleep for 0.5 sec
    setTimeout(console.log("Loading Settings..."), 500);
    const MO = localStorage.getItem('MacBookOptimized') 
    let Engine = Matter.Engine
    let Render = Matter.Render
    let Runner = Matter.Runner
    let World = Matter.World
    let Bodies = Matter.Bodies
    let engine = Engine.create({})
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        background: 'transparent',
        wireframes: false,
      },
    })
    let pusherPostiton = { x: 0, y: 0 }
    let windowWidth = window.outerWidth;
    let pusherWidth = 0
    console.log(`MacBookOptimized: ${MO} `)
    if (MO == "true"){
      pusherPostiton = {
        x: 100,
        y: 380,
      }
    }
    else if (windowWidth > 600) {
      pusherPostiton = {
        x: 100,
        y: 530,
      }
    }
    else {
      pusherPostiton = {
        x: 30,
        y: 350,
      }
    };
    const floor = Bodies.rectangle(100, 0, 0, STATIC_DENSITY, {
      isStatic: true,
      render: {
        fillStyle: 'blue',
      },
    })

    if (windowWidth > 600) {
      pusherWidth = 175
    }
    else {
      pusherWidth = 75
    }
    const pusher1 = Bodies.rectangle(pusherPostiton.x, pusherPostiton.y, pusherWidth, 15, {
      isStatic: true,
      friction: 0.1,
      frictionAir: 0.1,
      restitution: 0.1,

      render: {
        fillStyle: 'red',
      },
      mass: pusherMassStateValue,
    })

    World.add(engine.world, [floor, pusher1])
    engine.world.gravity.y = gravityStateValue;
    Runner.run(engine)
    Render.run(render)
    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)
    window.addEventListener('resize', () => {
      render.bounds.max.x = window.innerWidth;
      render.bounds.max.y = window.innerHeight;
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
    });
  }, [])
  // Config Floor 
  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints

      // Dynamically update canvas and bounds
      scene.bounds.max.x = width
      scene.bounds.max.y = height
      scene.options.width = width
      scene.options.height = height
      scene.canvas.width = width
      scene.canvas.height = 560


      // Dynamically update floor
      const floor = scene.engine.world.bodies[0]

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      })

      Matter.Body.setVertices(floor, [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: 0 + STATIC_DENSITY },
        { x: 0, y: 0 + STATIC_DENSITY },
      ])
    }
  }, [scene, constraints])
  // Create Ball
  useEffect(() => {
    // Add a new "ball" everytime `someStateValue` changes
    if (scene) {
      const MO = localStorage.getItem('MacBookOptimized')
      let circlePostiton = { x: 220, y: 0 }
      let windowWidth = window.outerWidth;
      let friction = 0;
      if (MO == 'true') {
        circlePostiton = {
          x: 250,
          y: 380,
        }
      }
      else if (windowWidth > 600) {
        circlePostiton.y = 530
      }
      else {
        circlePostiton.y = 350
        circlePostiton.x = 120
      };
      if (ballFrictionStateValue) {
        if (ballFrictionStateValue != true) {
          friction = ballFrictionStateValue;
        }
        else {
          friction = 0;
        }
      };
      Matter.World.add(
        scene.engine.world,
        Matter.Bodies.circle(circlePostiton.x, circlePostiton.y, PARTICLE_SIZE, { mass: ballMassStateValue, friction: friction, frictionAir: friction, restitution: 0 }),
      )
    }
  }, [someStateValue])
  // Config Gravity
  useEffect(() => {
    if (scene) {
      if (gravityStateValue) {
        scene.engine.world.gravity.y = 1;
      }
      else {
        scene.engine.world.gravity.y = 0;
      }
    }
  }, [gravityStateValue])
  // Config Friction
  useEffect(() => {
    if (scene) {
      if (ballFrictionStateValue) {
        let fValue = 0.1;
        if (ballFrictionStateValue != true) {
          fValue = ballFrictionStateValue;
        }
        for (let i = scene.engine.world.bodies.length - 1; i >= 0; i--) {
          scene.engine.world.bodies.forEach((body) => {
            if (body.label === 'Circle Body') {
              body.friction = fValue;
              body.frictionAir = fValue;
            }
          })
        }
      }
      else {
        for (let i = scene.engine.world.bodies.length - 1; i >= 0; i--) {
          scene.engine.world.bodies.forEach((body) => {
            if (body.label === 'Circle Body') {
              body.friction = 0;
              body.frictionAir = 0;
              body.restitution = 0;
            }
          })
        }
      }
    }
  }, [ballFrictionStateValue])
  // Reset World
  useEffect(() => {
    const MO = localStorage.getItem('MacBookOptimized') 
    let pusherPostiton = {}
    let windowWidth = window.outerWidth
    
    if (MO == 'true') {
      pusherPostiton = {
        x: 100,
        y: 380,
      }
    }
    else if (windowWidth > 600) {
      pusherPostiton = {
        x: 100,
        y: 530,
      }
    }
    else {
      pusherPostiton = {
        x: 30,
        y: 350,
      }
    }
    if (scene) {
      let pusher = scene.engine.world.bodies[1];
      Matter.Body.setPosition(pusher, pusherPostiton
      )
      Matter.Body.setVelocity(pusher, {
        x: 0,
        y: 0,
      }
      )
      for (let i = scene.engine.world.bodies.length - 1; i >= 0; i--) {
        scene.engine.world.bodies.forEach((body) => {
          if (body.label === 'Circle Body') {
            Matter.World.remove(scene.engine.world, body)
          }
        }
        )
      }
    }
  }, [resetStateValue])
  // Apply Force to Pusher
  useEffect(() => {
    // Run pusher everytime `pusherStateValue` changes
    const MO = localStorage.getItem('MacBookOptimized') 
    let windowWidth = window.outerWidth
    let pusherPostiton = {}
    if (MO == 'true') {
      pusherPostiton = {
        x: 100,
        y: 380,
      }
    }
    else if (windowWidth > 600) {
      pusherPostiton = {
        x: 100,
        y: 530,
      }
    }
    else {
      pusherPostiton = {
        x: 30,
        y: 350,
      }
    }

    if (scene) {
      let pusher = scene.engine.world.bodies[1];
      if (pusherStateValue) {
        pusher.isStatic = false;
        Matter.Body.applyForce(pusher, { x: pusher.position.x, y: pusher.position.y }, {
          x: pusherForceStateValue * pusherMassStateValue,
          y: 0,
        })
      } else {
        pusher.isStatic = true;
        Matter.Body.setPosition(pusher, pusherPostiton
        )
      }
    }
  }, [pusherStateValue])
  // Get Objects' properties
  useEffect(() => {
    if (scene) {
      setInterval(
        () => {
          for (let i = scene.engine.world.bodies.length - 1; i >= 0; i--) {
            scene.engine.world.bodies.forEach((body) => {
              if (body.label === 'Circle Body') {
                setBallSpeedStateValue(body.velocity.x);
                setBallMassStateValue(body.mass);
                if (body.velocity.x < 0.0000001) {
                  setBallSpeedStateValue(0);
                }
              }
              else if (body.label === 'Rectangle Body') {
                setPusherSpeedStateValue(body.velocity.x);
                body.mass = pusherMassStateValue;
                if (body.velocity.x < 0.0000001) {
                  setPusherSpeedStateValue(0);
                }
              };
            }
            )
          };
        }
        , 1)
    }
  }, [scene])

  return (
    <div>
      <div className="title">물리 시뮬레이터
        <Button variant="contained" style={{ marginLeft: '2vh', marginTop: '-0.5vh' }} onClick={MainNotification}>
          안내
        </Button></div>
        <Button variant='contained' onClick={MacBookOptimization}>
          맥북 최적화 {MacBookOptimized ? '켜짐' : '꺼짐' } (새로고침 시 적용.)
        </Button>
      <div
        className="canvas"
        ref={boxRef}
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '200vh',
          height: '59vh',
          pointerEvents: 'none',
        }}
      >
        <canvas ref={canvasRef} className="canvas" />
      </div>
      <div className="controls">
        <div className="crt-btn">
          <Button variant="contained" style={{ marginRight: '2vh' }} onClick={() => handleClick()}>
            생성
          </Button>
          <Button variant="contained" style={{ marginRight: '2vh' }} onClick={() => resetWorld()}>
            초기화
          </Button>
          <Button variant="contained" style={{ marginRight: '2vh' }} onClick={() => handlePusherClick()}>
            밀기
          </Button>
        </div>
        <br />
        <div className="slider-container">
          밀대 질량 / 밀대 힘
          <Slider aria-label="Custom marks" max={0.5} min={0} step={0.000000001} defaultValue={0.1} valueLabelDisplay="auto" onChange={(e, val) => setPusherForceStateValue(val)} />
          밀대 질량
          <Slider aria-label="Custom marks" max={10} min={0} step={0.01} defaultValue={1} valueLabelDisplay="auto" onChange={(e, val) => setPusherMassStateValue(val)} />
          공 질량
          <Slider aria-label="Custom marks" max={100} min={0} step={0.01} defaultValue={10} valueLabelDisplay="auto" onChange={(e, val) => setBallMassStateValue(val)} />
          공 마찰력
          <Slider aria-label="Custom marks" max={10} min={0} step={0.01} defaultValue={0} valueLabelDisplay="auto" onChange={(e, val) => setBallFrictionStateValue(val)} />
        </div>
        <div className="checkbox-container">
          <FormGroup>
            <FormControlLabel control={<Checkbox onChange={(e) => setGravityStateValue(!gravityStateValue)} />} label="중력" />
          </FormGroup>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="dashboard">
        <div className="chart">
          <Line options={chartOptions} data={data} />
        </div>
        Dashboard
        <br />
        공 속도: {ballSpeedStateValue}
        <br />
        공 질량: {ballMassStateValue}
        <br />
        공 마찰력: {ballFrictionStateValue}
        <br />
        밀대 속도: {pusherSpeedStateValue}
        <br />
        밀대가 미는 힘: {pusherForceStateValue * pusherMassStateValue}
        <br />
        밀대 질량: {pusherMassStateValue}
        <br />
        밀대에는 0.1의 마찰력이 작용함.
      </div>
      <style jsx>{`

        .btn-crt {
          cursor: pointer;
          display: block;
          textAlign: center;
          marginBottom: 16px;
          width: 10vh;
          marginLeft: 100vh;
          position: absolute;
          z-index: 1;
        }
        .btn-rst {
          cursor: pointer;
          display: block;
          textAlign: center;
          margin-top: -2vh;
          position: relative;
          z-index: 1;
          top: 7vh;
        }
        .controls {
          position: absolute;
          top: 57vh;
          left: 5vh;
          width: 100vh;
          height: 10vh;
          z-index: 1;
        }
        .canvas {
          position: absolute;
          top: -15vh;
        }
        .slider-container {
          width: 30%;
        }
        .checkbox-container {
          width: 30%;
        }
        .dashboard {
          position: absolute;
          width: auto;
          height: 10vh;
          left: 42vh;
          z-index: 1;
          margin-top: -18vh;
        }
        @media (max-width: 600px) {
          .canvas {
            top: -25vh;
          }
          .controls {
            top: 55vh;
            left: 10vh;
          }
          .dashboard {
            top: 110vh;
            margin-top: 5vh;
          }
        }
        .title {
          font-size: 1.5em;
          text-align: center;
        }
        .chart {
          width: 100vh;
          position: absolute;
          top: -3vh;
          left: 32vh;
        }
        `}</style>
    </div >
  )
}
