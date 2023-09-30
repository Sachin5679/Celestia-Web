import React, { useEffect, useRef } from "react";

interface Config {
  TEXTURE_DOWNSAMPLE?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE_DISSIPATION?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
}

export default function FluidBG(props: { config?: Config }) {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;

  const cnf = props.config || {};

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let config = {
      TEXTURE_DOWNSAMPLE: cnf.TEXTURE_DOWNSAMPLE || 1,
      DENSITY_DISSIPATION: cnf.DENSITY_DISSIPATION || 0.98,
      VELOCITY_DISSIPATION: cnf.VELOCITY_DISSIPATION || 0.99,
      PRESSURE_DISSIPATION: cnf.PRESSURE_DISSIPATION || 0.8,
      PRESSURE_ITERATIONS: cnf.PRESSURE_ITERATIONS || 25,
      CURL: cnf.CURL || 30,
      SPLAT_RADIUS: cnf.SPLAT_RADIUS || 0.005,
    };

    let pointers: any[] = [];
    let splatStack: any = [];

    const { gl, ext } = getWebGLContext(canvas);

    function getWebGLContext(canvas: any) {
      const params = {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
      };

      let gl = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension(
          "OES_texture_half_float_linear"
        );
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      const halfFloatTexType = isWebGL2
        ? gl.HALF_FLOAT
        : halfFloat.HALF_FLOAT_OES;
      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(
          gl,
          gl.RGBA16F,
          gl.RGBA,
          halfFloatTexType
        );
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }
    // @ts-ignore
    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }

      return {
        internalFormat,
        format,
      };
    }
    // @ts-ignore
    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );

      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status != gl.FRAMEBUFFER_COMPLETE) return false;
      return true;
    }

    function pointerPrototype() {
      // @ts-ignore
      this.id = -1;
      // @ts-ignore
      this.x = 0;
      // @ts-ignore
      this.y = 0;
      // @ts-ignore
      // @ts-ignore
      this.dx = 0;
      // @ts-ignore
      this.dy = 0;
      // @ts-ignore
      this.down = false;
      // @ts-ignore
      this.moved = false;
      // @ts-ignore
      this.color = [30, 0, 300];
    }

    // @ts-ignore
    pointers.push(new pointerPrototype());

    class GLProgram {
      // @ts-ignore
      constructor(vertexShader, fragmentShader) {
        // @ts-ignore
        this.uniforms = {};
        // @ts-ignore
        this.program = gl.createProgram();

        // @ts-ignore
        gl.attachShader(this.program, vertexShader);
        // @ts-ignore
        gl.attachShader(this.program, fragmentShader);
        // @ts-ignore
        gl.linkProgram(this.program);

        // @ts-ignore
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          // @ts-ignore
          throw gl.getProgramInfoLog(this.program);

        const uniformCount = gl.getProgramParameter(
          // @ts-ignore
          this.program,
          gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
          // @ts-ignore
          const uniformName = gl.getActiveUniform(this.program, i).name;
          // @ts-ignore
          this.uniforms[uniformName] = gl.getUniformLocation(
            // @ts-ignore
            this.program,
            uniformName
          );
        }
      }

      bind() {
        // @ts-ignore
        gl.useProgram(this.program);
      }
    }

    // @ts-ignore
    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(shader);

      return shader;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`
    );

    const advectionManualFilteringShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (in sampler2D sam, in vec2 p) {
        vec4 st;
        st.xy = floor(p - 0.5) + 0.5;
        st.zw = st.xy + 1.0;
        vec4 uv = st * texelSize.xyxy;
        vec4 a = texture2D(sam, uv.xy);
        vec4 b = texture2D(sam, uv.zy);
        vec4 c = texture2D(sam, uv.xw);
        vec4 d = texture2D(sam, uv.zw);
        vec2 f = p - st.xy;
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main () {
        vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
        gl_FragColor = dissipation * bilerp(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;

    vec2 sampleVelocity (in vec2 uv) {
        vec2 multiplier = vec2(1.0, 1.0);
        if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
        if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
        if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
        if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
        return multiplier * texture2D(uVelocity, uv).xy;
    }

    void main () {
        float L = sampleVelocity(vL).x;
        float R = sampleVelocity(vR).x;
        float T = sampleVelocity(vT).y;
        float B = sampleVelocity(vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
    }
`
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = vec2(abs(T) - abs(B), 0.0);
        force *= 1.0 / length(force + 0.00001) * curl * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
