// Material helpers for the CAD model generators.
// Kept in a separate file so it can be imported from many model files.

import * as THREE from 'three';

export function metal(color: number, metalness = 0.9, roughness = 0.2): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

export function steel(): THREE.MeshStandardMaterial {
  return metal(0x6b7280, 0.92, 0.18);
}

export function stainless(): THREE.MeshStandardMaterial {
  return metal(0xb8bcc4, 0.95, 0.12);
}

export function aluminum(): THREE.MeshStandardMaterial {
  return metal(0x9aa3b0, 0.7, 0.35);
}

export function darkSteel(): THREE.MeshStandardMaterial {
  return metal(0x3a3f47, 0.88, 0.25);
}

export function brass(): THREE.MeshStandardMaterial {
  return metal(0xc09545, 0.9, 0.3);
}

export function rubber(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.9 });
}

export function plastic(color = 0x2a2a2a): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, metalness: 0.05, roughness: 0.6 });
}

export function addShadow(mesh: THREE.Mesh): THREE.Mesh {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
