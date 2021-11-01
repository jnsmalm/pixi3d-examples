import { Application, Texture } from "pixi.js";
import {
  Sprite3D,
  SpriteBillboardType,
  Vec3,
  Camera,
  CameraOrbitControl
} from "pixi3d";

import "./styles.css";

let app = new Application({
  backgroundColor: 0xdddddd,
  resizeTo: window,
  antialias: true
});
document.body.appendChild(app.view);

let control = new CameraOrbitControl(app.view);
control.distance = 3.5;
control.angles.x = 8;

class Bunny extends Sprite3D {
  constructor(texture, areaSize) {
    super(texture);

    this.areaSize = areaSize;
    this.position.set(
      -this.areaSize / 2 + Math.random() * this.areaSize,
      0,
      -this.areaSize / 2 + Math.random() * this.areaSize
    );

    this.speedX = -0.01 + Math.random() * 0.02;
    this.speedY = Math.random() * 6;
    this.speedZ = -0.01 + Math.random() * 0.02;

    // The billboard type is set so the sprite always face the camera.
    this.billboardType = SpriteBillboardType.Spherical;
  }

  distanceFromCamera() {
    return Vec3.distance(
      this.worldTransform.position,
      Camera.main.worldTransform.position
    );
  }

  update() {
    this.position.x += this.speedX;
    this.position.y = Math.cos((this.speedY += 0.4)) * 0.05;
    this.position.z += this.speedZ;

    if (this.position.x > this.areaSize / 2) {
      this.speedX *= -1;
      this.position.x = this.areaSize / 2;
    } else if (this.position.x < -this.areaSize / 2) {
      this.speedX *= -1;
      this.position.x = -this.areaSize / 2;
    }
    if (this.position.z > this.areaSize / 2) {
      this.speedZ *= -1;
      this.position.z = this.areaSize / 2;
    } else if (this.position.z < -this.areaSize / 2) {
      this.speedZ *= -1;
      this.position.z = -this.areaSize / 2;
    }
  }
}

const textures = [
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_ash.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_batman.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_bb8.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_neo.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_sonic.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_spidey.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_stormtrooper.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_superman.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_tron.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_wolverine.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3.png"
  ),
  Texture.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-examples/master/assets/bunnies/rabbitv3_frankenstein.png"
  )
];

const bunnies = [];
for (let i = 0; i < 500; i++) {
  bunnies.push(app.stage.addChild(new Bunny(textures[i % textures.length], 6)));
}

// So the sprites can be sorted using z-index.
app.stage.sortableChildren = true;

app.ticker.add(() => {
  for (let bunny of bunnies) {
    bunny.update();

    // This will render the bunnies from back to front.
    bunny.zIndex = -bunny.distanceFromCamera();
  }
});
