"use strict";

// Form house
const houseFormContainer = document.querySelector("#form-section--house");
const formMenus = document.querySelectorAll(".form--selection");
const countriesContainer = document.querySelector(".form__location--selection");
const searchInput = document.querySelector(`[name="form__search--input"]`);
let typingTimer;

houseFormContainer.addEventListener("click", (e) => {
  if (e.target.closest(".form__btn")) {
    const btn = e.target.closest(".form__btn");
    const btnName = [...btn.classList]
      .find((el) => el.includes("form__btn--"))
      .split("--")
      .at(-1);

    if (btnName === "location") {
      const name = btn.querySelector("input").value || "ro";

      // searchInput.style.width = [...searchInput.value].length * 1.125 + "rem";

      console.dir(searchInput);
      createDatalistCountries(name);
    }

    if (
      [...formMenus].find((el) => !el.classList.contains("d-none"))
        ?.previousElementSibling === btn
    ) {
      e.target.closest(".form__btn").nextElementSibling.classList.add("d-none");
    } else {
      formMenus.forEach((el) => el.classList.add("d-none"));
      toggleMenu(btnName);
    }
  }

  if (e.target.closest(".form-check")) {
    const btnText =
      e.target.closest(".radioGroup").querySelector("span") ||
      e.target.closest(".radioGroup").querySelector("input");

    e.target.closest(".form-check").querySelector("input").checked = true;

    const newText = e.target.closest("div").querySelector("label > h4");

    if (btnText.value) {
      btnText.value = newText.innerText;
      calcInputWidth();
    } else {
      btnText.innerText = newText.innerText;
    }
  }
});

// toggle menu
function toggleMenu(btn) {
  document.querySelector(`.form__${btn}--selection`).classList.toggle("d-none");
}

// detect clicks on window
window.addEventListener("click", (e) => {
  if (!e.target.closest(".form__btn")) {
    formMenus.forEach((el) => el.classList.add("d-none"));
  }
});

// width search input
function calcInputWidth() {
  const newWidth = [...searchInput.value].length;

  if (newWidth < 4) {
    searchInput.style.width = "";
  } else {
    searchInput.style.width = newWidth + "rem";
  }
}

// istant search
searchInput.addEventListener("keyup", (e) => {
  clearInterval(typingTimer);

  console.dir(searchInput);
  typingTimer = setTimeout((e) => {
    createDatalistCountries(searchInput.value);
  });

  calcInputWidth();
});

// create and insert data in datalist form
async function createDatalistCountries(name) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);

    if (!res.ok || res.status === 404) return;

    const data = await res.json();

    countriesContainer.innerHTML = "";

    data.slice(0, 5).forEach((el, i) => {
      const html = `
    <div class="form-check mb-0 px-4 pt-2 d-flex align-items-center text-dark bg-light">
      <label class="form-check-label" for="radio__location--${i + 1}">
        <h4>${el.name.common}</h4>
      </label>
      <input
        class="form-check-input ms-0 border-0"
        type="radio"
        name="form__location--radio"
        id="radio__location--${i + 1}"
        value="${el.name.common}"/>
    </div>`;
      countriesContainer.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.log("rip");
  }
}

// card-slider
const cardSliderPrev = document.querySelector(
  "#card-slider .carousel-control-prev"
);
const cardSliderNext = document.querySelector(
  "#card-slider .carousel-control-next"
);
const cardSliderRow = document.querySelector("#card-slider .row");

cardSliderPrev.addEventListener("click", () => {
  cardSliderRow.scrollBy({ left: -200, behavior: "smooth" });
});

cardSliderNext.addEventListener("click", () => {
  cardSliderRow.scrollBy({ left: 200, behavior: "smooth" });
});

cardSliderRow.addEventListener("scroll", setFog);

function setFog() {
  cardSliderRow.style.setProperty("--fog-start", "15%");
  cardSliderRow.style.setProperty("--fog-end", "15%");
  cardSliderPrev.classList.remove("d-none");
  cardSliderNext.classList.remove("d-none");

  if (cardSliderRow.scrollLeft <= 50) {
    cardSliderRow.style.setProperty("--fog-start", "0");
    cardSliderPrev.classList.add("d-none");
  }

  if (
    cardSliderRow.clientWidth + cardSliderRow.scrollLeft >=
    cardSliderRow.scrollWidth - 20
  ) {
    cardSliderRow.style.setProperty("--fog-end", "0");
    cardSliderNext.classList.add("d-none");
  }
}
