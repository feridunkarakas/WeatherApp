import { useState } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // API key'i artık .env dosyasından güvenli bir şekilde alıyorum
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const handleSearch = () => {
    // Şehir ismi yazılmamışsa uyarı veriyor
    if (city === "") {
      alert("Lütfen bir şehir adı girin!")
      return
    }

    setLoading(true)
    setError('')

    // Veriyi çekmek için axios kullanıyorum
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=tr&appid=${API_KEY}`)
      .then(response => {
        // Cevap başarılıysa hava durumu bilgisini kaydediyoruz
        setWeather(response.data)
        setLoading(false)
      })
      .catch(err => {
        // Bir hata olursa burası çalışıyor
        setWeather(null)

        if (err.response) {
          if (err.response.status === 404) {
            setError("Şehir bulunamadı!")
          } else if (err.response.status === 401) {
            setError("API Anahtarı henüz aktif değil veya yanlış. Lütfen bekleyin.")
          } else {
            setError("Hava durumu bilgisi alınamadı.")
          }
        } else {
          setError("İnternet bağlantınızı kontrol edin.")
        }
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">
          Hava Durumu
        </h1>
        
        <div className="flex flex-col gap-3 mb-8">
          <input
            type="text"
            className="border-2 border-indigo-50 p-3 rounded-xl w-full outline-none focus:border-indigo-400 transition-all text-center text-lg"
            placeholder="Şehir adı yazın..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg"
          >
            Hava Durumunu Gör
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-600 text-center text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-indigo-500 font-medium">Yükleniyor...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="text-center">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{weather.name}, {weather.sys.country}</h2>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <img 
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                alt="weather icon"
                className="w-32 h-32 -my-4" 
              />
              <span className="text-6xl font-black text-gray-800">{Math.round(weather.main.temp)}°C</span>
              <p className="capitalize text-lg font-medium text-gray-500 mt-2">{weather.weather[0].description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Nem</p>
                <p className="text-xl font-bold text-gray-800">%{weather.main.humidity}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Rüzgar</p>
                <p className="text-xl font-bold text-gray-800">{weather.wind.speed} km/s</p>
              </div>
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="text-center py-5">
            <p className="text-gray-400 italic">Hangi şehri aramak istersin?</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
