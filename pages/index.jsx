import React, { useEffect, useState, useRef } from 'react'
import Matter from 'matter-js'

const STATIC_DENSITY = 9
const PARTICLE_SIZE = 20

export default function Index() {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  const [constraints, setContraints] = useState()
  const [scene, setScene] = useState()

  const [someStateValue, setSomeStateValue] = useState(false)
  const [resetStateValue, setResetStateValue] = useState(false)

  const [pusherStateValue, setPusherStateValue] = useState(false)
  const [ballSpeedStateValue, setBallSpeedStateValue] = useState(false)
  const [pusherSpeedStateValue, setPusherSpeedStateValue] = useState(false)
  const [ballMassStateValue, setBallMassStateValue] = useState(10)
  const [pusherMassStateValue, setPusherMassStateValue] = useState(1)
  const [pusherForceStateValue, setPusherForceStateValue] = useState(0.1)

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect())
  }

  const resetWorld = () => {
    setResetStateValue(!resetStateValue)
  }

  const handleClick = () => {
    setSomeStateValue(!someStateValue)
  }

  const handlePusherClick = () => {
    setPusherStateValue(!pusherStateValue)
  }

  useEffect(() => {
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

    const floor = Bodies.rectangle(0, 0, 0, STATIC_DENSITY, {
      isStatic: true,
      render: {
        fillStyle: 'blue',
      },
    })


    const pusher1 = Bodies.rectangle(0, 535, 175, 15, {
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
    engine.world.gravity.y = 0;
    Runner.run(engine)
    Render.run(render)
    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)

    window.addEventListener('resize', handleResize)
  }, [])

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

  useEffect(() => {
    // Add a new "ball" everytime `someStateValue` changes
    if (scene) {
      let randomX = 220
      Matter.World.add(
        scene.engine.world,
        Matter.Bodies.circle(randomX, 550, PARTICLE_SIZE, { mass: ballMassStateValue, friction: 0, frictionAir: 0, restitution: 0 }),
      )
    }
  }, [someStateValue])

  useEffect(() => {
    // Remove ALL "ball" everytime `resetStateValue` changes
    if (scene) {
      let pusher = scene.engine.world.bodies[1];
      Matter.Body.setPosition(pusher, {
        x: 100,
        y: 535,
      }
      )
      Matter.Body.setVelocity(pusher, {
        x: 0,
        y: 0,
      }
      )
      for (let i = scene.engine.world.bodies.length - 1; i >= 0; i--) {
        scene.engine.world.bodies.forEach((body) => {
          if (body.label === 'Circle Body') {
            console.log(body.mass)
            Matter.World.remove(scene.engine.world, body)
          }
        }
        )
      }
    }
  }, [resetStateValue])

  useEffect(() => {
    // Run pusher everytime `pusherStateValue` changes
    if (scene) {
      let pusher = scene.engine.world.bodies[1];
      if (pusherStateValue) {
        pusher.isStatic = false;
        Matter.Body.applyForce(pusher, { x: pusher.position.x, y: pusher.position.y }, {
          x: pusherForceStateValue * pusher.mass,
          y: 0,
        })
      } else {
        pusher.isStatic = true;
        Matter.Body.setPosition(pusher, {
          x: 100,
          y: 535,
        }
        )
      }
    }
  }, [pusherStateValue])

  useEffect(() => {
    // Get object' speed 
    if (scene) {
      setInterval(
        () => {
          for (let i = scene.engine.world.bodies.length - 1; i >= 0; i--) {
            scene.engine.world.bodies.forEach((body) => {
              if (body.label === 'Circle Body') {
                setBallSpeedStateValue(body.velocity.x)
                setBallMassStateValue(body.mass)
              }
              else if (body.label === 'Rectangle Body') {
                setPusherSpeedStateValue(body.velocity.x)
                setPusherMassStateValue(body.mass)
              }
            }
            )
          }
        }
        , 1)
    }
  }, [scene])


  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid white',
        padding: '8px',
      }}
    >
      <div style={{ textAlign: 'center' }}>물리 (1920x1080 해상도 기준, 최대화 된 화면에만 최적화 되어있습니다. 그 외의 환경에선 작동을 보장하지 않습니다.)</div>

      <div
        ref={boxRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '550vh',
          height: '59vh',
          pointerEvents: 'none',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <button
        style={{
          cursor: 'pointer',
          display: 'block',
          textAlign: 'center',
          marginBottom: '16px',
          width: '10vh',
          top: '10vh',
          marginLeft: "100vh",
          marginTop: "50vh",
          position: 'relative',
          zIndex: '1'
        }}
        onClick={() => handleClick()}
      >
        생성
      </button>
      <button className="btn-rst" onClick={() => resetWorld()}>
        초기화
      </button>
      <br />
      <button className="btn-rst" onClick={() => handlePusherClick()}>
        push
      </button>
      <br />
      <br />
      <br />
      <div>
        Dashboard
        <br />
        공 속도: {ballSpeedStateValue}
        <br />
        질량: {ballMassStateValue}
        <br />
        밀대 속도: {pusherSpeedStateValue}
        <br />
        밀대가 미는 힘: {pusherForceStateValue * pusherMassStateValue}
        <br />
        질량: {pusherMassStateValue}
        <br />
        공에는 마찰력이 작용하지 않음. 중력이 적용되지 않음.
      </div>
      <style jsx>{`
        .btn-rst {
          cursor: pointer;
          display: block;
          textAlign: center;
          margin-top: -2vh;
          position: relative;
          z-index: 1;
          top: 7vh;
        }
      `}</style>
    </div>
  )
}
