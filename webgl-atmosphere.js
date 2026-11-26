/* A small transparent WebGL light/water surface. The CSS architecture remains the fallback. */
(() => {
  const canvas = document.getElementById('webgl-atmosphere');
  const host = canvas?.closest('.hero-image');
  if (!canvas || !host) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let gl;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  } catch (_) { return; }
  if (!gl) { canvas.hidden = true; return; }

  const vertex = `attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragment = `precision mediump float;
    varying vec2 v_uv; uniform vec2 u_resolution; uniform vec2 u_pointer; uniform float u_time;
    void main(){
      vec2 uv=v_uv; vec2 p=uv-vec2(.5); p.x*=u_resolution.x/max(u_resolution.y,1.);
      vec2 m=u_pointer-vec2(.5); m.x*=u_resolution.x/max(u_resolution.y,1.);
      float d=length(p-m);
      float wave=sin(d*42.0-u_time*1.15 + sin(uv.x*5.0+u_time*.16)*.45);
      float ripple=pow(max(0.0,1.0-abs(wave)),9.0)*exp(-d*1.2);
      float drift=sin(uv.x*4.0+uv.y*2.0-u_time*.18)*.5+.5;
      float light=exp(-length((uv-vec2(.76,.28))*vec2(1.1,1.8))*5.0);
      vec3 sage=vec3(.56,.69,.56); vec3 champagne=vec3(.87,.76,.54);
      vec3 tint=mix(sage,champagne,clamp(drift*.58+light*.45,0.0,1.0));
      float alpha=clamp(.018+ripple*.19+light*.045,0.0,.22);
      gl_FragColor=vec4(tint,alpha);
    }`;
  const compile = (type, source) => {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw new Error('WebGL shader unavailable'); }
    return shader;
  };
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('WebGL program unavailable');
  } catch (_) { canvas.hidden = true; return; }

  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const pointer = gl.getUniformLocation(program, 'u_pointer');
  const time = gl.getUniformLocation(program, 'u_time');
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
  let cursor = [0.52, 0.48], raf = 0, started = performance.now(), inView = false;

  const resize = () => {
    const rect = host.getBoundingClientRect(); const ratio = Math.min(devicePixelRatio || 1, 1.35);
    const width = Math.max(1, Math.round(rect.width * ratio)); const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height); }
    gl.uniform2f(resolution, width, height);
  };
  const draw = now => {
    raf = 0; if (!inView || document.hidden) return;
    resize(); gl.uniform2f(pointer, cursor[0], cursor[1]);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(time, reduced.matches ? 0 : (now - started) * .001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!reduced.matches) raf = requestAnimationFrame(draw);
  };
  const start = () => { if (!document.hidden && inView && !raf) raf = requestAnimationFrame(draw); };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; inView ? start() : stop(); }, { threshold: 0.05 });
    observer.observe(host);
  } else { inView = true; start(); }
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  window.addEventListener('resize', resize, { passive: true });
  host.addEventListener('pointermove', event => {
    const rect = host.getBoundingClientRect();
    cursor = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height];
  }, { passive: true });
  reduced.addEventListener?.('change', () => { stop(); start(); });
  resize(); if (!('IntersectionObserver' in window)) start();
})();
