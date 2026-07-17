import * as VERT from './snakeJawVertices'

// Вспомогательная функция для создания треугольной грани
const face = (a: number[], b: number[], c: number[]) => [...a, ...b, ...c]

function SnakeJawGeometry() {
  const faces = [
    face(VERT.vertexA, VERT.vertexH, VERT.vertexB), // верхняя правая грань
    face(VERT.vertexA, VERT.vertexE, VERT.vertexH), // задняя правая грань
    face(VERT.vertexA, VERT.vertexC, VERT.vertexF), // нижняя левая передняя грань
    face(VERT.vertexA, VERT.vertexF, VERT.vertexE), // нижняя левая задняя грань
    face(VERT.vertexA, VERT.vertexB, VERT.vertexD), // нижняя передняя правая грань
    face(VERT.vertexA, VERT.vertexD, VERT.vertexC), // нижняя левая передняя грань
    face(VERT.vertexB, VERT.vertexG, VERT.vertexD), // верхняя передняя грань
    face(VERT.vertexB, VERT.vertexH, VERT.vertexG), // верхняя правая грань
    face(VERT.vertexC, VERT.vertexD, VERT.vertexG), // левая передняя грань
    face(VERT.vertexC, VERT.vertexG, VERT.vertexF), // левая задняя грань
    face(VERT.vertexG, VERT.vertexH, VERT.vertexE), // задняя верхняя грань
    face(VERT.vertexG, VERT.vertexE, VERT.vertexF), // задняя нижняя грань
  ]

  const jawVertices = new Float32Array(faces.flat())

  return (
    <bufferGeometry onUpdate={(self) => self.computeVertexNormals()}>
      <bufferAttribute
        attach='attributes-position'
        count={jawVertices.length / 3}
        array={jawVertices}
        itemSize={3}
      />
    </bufferGeometry>
  )
}

export default SnakeJawGeometry
