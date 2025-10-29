// Prayer Times App
class PrayerTimesApp {
  constructor() {
    this.prayerTimes = null
    this.init()
  }

  async init() {
    try {
      await this.loadPrayerTimes()
      this.displayPrayerTimes()
    } catch (error) {
      this.showError('Failed to load prayer times: ' + error.message)
    }
  }

  async loadPrayerTimes() {
    const response = await fetch('./data/current-version.json')
    if (!response.ok) {
      throw new Error(`Failed to load prayer times: ${response.status}`)
    }
    this.prayerTimes = await response.json()
    console.log('Loaded prayer times:', this.prayerTimes)
  }

  displayPrayerTimes() {
    const container = document.getElementById('prayer-times')

    if (!this.prayerTimes || !this.prayerTimes.prayer_times) {
      container.innerHTML = '<div class="error">No prayer times data available.</div>'
      return
    }

    const { location, month, year, prayer_times } = this.prayerTimes

    // Get today's date
    const today = new Date()
    const todayDate = today.getDate().toString().padStart(2, '0')

    // Find today's prayer times
    const todayTimes = prayer_times.find((day) => day.date === todayDate)

    let html = `
            <div class="header">
                <h1>${location}</h1>
                <h2>${month} ${year}</h2>
                <div class="today-date">Today: ${this.getTodayFormatted()}</div>
            </div>
        `

    if (todayTimes) {
      html += `
                <div class="today-times">
                    <h3>Today's Prayer Times</h3>
                    <div class="prayer-list">
                        <div class="prayer-time">
                            <span class="prayer-name">Fajr</span>
                            <span class="time-value">${todayTimes.fajr}</span>
                        </div>
                        <div class="prayer-time">
                            <span class="prayer-name">Sunrise</span>
                            <span class="time-value">${todayTimes.sunrise}</span>
                        </div>
                        <div class="prayer-time">
                            <span class="prayer-name">Dhuhr</span>
                            <span class="time-value">${todayTimes.dhuhr}</span>
                        </div>
                        <div class="prayer-time">
                            <span class="prayer-name">Asr</span>
                            <span class="time-value">${todayTimes.asr}</span>
                        </div>
                        <div class="prayer-time">
                            <span class="prayer-name">Maghrib</span>
                            <span class="time-value">${todayTimes.maghrib}</span>
                        </div>
                        <div class="prayer-time">
                            <span class="prayer-name">Isha</span>
                            <span class="time-value">${todayTimes.isha}</span>
                        </div>
                    </div>
                </div>
            `
    } else {
      html += '<div class="error">No prayer times found for today.</div>'
    }

    // Add monthly calendar view
    html += this.createMonthlyCalendar(prayer_times, todayDate)

    container.innerHTML = html
  }

  createMonthlyCalendar(prayer_times, todayDate) {
    return `
            <div class="monthly-calendar">
                <h3>Full Month</h3>
                <div class="calendar-grid">
                    ${prayer_times
                      .map(
                        (day) => `
                        <div class="calendar-day ${day.date === todayDate ? 'today' : ''}">
                            <div class="date">${day.date}</div>
                            <div class="day-name">${day.day}</div>
                            <div class="prayer-times">
                                <div class="prayer-time-small">
                                    <span>Fajr:</span><span>${day.fajr}</span>
                                </div>
                                <div class="prayer-time-small">
                                    <span>Duhur:</span><span>${day.dhuhr}</span>
                                </div>
                                <div class="prayer-time-small">
                                    <span>Asr:</span><span>${day.asr}</span>
                                </div>
                                <div class="prayer-time-small">
                                    <span>Maghrib:</span><span>${day.maghrib}</span>
                                </div>
                                <div class="prayer-time-small">
                                    <span>Isha:</span><span>${day.isha}</span>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        `
  }

  getTodayFormatted() {
    const today = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return today.toLocaleDateString('en-US', options)
  }

  showError(message) {
    const container = document.getElementById('prayer-times')
    container.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `
  }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
  new PrayerTimesApp()
})
