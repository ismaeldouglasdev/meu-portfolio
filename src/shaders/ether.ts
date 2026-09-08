export const etherFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform mediump float u_time;
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;

uniform float SAMPLES;
uniform float FOCAL_DISTANCE;
uniform float FOCAL_RANGE;
uniform float colorChangeSpeed;

out vec4 fragColor;

#define saturate(V) clamp(V, 0.0, 1.0)

vec3 hue2rgb(float hue) {
  float R = abs(hue * 6.0 - 3.0) - 1.0;
  float G = 2.0 - abs(hue * 6.0 - 2.0);
  float B = 2.0 - abs(hue * 6.0 - 4.0);
  return saturate(vec3(R, G, B));
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb = hue2rgb(hsl.x);
  float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
  return (rgb - 0.5) * C + hsl.z;
}

mat2 rotate2d(float r) {
  float c = cos(r);
  float s = sin(r);
  return mat2(c, s, -s, c);
}

float map(vec3 p) {
  p.xz *= rotate2d(u_time * 0.4);
  p.xy *= rotate2d(u_time * 0.3);
  vec3 q = p * 2. + u_time;
  return length(p + vec3(sin(u_time * 0.7))) * log(length(p) + 1.) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_resolution.y - vec2(0.9, 0.5);
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
    const int iterations = 5;
    for (int j = 0; j < iterations; j++) {
      vec3 q = vec3(0, 0, 5) + normalize(vec3(p, -1.)) * depth;
      float rz = map(q);
      float f = clamp((rz - map(q + 0.1)) * 0.5, -0.1, 1.);
      vec3 rgbColor;
      if (samples > 1) {
        float hue = 0.44 + 0.16 * mod(u_time * colorChangeSpeed + float(j) / float(iterations), 1.);
        rgbColor = hsl2rgb(vec3(hue, 1, 0.5));
      } else {
        rgbColor = vec3(0.1, 0.3, 0.4);
      }
      vec3 l = rgbColor + vec3(3, 4, 5) * f;
      sampleColor = sampleColor * l + smoothstep(2.5, 0., rz) * 0.7 * l;
      depth += min(rz, 1.);
    }
    color += sampleColor * weight;
    depthSum += weight;
  }
  color /= depthSum;
  fragColor = vec4(color, 1);
}
`;