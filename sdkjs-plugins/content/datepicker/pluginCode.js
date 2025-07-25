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

    // Default month names - will be updated by translation
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

    // Default short month names
    this.monthsShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Default weekday names
    this.weekdays_full = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    this.init();
  }

  // Update localized data
  updateLocalization() {
    if (window.Asc && window.Asc.plugin && window.Asc.plugin.tr) {
      // Update months array with translations using English keys
      this.months = [
        window.Asc.plugin.tr("January"),
        window.Asc.plugin.tr("February"),
        window.Asc.plugin.tr("March"),
        window.Asc.plugin.tr("April"),
        window.Asc.plugin.tr("May"),
        window.Asc.plugin.tr("June"),
        window.Asc.plugin.tr("July"),
        window.Asc.plugin.tr("August"),
        window.Asc.plugin.tr("September"),
        window.Asc.plugin.tr("October"),
        window.Asc.plugin.tr("November"),
        window.Asc.plugin.tr("December"),
      ];

      this.monthsShort = [
        window.Asc.plugin.tr("Jan"),
        window.Asc.plugin.tr("Feb"),
        window.Asc.plugin.tr("Mar"),
        window.Asc.plugin.tr("Apr"),
        window.Asc.plugin.tr("May"),
        window.Asc.plugin.tr("Jun"),
        window.Asc.plugin.tr("Jul"),
        window.Asc.plugin.tr("Aug"),
        window.Asc.plugin.tr("Sep"),
        window.Asc.plugin.tr("Oct"),
        window.Asc.plugin.tr("Nov"),
        window.Asc.plugin.tr("Dec"),
      ];

      this.weekdays_full = [
        window.Asc.plugin.tr("Sunday"),
        window.Asc.plugin.tr("Monday"),
        window.Asc.plugin.tr("Tuesday"),
        window.Asc.plugin.tr("Wednesday"),
        window.Asc.plugin.tr("Thursday"),
        window.Asc.plugin.tr("Friday"),
        window.Asc.plugin.tr("Saturday"),
      ];

      // Update month view with translated names
      const monthElements = document.querySelectorAll(".calendar-month");
      monthElements.forEach((el, index) => {
        el.textContent = this.monthsShort[index];
      });
    }
  }

  init() {
    this.render();
    this.bindEvents();
    this.updateInput();
    this.setupIcon();
    this.applyThemeToIcon();
  }

  applyThemeToIcon() {
    const body = document.body;
    const mainContent = document.getElementById("mainContent");
    const form = document.getElementById("mainForm");

    let backgroundColor = window.getComputedStyle(body).backgroundColor;

    if (
      !backgroundColor ||
      backgroundColor === "rgba(0, 0, 0, 0)" ||
      backgroundColor === "transparent"
    ) {
      if (mainContent) {
        backgroundColor = window.getComputedStyle(mainContent).backgroundColor;
      }
      if (
        (!backgroundColor ||
          backgroundColor === "rgba(0, 0, 0, 0)" ||
          backgroundColor === "transparent") &&
        form
      ) {
        backgroundColor = window.getComputedStyle(form).backgroundColor;
      }
    }

    let isDark = false;

    if (backgroundColor && backgroundColor.includes("rgb")) {
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        isDark = luminance < 0.5;
      }
    }

    if (isDark) {
      this.calendarIcon.classList.add("dark-theme");
      this.calendarIcon.classList.remove("light-theme");
    } else {
      this.calendarIcon.classList.add("light-theme");
      this.calendarIcon.classList.remove("dark-theme");
    }
  }

  async setupIcon() {
    await testBackgroundImage(
      this.calendarIcon,
      "resources/img/icon-light.png"
    );
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
    this.applyThemeToCalendar();
  }

  applyThemeToCalendar() {
    const body = document.body;
    const mainContent = document.getElementById("mainContent");
    const form = document.getElementById("mainForm");

    let backgroundColor = window.getComputedStyle(body).backgroundColor;

    if (
      !backgroundColor ||
      backgroundColor === "rgba(0, 0, 0, 0)" ||
      backgroundColor === "transparent"
    ) {
      if (mainContent) {
        backgroundColor = window.getComputedStyle(mainContent).backgroundColor;
      }
      if (
        (!backgroundColor ||
          backgroundColor === "rgba(0, 0, 0, 0)" ||
          backgroundColor === "transparent") &&
        form
      ) {
        backgroundColor = window.getComputedStyle(form).backgroundColor;
      }
    }

    let isDark = false;
    let r = 255,
      g = 255,
      b = 255;

    if (backgroundColor && backgroundColor.includes("rgb")) {
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        r = parseInt(rgb[0]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2]);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        isDark = luminance < 0.5;
      }
    }

    let calendarBgColor, calendarTextColor;

    if (isDark) {
      const darkerR = Math.max(0, r - 15);
      const darkerG = Math.max(0, g - 15);
      const darkerB = Math.max(0, b - 15);
      calendarBgColor = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
      calendarTextColor = "#ffffff";
    } else {
      const lighterR = Math.min(255, r + 15);
      const lighterG = Math.min(255, g + 15);
      const lighterB = Math.min(255, b + 15);
      calendarBgColor = `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
      calendarTextColor = "#000000";
    }

    this.calendar.style.setProperty(
      "background-color",
      calendarBgColor,
      "important"
    );
    this.calendar.style.setProperty("color", calendarTextColor, "important");

    if (isDark) {
      this.calendarIcon.classList.add("dark-theme");
      this.calendarIcon.classList.remove("light-theme");
    } else {
      this.calendarIcon.classList.add("light-theme");
      this.calendarIcon.classList.remove("dark-theme");
    }

    const allElements = this.calendar.querySelectorAll("*");
    allElements.forEach((element) => {
      if (
        !element.matches(".calendar-day:nth-child(7n+1)") &&
        !element.matches(".calendar-day:nth-child(7n)")
      ) {
        element.style.setProperty("color", calendarTextColor, "important");
      }
    });

    const selectedElements = this.calendar.querySelectorAll(
      ".calendar-day.selected, .calendar-month.active, .calendar-year.active"
    );
    selectedElements.forEach((element) => {
      if (isDark) {
        element.style.setProperty("background-color", "#9ca3af", "important");
        element.style.setProperty("color", "#ffffff", "important");
      } else {
        element.style.setProperty("background-color", "#d1d5db", "important");
        element.style.setProperty("color", "#000000", "important");
      }
    });
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

    setTimeout(() => {
      this.applyGreyToSelected();
    }, 10);
  }

  applyGreyToSelected() {
    const calendarBg = window.getComputedStyle(this.calendar).backgroundColor;
    const isDark = this.isBackgroundDark(calendarBg);

    const selectedElements = this.calendar.querySelectorAll(
      ".calendar-day.selected, .calendar-month.active, .calendar-year.active"
    );
    selectedElements.forEach((element) => {
      if (isDark) {
        element.style.setProperty("background-color", "#9ca3af", "important");
        element.style.setProperty("color", "#ffffff", "important");
      } else {
        element.style.setProperty("background-color", "#d1d5db", "important");
        element.style.setProperty("color", "#000000", "important");
      }
    });
  }

  isBackgroundDark(backgroundColor) {
    if (backgroundColor && backgroundColor.includes("rgb")) {
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
    }
    return false;
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

    const weekday = this.weekdays_full[date.getDay()];
    const monthFull = this.months[month - 1];
    const monthShort = this.monthsShort[month - 1];

    switch (format) {
      case "MM/DD/YYYY":
        return `${monthPadded}/${dayPadded}/${year}`;
      case "dddd, MMMM D, YYYY":
        return `${weekday}, ${monthFull} ${day}, ${year}`;
      case "MMMM D, YYYY":
        return `${monthFull} ${day}, ${year}`;
      case "M/D/YY":
        return `${month}/${day}/${yearShort}`;
      case "YYYY-MM-DD":
        return `${year}-${monthPadded}-${dayPadded}`;
      case "D-MMM-YY":
        return `${dayPadded}-${monthShort}-${yearShort}`;
      case "M.D.YYYY":
        return `${month}.${day}.${year}`;
      default:
        return `${monthPadded}/${dayPadded}/${year}`;
    }
  }
}

// Global calendar variable
let globalCalendar = null;

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

// Simple plugin initialization
window.Asc.plugin.init = function () {
  if (this.executeMethod) window.pluginAPI = this;
  initializeDatePicker();
};

// Translation function using English text as keys
window.Asc.plugin.onTranslate = function () {
  // Update instruction text
  const instructionText = document.getElementById("instructionText");
  if (instructionText) {
    instructionText.innerHTML = window.Asc.plugin.tr(
      "Select the <strong>date and format</strong>, then click the <strong>Insert date</strong> button. The date will be displayed in the selected cell."
    );
  }

  // Update labels
  const selectDateLabel = document.getElementById("selectDateLabel");
  if (selectDateLabel) {
    selectDateLabel.innerHTML = window.Asc.plugin.tr("Select date");
  }

  const selectDateFormatLabel = document.getElementById(
    "selectDateFormatLabel"
  );
  if (selectDateFormatLabel) {
    selectDateFormatLabel.innerHTML =
      window.Asc.plugin.tr("Select date format");
  }

  // Update button text
  const insertDateBtn = document.getElementById("insertDate");
  if (insertDateBtn) {
    insertDateBtn.innerHTML = window.Asc.plugin.tr("Insert date");
  }

  // Update loading texts
  const pleaseDoNotClose = document.getElementById("pleaseDoNotClose");
  if (pleaseDoNotClose) {
    pleaseDoNotClose.innerHTML = window.Asc.plugin.tr(
      "Please <strong>do not close</strong> the plugin panel."
    );
  }

  const loadingText = document.getElementById("loadingText");
  if (loadingText) {
    loadingText.innerHTML = window.Asc.plugin.tr("Loading...");
  }

  // Update input placeholder
  const dateInput = document.getElementById("dateInput");
  if (dateInput) {
    dateInput.placeholder = window.Asc.plugin.tr("Select a date");
  }

  // Update weekday abbreviations in calendar
  const weekdayElements = document.querySelectorAll("[data-day]");
  const weekdayKeys = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  weekdayElements.forEach((el, index) => {
    if (weekdayKeys[index]) {
      const translated = window.Asc.plugin.tr(weekdayKeys[index]);
      el.textContent = translated.substring(0, 2);
    }
  });

  // Update calendar instance if it exists
  if (globalCalendar) {
    globalCalendar.updateLocalization();
    globalCalendar.render();
  }
};

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

function insertDateValueAlternative(formattedDate, selectedDate) {
  if (!window.pluginAPI) {
    console.error("Plugin API not available");
    return false;
  }

  try {
    const safeDate = JSON.stringify("'" + formattedDate);

    const functionCode = `
      function() {
        try {
          var oWorksheet = Api.GetActiveSheet();
          if (!oWorksheet) return false;
          
          var dateValue = ${safeDate};
          var oSelection = oWorksheet.GetSelection();
          if (oSelection) {
            oSelection.Clear();
            oSelection.SetValue(dateValue);
            return true;
          }
          
          var oActiveCell = oWorksheet.GetActiveCell();
          if (oActiveCell) {
            oActiveCell.Clear();
            oActiveCell.SetValue(dateValue);
            return true;
          }
          
          return false;
        } catch (e) {
          return false;
        }
      }
    `;

    const embeddedFunction = eval(`(${functionCode})`);
    window.pluginAPI.callCommand(embeddedFunction);
    return true;
  } catch (e) {
    return false;
  }
}

function insertDateValue(formattedDate, selectedDate) {
  if (!window.pluginAPI) {
    console.error("Plugin API not available");
    return false;
  }

  const escapedDate = formattedDate
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

  try {
    const functionCode = `
      function() {
        try {
          var oWorksheet = Api.GetActiveSheet();
          if (!oWorksheet) return false;
          
          var oSelection = oWorksheet.GetSelection();
          if (!oSelection) {
            var oActiveCell = oWorksheet.GetActiveCell();
            if (oActiveCell) {
              oActiveCell.SetValue("'${escapedDate}");
              return true;
            }
            return false;
          }
          
          try {
            oSelection.Clear();
            oSelection.SetValue("'${escapedDate}");
            return true;
          } catch (directError) {
            try {
              var oRange = oSelection;
              if (oRange.GetRowsCount && oRange.GetColsCount) {
                var rowCount = oRange.GetRowsCount();
                var colCount = oRange.GetColsCount();
                
                for (var row = 0; row < rowCount; row++) {
                  for (var col = 0; col < colCount; col++) {
                    var oCell = oRange.GetRows(row).GetCells(col);
                    if (oCell) {
                      oCell.SetValue("'${escapedDate}");
                    }
                  }
                }
                return true;
              } else {
                oSelection.SetValue("'${escapedDate}");
                return true;
              }
            } catch (cellError) {
              var oActiveCell = oWorksheet.GetActiveCell();
              if (oActiveCell) {
                oActiveCell.SetValue("'${escapedDate}");
                return true;
              }
              return false;
            }
          }
        } catch (e) {
          return false;
        }
      }
    `;

    const embeddedFunction = eval(`(${functionCode})`);
    window.pluginAPI.callCommand(embeddedFunction);
    return true;
  } catch (e) {
    return false;
  }
}

function validateAndGetFormat(formatSelect) {
  const format = formatSelect.value;
  const validFormats = [
    "MM/DD/YYYY",
    "dddd, MMMM D, YYYY",
    "MMMM D, YYYY",
    "M/D/YY",
    "YYYY-MM-DD",
    "D-MMM-YY",
    "M.D.YYYY",
  ];

  if (validFormats.includes(format)) {
    return format;
  } else {
    formatSelect.value = "MM/DD/YYYY";
    return "MM/DD/YYYY";
  }
}

function initializeDatePicker() {
  const input = document.getElementById("dateInput");
  const formatSelect = document.getElementById("dateFormat");
  const insertBtn = document.getElementById("insertDate");

  if (!input || !formatSelect || !insertBtn) return;

  input.setAttribute("data-initialized", "true");
  globalCalendar = new CustomCalendar(input);

  function updateFormatOptions(selectedDate) {
    const formats = [
      "MM/DD/YYYY",
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
      option.textContent = globalCalendar.formatDate(selectedDate, format);
      formatSelect.appendChild(option);
    });
    formatSelect.value = currentValue;
  }

  updateFormatOptions(new Date());

  let formatChangeTimeout;
  formatSelect.addEventListener("change", () => {
    clearTimeout(formatChangeTimeout);
    formatChangeTimeout = setTimeout(() => {
      globalCalendar.updateInput();
    }, 100);
  });

  input.addEventListener("datechange", () =>
    updateFormatOptions(globalCalendar.getDate())
  );

  insertBtn.addEventListener("click", () => {
    const selectedDate = globalCalendar.getDate();
    if (!selectedDate) return;

    insertBtn.disabled = true;
    formatSelect.disabled = true;

    const currentFormat = validateAndGetFormat(formatSelect);
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.classList.add("loading");
    }

    const insertingMessage = window.Asc.plugin.tr
      ? window.Asc.plugin.tr("Inserting date...")
      : "Inserting date...";
    showLoadingScreen(insertingMessage);

    const formattedDate = globalCalendar.formatDate(
      selectedDate,
      currentFormat
    );

    setTimeout(() => {
      let success = insertDateValue(formattedDate, selectedDate);

      if (
        !success &&
        (currentFormat.includes("MMMM") ||
          currentFormat.includes("YYYY-MM-DD") ||
          currentFormat.includes("dddd"))
      ) {
        success = insertDateValueAlternative(formattedDate, selectedDate);
      }

      setTimeout(() => {
        if (success) {
          const todaysDate = new Date();
          formatSelect.selectedIndex = 0;
          updateFormatOptions(todaysDate);
          globalCalendar.setDate(todaysDate);
        }

        insertBtn.disabled = false;
        formatSelect.disabled = false;

        hideLoadingScreen();
        if (mainContent) {
          mainContent.classList.remove("loading");
        }
      }, 800);
    }, 10);
  });
}

// Fallback initialization
document.addEventListener("DOMContentLoaded", function () {
  const loadingMessage = window.Asc.plugin.tr
    ? window.Asc.plugin.tr("Loading plugin...")
    : "Loading plugin...";
  showLoadingScreen(loadingMessage);
  setTimeout(() => {
    if (
      !document.querySelector("#dateInput").hasAttribute("data-initialized")
    ) {
      initializeDatePicker();
    }
    hideLoadingScreen();
  }, 800);
});
