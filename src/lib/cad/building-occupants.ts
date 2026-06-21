// ====================== BUILDING OCCUPANTS (3D People) ======================
// Detailed 3D person models that can "enter" the building and be placed
// in various rooms. Each person has: head, hair, torso, arms, hands, legs,
// shoes, and clothing. Different poses and colors for variety.

import * as THREE from 'three';
import { addShadow, metal, steel, stainless, aluminum, darkSteel, brass, rubber, plastic } from './materials-dsl';

// Skin tones
const SKIN_TONES = [
  0xfdc4a6,  // light
  0xe8b48b,  // medium-light
  0xc68863,  // medium
  0x8d5524,  // dark
];

// Clothing color palettes
const SHIRT_COLORS = [0x3b82f6, 0xdc2626, 0x16a34a, 0x9333ea, 0xea580c, 0x0891b2, 0xca8a04, 0xdb2777];
const PANTS_COLORS = [0x1e3a5f, 0x374151, 0x4a2c1a, 0x1f2937, 0x5a3a1a, 0x2d3748];

interface PersonOptions {
  skinTone?: number;
  shirtColor?: number;
  pantsColor?: number;
  hairColor?: number;
  pose?: 'standing' | 'sitting' | 'walking' | 'waving' | 'reaching';
  gender?: 'male' | 'female';
  height?: number; // total height in mm (default 65 for ~1.7m at building scale)
}

