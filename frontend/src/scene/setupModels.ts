// let _deferredSettings: PlantariumSettings = <PlantariumSettings>{};

// async function applySettings(_s: PlantariumSettings) {
//   if (!_deferredSettings) {
//     if (_s) {
//       _deferredSettings = _s;
//     }
//   }

//   if (plant) {
//     if (_s['debug_wireframe']) {
//       plantMesh.mode = gl.LINES;
//       groundMesh.mode = gl.LINES;
//       leafMesh.mode = gl.LINES;
//     } else {
//       plantMesh.mode = gl.TRIANGLES;
//       groundMesh.mode = gl.TRIANGLES;
//       leafMesh.mode = gl.TRIANGLES;
//     }
//   }

//   if (_s['debug_indices']) {
//     showIndices = true;
//   } else {
//     showIndices = false;
//   }

//   if (_s['debug_skeleton']) {
//     showSkeleton = true;
//   } else {
//     showSkeleton = false;
//   }

//   if (groundMesh) {
//     const resX = _s['ground_resX'] || 12;
//     const resY = _s['ground_resY'] || 12;
//     const size = _s['ground_size'] || 0.00001;
//     if (resX && resY && size) {
//       const groundGeometry = ground(size, resX, resY);
//       groundMesh.geometry = new Geometry(gl, {
//         position: { size: 3, data: new Float32Array(groundGeometry.position) },
//         normal: { size: 3, data: new Float32Array(groundGeometry.normal) },
//         uv: { size: 2, data: new Float32Array(groundGeometry.uv) },
//         index: { size: 1, data: new Uint16Array(groundGeometry.index) },
//       });
//     }

//     if (_s['ground_enable'] !== false) {
//       groundMesh.visible = true;
//       if (!groundMesh.parent) {
//         groundMesh.setParent(scene);
//       }
//     } else {
//       groundMesh.visible = false;
//     }
//   }

//   if (plant) {
//     plantMesh.visible = !_s['debug_disable_model'];
//   }

//   if (gridMesh) {
//     if (_s['debug_grid']) {
//       gridMesh.visible = true;

//       let gridNeedsUpdate = false;

//       if (_s['debug_grid_resolution'] !== gridResolution) {
//         gridResolution = _s['debug_grid_resolution'];
//         gridNeedsUpdate = true;
//       }

//       if (_s['debug_grid_size'] !== gridSize) {
//         gridSize = _s['debug_grid_size'];
//         gridNeedsUpdate = true;
//       }

//       if (gridNeedsUpdate) {
//         const gridGeometry = grid(gridSize, gridResolution);
//         gridMesh.geometry = new Geometry(gl, {
//           position: { size: 3, data: new Float32Array(gridGeometry.position) },
//         });
//       }
//     } else {
//       gridMesh.visible = false;
//     }
//   }
// }

// //Init
// (async () => {
//   //Load the models;
//   (async () => {
//     // Create the grid;

//     plant = new Geometry(gl, {
//       position: { size: 3, data: new Float32Array([0, 0, 0]) },
//       normal: { size: 3, data: new Float32Array([0, 0, 0]) },
//       uv: { size: 2, data: new Float32Array([0, 0]) },
//       index: { size: 1, data: new Uint16Array([0, 0]) },
//     });

//     // Create the main mesh with the placeholder geometry
//     plantMesh = new Mesh(gl, {
//       geometry: plant,
//       program: basicShader,
//     });
//     plantMesh.setParent(scene);
//     plant.computeBoundingBox();

//     leaf = new Geometry(gl, {
//       position: { size: 3, data: new Float32Array([0, 0, 0, 0, 0, 0]) },
//       normal: { size: 3, data: new Float32Array([0, 0, 0, 0, 0, 0]) },
//       uv: { size: 2, data: new Float32Array([0, 0, 0, 0]) },
//       index: { size: 1, data: new Uint16Array([0, 1]) },
//       // simply add the 'instanced' property to flag as an instanced attribute.
//       // set the value as the divisor number
//       offset: {
//         instanced: 1,
//         size: 3,
//         data: new Float32Array([0, 0, 0, 1, 1, 1]),
//       },
//       rotation: {
//         instanced: 1,
//         size: 3,
//         data: new Float32Array([0, 0, 0, 1, 1, 1]),
//       },
//       scale: {
//         instanced: 1,
//         size: 3,
//         data: new Float32Array([0, 0, 0, 1, 1, 1]),
//       },
//     });

//     leafMesh = new Mesh(gl, {
//       geometry: leaf,
//       program: load.shader('InstanceShader', {
//         uTime: { value: 0 },
//       }),
//     });

//     leafMesh.setParent(scene);

//     // Load ground object
//     groundMesh = new Mesh(gl, {
//       // mode: gl.LINES,
//       program: load.shader('GroundShader', {
//         uTime: { value: 0 },
//         tMap: { value: groundTexture },
//         // Pass relevant uniforms for fog
//         uFogColor: { value: new Color('#ffffff') },
//         uFogNear: { value: 10 },
//         uFogFar: { value: 30 },
//         texScale: { value: 1 },
//       }),
//       geometry: new Geometry(gl, {
//         position: { size: 3, data: new Float32Array([0, 0, 0]) },
//         normal: { size: 1, data: new Float32Array([0, 0, 0]) },
//         uv: { size: 2, data: new Float32Array([0, 0, 0]) },
//         index: { size: 1, data: new Uint16Array([0]) },
//       }),
//     });

//     applySettings(_deferredSettings);
//   })();

//   requestAnimationFrame(render);
// })();
