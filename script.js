const slider = document.querySelector(".range-slider");
const progress = slider.querySelector(".progress");
const minPriceInput = slider.querySelector(".min-price");
const maxPriceInput = slider.querySelector(".max-price");
const minInput = slider.querySelector(".min-input");
const maxInput = slider.querySelector(".max-input");

const updateProgress = () => {
  const minValue = parseInt(minInput.value);
  const maxValue = parseInt(maxInput.value);

  // get the total range of the slider
  const range = maxInput.max - minInput.min;
  // get the selected value range of the progress
  const valueRange = maxValue - minValue;
  // calculate the width percentage
  const width = (valueRange / range) * 100;
  // calculate the min thumb offset
  const minOffset = ((minValue - minInput.min) / range) * 100;

  // update the progress width
  progress.style.width = width + "%";
  // update the progress left position
  progress.style.left = minOffset + "%";

  // update the number inputs
  minPriceInput.value = minValue;
  maxPriceInput.value = maxValue;
};

const updateRange = (event) => {
  const input = event.target;

  let min = parseInt(minPriceInput.value);
  let max = parseInt(maxPriceInput.value);

  if (input === minPriceInput && min > max) {
    max = min;
    maxPriceInput.value = max;
  } else if (input === maxPriceInput && max < min) {
    min = max;
    minPriceInput.value = min;
  }

  minInput.value = min;
  maxInput.value = max;

  updateProgress();
};

minPriceInput.addEventListener("input", updateRange);
maxPriceInput.addEventListener("input", updateRange);

minInput.addEventListener("input", () => {
  if (parseInt(minInput.value) >= parseInt(maxInput.value)) {
    maxInput.value = minInput.value;
  }
  updateProgress();
});

maxInput.addEventListener("input", () => {
  if (parseInt(maxInput.value) <= parseInt(minInput.value)) {
    minInput.value = maxInput.value;
  }
  updateProgress();
});

let isDragging = false;
let startOffsetX;

progress.addEventListener("mousedown", (e) => {
  e.preventDefault(); // prevent text selection

  isDragging = true;

  startOffsetX = e.clientX - progress.getBoundingClientRect().left;

  slider.classList.toggle("dragging", isDragging);
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    // get the size and position of the slider
    const sliderRect = slider.getBoundingClientRect();
    const progressWidth = parseFloat(progress.style.width || 0);

    // calculate the new left position for the progress element
    let newLeft =
      ((e.clientX - sliderRect.left - startOffsetX) / sliderRect.width) * 100;

    // ensure the progress is not exceeding the slider boundaries
    newLeft = Math.min(Math.max(newLeft, 0), 100 - progressWidth);

    // update the progress position
    progress.style.left = newLeft + "%";

    // calculate the new min thumb position
    const range = maxInput.max - minInput.min;
    const newMin = Math.round((newLeft / 100) * range) + parseInt(minInput.min);
    const newMax = newMin + parseInt(maxInput.value) - parseInt(minInput.value);

    // update the min input
    minInput.value = newMin;
    maxInput.value = newMax;

    // update the progress
    updateProgress();
  }
  slider.classList.toggle("dragging", isDragging);
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
  }
  slider.classList.toggle("dragging", isDragging);
});

updateProgress();