// Create a single 3D person
export function createPerson(opts: PersonOptions = {}): THREE.Group {
  const person = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({
    color: opts.skinTone ?? SKIN_TONES[0],
    metalness: 0.05, roughness: 0.7,
  });
  const shirt = new THREE.MeshStandardMaterial({
    color: opts.shirtColor ?? SHIRT_COLORS[0],
    metalness: 0.05, roughness: 0.8,
  });
  const pants = new THREE.MeshStandardMaterial({
    color: opts.pantsColor ?? PANTS_COLORS[0],
    metalness: 0.05, roughness: 0.85,
  });
  const hair = new THREE.MeshStandardMaterial({
    color: opts.hairColor ?? 0x1a1a1a,
    metalness: 0.1, roughness: 0.6,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x222222, metalness: 0.3, roughness: 0.5,
  });

  const H = opts.height ?? 17; // total height (~1.7m at 10 units/m building scale)
  const headR = H * 0.06;      // head radius
  const torsoH = H * 0.32;     // torso height
  const torsoW = H * 0.14;     // torso width
  const torsoD = H * 0.08;     // torso depth
  const armL = H * 0.34;       // arm length
  const armR = H * 0.022;      // arm radius
  const legH = H * 0.42;       // leg height
  const legR = H * 0.03;       // leg radius
  const legGap = H * 0.03;     // gap between legs

  const pose = opts.pose ?? 'standing';
  const gender = opts.gender ?? 'male';

  // ===== HEAD =====
  const headGroup = new THREE.Group();
  headGroup.position.y = H - headR * 1.2;

  // Head sphere (slightly elongated)
  const headMesh = addShadow(new THREE.Mesh(
    new THREE.SphereGeometry(headR, 16, 14), skin
  ));
  headMesh.scale.set(0.85, 1, 0.9);
  headGroup.add(headMesh);

  // Hair (varies by gender)
  if (gender === 'female') {
    // Longer hair (covers back of head + extends down)
    const hairBack = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(headR * 1.1, 16, 14), hair
    ));
    hairBack.scale.set(0.95, 1.15, 1.05);
    hairBack.position.set(0, -headR * 0.1, -headR * 0.15);
    headGroup.add(hairBack);
    // Hair flowing down the back
    const hairFlow = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(headR * 0.9, headR * 0.7, H * 0.2, 12), hair
    ));
    hairFlow.position.set(0, -headR * 0.5, -headR * 0.6);
    headGroup.add(hairFlow);
  } else {
    // Short hair (cap on top)
    const hairCap = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(headR * 1.02, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair
    ));
    hairCap.position.y = headR * 0.15;
    headGroup.add(hairCap);
  }

  // Eyes (2 small dark spheres)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.3 });
  [-1, 1].forEach((s) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.1, 8, 8), eyeMat);
    eye.position.set(s * headR * 0.3, headR * 0.05, headR * 0.78);
    headGroup.add(eye);
    // Eye white
    const white = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    white.position.set(s * headR * 0.3, headR * 0.05, headR * 0.74);
    white.scale.set(1, 0.7, 0.5);
    headGroup.add(white);
  });

  // Mouth (small dark box)
  const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(headR * 0.3, headR * 0.08, headR * 0.05),
    new THREE.MeshStandardMaterial({ color: 0x8b3a3a, roughness: 0.5 })
  );
  mouth.position.set(0, -headR * 0.3, headR * 0.78);
  headGroup.add(mouth);

  // Nose (small cone)
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(headR * 0.08, headR * 0.2, 8), skin
  );
  nose.position.set(0, -headR * 0.1, headR * 0.88);
  nose.rotation.x = Math.PI / 2;
  headGroup.add(nose);

  // Ears (2 small spheres on sides)
  [-1, 1].forEach((s) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.15, 8, 8), skin);
    ear.position.set(s * headR * 0.85, 0, 0);
    ear.scale.set(0.5, 1, 0.7);
    headGroup.add(ear);
  });

  person.add(headGroup);

  // ===== NECK =====
  const neck = addShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(headR * 0.5, headR * 0.55, H * 0.04, 12), skin
  ));
  neck.position.y = H - headR * 2.4;
  person.add(neck);

  // ===== TORSO =====
  const torsoY = H - headR * 2.4 - torsoH / 2 - H * 0.02;
  const torso = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(torsoW, torsoH, torsoD), shirt
  ));
  torso.position.y = torsoY;
  // Slightly taper torso (wider at shoulders)
  torso.scale.set(1, 1, 0.95);
  person.add(torso);

  // Shoulders (rounded)
  const shoulderY = torsoY + torsoH * 0.45;
  [-1, 1].forEach((s) => {
    const shoulder = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(armR * 1.4, 12, 10), shirt
    ));
    shoulder.position.set(s * (torsoW / 2 - armR * 0.3), shoulderY, 0);
    person.add(shoulder);
  });

  // Collar (for shirt detail)
  const collar = addShadow(new THREE.Mesh(
    new THREE.TorusGeometry(headR * 0.45, headR * 0.08, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
  ));
  collar.position.y = torsoY + torsoH * 0.48;
  collar.rotation.x = Math.PI / 2;
  person.add(collar);

  // ===== ARMS =====
  // Arm positions depend on pose
  const createArm = (side: number, armPose: 'down' | 'up' | 'out' | 'wave' | 'reach') => {
    const armGroup = new THREE.Group();
    armGroup.position.set(side * (torsoW / 2 + armR * 0.5), shoulderY, 0);

    // Upper arm
    const upperArm = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(armR, armR * 0.95, armL * 0.45, 12), shirt
    ));
    upperArm.position.y = -armL * 0.225;
    armGroup.add(upperArm);

    // Elbow (joint sphere)
    const elbow = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(armR * 0.9, 10, 8), shirt
    ));
    elbow.position.y = -armL * 0.45;
    armGroup.add(elbow);

    // Forearm group (rotates at elbow)
    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -armL * 0.45;

    const forearm = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(armR * 0.95, armR * 0.85, armL * 0.4, 12), skin
    ));
    forearm.position.y = -armL * 0.2;
    forearmGroup.add(forearm);

    // Hand
    const hand = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(armR * 1.4, armL * 0.12, armR * 1.6), skin
    ));
    hand.position.y = -armL * 0.46;
    forearmGroup.add(hand);

    // Fingers (simplified — 4 small boxes)
    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(
        new THREE.BoxGeometry(armR * 0.3, armL * 0.1, armR * 0.5), skin
      );
      finger.position.set(-armR * 0.5 + i * armR * 0.35, -armL * 0.55, 0);
      forearmGroup.add(finger);
    }

    armGroup.add(forearmGroup);

    // Apply pose
    switch (armPose) {
      case 'down':
        // Arms hang down naturally
        armGroup.rotation.z = side * 0.05;
        forearmGroup.rotation.x = 0;
        break;
      case 'up':
        // Arms raised up
        armGroup.rotation.z = side * -Math.PI * 0.8;
        forearmGroup.rotation.x = 0;
        break;
      case 'out':
        // Arms out to sides
        armGroup.rotation.z = side * -Math.PI * 0.45;
        forearmGroup.rotation.x = 0;
        break;
      case 'wave':
        // One arm up and waving (only used for one side)
        armGroup.rotation.z = side * -Math.PI * 0.7;
        forearmGroup.rotation.x = -Math.PI * 0.3;
        forearmGroup.rotation.z = side * 0.3;
        break;
      case 'reach':
        // Arm reaching forward
        armGroup.rotation.x = -Math.PI * 0.5;
        forearmGroup.rotation.x = -Math.PI * 0.2;
        break;
    }

    return armGroup;
  };

  // Add arms based on pose
  if (pose === 'waving') {
    person.add(createArm(1, 'wave'));  // right arm waves
    person.add(createArm(-1, 'down')); // left arm down
  } else if (pose === 'sitting') {
    // Arms rest on lap / forward
    person.add(createArm(1, 'reach'));
    person.add(createArm(-1, 'reach'));
  } else if (pose === 'walking') {
    // One arm slightly forward, one back
    const armR_walk = createArm(1, 'down');
    armR_walk.rotation.x = -0.4;
    person.add(armR_walk);
    const armL_walk = createArm(-1, 'down');
    armL_walk.rotation.x = 0.4;
    person.add(armL_walk);
  } else if (pose === 'reaching') {
    person.add(createArm(1, 'reach'));
    person.add(createArm(-1, 'down'));
  } else {
    // standing
    person.add(createArm(1, 'down'));
    person.add(createArm(-1, 'down'));
  }

  // ===== HIPS =====
  const hipY = torsoY - torsoH / 2;
  const hip = addShadow(new THREE.Mesh(
    new THREE.BoxGeometry(torsoW * 0.9, H * 0.06, torsoD), pants
  ));
  hip.position.y = hipY - H * 0.03;
  person.add(hip);

  // ===== LEGS =====
  const createLeg = (side: number, legPose: 'straight' | 'bent' | 'walk-fwd' | 'walk-back') => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * legGap, hipY - H * 0.06, 0);

    // Upper leg (thigh)
    const thigh = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(legR, legR * 0.9, legH * 0.5, 12), pants
    ));
    thigh.position.y = -legH * 0.25;
    legGroup.add(thigh);

    // Knee (joint)
    const knee = addShadow(new THREE.Mesh(
      new THREE.SphereGeometry(legR * 0.9, 10, 8), pants
    ));
    knee.position.y = -legH * 0.5;
    legGroup.add(knee);

    // Lower leg group (rotates at knee)
    const lowerLegGroup = new THREE.Group();
    lowerLegGroup.position.y = -legH * 0.5;

    const lowerLeg = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(legR * 0.9, legR * 0.75, legH * 0.5, 12), pants
    ));
    lowerLeg.position.y = -legH * 0.25;
    lowerLegGroup.add(lowerLeg);

    // Shoe
    const shoe = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(legR * 1.8, legR * 0.8, legR * 3), shoeMat
    ));
    shoe.position.set(0, -legH * 0.5 - legR * 0.4, legR * 0.8);
    lowerLegGroup.add(shoe);

    legGroup.add(lowerLegGroup);

    // Apply pose
    switch (legPose) {
      case 'straight':
        lowerLegGroup.rotation.x = 0;
        break;
      case 'bent':
        // Knee bent (sitting position)
        legGroup.rotation.x = -Math.PI * 0.45;
        lowerLegGroup.rotation.x = Math.PI * 0.45;
        break;
      case 'walk-fwd':
        legGroup.rotation.x = -0.4;
        lowerLegGroup.rotation.x = 0.2;
        break;
      case 'walk-back':
        legGroup.rotation.x = 0.4;
        lowerLegGroup.rotation.x = -0.1;
        break;
    }

    return legGroup;
  };

  // Add legs based on pose
  if (pose === 'sitting') {
    person.add(createLeg(1, 'bent'));
    person.add(createLeg(-1, 'bent'));
  } else if (pose === 'walking') {
    person.add(createLeg(1, 'walk-fwd'));
    person.add(createLeg(-1, 'walk-back'));
  } else {
    person.add(createLeg(1, 'straight'));
    person.add(createLeg(-1, 'straight'));
  }

  return person;
}

