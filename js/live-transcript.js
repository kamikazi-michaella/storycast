(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const panels = document.querySelectorAll("[data-live-transcript]");

  if (!panels.length) {
    return;
  }

  panels.forEach((panel) => {
    const media = document.querySelector(panel.dataset.media);
    const body = panel.querySelector(".live-transcript__body");
    const status = panel.querySelector("[data-transcript-status]");
    const lineElements = [...panel.querySelectorAll(".live-transcript__line")];

    if (!media || !body || !lineElements.length) {
      return;
    }

    const lines = lineElements
      .map((element) => ({
        element,
        start: Number.parseFloat(element.dataset.start),
        end: Number.parseFloat(element.dataset.end),
      }))
      .filter((line) => Number.isFinite(line.start) && Number.isFinite(line.end));

    if (!lines.length) {
      return;
    }

    let activeIndex = -1;
    let following = true;
    let frame = 0;
    let scrollFrame = 0;

    const setStatus = () => {
      if (!status) {
        return;
      }

      status.textContent = following ? "Following" : "Resume follow";
      status.setAttribute("aria-pressed", String(following));
      status.setAttribute(
        "title",
        following
          ? "Pause automatic transcript scrolling"
          : "Resume automatic transcript scrolling"
      );
      panel.classList.toggle("is-paused", !following);
    };

    const animateScroll = (target) => {
      window.cancelAnimationFrame(scrollFrame);

      const start = body.scrollTop;
      const distance = target - start;

      if (reduceMotion.matches || Math.abs(distance) < 2) {
        body.scrollTop = target;
        return;
      }

      const started = window.performance.now();
      const duration = 420;

      const step = (now) => {
        if (!following) {
          return;
        }

        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        body.scrollTop = start + distance * eased;

        if (progress < 1) {
          scrollFrame = window.requestAnimationFrame(step);
        }
      };

      scrollFrame = window.requestAnimationFrame(step);
    };

    const scrollToLine = (line) => {
      if (!following) {
        return;
      }

      const target =
        line.element.offsetTop -
        (body.clientHeight - line.element.offsetHeight) / 2;

      animateScroll(Math.max(0, target));
    };

    const setProgress = (line, time) => {
      const duration = Math.max(0.1, line.end - line.start);
      const progress = Math.min(1, Math.max(0, (time - line.start) / duration));
      line.element.style.setProperty("--progress", progress.toFixed(4));
    };

    const update = () => {
      const time = Number.isFinite(media.currentTime) ? media.currentTime : 0;
      let index = 0;

      for (let i = 0; i < lines.length; i += 1) {
        if (time >= lines[i].start) {
          index = i;
        } else {
          break;
        }
      }

      if (media.ended) {
        index = lines.length - 1;
      }

      const current = lines[index];

      if (index !== activeIndex) {
        if (activeIndex >= 0) {
          const previous = lines[activeIndex];
          previous.element.classList.remove("is-active");
          previous.element.removeAttribute("aria-current");
          previous.element.style.setProperty("--progress", "1");
        }

        lines.forEach((line, lineIndex) => {
          line.element.classList.toggle("is-past", lineIndex < index);
          line.element.classList.toggle("is-upcoming", lineIndex > index);
          line.element.classList.remove("is-active");
          line.element.removeAttribute("aria-current");
        });

        current.element.classList.add("is-active");
        current.element.classList.remove("is-past", "is-upcoming");
        current.element.setAttribute("aria-current", "true");
        activeIndex = index;
        scrollToLine(current);
      }

      setProgress(current, media.ended ? current.end : time);
    };

    const tick = () => {
      update();

      if (!media.paused && !media.ended) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      update();
    };

    const pauseFollow = () => {
      if (!following) {
        return;
      }

      following = false;
      window.cancelAnimationFrame(scrollFrame);
      setStatus();
    };

    const resumeFollow = () => {
      following = true;
      setStatus();
      update();

      if (activeIndex >= 0) {
        scrollToLine(lines[activeIndex]);
      }
    };

    if (status) {
      status.addEventListener("click", () => {
        if (following) {
          pauseFollow();
        } else {
          resumeFollow();
        }
      });
    }

    ["wheel", "touchmove"].forEach((eventName) => {
      body.addEventListener(eventName, pauseFollow, { passive: true });
    });

    body.addEventListener("keydown", (event) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          event.key
        )
      ) {
        pauseFollow();
      }
    });

    media.addEventListener("play", start);
    media.addEventListener("pause", stop);
    media.addEventListener("timeupdate", update);
    media.addEventListener("seeked", update);
    media.addEventListener("ended", stop);
    media.addEventListener("loadedmetadata", update);

    setStatus();
    update();
  });
})();
