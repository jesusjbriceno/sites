var date = new Date();
var hour = date.getHours();
const MEDIA_PATH = "media/";

const sizes = {
  vertical: "vertical",
  big: "1080",
  medium: "720",
  small: "360"
};

const families = {
  coffee: {
    name: "coffee",
    target: document.getElementById("coffeeVideo")
  },
  tech: {
    name: "tech",
    target: document.getElementById("techVideo")
  },
  river: {
    name: "river",
    target: document.getElementById("riverVideo")
  }
};

const getSize = _ => {
  var width = window.innerWidth;
  if (width <= 480) {
    return sizes.vertical;
  }
  if (width <= 720) {
    return sizes.small;
  }
  if (width <= 1080) {
    return sizes.medium;
  }
  return sizes.big;
};

const getSource = (family, size) => {
  if (size === sizes.vertical) {
    return `${MEDIA_PATH}${family}_vertical.mp4`;
  }
  return `${MEDIA_PATH}${family}_${size}p.mp4`;
};

const FAMILIAS_CON_AV1 = { coffee: true, tech: true, river: false };

// AV1 pesa entre un 75% y un 90% menos que el H.264 con la misma calidad
// (medido: SSIM por encima de 0.99). El rio se queda en H.264 a proposito:
// el agua es el peor caso para comprimir y no le sale a cuenta.
const soportaAv1 = video =>
  video.canPlayType('video/mp4; codecs="av01.0.05M.08"') !== "";

const setSource = family => {
  var size = getSize();
  var base = getSource(family.name, size);

  if (FAMILIAS_CON_AV1[family.name] && soportaAv1(family.target)) {
    family.target.onerror = function () {
      // Si el AV1 faltara, no dejamos la pantalla en blanco: al H.264.
      family.target.onerror = null;
      family.target.src = base;
    };
    family.target.src = base.replace(/\.mp4$/, "_av1.mp4");
  } else {
    family.target.src = base;
  }
};

const showFamily = family => {
  const targets = Object.values(families).map(family => family.target);
  targets.forEach(target => target.classList.remove("show"));
  setSource(family);
  family.target.classList.add("show");
};

const showVideo = _ => {
  if (hour >= 7 && hour < 10) {
    showFamily(families.coffee);
  } else if (hour >= 10 && hour < 17) {
    showFamily(families.tech);
  } else {
    showFamily(families.river);
  }
};

window.addEventListener('resize', function() {
  showVideo();
});

showVideo();