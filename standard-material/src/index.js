import { Application } from "pixi.js";
import {
  Model,
  Skybox,
  LightingEnvironment,
  ImageBasedLighting,
  CameraOrbitControl,
  Color
} from "pixi3d";

import "./styles.css";

// Create the PixiJS application which will handle the render loop and create the canvas view.
let app = new Application({
  backgroundColor: 0xdddddd,
  resizeTo: window,
  antialias: true
});

// Append the application canvas view to the document body.
document.body.appendChild(app.view);

let control = new CameraOrbitControl(app.view);

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
  "waterbottle.gltf",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/waterbottle/waterbottle.gltf"
);

app.loader.load((_, resources) => {
  app.stage.addChild(new Skybox(resources["skybox.cubemap"].cubemap));

  // Create and add the model, it uses the standard material by default.
  let model = app.stage.addChild(
    Model.from(resources["waterbottle.gltf"].gltf)
  );
  model.scale.set(15);

  model.meshes.forEach((mesh) => {
    mesh.material.unlit = false; // Set unlit = true to disable all lighting.
    mesh.material.baseColor = new Color(1, 1, 1, 1); // The base color will be blended together with base color texture (if available).
    mesh.material.alphaMode = "opaque"; // Set alpha mode to "blend" for transparency (base color alpha less than 1).
    mesh.material.exposure = 1; // Set exposure to be able to control the brightness.
  });

  // Create the image-based lighting (IBL) object which is used to light the model. Depending on which IBL environment is used, it will greatly affect the visual appearence of the model.
  let ibl = new ImageBasedLighting(
    resources["diffuse.cubemap"].cubemap,
    resources["specular.cubemap"].cubemap
  );

  LightingEnvironment.main = new LightingEnvironment(app.renderer, ibl);
});
