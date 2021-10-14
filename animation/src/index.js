import { Application } from "pixi.js";
import {
  Mesh3D,
  Model,
  Skybox,
  ImageBasedLighting,
  LightingEnvironment,
  Light,
  LightType,
  ShadowCastingLight,
  ShadowQuality,
  CameraOrbitControl
} from "pixi3d";

import "./styles.css";

// Create the PixiJS application which will handle the render loop and create
// the canvas view.
let app = new Application({
  backgroundColor: 0xdddddd,
  resizeTo: window,
  antialias: true
});

// Append the application canvas view to the document body.
document.body.appendChild(app.view);

app.loader.add(
  "diffuse.cubemap",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/footprint_court/diffuse.cubemap"
);
app.loader.add(
  "specular.cubemap",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/footprint_court/specular.cubemap"
);
app.loader.add(
  "skybox.cubemap",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/footprint_court/skybox.cubemap"
);
app.loader.add(
  "stormtrooper.gltf",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/stormtrooper/stormtrooper.gltf"
);

app.loader.load((_, resources) => {
  app.stage.addChild(new Skybox(resources["skybox.cubemap"].cubemap));

  // Create and add the model, it uses the standard material by default.
  let model = app.stage.addChild(
    Model.from(resources["stormtrooper.gltf"].gltf)
  );
  model.y = -1.8;

  // Start to play the first animation.
  model.animations[0].play();
  model.animations[0].loop = true;
  model.animations[0].speed = 1;

  // Create the ground, just a plane mesh.
  let ground = app.stage.addChild(Mesh3D.createPlane());
  ground.y = -1.8;
  ground.scale.set(15);
  ground.material.metallic = 0;

  // Create the image-based lighting (IBL) object which is used to light the
  // model. Depending on which IBL environment is used, it will greatly affect
  // the visual appearence of the model.
  let ibl = new ImageBasedLighting(
    resources["diffuse.cubemap"].cubemap,
    resources["specular.cubemap"].cubemap
  );

  LightingEnvironment.main = new LightingEnvironment(app.renderer, ibl);

  // Create a directional light, which will be used for casting a shadow.
  let dirLight = Object.assign(new Light(), {
    type: LightType.directional,
    intensity: 0.75
  });
  dirLight.rotationQuaternion.setEulerAngles(45, -75, 0);
  LightingEnvironment.main.lights.push(dirLight);

  // Create the shadow casting light which is used to render meshes to a shadow
  // texture. It has several settings which is used for controlling the quality
  // and performance of the shadows.
  let shadowCastingLight = new ShadowCastingLight(app.renderer, dirLight, {
    shadowTextureSize: 512,
    quality: ShadowQuality.medium
  });
  shadowCastingLight.softness = 1;
  shadowCastingLight.shadowArea = 15;

  let pipeline = app.renderer.plugins.pipeline;

  // Enable shadows for both the model and the ground. This will add the object
  // to the shadow render pass and setup the material to use the shadow texture.
  pipeline.enableShadows(model, shadowCastingLight);
  pipeline.enableShadows(ground, shadowCastingLight);
});

let control = new CameraOrbitControl(app.view);
