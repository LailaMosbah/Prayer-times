let cities = document.getElementById("cities")

// console.log(cities)
// for(city of cities){
//     console.log(city.value)
// }

cities.addEventListener('change',function(){
    let city= getSelectedCity()
    //console.log()
    console.log('addEvent' ,city)
    changeTiming(city)

    
})




  function getSelectedCity() {
    // Get the <select> element
    const cities = document.getElementById("cities");
    // Get the selected value
    const selectedCity = cities.value;
    // Display the text option
    const selectedIndex = cities.selectedIndex;
    const selectedText = cities.options[selectedIndex].text;
    //console.log('text',selectedText)


    return [selectedCity,selectedText]
  }


  function changeTiming(city){
    //change <h1>
    document.getElementById('city').innerHTML=city[1]
    //console.log("the function city ",city )
    let param ={
        country :'EG',
        city:city[0]
    }

    axios.get('http://api.aladhan.com/v1/timingsByCity', {
        params:param
      })
      .then(function (response) {
        console.log(param)
        let timing = response.data.data.timings
        let date = response.data.data.date.gregorian.date
        document.getElementById('ft').innerHTML=timing['Fajr']
        document.getElementById('sht').innerHTML=timing['Sunrise']
        document.getElementById('nt').innerHTML=timing['Dhuhr']
        document.getElementById('at').innerHTML=timing['Asr']
        document.getElementById('mt').innerHTML=timing['Maghrib']
        document.getElementById('et').innerHTML=timing['Isha']
    
        document.getElementById('date').innerHTML = date
    
    
        //console.log(timing);
        let d = response.data.data.date
        console.log(d)
      })
      .catch(function (error) {
        console.log(error);
      })

  }