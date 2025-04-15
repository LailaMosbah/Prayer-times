// Predefined list of countries and their cities (since Aladhan API doesn't provide dynamic country/city endpoints)
const cityLists = {
  EG: [
      { value: "Cairo", text: "القاهرة" },
      { value: "Giza", text: "الجيزة" },
      { value: "Alexandria", text: "الأسكندرية" },
      { value: "Menofia", text: "المنوفية" },
      { value: "Luxor", text: "الأقصر" }
  ],
  SA: [
      { value: "Riyadh", text: "الرياض" },
      { value: "Jeddah", text: "جدة" },
      { value: "Mecca", text: "مكة" },
      { value: "Medina", text: "المدينة" }
  ],
  AE: [
      { value: "Dubai", text: "دبي" },
      { value: "Abu Dhabi", text: "أبو ظبي" },
      { value: "Sharjah", text: "الشارقة" }
  ]
};

// DOM elements
const countrySelect = document.getElementById("countries");
const citySelect = document.getElementById("cities");
const cityDisplay = document.getElementById("city");
const dateDisplay = document.getElementById("date");

// Event listener for country selection
countrySelect.addEventListener('change', function() {
  const selectedCountry = this.value;
  // Reset city dropdown
  citySelect.innerHTML = '<option value="" selected disabled>اختار مدينة</option>';
  cityDisplay.textContent = "اختار المدينة";
  resetPrayerTimes();

  if (selectedCountry && cityLists[selectedCountry]) {
      // Enable and populate city dropdown
      citySelect.disabled = false;
      cityLists[selectedCountry].forEach(city => {
          const option = document.createElement('option');
          option.value = city.value;
          option.textContent = city.text;
          citySelect.appendChild(option);
      });
  } else {
      citySelect.disabled = true;
  }
});

// Event listener for city selection
citySelect.addEventListener('change', function() {
  const [cityValue, cityText] = getSelectedCity();
  const countryValue = countrySelect.value;
  
  if (cityValue && countryValue) {
      changeTiming(countryValue, cityValue, cityText);
  } else {
      alert('يرجى اختيار دولة ومدينة صالحة');
  }
});

// Get selected city value and text
function getSelectedCity() {
  const cities = document.getElementById("cities");
  const selectedCity = cities.value;
  const selectedIndex = cities.selectedIndex;
  const selectedText = cities.options[selectedIndex].text;
  return [selectedCity, selectedText];
}

// Reset prayer times to default
function resetPrayerTimes() {
  document.getElementById('ft').textContent = "00:00";
  document.getElementById('sht').textContent = "00:00";
  document.getElementById('nt').textContent = "00:00";
  document.getElementById('at').textContent = "00:00";
  document.getElementById('mt').textContent = "00:00";
  document.getElementById('et').textContent = "00:00";
  dateDisplay.textContent = "تاريخ اليوم";
}

// Fetch and update prayer times
function changeTiming(country, city, cityText) {
  cityDisplay.textContent = cityText;

  const params = {
      country: country,
      city: city
  };

  // Show loading state
  cityDisplay.textContent = `جاري تحميل مواقيت ${cityText}...`;

  axios.get('https://api.aladhan.com/v1/timingsByCity', {
      params: params
  })
  .then(function (response) {
      const timing = response.data.data.timings;
      const date = response.data.data.date.gregorian.date;

      // Update prayer times
      document.getElementById('ft').textContent = timing['Fajr'];
      document.getElementById('sht').textContent = timing['Sunrise'];
      document.getElementById('nt').textContent = timing['Dhuhr'];
      document.getElementById('at').textContent = timing['Asr'];
      document.getElementById('mt').textContent = timing['Maghrib'];
      document.getElementById('et').textContent = timing['Isha'];
      dateDisplay.textContent = date;

      // Restore city name after loading
      cityDisplay.textContent = cityText;
  })
  .catch(function (error) {
      console.error('Error fetching prayer times:', error);
      alert('حدث خطأ أثناء جلب مواقيت الصلاة. تأكد من اختيار الدولة والمدينة الصحيحة.');
      resetPrayerTimes();
      cityDisplay.textContent = cityText;
  });
}
