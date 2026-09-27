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

const setSource = family => {
  var size = getSize();
  family.target.src = getSource(family.name, size);
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