(() => {
  if (window.imageZoomInitialized) return;
  window.imageZoomInitialized = true;

  const dialog = document.createElement("dialog");
  dialog.className = "image-zoom-dialog";
  dialog.setAttribute("aria-label", "图片查看器");

  dialog.innerHTML = `
    <div class="image-zoom-toolbar">
      <button type="button" data-action="zoom-out" aria-label="缩小" title="缩小">−</button>
      <span data-zoom-level aria-live="polite">100%</span>
      <button type="button" data-action="zoom-in" aria-label="放大" title="放大">+</button>
      <button type="button" data-action="reset" aria-label="重置缩放" title="重置缩放">重置</button>
      <button type="button" data-action="close" aria-label="关闭" title="关闭">×</button>
    </div>
    <div class="image-zoom-stage">
      <img alt="" draggable="false">
    </div>
  `;

  document.body.appendChild(dialog);

  const image = dialog.querySelector(".image-zoom-stage img");
  const stage = dialog.querySelector(".image-zoom-stage");
  const toolbar = dialog.querySelector(".image-zoom-toolbar");
  const zoomLevel = dialog.querySelector("[data-zoom-level]");

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let pointerX = 0;
  let pointerY = 0;

  function clampPan() {
    const maxX = Math.max(
      0,
      (image.offsetWidth * scale - stage.clientWidth) / 2
    );
    const maxY = Math.max(
      0,
      (image.offsetHeight * scale - stage.clientHeight) / 2
    );

    offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
    offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
  }

  function updateImage() {
    clampPan();

    image.style.transform =
      `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;

    zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    dialog.classList.toggle("is-zoomed", scale > 1);
  }

  function setScale(nextScale) {
    scale = Math.min(8, Math.max(0.25, nextScale));
    updateImage();
  }

  function resetZoom() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    updateImage();
  }

  function stopDragging() {
    dragging = false;
    dialog.classList.remove("is-dragging");
  }

  // 点击文章里的图片链接，打开原图。
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-image-zoom]");
    if (!link) return;

    event.preventDefault();

    const thumbnail = link.querySelector("img");
    image.src = link.href;
    image.alt = thumbnail?.alt || "";

    resetZoom();

    if (!dialog.open) {
      dialog.showModal();
    }
  });

  // 工具栏按钮。
  dialog
    .querySelector('[data-action="zoom-in"]')
    .addEventListener("click", () => {
      setScale(scale * 1.25);
    });

  dialog
    .querySelector('[data-action="zoom-out"]')
    .addEventListener("click", () => {
      setScale(scale / 1.25);
    });

  dialog
    .querySelector('[data-action="reset"]')
    .addEventListener("click", resetZoom);

  dialog
    .querySelector('[data-action="close"]')
    .addEventListener("click", () => {
      dialog.close();
    });

  // 滚轮缩放。
  stage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      setScale(scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15));
    },
    { passive: false }
  );

  // 放大后按住图片拖动。
  image.addEventListener("pointerdown", (event) => {
    if (scale <= 1) return;

    event.preventDefault();

    dragging = true;
    pointerX = event.clientX;
    pointerY = event.clientY;

    image.setPointerCapture(event.pointerId);
    dialog.classList.add("is-dragging");
  });

  image.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    offsetX += event.clientX - pointerX;
    offsetY += event.clientY - pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;

    updateImage();
  });

  image.addEventListener("pointerup", stopDragging);
  image.addEventListener("pointercancel", stopDragging);

  // 点击图片和工具栏以外的遮罩区域关闭。
  dialog.addEventListener("click", (event) => {
    const clickedImage = image.contains(event.target);
    const clickedToolbar = toolbar.contains(event.target);

    if (!clickedImage && !clickedToolbar) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", stopDragging);

  // 键盘快捷键：+/- 缩放，0 重置；Esc 可关闭原生 dialog。
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setScale(scale * 1.25);
    } else if (event.key === "-") {
      event.preventDefault();
      setScale(scale / 1.25);
    } else if (event.key === "0") {
      event.preventDefault();
      resetZoom();
    }
  });
})();