`
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    vec2 boundary (in vec2 uv) {
        uv = min(max(uv, 0.0), 1.0);
        return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    vec2 boundary (in vec2 uv) {
        uv = min(max(uv, 0.0), 1.0);
        return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`
    );

    // @ts-ignore
    let textureWidth;
    // @ts-ignore
    let textureHeight;
    // @ts-ignore
    let density;
    // @ts-ignore
    let velocity;
    // @ts-ignore
    let divergence;
    // @ts-ignore
    let curl;
    // @ts-ignore
    let pressure;
    initFramebuffers();

    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(
      baseVertexShader,
      ext.supportLinearFiltering
        ? advectionShader
        : advectionManualFilteringShader
    );
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader
    );

    function initFramebuffers() {
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;

      density = createDoubleFBO(
        2,
        textureWidth,
        textureHeight,
        // @ts-ignore
        rgba.internalFormat,
        // @ts-ignore
        rgba.format,
        texType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      velocity = createDoubleFBO(
        0,
        textureWidth,
        textureHeight,
        // @ts-ignore
        rg.internalFormat,
        // @ts-ignore
        rg.format,
        texType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      divergence = createFBO(
        4,
        textureWidth,
        textureHeight,
        // @ts-ignore
        r.internalFormat,
        // @ts-ignore
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        5,
        textureWidth,
        textureHeight,
        // @ts-ignore
        r.internalFormat,
        // @ts-ignore
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        6,
        textureWidth,
        textureHeight,
        // @ts-ignore
        r.internalFormat,
        // @ts-ignore
        r.format,
        texType,
        gl.NEAREST
      );
    }

    // @ts-ignore
    function createFBO(texId, w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0 + texId);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return [texture, fbo, texId];
    }

    // @ts-ignore
    function createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(
        texId + 1,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );

      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (destination: any) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let lastTime = Date.now();
    // @ts-ignore
    multipleSplats(parseInt(Math.random() * 20) + 5);
    update();

    function update() {
      resizeCanvas();

      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      // @ts-ignore
      gl.viewport(0, 0, textureWidth, textureHeight);

      // @ts-ignore
      if (splatStack.length > 0) multipleSplats(splatStack.pop());

      advectionProgram.bind();
      gl.uniform2f(
        // @ts-ignore
        advectionProgram.uniforms.texelSize,
        // @ts-ignore
        1.0 / textureWidth,
        // @ts-ignore
        1.0 / textureHeight
        // @ts-ignore
      );
      // @ts-ignore
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      // @ts-ignore
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read[2]);
      // @ts-ignore
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        // @ts-ignore
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      // @ts-ignore
      blit(velocity.write[1]);
      // @ts-ignore
      velocity.swap();

      // @ts-ignore
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      // @ts-ignore
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read[2]);
      gl.uniform1f(
        // @ts-ignore
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      // @ts-ignore
      blit(density.write[1]);
      // @ts-ignore
      density.swap();

      for (let i = 0; i < pointers.length; i++) {
        // @ts-ignore
        const pointer = pointers[i];
        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      curlProgram.bind();
      gl.uniform2f(
        // @ts-ignore
        curlProgram.uniforms.texelSize,
        // @ts-ignore
        1.0 / textureWidth,
        // @ts-ignore
        1.0 / textureHeight
      );
      // @ts-ignore
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read[2]);
      // @ts-ignore
      blit(curl[1]);

      vorticityProgram.bind();
      gl.uniform2f(
        // @ts-ignore
        vorticityProgram.uniforms.texelSize,
        // @ts-ignore
        1.0 / textureWidth,
        // @ts-ignore
        1.0 / textureHeight
      );
      // @ts-ignore
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read[2]);
      // @ts-ignore
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
      // @ts-ignore
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      // @ts-ignore
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      // @ts-ignore
      blit(velocity.write[1]);
      // @ts-ignore
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        // @ts-ignore
        divergenceProgram.uniforms.texelSize,
        // @ts-ignore
        1.0 / textureWidth,
        // @ts-ignore
        1.0 / textureHeight
      );
      // @ts-ignore
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read[2]);
      // @ts-ignore
      blit(divergence[1]);

      clearProgram.bind();
      // @ts-ignore
      let pressureTexId = pressure.read[2];
      // @ts-ignore
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      // @ts-ignore
      gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
      // @ts-ignore
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      // @ts-ignore
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      // @ts-ignore
      blit(pressure.write[1]);
      // @ts-ignore
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        // @ts-ignore
        pressureProgram.uniforms.texelSize,
        // @ts-ignore
        1.0 / textureWidth,
        // @ts-ignore
        1.0 / textureHeight
      );
      // @ts-ignore
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
      // @ts-ignore
      pressureTexId = pressure.read[2];
      // @ts-ignore
      // @ts-ignore
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
      // @ts-ignore
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      // @ts-ignore
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        // @ts-ignore
        gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
        // @ts-ignore
        blit(pressure.write[1]);
        // @ts-ignore
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(
        // @ts-ignore
        gradienSubtractProgram.uniforms.texelSize,
        // @ts-ignore
        1.0 / textureWidth,
        // @ts-ignore
        1.0 / textureHeight
      );
      // @ts-ignore
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read[2]);
      // @ts-ignore
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read[2]);
      // @ts-ignore
      blit(velocity.write[1]);
      // @ts-ignore
      velocity.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayProgram.bind();
      // @ts-ignore
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read[2]);
      blit(null);

      requestAnimationFrame(update);
    }

    // @ts-ignore
    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      // @ts-ignore
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read[2]);
      gl.uniform1f(
        // @ts-ignore
        splatProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      );
      gl.uniform2f(
        // @ts-ignore
        splatProgram.uniforms.point,
        x / canvas.width,
        1.0 - y / canvas.height
      );
      // @ts-ignore
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      // @ts-ignore
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      // @ts-ignore
      blit(velocity.write[1]);
      // @ts-ignore
      velocity.swap();

      // @ts-ignore
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read[2]);
      gl.uniform3f(
        // @ts-ignore
        splatProgram.uniforms.color,
        color[0] * 0.3,
        color[1] * 0.3,
        color[2] * 0.3
      );
      // @ts-ignore
      blit(density.write[1]);
      // @ts-ignore
      density.swap();
    }

    // @ts-ignore
    function multipleSplats(amount) {
      for (let i = 0; i < amount; i++) {
        const color = [
          Math.random() * 10,
          Math.random() * 10,
          Math.random() * 10,
        ];
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }

    function resizeCanvas() {
      if (
        canvas.width != canvas.clientWidth ||
        canvas.height != canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        initFramebuffers();
      }
    }

    canvas.addEventListener("mousemove", (e) => {
      // @ts-ignore
      pointers[0].moved = pointers[0].down;
      // @ts-ignore
      pointers[0].dx = (e.offsetX - pointers[0].x) * 10.0;
      // @ts-ignore
      pointers[0].dy = (e.offsetY - pointers[0].y) * 10.0;
      // @ts-ignore
      pointers[0].x = e.offsetX;
      // @ts-ignore
      pointers[0].y = e.offsetY;
    });

    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
          // @ts-ignore
          let pointer = pointers[i];
          pointer.moved = pointer.down;
          pointer.dx = (touches[i].pageX - pointer.x) * 10.0;
          pointer.dy = (touches[i].pageY - pointer.y) * 10.0;
          pointer.x = touches[i].pageX;
          pointer.y = touches[i].pageY;
        }
      },
      false
    );

    canvas.addEventListener("mousemove", () => {
      // @ts-ignore
      pointers[0].down = true;
      // @ts-ignore
      pointers[0].color = [
        Math.random() + 0.2,
        Math.random() + 0.2,
        Math.random() + 0.2,
      ];
    });

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        // @ts-ignore
        if (i >= pointers.length) pointers.push(new pointerPrototype());

        // @ts-ignore
        pointers[i].id = touches[i].identifier;
        // @ts-ignore
        pointers[i].down = true;
        // @ts-ignore
        pointers[i].x = touches[i].pageX;
        // @ts-ignore
        pointers[i].y = touches[i].pageY;
        // @ts-ignore
        pointers[i].color = [
          Math.random() + 0.2,
          Math.random() + 0.2,
          Math.random() + 0.2,
        ];
      }
    });

    window.addEventListener("mouseup", () => {
      // @ts-ignore
      pointers[0].down = false;
    });

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++)
        for (let j = 0; j < pointers.length; j++)
          // @ts-ignore
          if (touches[i].identifier == pointers[j].id) pointers[j].down = false;
    });
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute" />;
}
