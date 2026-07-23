import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const effects: Array<() => void | (() => void)> = []
  const gltfScene = {
    clone: vi.fn(() => ({
      traverse: vi.fn(),
    })),
  }
  const useGLTF = vi.fn(() => ({ scene: gltfScene }))
  Object.assign(useGLTF, {
    clear: vi.fn(),
    preload: vi.fn(),
  })

  return {
    effects,
    gltfScene,
    useGLTF,
    useApplePosition: vi.fn(() => ({
      position: [1, 2, 3],
      updatePosition: vi.fn(),
    })),
    useFrame: vi.fn(),
    useShadowSetup: vi.fn(),
  }
})

vi.mock('react', () => {
  const react = {
    createElement: vi.fn((type: unknown, props: unknown, ...children: unknown[]) => ({
      type,
      props,
      children,
    })),
    memo: vi.fn((component: unknown) => component),
    useEffect: vi.fn((effect: () => void | (() => void)) => {
      mocks.effects.push(effect)
    }),
    useMemo: vi.fn((factory: () => unknown) => factory()),
    useRef: vi.fn((initialValue: unknown) => ({ current: initialValue })),
    useState: vi.fn((initialValue: unknown) => [initialValue, vi.fn()]),
  }

  return {
    ...react,
    default: react,
  }
})

vi.mock('@react-three/drei', () => ({
  useGLTF: mocks.useGLTF,
}))

vi.mock('@react-three/fiber', () => ({
  useFrame: mocks.useFrame,
}))

vi.mock('../../../src/hooks/useApplePosition', () => ({
  useApplePosition: mocks.useApplePosition,
}))

vi.mock('../../../src/hooks/useShadowSetup', () => ({
  useShadowSetup: mocks.useShadowSetup,
}))

vi.mock('../../../src/assets/snakeModel/snakeHead/snakeJaw/SnakeJaw', () => ({
  default: () => null,
}))

import Apple from '../../../src/components/Apple'

describe('Apple GLTF cache lifecycle', () => {
  beforeEach(() => {
    mocks.effects.length = 0
    mocks.gltfScene.clone.mockClear()
    mocks.useGLTF.mockClear()
    mocks.useGLTF.clear.mockClear()
    mocks.useApplePosition.mockClear()
    mocks.useFrame.mockClear()
    mocks.useShadowSetup.mockClear()
  })

  it('loads the preloaded apple model without treating extendLoader as an error callback', () => {
    Apple({})

    expect(mocks.useGLTF).toHaveBeenCalledWith('/apple.glb')
  })

  it('does not clear the shared apple GLTF cache on unmount, allowing remount reuse', () => {
    Apple({})
    const cleanups = mocks.effects
      .map((effect) => effect())
      .filter((cleanup): cleanup is () => void => typeof cleanup === 'function')

    cleanups.forEach((cleanup) => cleanup())
    Apple({})

    expect(mocks.useGLTF.clear).not.toHaveBeenCalled()
    expect(mocks.useGLTF).toHaveBeenNthCalledWith(1, '/apple.glb')
    expect(mocks.useGLTF).toHaveBeenNthCalledWith(2, '/apple.glb')
  })
})
