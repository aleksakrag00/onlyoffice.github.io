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
    // Apply theme to icon immediately on initialization
    this.applyThemeToIcon();
  }

  applyThemeToIcon() {
    // Get the current background color of the plugin
    const body = document.body;
    const mainContent = document.getElementById("mainContent");
    const form = document.getElementById("mainForm");

    let backgroundColor = window.getComputedStyle(body).backgroundColor;

    // If body doesn't have a background, try main content or form
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

    // Parse RGB values to determine if it's light or dark
    let isDark = false;

    if (backgroundColor && backgroundColor.includes("rgb")) {
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        isDark = luminance < 0.5;
      }
    }

    // Apply theme to calendar icon
    if (isDark) {
      this.calendarIcon.classList.add("dark-theme");
      this.calendarIcon.classList.remove("light-theme");
      console.log("Applied dark theme to icon on init");
    } else {
      this.calendarIcon.classList.add("light-theme");
      this.calendarIcon.classList.remove("dark-theme");
      console.log("Applied light theme to icon on init");
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

    // Detect if it's dark or light theme and apply appropriate calendar styling
    this.applyThemeToCalendar();
  }

  applyThemeToCalendar() {
    // Get the current background color of the plugin
    const body = document.body;
    const mainContent = document.getElementById("mainContent");
    const form = document.getElementById("mainForm");

    let backgroundColor = window.getComputedStyle(body).backgroundColor;

    // If body doesn't have a background, try main content or form
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

    console.log("Plugin background color:", backgroundColor);

    // Parse RGB values to determine if it's light or dark
    let isDark = false;
    let r = 255,
      g = 255,
      b = 255; // Default to white

    if (backgroundColor && backgroundColor.includes("rgb")) {
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        r = parseInt(rgb[0]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2]);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        isDark = luminance < 0.5;

        console.log("Plugin RGB values:", r, g, b);
        console.log("Luminance:", luminance);
        console.log("Is dark theme:", isDark);
      }
    }

    let calendarBgColor, calendarTextColor;

    if (isDark) {
      // Dark theme - make calendar background darker than plugin background
      const darkerR = Math.max(0, r - 15);
      const darkerG = Math.max(0, g - 15);
      const darkerB = Math.max(0, b - 15);
      calendarBgColor = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
      calendarTextColor = "#ffffff";
      console.log("Applied darker background:", calendarBgColor);
    } else {
      // Light theme - make calendar background lighter than plugin background
      const lighterR = Math.min(255, r + 15);
      const lighterG = Math.min(255, g + 15);
      const lighterB = Math.min(255, b + 15);
      calendarBgColor = `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
      calendarTextColor = "#000000";
      console.log("Applied lighter background:", calendarBgColor);
    }

    // Apply the calculated colors with !important
    this.calendar.style.setProperty(
      "background-color",
      calendarBgColor,
      "important"
    );
    this.calendar.style.setProperty("color", calendarTextColor, "important");

    // Apply theme to calendar icon (add theme class for PNG background image)
    if (isDark) {
      this.calendarIcon.classList.add("dark-theme");
      this.calendarIcon.classList.remove("light-theme");
      console.log("Added dark-theme class to icon");
      console.log("Icon classes:", this.calendarIcon.className);
    } else {
      this.calendarIcon.classList.add("light-theme");
      this.calendarIcon.classList.remove("dark-theme");
      console.log("Added light-theme class to icon");
      console.log("Icon classes:", this.calendarIcon.className);
    }

    // Apply text color to all child elements (except red weekend days)
    const allElements = this.calendar.querySelectorAll("*");
    allElements.forEach((element) => {
      // Skip weekend days (they should stay red)
      if (
        !element.matches(".calendar-day:nth-child(7n+1)") &&
        !element.matches(".calendar-day:nth-child(7n)")
      ) {
        element.style.setProperty("color", calendarTextColor, "important");
      }
    });

    // Force grey backgrounds for selected elements
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

    console.log("Applied theme to calendar and children");
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

    // Apply grey styling to the newly selected date
    setTimeout(() => {
      this.applyGreyToSelected();
    }, 10);
  }

  applyGreyToSelected() {
    // Determine if dark theme based on current calendar background
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
        return `${dayPadded}-${monthShort}-${yearShort}`;
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
  showLoadingScreen("Initializing plugin...");
  setTimeout(() => {
    detectAndApplyTheme();
    initializeDatePicker();
    hideLoadingScreen();
  }, 500);
};

function detectAndApplyTheme() {
  // Get the current background color of the body or main content
  const body = document.body;
  const mainContent = document.getElementById("mainContent");
  const form = document.getElementById("mainForm");

  let backgroundColor = window.getComputedStyle(body).backgroundColor;

  // If body doesn't have a background, try main content or form
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

  console.log("Detected background color:", backgroundColor);

  // Parse RGB values to determine if it's light or dark
  let isDark = false;

  if (backgroundColor && backgroundColor.includes("rgb")) {
    const rgb = backgroundColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);

      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      isDark = luminance < 0.5;

      console.log("RGB values:", r, g, b);
      console.log("Luminance:", luminance);
      console.log("Is dark theme:", isDark);
    }
  }

  // Apply brown background for testing
  const calendar = document.getElementById("customCalendar");
  if (calendar) {
    calendar.style.backgroundColor = "#8B4513";
    calendar.style.color = "#ffffff";
    console.log("Applied brown background to calendar");
  }
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

// Alternative insertion method for problematic formats
function insertDateValueAlternative(formattedDate, selectedDate) {
  if (!window.pluginAPI) {
    console.error("Plugin API not available");
    return false;
  }

  console.log("Using alternative insertion for:", formattedDate);

  try {
    // Use JSON.stringify to properly escape the string
    const safeDate = JSON.stringify("'" + formattedDate); // Prefix with apostrophe for text format

    const functionCode = `
      function() {
        try {
          var oWorksheet = Api.GetActiveSheet();
          if (!oWorksheet) return false;
          
          var dateValue = ${safeDate};
          console.log("Inserting safe date as text:", dateValue);
          
          // Get selection and force override
          var oSelection = oWorksheet.GetSelection();
          if (oSelection) {
            // Clear first, then set as text
            oSelection.Clear();
            oSelection.SetValue(dateValue);
            return true;
          }
          
          // Fallback to active cell
          var oActiveCell = oWorksheet.GetActiveCell();
          if (oActiveCell) {
            oActiveCell.Clear();
            oActiveCell.SetValue(dateValue);
            return true;
          }
          
          return false;
        } catch (e) {
          console.log("Alternative insert error:", e);
          return false;
        }
      }
    `;

    const embeddedFunction = eval(`(${functionCode})`);
    window.pluginAPI.callCommand(embeddedFunction);
    return true;
  } catch (e) {
    console.log("Alternative insert wrapper error:", e);
    return false;
  }
}

// Enhanced date insertion function with text formatting to prevent auto-conversion
function insertDateValue(formattedDate, selectedDate) {
  if (!window.pluginAPI) {
    console.error("Plugin API not available");
    return false;
  }

  console.log("Attempting to insert date:", formattedDate);

  // Escape the formatted date to prevent issues with special characters
  const escapedDate = formattedDate
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

  try {
    // Enhanced function that forces text insertion to prevent auto-formatting
    const functionCode = `
      function() {
        try {
          var oWorksheet = Api.GetActiveSheet();
          if (!oWorksheet) {
            console.log("No active worksheet");
            return false;
          }
          
          // Get the current selection
          var oSelection = oWorksheet.GetSelection();
          if (!oSelection) {
            console.log("No selection found, trying active cell");
            var oActiveCell = oWorksheet.GetActiveCell();
            if (oActiveCell) {
              // Force as text by prefixing with apostrophe
              oActiveCell.SetValue("'${escapedDate}");
              return true;
            }
            return false;
          }
          
          // Force clear and set the value as TEXT
          try {
            // Method 1: Direct SetValue with text prefix
            oSelection.Clear();
            // Prefix with apostrophe to force text format and prevent auto-conversion
            oSelection.SetValue("'${escapedDate}");
            console.log("Successfully set value as text using direct method");
            return true;
          } catch (directError) {
            console.log("Direct method failed, trying cell-by-cell approach");
            
            // Method 2: Cell-by-cell for ranges
            try {
              var oRange = oSelection;
              if (oRange.GetRowsCount && oRange.GetColsCount) {
                var rowCount = oRange.GetRowsCount();
                var colCount = oRange.GetColsCount();
                console.log("Range size:", rowCount, "x", colCount);
                
                for (var row = 0; row < rowCount; row++) {
                  for (var col = 0; col < colCount; col++) {
                    var oCell = oRange.GetRows(row).GetCells(col);
                    if (oCell) {
                      // Force as text
                      oCell.SetValue("'${escapedDate}");
                    }
                  }
                }
                return true;
              } else {
                // Single cell - force as text
                oSelection.SetValue("'${escapedDate}");
                return true;
              }
            } catch (cellError) {
              console.log("Cell-by-cell method failed:", cellError);
              
              // Method 3: Fallback using active cell
              var oActiveCell = oWorksheet.GetActiveCell();
              if (oActiveCell) {
                oActiveCell.SetValue("'${escapedDate}");
                return true;
              }
              return false;
            }
          }
        } catch (e) {
          console.log("Insert error:", e.message || e);
          return false;
        }
      }
    `;

    // Convert string to function and execute
    const embeddedFunction = eval(`(${functionCode})`);
    window.pluginAPI.callCommand(embeddedFunction);
    console.log("Date insertion command sent");
    return true;
  } catch (e) {
    console.log("Insert wrapper error:", e);
    return false;
  }
}

// Format validation utility
function validateAndGetFormat(formatSelect) {
  const format = formatSelect.value;
  const validFormats = [
    "M/D/YYYY",
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
    console.warn("Invalid format detected, falling back to default");
    formatSelect.value = "M/D/YYYY";
    return "M/D/YYYY";
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

  // Add debouncing to the format change listener to prevent rapid changes
  let formatChangeTimeout;
  formatSelect.addEventListener("change", () => {
    clearTimeout(formatChangeTimeout);
    formatChangeTimeout = setTimeout(() => {
      calendar.updateInput();
    }, 100);
  });

  input.addEventListener("datechange", () =>
    updateFormatOptions(calendar.getDate())
  );

  // FIXED INSERT BUTTON EVENT LISTENER
  insertBtn.addEventListener("click", () => {
    const selectedDate = calendar.getDate();
    if (!selectedDate) {
      console.log("No date selected");
      return;
    }

    // Disable controls to prevent changes during insertion
    insertBtn.disabled = true;
    formatSelect.disabled = true;

    // CAPTURE the format value IMMEDIATELY before any async operations
    const currentFormat = validateAndGetFormat(formatSelect);
    console.log("Using format:", currentFormat);
    console.log("Selected date:", selectedDate);

    // Apply loading state IMMEDIATELY before any async operations
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.classList.add("loading");
    }
    showLoadingScreen("Inserting date...");

    // Use the captured format value and log it
    const formattedDate = calendar.formatDate(selectedDate, currentFormat);
    console.log("Formatted date result:", formattedDate);

    // Use setTimeout to ensure UI updates immediately
    setTimeout(() => {
      // Try primary insertion method first
      let success = insertDateValue(formattedDate, selectedDate);

      // If primary method fails, try alternative method for problematic formats
      if (
        !success &&
        (currentFormat.includes("MMMM") ||
          currentFormat.includes("YYYY-MM-DD") ||
          currentFormat.includes("dddd"))
      ) {
        console.log("Primary insertion failed, trying alternative method");
        success = insertDateValueAlternative(formattedDate, selectedDate);
      }

      setTimeout(() => {
        if (success) {
          console.log("Date inserted successfully:", formattedDate);
          // Reset both the calendar and format dropdown
          const todaysDate = new Date();

          // Reset format dropdown to first option FIRST
          formatSelect.selectedIndex = 0;

          // Update format options to show today's date in all formats
          updateFormatOptions(todaysDate);

          // Set calendar date AFTER format is reset (this will trigger updateInput)
          calendar.setDate(todaysDate);
        } else {
          console.error("Failed to insert date:", formattedDate);
        }

        // Re-enable controls
        insertBtn.disabled = false;
        formatSelect.disabled = false;

        hideLoadingScreen();
        if (mainContent) {
          mainContent.classList.remove("loading");
        }
      }, 800); // Increased timeout to ensure insertion completes fully
    }, 10); // Very short delay to ensure UI updates
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
