import { Application } from "pixi.js";
import {
  Container3D,
  Mesh3D,
  Model,
  Color,
  Camera,
  LightingEnvironment,
  Light,
  LightType,
  CameraOrbitControl
} from "pixi3d";

import "./styles.css";

let app = new Application({
  backgroundColor: 0xdddddd,
  resizeTo: window,
  antialias: true
});
document.body.appendChild(app.view);

app.loader.add(
  "duck.gltf",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/duck/duck.gltf"
);

app.loader.load((_, resources) => {
  let ground = app.stage.addChild(Mesh3D.createPlane());
  ground.scale.set(15);

  let model = app.stage.addChild(Model.from(resources["duck.gltf"].gltf));
  model.y = -0.2;
  model.rotationQuaternion.setEulerAngles(0, 180, 0);
  model.scale.set(2);

  // A light that is located infinitely far away, and emits light in one
  // direction only.
  let dirLight = Object.assign(new Light(), {
    type: LightType.directional,
    intensity: 1,
    color: new Color(1, 1, 1)
  });
  dirLight.rotationQuaternion.setEulerAngles(45, -75, 0);
  LightingEnvironment.main.lights.push(dirLight);

  // A light that is located at a point and emits light in a cone shape.
  let spotLight = Object.assign(new Light(), {
    type: LightType.spot,
    range: 30,
    color: new Color(1, 0.7, 0.7),
    intensity: 30
  });
  spotLight.position.set(-3, 2, -3);
  LightingEnvironment.main.lights.push(spotLight);

  document.addEventListener("pointermove", (e) => {
    // Moves spot light to pointer position.
    spotLight.position = Camera.main.screenToWorld(e.x, e.y, 6);
  });

  // A light that is located at a point and emits light in all directions equally.
  let pointLight = Object.assign(new Light(), {
    type: LightType.point,
    range: 10,
    color: new Color(0.5, 0.5, 1),
    intensity: 25
  });
  pointLight.position.set(0, 2, -3);
  LightingEnvironment.main.lights.push(pointLight);

  let container = app.stage.addChild(new Container3D());
  container.addChild(pointLight);

  let rotation = 0;
  app.ticker.add(() => {
    // Rotate point light around the model.
    container.rotationQuaternion.setEulerAngles(0, rotation++, 0);
    // Rotate spot light towards the model.
    spotLight.transform.lookAt(model.position);
  });
});

let control = new CameraOrbitControl(app.view);
control.distance = 10;
control.angles.set(45, 0);
