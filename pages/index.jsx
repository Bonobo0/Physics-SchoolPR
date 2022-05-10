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

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect())
  }

  const resetWorld = () => {
    setResetStateValue(!resetStateValue)
  }

  const handleClick = () => {
    setSomeStateValue(!someStateValue)
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

    const pusher0 = Bodies.polygon(0, 530, 100, 25, {
      isStatic: true,
      render: {
        fillStyle: 'red',
      },
    })
    const pusher1 = Bodies.rectangle(40, 530, 175, 15, {
      isStatic: true,
      render: {
        fillStyle: 'red',
      },
    })

    World.add(engine.world, [floor, pusher0, pusher1])

    Runner.run(engine)
    Render.run(render)

    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)

    window.addEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', handleResize)
    }
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
      let { width } = constraints
      let randomX = Math.floor(Math.random() * -width) + width + 290
      Matter.World.add(
        scene.engine.world,
        Matter.Bodies.circle(randomX, 555, PARTICLE_SIZE),
      )
    }
  }, [someStateValue])

  useEffect(() => {
    // Remove ALL "ball" everytime `resetStateValue` changes
    if (scene) {
      console.log('detected')
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
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          rowGap: '16px',
          marginBottom: '32px',
        }}
      >
      </div>

      <div
        ref={boxRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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
          width: '10%',
          top: '120px',
          marginLeft: "45%",
          marginTop: "25%",
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
      <style jsx>{`
        .btn-rst {
          cursor: pointer;
          display: block;
          textAlign: center;
          margin-top: -1%;
          position: relative;
          z-index: 1;
          top: 90px;
        }
      `}</style>
    </div>
  )
}