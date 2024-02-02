const searchInput = document.querySelector(".search-input input");
const searchInputBtn = document.querySelector(".search-input img");
const searchResultBar = document.querySelector(".search-result");
const surahText = document.querySelector(".surah-text");

const baseUrl = "http://api.alquran.cloud/v1/";

const getSurahNumberByName = async (name) => {
  const response = await fetch(`http://api.alquran.cloud/v1/surah`);
  const data = await response.json();
  const surah = data.data.find(
    (s) => s.englishName.toLowerCase() === name.toLowerCase()
  );
  return surah ? surah.number : null;
};

const showLoadingMessage = () => {
  searchResultBar.querySelector(".surah-number span").textContent = "Loading";
  searchResultBar.querySelector(".in-arabic span").textContent = "";
  searchResultBar.querySelector(".in-english span").textContent = "";
  searchResultBar.querySelector(".translation span").textContent = "";
  searchResultBar.querySelector(".number-of-ayahs span").textContent = "";
  searchResultBar.querySelector(".revelation-type span").textContent = "";
};

const handleSearch = async () => {
  showLoadingMessage();
  const inputVal = searchInput.value.trim();

  if (!inputVal) {
    console.log("Please enter a surah name or number");
    return;
  }

  let surahNumber = parseInt(inputVal);

  if (isNaN(surahNumber)) {
    surahNumber = await getSurahNumberByName(inputVal);
  }

  if (!surahNumber) {
    alert("Surah not found");
    return;
  }

  // Clear previous results
  surahText.innerHTML = "";

  fetch(`${baseUrl}surah/${surahNumber}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not found");
      }
      return response.json();
    })
    .then((data) => {
      const result = data.data;
      searchResultBar.querySelector(".surah-number span").textContent =
        result.number;
      searchResultBar.querySelector(".in-arabic span").textContent =
        result.name;
      searchResultBar.querySelector(".in-english span").textContent =
        result.englishName;
      searchResultBar.querySelector(".translation span").textContent =
        result.englishNameTranslation;
      searchResultBar.querySelector(".number-of-ayahs span").textContent =
        result.numberOfAyahs;
      searchResultBar.querySelector(".revelation-type span").textContent =
        result.revelationType;
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(`${baseUrl}quran`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch Quran data");
      }
      return response.json();
    })
    .then((data) => {
      const result = data.data.surahs[surahNumber - 1].ayahs;
      for (let i = 0; i < result.length; i++) {
        let ayahSpan = document.createElement("span");
        ayahSpan.textContent = result[i].text;
        surahText.style =
          "display:flex;align-items: end; flex-direction: column";
        surahText.appendChild(ayahSpan);
        console.log(result[i].text);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

searchInputBtn.addEventListener("click", () => {
  handleSearch();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
    e.preventDefault();
  }
});
