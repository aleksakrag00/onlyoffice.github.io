// Custom Calendar Class
class CustomCalendar {
  constructor(input, options = {}) {
    this.input = input;
    this.calendar = document.getElementById("customCalendar");
    this.calendarDays = document.getElementById("calendarDays");
    this.calendarTitle = document.getElementById("monthYearTitle");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.calendarIcon = document.getElementById("calendarIcon");
    this.monthView = document.getElementById("monthView");
    this.yearView = document.getElementById("yearView");
    this.weekdays = document.getElementById("calendarWeekdays");

    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.viewYear = this.currentDate.getFullYear();
    this.viewMonth = this.currentDate.getMonth();
    this.isOpen = false;
    this.currentView = "days";

    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.updateInput();
    this.setupIcon();
  }

  async setupIcon() {
    // Test if the background image loads
    await testBackgroundImage(this.calendarIcon, "resources/img/icon.png");
  }

  bindEvents() {
    this.input.addEventListener("click", () => this.toggle());
    this.calendarIcon.addEventListener("click", () => this.toggle());

    this.prevBtn.addEventListener("click", () => this.handleNavPrev());
    this.nextBtn.addEventListener("click", () => this.handleNavNext());

    this.calendarTitle.addEventListener("click", () => this.handleTitleClick());

    document.querySelectorAll(".calendar-month").forEach((monthEl) => {
      monthEl.addEventListener("click", () => {
        this.viewMonth = parseInt(monthEl.dataset.month);
        this.showDayView();
      });
    });

    document.addEventListener("click", (e) => {
      if (!this.input.parentNode.contains(e.target)) {
        this.hide();
      }
    });

    this.calendar.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  handleNavPrev() {
    if (this.currentView === "days") {
      this.previousMonth();
    } else if (this.currentView === "months") {
      this.viewYear--;
      this.updateTitle();
    } else if (this.currentView === "years") {
      this.viewYear -= 12;
      this.showYearView();
    }
  }

  handleNavNext() {
    if (this.currentView === "days") {
      this.nextMonth();
    } else if (this.currentView === "months") {
      this.viewYear++;
      this.updateTitle();
    } else if (this.currentView === "years") {
      this.viewYear += 12;
      this.showYearView();
    }
  }

  handleTitleClick() {
    if (this.currentView === "days") {
      this.showMonthView();
    } else if (this.currentView === "months") {
      this.showYearView();
    } else {
      this.showDayView();
    }
  }

  toggle() {
    this.isOpen ? this.hide() : this.show();
  }

  show() {
    this.calendar.classList.add("show");
    this.calendarIcon.classList.add("active");
    this.isOpen = true;
  }

  hide() {
    this.calendar.classList.remove("show");
    this.calendarIcon.classList.remove("active");
    this.isOpen = false;
    this.showDayView();
  }

  showMonthView() {
    this.currentView = "months";
    this.monthView.style.display = "grid";
    this.yearView.style.display = "none";
    this.calendarDays.style.display = "none";
    this.weekdays.style.display = "none";

    // Highlight current month
    document.querySelectorAll(".calendar-month").forEach((el) => {
      el.classList.remove("active");
      if (parseInt(el.dataset.month) === this.viewMonth) {
        el.classList.add("active");
      }
    });

    this.updateTitle();
  }

  showYearView() {
    this.currentView = "years";
    this.monthView.style.display = "none";
    this.yearView.style.display = "grid";
    this.calendarDays.style.display = "none";
    this.weekdays.style.display = "none";

    this.generateYears();
    this.updateTitle();
  }

  showDayView() {
    this.currentView = "days";
    this.monthView.style.display = "none";
    this.yearView.style.display = "none";
    this.calendarDays.style.display = "grid";
    this.weekdays.style.display = "grid";

    this.render();
  }

  generateYears() {
    this.yearView.innerHTML = "";
    const currentYear = this.viewYear;
    const startYear = currentYear - 6;

    for (let year = startYear; year < startYear + 12; year++) {
      const yearEl = document.createElement("div");
      yearEl.className = "calendar-year";
      yearEl.textContent = year;
      yearEl.dataset.year = year;
      if (year === currentYear) yearEl.classList.add("active");

      yearEl.addEventListener("click", () => {
        this.viewYear = year;
        this.showMonthView();
      });
      this.yearView.appendChild(yearEl);
    }
  }

  previousMonth() {
    this.viewMonth--;
    if (this.viewMonth < 0) {
      this.viewMonth = 11;
      this.viewYear--;
    }
    this.render();
  }

  nextMonth() {
    this.viewMonth++;
    if (this.viewMonth > 11) {
      this.viewMonth = 0;
      this.viewYear++;
    }
    this.render();
  }

  render() {
    this.updateTitle();
    this.calendarDays.innerHTML = "";

    const firstDay = new Date(this.viewYear, this.viewMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEl = document.createElement("div");
      dayEl.classList.add("calendar-day");
      dayEl.textContent = date.getDate();

      if (date.getMonth() !== this.viewMonth) {
        dayEl.classList.add("other-month");
      }

      if (this.isSameDay(date, this.currentDate)) {
        dayEl.classList.add("today");
      }

      if (this.isSameDay(date, this.selectedDate)) {
        dayEl.classList.add("selected");
      }

      dayEl.addEventListener("click", () => {
        this.selectDate(date);
      });

      this.calendarDays.appendChild(dayEl);
    }
  }

  updateTitle() {
    if (this.currentView === "days") {
      this.calendarTitle.textContent = `${this.months[this.viewMonth]} ${
        this.viewYear
      }`;
    } else if (this.currentView === "months") {
      this.calendarTitle.textContent = this.viewYear;
    } else {
      const startYear = this.viewYear - 6;
      this.calendarTitle.textContent = `${startYear}-${startYear + 11}`;
    }
  }

  selectDate(date) {
    this.selectedDate = new Date(date);
    this.updateInput();
    this.render();
    this.hide();
    this.input.dispatchEvent(new Event("datechange"));
  }

  updateInput() {
    const formatSelect = document.getElementById("dateFormat");
    this.input.value = this.formatDate(this.selectedDate, formatSelect.value);
  }

  getDate() {
    return this.selectedDate;
  }

  setDate(date) {
    this.selectedDate = new Date(date);
    this.viewYear = date.getFullYear();
    this.viewMonth = date.getMonth();
    this.updateInput();
    this.render();
  }

  isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  formatDate(date, format) {
    const day = date.getDate();
    const dayPadded = String(day).padStart(2, "0");
    const month = date.getMonth() + 1;
    const monthPadded = String(month).padStart(2, "0");
    const year = date.getFullYear();
    const yearShort = String(year).slice(-2);

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekday = weekdays[date.getDay()];

    const monthFull = this.months[month - 1];
    const monthShort = monthFull.slice(0, 3);

    switch (format) {
      case "M/D/YYYY":
        return `${month}/${day}/${year}`;
      case "dddd, MMMM D, YYYY":
        return `${weekday}, ${monthFull} ${day}, ${year}`;
      case "MMMM D, YYYY":
        return `${monthFull} ${day}, ${year}`;
      case "M/D/YY":
        return `${month}/${day}/${yearShort}`;
      case "YYYY-MM-DD":
        return `${year}-${monthPadded}-${dayPadded}`;
      case "D-MMM-YY":
        return `${day}-${monthShort}-${yearShort}`;
      case "M.D.YYYY":
        return `${month}.${day}.${year}`;
      default:
        return `${month}/${day}/${year}`;
    }
  }
}

// Background image detection utility
function testBackgroundImage(element, url) {
  return new Promise((resolve) => {
    const testImg = new Image();
    testImg.onload = () => {
      element.classList.add("has-bg-image");
      resolve(true);
    };
    testImg.onerror = () => {
      element.classList.remove("has-bg-image");
      resolve(false);
    };
    testImg.src = url;
  });
}

// Initialize plugin
window.Asc = window.Asc || {};
window.Asc.plugin = window.Asc.plugin || {};
window.Asc.scope = window.Asc.scope || {};

window.Asc.plugin.init = function () {
  if (this.executeMethod) window.pluginAPI = this;
  detectTheme();
  showLoadingScreen("Initializing plugin...");
  setTimeout(() => {
    initializeDatePicker();
    hideLoadingScreen();
  }, 500);
};

function detectTheme() {
  const body = document.body;
  const themeClasses = [
    "theme-type-light",
    "theme-type-classic-light",
    "theme-type-dark",
    "theme-type-contrast-dark",
  ];

  for (let themeClass of themeClasses) {
    if (body.classList.contains(themeClass)) {
      return themeClass;
    }
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    body.classList.add("theme-type-dark");
    return "theme-type-dark";
  }

  body.classList.add("theme-type-light");
  return "theme-type-light";
}

function showLoadingScreen(message = "Loading...") {
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");
  if (loadingOverlay && loadingText) {
    loadingText.textContent = message;
    loadingOverlay.style.display = "flex";
    document.getElementById("mainContent").classList.add("loading");
  }
}

function hideLoadingScreen() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "none";
    document.getElementById("mainContent").classList.remove("loading");
  }
}

