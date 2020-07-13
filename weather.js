
const searchBtn = document.getElementById('search')

// checks that response status is greenlit
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response)
  }
  return Promise.reject(new Error(response.statusText))
}

// takes a url and checks for ok status, then returns json data
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
}

// Takes in openweather api data and manipulates the dom to display said data
function weatherData() {
  // todo: put api key in .env file
  const weatherApiKey = '7ef867f3a2a7e40636bfa28fc0d9173c'
  const city = document.getElementById('city').value
  const info = document.getElementById('info')

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`

  // generates section element to store Original api call data
  function createHtml(data) {
    const section = document.createElement('section')
    section.innerHTML = `<h2>City: ${data.name}</h2>
        <p>Lon: ${data.coord.lon}</p>
        <p>Lat: ${data.coord.lat}</p>
        <p>Country: ${data.sys.country}</p>
        <p>Current Temp: ${data.main.temp}</p>
        <br>`
    info.appendChild(section)
  }
  // FIXME: get future days of getDay() properly
  // Creates a  table element,and adds 'one call' openweather api data into the table cells
  function creatTable(data) {
    const table = document.createElement('table')
    const date = new Date()
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Next Week']
    // const day = date.getDay()

    table.innerHTML = `<thead><tr><th>day</th><th>min</th><th>max</th><th>weather</th></tr></thead><tbody>${data.daily.map((el, index) =>
      `<tr><th>${weekday[index]}</th><th>${Math.round(el.temp.min)}</th><th>${Math.round(el.temp.max)}</th><th><img src="http://openweathermap.org/img/wn/${
        el.weather[0].icon
      }@2x.png"></img></th></tr>`)} </tbody>`
    info.appendChild(table)
    // console.log(data.getUTCMilliseconds)
    // console.log(data.getDay())
  }

  fetchData(weatherUrl)
    .then((data) => {
      const { lat, lon } = data.coord
      createHtml(data)

      return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`, {
        'Access-Control-Allow-Origin': '*',
      })
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      creatTable(data)
    })
    .catch((err) => {
      info.innerHTML = '<h2>CITY NOT FOUND</h2>'
      throw err
    })
}

searchBtn.addEventListener('click', weatherData)
// Press Enter key
document.querySelector('input').addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    weatherData()
  }
})
