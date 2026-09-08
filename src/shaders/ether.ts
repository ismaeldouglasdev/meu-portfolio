export const etherFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform mediump float u_time;
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;

uniform float SAMPLES;
uniform float FOCAL_DISTANCE;
uniform float FOCAL_RANGE;
uniform float colorChangeSpeed;
uniform float brightness;

out vec4 fragColor;

#define saturate(V) clamp(V, 0.0, 1.0)

vec3 paletteMix(float t) {
  // Paleta das metaballs (Contato): verde -> teal -> azul
  vec3 green = vec3(0.063, 0.725, 0.506);
  vec3 teal = vec3(0.025, 0.714, 0.831);
  vec3 blue = vec3(0.145, 0.388, 0.922);
  if (t < 0.5) return mix(green, teal, t * 2.0);
  return mix(teal, blue, (t - 0.5) * 2.0);
}

mat2 rotate2d(float r) {
  float c = cos(r);
  float s = sin(r);
  return mat2(c, s, -s, c);
}

float map(vec3 p) {
  p.xz *= rotate2d(u_time * 0.06);
  p.xy *= rotate2d(u_time * 0.04);
  vec3 q = p * 2. + u_time * 0.15;
  return length(p + vec3(sin(u_time * 0.12) * 0.5)) * log(length(p) + 1.) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_resolution.y - vec2(0.65, 0.5);
  vec3 color = vec3(0);
  float depthSum = 0.;
  int samples = int(SAMPLES);
  for (int i = 0; i < samples; i++) {
    float depth = FOCAL_DISTANCE;
    if (samples > 1) {
      depth += (float(i) / float(samples - 1)) * FOCAL_RANGE;
    }
    float weight = 1. / (1. + abs(depth - FOCAL_DISTANCE));
    vec3 sampleColor = vec3(0);
    const int iterations = 7;
    for (int j = 0; j < iterations; j++) {
      vec3 q = vec3(0, 0, 5) + normalize(vec3(p, -1.)) * depth;
      float rz = map(q);
      float f = clamp((rz - map(q + 0.1)) * 0.5, -0.1, 1.);
      vec3 rgbColor;
      if (samples > 1) {
        float huePhase = 0.2 + p.x * 0.9 + p.y * 0.4 + sin(u_time * colorChangeSpeed * 0.4) * 0.15;
        rgbColor = paletteMix(clamp(huePhase, 0.0, 1.0));
      } else {
        rgbColor = vec3(0.1, 0.3, 0.4);
      }
      vec3 l = rgbColor * 0.75 + vec3(0.35, 0.5, 0.65) * f;
      vec3 glow = smoothstep(3.2, 0., rz) * l;
      sampleColor = sampleColor * min(l, vec3(0.8)) + glow;
      sampleColor = min(sampleColor, vec3(0.95));
      depth += min(rz, 1.);
    }
    color += sampleColor * weight;
    depthSum += weight;
  }
  color /= depthSum;
  color = 1.0 - exp(-color * 1.15);
  float g2 = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(g2), color, 1.25);
  color += vec3(0.03, 0.06, 0.12);
  color *= brightness;
  fragColor = vec4(color, 1);
}
`;