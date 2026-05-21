const deck = document.getElementById("deck");
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("dots");
const counter = document.getElementById("counter");
const progressBar = document.getElementById("progressBar");

let current = 0;
let locked = false;
let touchStartY = 0;

const dots = slides.map((_, index) => {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Idi na slajd ${index + 1}`);
  dot.addEventListener("click", () => goTo(index));
  dotsWrap.appendChild(dot);
  return dot;
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function paintUI() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === current);
  });

  dots.forEach((dot, index) => {
    dot.setAttribute("aria-current", index === current ? "true" : "false");
  });

  counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

  const ratio = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;
  progressBar.style.width = `${ratio}%`;
}

function goTo(index) {
  const next = clamp(index, 0, slides.length - 1);

  if (next === current || locked) {
    return;
  }

  locked = true;
  current = next;
  deck.style.transform = `translateY(-${current * 100}vh)`;
  paintUI();

  window.setTimeout(() => {
    locked = false;
  }, 860);
}

function step(direction) {
  goTo(current + direction);
}

window.addEventListener(
  "wheel",
  (event) => {
    if (locked) {
      return;
    }

    if (event.deltaY > 24) {
      step(1);
    } else if (event.deltaY < -24) {
      step(-1);
    }
  },
  { passive: true }
);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    step(1);
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    step(-1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    goTo(slides.length - 1);
  }
});

window.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.changedTouches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  "touchend",
  (event) => {
    if (locked) {
      return;
    }

    const delta = touchStartY - event.changedTouches[0].clientY;

    if (delta > 40) {
      step(1);
    } else if (delta < -40) {
      step(-1);
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  deck.style.transform = `translateY(-${current * 100}vh)`;
});

paintUI();