// Create a group of multiple people placed throughout the building interior
export function createBuildingOccupants(): THREE.Group {
  const group = new THREE.Group();

  // Building dimensions (must match building shell)
  const FH = 100; // floor height

  // ===== GROUND FLOOR (Shop) =====
  // Shopkeeper behind counter (position: behind counter at x=0, z=30, shop area)
  const shopkeeper = createPerson({
    skinTone: SKIN_TONES[1],
    shirtColor: 0x16a34a,  // green apron/shirt
    pantsColor: 0x1f2937,
    hairColor: 0x1a1a1a,
    pose: 'standing',
    gender: 'male',
    height: 17,
  });
  shopkeeper.position.set(0, 0, 22); // standing on floor behind counter
  group.add(shopkeeper);

  // Customer browsing in shop (walking pose)
  const customer1 = createPerson({
    skinTone: SKIN_TONES[0],
    shirtColor: 0x3b82f6,  // blue shirt
    pantsColor: 0x374151,
    hairColor: 0x4a2c1a,
    pose: 'walking',
    gender: 'male',
    height: 18,
  });
  customer1.position.set(-40, 0, 25);
  customer1.rotation.y = Math.PI / 6; // facing toward shelves
  group.add(customer1);

  // Customer 2 looking at items
  const customer2 = createPerson({
    skinTone: SKIN_TONES[2],
    shirtColor: 0xdb2777,  // pink
    pantsColor: 0x4a2c1a,
    hairColor: 0x1a1a1a,
    pose: 'standing',
    gender: 'female',
    height: 16,
  });
  customer2.position.set(60, 0, 10);
  customer2.rotation.y = -Math.PI / 4;
  group.add(customer2);

  // ===== 2ND FLOOR =====
  // Person sitting on sofa in living room
  const sitter = createPerson({
    skinTone: SKIN_TONES[0],
    shirtColor: 0xea580c,  // orange
    pantsColor: 0x2d3748,
    hairColor: 0x3a2a1a,
    pose: 'sitting',
    gender: 'male',
    height: 17,
  });
  sitter.position.set(40, 4, -10); // sitting on sofa (seat at ~0.4m = 4 units)
  sitter.rotation.y = Math.PI; // facing away from back wall (toward TV)
  group.add(sitter);

  // Person walking in living room (kid)
  const kid = createPerson({
    skinTone: SKIN_TONES[1],
    shirtColor: 0xfacc15,  // yellow shirt
    pantsColor: 0x1e3a5f,
    hairColor: 0x1a1a1a,
    pose: 'walking',
    gender: 'female',
    height: 13, // shorter = child
  });
  kid.position.set(50, FH, 25);
  kid.rotation.y = -Math.PI / 3;
  group.add(kid);

  // Person in kitchen (cooking, reaching)
  const cook = createPerson({
    skinTone: SKIN_TONES[2],
    shirtColor: 0x0891b2,  // cyan
    pantsColor: 0x374151,
    hairColor: 0x1a1a1a,
    pose: 'reaching',
    gender: 'female',
    height: 16,
  });
  cook.position.set(15, FH, -35); // at stove
  cook.rotation.y = Math.PI; // facing stove (away from camera)
  group.add(cook);

  // Person on stairs (walking up, mid-staircase)
  const stairPerson = createPerson({
    skinTone: SKIN_TONES[1],
    shirtColor: 0x9333ea,  // purple
    pantsColor: 0x1f2937,
    hairColor: 0x2a1a0a,
    pose: 'walking',
    gender: 'male',
    height: 17,
  });
  stairPerson.position.set(-75, 25, -55); // mid-stairs (y=25 is halfway up)
  stairPerson.rotation.y = Math.PI / 2; // facing up the stairs
  group.add(stairPerson);

  // ===== 3RD FLOOR =====
  // Person sitting at desk in study
  const studier = createPerson({
    skinTone: SKIN_TONES[0],
    shirtColor: 0x16a34a,  // green
    pantsColor: 0x1f2937,
    hairColor: 0x1a1a1a,
    pose: 'sitting',
    gender: 'male',
    height: 17,
  });
  studier.position.set(80, FH * 2 + 4, -42); // sitting at desk (seat at ~0.4m)
  studier.rotation.y = Math.PI; // facing desk
  group.add(studier);

  // Person standing in master bedroom (waving)
  const waver = createPerson({
    skinTone: SKIN_TONES[3],
    shirtColor: 0xdc2626,  // red
    pantsColor: 0x4a2c1a,
    hairColor: 0x1a1a1a,
    pose: 'waving',
    gender: 'female',
    height: 16,
  });
  waver.position.set(-50, FH * 2, 25); // in master bedroom
  waver.rotation.y = Math.PI / 4;
  group.add(waver);

  // Person on 3rd floor balcony (relaxing)
  const balconyPerson = createPerson({
    skinTone: SKIN_TONES[1],
    shirtColor: 0xca8a04,  // gold
    pantsColor: 0x2d3748,
    hairColor: 0x3a2a1a,
    pose: 'standing',
    gender: 'male',
    height: 17,
  });
  balconyPerson.position.set(0, FH * 2 + 30, 60); // on 3F balcony
  balconyPerson.rotation.y = Math.PI; // looking out from building
  group.add(balconyPerson);

  // Person in 3rd floor kitchen (rice cooker!)
  const cook2 = createPerson({
    skinTone: SKIN_TONES[2],
    shirtColor: 0xea580c,  // orange
    pantsColor: 0x1f2937,
    hairColor: 0x1a1a1a,
    pose: 'reaching',
    gender: 'female',
    height: 15,
  });
  cook2.position.set(5, FH * 2, -40);
  cook2.rotation.y = Math.PI;
  group.add(cook2);

  return group;
}
