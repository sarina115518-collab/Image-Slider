//Sarina_Thapa_115518

document.addEventListener("DOMContentLoaded", function () {

    // Select the slider elements
    const track = document.getElementById("sliderTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("sliderDots");
    const counter = document.getElementById("slideCounter");
    const slider = document.getElementById("dogSlider");

    // Get the original slides before creating clones
    const originalSlides = Array.from(
        track.querySelectorAll(".slide")
    );

    const totalSlides = originalSlides.length;

    // Stop if there are no slides
    if (totalSlides === 0) {
        return;
    }

    // Clone the first and last slides for infinite looping
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    firstClone.querySelector("img").alt = "";
    lastClone.querySelector("img").alt = "";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    // The first original slide is at index 1
    let currentIndex = 1;
    let isAnimating = false;

    // Create a navigation dot for each original slide
    originalSlides.forEach(function (slide, index) {

        const dot = document.createElement("button");

        dot.type = "button";
        dot.classList.add("dot");
        dot.setAttribute(
            "aria-label",
            `Go to ${slide.querySelector("h3").textContent}`
        );

        dot.addEventListener("click", function () {
            if (isAnimating) {
                return;
            }

            // Move to the selected original slide
            currentIndex = index + 1;
            updateSlider();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(
        dotsContainer.querySelectorAll(".dot")
    );

    // Move the track horizontally
    function moveTrack() {
        track.style.transform =
            `translateX(-${currentIndex * 100}%)`;
    }

    // Update the active dot and image counter
    function updateIndicators() {

        const actualIndex =
            (currentIndex - 1 + totalSlides) % totalSlides;

        dots.forEach(function (dot, index) {

            const isActive = index === actualIndex;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        counter.textContent =
            `Breed ${actualIndex + 1} of ${totalSlides}`;
    }
    // Update the slider position
    function updateSlider() {
        isAnimating = true;
        moveTrack();
        updateIndicators();
    }
    // Go to the next slide
    function nextSlide() {
        if (isAnimating) {
            return;
        }

        currentIndex++;
        updateSlider();
    }
    // Go to the previous slide
    function previousSlide() {
        if (isAnimating) {
            return;
        }

        currentIndex--;
        updateSlider();
    }
    // Handle the end of the CSS transition
    track.addEventListener("transitionend", function (event) {

        if (
            event.target !== track ||
            event.propertyName !== "transform"
        ) {
            return;
        }

        // Reached the cloned first slide
        if (currentIndex === totalSlides + 1) {

            track.style.transition = "none";
            currentIndex = 1;
            moveTrack();

            // Apply the position reset before restoring animation
            track.getBoundingClientRect();
            track.style.transition = "";
        }

        // Reached the cloned last slide
        else if (currentIndex === 0) {

            track.style.transition = "none";
            currentIndex = totalSlides;
            moveTrack();

            // Apply the position reset before restoring animation
            track.getBoundingClientRect();
            track.style.transition = "";
        }

        isAnimating = false;
        updateIndicators();
    });

    // Attach click events to navigation buttons
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", previousSlide);

    // Support left and right keyboard arrows
    document.addEventListener("keydown", function (event) {

        // Avoid interfering with buttons and other interactive elements
        if (
            event.target.closest("button, input, textarea, select") ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
        ) {
            return;
        }

        if (event.key === "ArrowRight") {
            nextSlide();
        } else if (event.key === "ArrowLeft") {
            previousSlide();
        }
    });

    // Initialize the slider at the first original slide
    moveTrack();
    updateIndicators();

});
 