function initializeDatePicker() {
  const input = document.getElementById("dateInput");
  const formatSelect = document.getElementById("dateFormat");
  const insertBtn = document.getElementById("insertDate");

  if (!input || !formatSelect || !insertBtn) return;

  input.setAttribute("data-initialized", "true");
  const calendar = new CustomCalendar(input);

  function updateFormatOptions(selectedDate) {
    const formats = [
      "M/D/YYYY",
      "dddd, MMMM D, YYYY",
      "MMMM D, YYYY",
      "M/D/YY",
      "YYYY-MM-DD",
      "D-MMM-YY",
      "M.D.YYYY",
    ];
    const currentValue = formatSelect.value;
    formatSelect.innerHTML = "";
    formats.forEach((format) => {
      const option = document.createElement("option");
      option.value = format;
      option.textContent = calendar.formatDate(selectedDate, format);
      formatSelect.appendChild(option);
    });
    formatSelect.value = currentValue;
  }

  updateFormatOptions(new Date());
  formatSelect.addEventListener("change", () => calendar.updateInput());
  input.addEventListener("datechange", () =>
    updateFormatOptions(calendar.getDate())
  );

  insertBtn.addEventListener("click", () => {
    const selectedDate = calendar.getDate();
    if (!selectedDate) return;

    showLoadingScreen("Inserting date...");
    const formattedDate = calendar.formatDate(selectedDate, formatSelect.value);

    if (window.plugin) {
      try {
        window.plugin.callCommand(function () {
          const oWorksheet = Api.GetActiveSheet();
          const target =
            oWorksheet.GetSelection() || oWorksheet.GetActiveCell();
          if (target) {
            try {
              target.SetNumberFormat("@");
              target.SetValue(formattedDate);
            } catch (e) {
              target.SetValue("'" + formattedDate);
            }
          }
        });
      } catch (e) {
        console.log("callCommand failed:", e);
      }
    }

    setTimeout(() => {
      calendar.setDate(new Date());
      formatSelect.selectedIndex = 0;
      hideLoadingScreen();
    }, 300);
  });
}

// Fallback initialization
document.addEventListener("DOMContentLoaded", function () {
  showLoadingScreen("Loading date picker...");
  setTimeout(() => {
    if (
      !document.querySelector("#dateInput").hasAttribute("data-initialized")
    ) {
      initializeDatePicker();
    }
    hideLoadingScreen();
  }, 800);
});
