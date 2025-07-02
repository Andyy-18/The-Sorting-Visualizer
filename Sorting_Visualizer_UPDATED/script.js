const canvas = document.getElementById("mycanvas");
mycanvas.width = Math.min(window.innerWidth - 40, 800);  // max width = 800
mycanvas.height = 300;

let highlighted = { type: null, indices: [] };

let speed = 30; // default speed
let paused = false;

const margin = 30;
const n = 20;
const array = [];
let moves = [];
const cols = [];

const spacing = (canvas.width - margin * 2) / n;
const ctx = canvas.getContext("2d");
const maxcolumnheight = 200;

init();

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  moves = [];
  for (let i = 0; i < array.length; i++) {
    const x = i * spacing + spacing / 2 + margin;
    const y = canvas.height - margin - i * 3;
    const width = spacing - 4;
    const height = maxcolumnheight * array[i];
    cols[i] = new column(x, y, width, height);
  }
}
document.getElementById("speedRange").addEventListener("input", (e) => {
  speed = parseInt(e.target.value);
});

function play() {
  const selectedAlgo = document.getElementById("algorithm").value;
  const arrCopy = [...array]; // fresh copy to preserve original
  if (selectedAlgo === "bubble") {
    moves = bubblesort(arrCopy);
  } else if (selectedAlgo === "selection") {
    moves = selectionsort(arrCopy);
  } else if (selectedAlgo === "merge") {
    moves = [];
    mergesort([...array], 0, array.length - 1, moves);
  } else if (selectedAlgo === "quick") {
    moves = [];
    quicksort([...array], 0, array.length - 1, moves);
  }
}

function togglePause() {
  paused = !paused;
  document.getElementById("pauseBtn").innerText = paused
    ? "▶ Resume"
    : "⏸ Pause";
}

function bubblesort(arr) {
  const moves = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) {
        swapped = true;
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        moves.push({ indices: [i - 1, i], swap: true });
      } else {
        moves.push({ indices: [i - 1, i], swap: false });
      }
    }
  } while (swapped);
  return moves;
}

function selectionsort(arr) {
  const moves = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      moves.push({ indices: [minIndex, j], swap: false });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      moves.push({ indices: [i, minIndex], swap: true });
    }
  }

  return moves;
}

function animate() {
  if (paused) {
    requestAnimationFrame(animate);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let changed = false;
  for (let i = 0; i < cols.length; i++) {
    changed = cols[i].draw(ctx) || changed;
  }

  if (!changed && moves.length > 0) {
    const move = moves.shift();
    highlighted = {
      type: move.swap ? "swap" : "compare",
      indices: move.indices,
    };

    const [i, j] = move.indices;

    if (move.action === "overwrite") {
      const newH = maxcolumnheight * move.newHeight;
      const currentH = cols[i].height;
      const steps = 10;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        cols[i].queue.push({
          x: cols[i].x,
          y: cols[i].y,
          height: lerp(currentH, newH, t),
        });
      }
    } else if (move.swap) {
      cols[i].moveTo(cols[j], 1, 30);
      cols[j].moveTo(cols[i], -1, 30);
      [cols[i], cols[j]] = [cols[j], cols[i]];
    }
  }
  // Reset highlights after some frames
  if (highlighted.indices.length > 0) {
    setTimeout(() => (highlighted = { type: null, indices: [] }), 50);
  }

  setTimeout(() => requestAnimationFrame(animate), 110 - speed);
}

animate();

function mergesort(arr, left, right, moves) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  mergesort(arr, left, mid, moves);
  mergesort(arr, mid + 1, right, moves);

  const merged = [];
  let i = left,
    j = mid + 1;

  while (i <= mid && j <= right) {
    moves.push({ indices: [i, j], swap: false }); // comparison

    if (arr[i] < arr[j]) {
      merged.push(arr[i++]);
    } else {
      merged.push(arr[j++]);
    }
  }

  while (i <= mid) {
    merged.push(arr[i++]);
  }

  while (j <= right) {
    merged.push(arr[j++]);
  }

  for (let k = 0; k < merged.length; k++) {
    arr[left + k] = merged[k];
    moves.push({
      indices: [left + k],
      newHeight: merged[k],
      action: "overwrite",
      fromHeight: arr[left + k], // this line is new
    });
  }
}

function quicksort(arr, left, right, moves) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right, moves);
    quicksort(arr, left, pivotIndex - 1, moves);
    quicksort(arr, pivotIndex + 1, right, moves);
  }
}

function partition(arr, left, right, moves) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    moves.push({ indices: [j, right], swap: false }); // comparison

    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      moves.push({ indices: [i, j], swap: true });
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  moves.push({ indices: [i + 1, right], swap: true });

  return i + 1;
}
