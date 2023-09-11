import * as PIXI from 'pixi.js';

export default class Shaders {
  static ENTITY_SPRITE_SHADER = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float intensity;
    
    void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);
if(color.a  < 0.9) discard;
  color.r = color.r + intensity;
  color.g = color.g + intensity;
  color.b = color.b + intensity;
  color.a = color.a;
  gl_FragColor = color;
}`;

  static fragment = `
  varying vec2 vTextureCoord;
  uniform vec4 uColor;
  
  uniform sampler2D uSampler;
  
  void main(void)
  {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
  }`;

  static get ENTITY_SPRITE_UNIFORMS() {
    return {
      intensity: 1
    }
  };

  static Intensity =  new PIXI.Filter(null, Shaders.ENTITY_SPRITE_SHADER)
  

  constructor() {
  }
}