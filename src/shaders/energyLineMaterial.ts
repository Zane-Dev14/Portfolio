import * as THREE from "three"

const vertexShader = /* glsl */ `
  attribute float lineDistance;
  varying float vLineDistance;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vLineDistance = lineDistance;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uPulseWidth;

  varying float vLineDistance;
  varying vec2 vUv;

  void main() {
    // Pulse moving along the line
    float pulse = sin((vUv.x - uTime * uSpeed) * 6.28318 * 3.0) * 0.5 + 0.5;
    pulse = smoothstep(0.3, 0.7, pulse);

    // Secondary fast pulse
    float pulse2 = sin((vUv.x - uTime * uSpeed * 2.0) * 6.28318 * 6.0) * 0.5 + 0.5;
    pulse2 = smoothstep(0.5, 0.8, pulse2);

    // Combine
    float brightness = pulse * 0.7 + pulse2 * 0.3;

    // Edge fade for line width
    float edgeFade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

    vec3 finalColor = uColor * brightness * 2.0;
    float alpha = brightness * edgeFade * 0.9;

    gl_FragColor = vec4(finalColor, alpha);
  }
`

export class EnergyLineMaterial extends THREE.ShaderMaterial {
  constructor(
    color: THREE.Color = new THREE.Color(0x00e5ff),
    speed = 0.8,
    pulseWidth = 0.3
  ) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uSpeed: { value: speed },
        uPulseWidth: { value: pulseWidth },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }

  update(delta: number) {
    this.uniforms.uTime.value += delta
  }
}

export default EnergyLineMaterial
