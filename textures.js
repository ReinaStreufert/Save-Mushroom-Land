let textureList = [
  {
    name: "froggistill",
    src: "/froggi/froggi_still.png"
  },
  {
    name: "froggijump",
    src: "/froggi/froggi_jump.png"
  },
  {
    name: "froggitongueleft",
    src: "/froggi/froggi_tongue_left.png"
  },
  {
    name: "froggitongueright",
    src: "/froggi/froggi_tongue_right.png"
  },
  {
    name: "froggijumptongueleft",
    src: "/froggi/froggi_jump_tongue_left.png"
  },
  {
    name: "froggijumptongueright",
    src: "/froggi/froggi_jump_tongue_right.png"
  },
  {
    name: "mushroom1",
    src: "/mushrooms/mushroom_1.png"
  },
  {
    name: "mushroom2",
    src: "/mushrooms/mushroom_2.png"
  },
  {
    name: "mushroom3",
    src: "/mushrooms/mushroom_3.png"
  },
  {
    name: "mushroom4",
    src: "/mushrooms/mushroom_4.png"
  },
  {
    name: "cloud1",
    src: "/env/cloud_1.png"
  },
  {
    name: "cloud2",
    src: "/env/cloud_2.png"
  },
  {
    name: "sun",
    src: "/env/sun.png"
  }
];

window.textures = {};
textures.TotalTextures = textureList.length;
textures.LoadedTextures = 0;
textures.LoadAll = function(oncomplete) {
  for (let i = 0; i < textureList.length; i++) {
    let texentry = textureList[i];
    textures[texentry.name] = new Image();
    textures[texentry.name].onload = function() {
      textures.LoadedTextures++;
      if (textures.LoadedTextures == textures.TotalTextures) {
        oncomplete();
      }
    }
    textures[texentry.name].src = texentry.src;
  }
}
