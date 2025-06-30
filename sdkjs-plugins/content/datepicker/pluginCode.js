// Initialize plugin object structure
window.Asc = window.Asc || {};
window.Asc.plugin = window.Asc.plugin || {};

// Loading screen functions
function showLoadingScreen(message = "Loading...") {
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingText = document.querySelector(".loading-text");
  const mainForm = document.getElementById("mainForm");

  if (loadingScreen && loadingText && mainForm) {
    loadingText.textContent = message;
    loadingScreen.style.display = "flex";
    mainForm.style.opacity = "0.3";
    mainForm.style.pointerEvents = "none";
    console.log("Loading screen shown:", message);
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  const mainForm = document.getElementById("mainForm");

  if (loadingScreen && mainForm) {
    loadingScreen.style.display = "none";
    mainForm.style.opacity = "1";
    mainForm.style.pointerEvents = "auto";
    console.log("Loading screen hidden");
  }
}

// Plugin initialization function called by ONLYOFFICE
window.Asc.plugin.init = function () {
  console.log("Plugin init called by ONLYOFFICE");

  // Show loading screen during initialization
  showLoadingScreen("Initializing plugin...");

  // Store reference to plugin API
  if (this.executeMethod) {
    window.pluginAPI = this;
    console.log("Plugin API stored successfully");
  }

  setTimeout(() => {
    initializeDatePicker();
    // Hide loading screen after initialization
    hideLoadingScreen();
  }, 500);
};

// Plugin event handlers
window.Asc.plugin.onMethodReturn = function (returnValue) {
  console.log("Method returned:", returnValue);
};

// Handle button clicks (including close button)
window.Asc.plugin.button = function (id) {
  console.log("Button clicked:", id);

  // Handle close button or any other button
  if (id === -1 || id === 0) {
    // This is typically the close button
    console.log("Plugin close requested");
    this.executeMethod("ClosePlugin");
  }
};

// Handle plugin resize events
window.Asc.plugin.onResize = function (params) {
  console.log("Plugin resized:", params);
};

// Handle plugin close event
window.Asc.plugin.onClose = function () {
  console.log("Plugin is closing");
  // Clean up any resources if needed
  return true; // Allow the plugin to close
};

// Also try direct initialization as fallback
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, checking if plugin already initialized...");
  showLoadingScreen("Loading date picker...");

  setTimeout(function () {
    if (
      !document.querySelector("#dateInput").hasAttribute("data-initialized")
    ) {
      console.log("Plugin not initialized yet, running fallback...");
      initializeDatePicker();
    }
    hideLoadingScreen();
  }, 1000);
});

function initializeDatePicker() {
  console.log("Initializing date picker...");

  const input = document.getElementById("dateInput");
  const icon = document.getElementById("calendarIcon");
  const formatSelect = document.getElementById("dateFormat");
  const insertBtn = document.getElementById("insertDate");

  if (!input || !icon || !formatSelect || !insertBtn) {
    console.error("DOM elements not found");
    return;
  }

  // Mark as initialized to prevent double initialization
  input.setAttribute("data-initialized", "true");

  // Format function supporting 7 custom formats
  function formatDate(date, format) {
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
    const monthsFull = [
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
    const monthFull = monthsFull[month - 1];
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
        return "";
    }
  }

  // Initialize the datepicker with today's date
  const today = new Date();
  input.value = formatDate(today, formatSelect.value);
  const dp = new Datepicker(input, {
    autohide: false,
    defaultViewDate: today,
    todayHighlight: true,
    maxView: 2,
  });

  // Function to update format options with current date
  function updateFormatOptions(selectedDate) {
    const formats = [
      { value: "M/D/YYYY", label: "M/D/YYYY" },
      { value: "dddd, MMMM D, YYYY", label: "dddd, MMMM D, YYYY" },
      { value: "MMMM D, YYYY", label: "MMMM D, YYYY" },
      { value: "M/D/YY", label: "M/D/YY" },
      { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
      { value: "D-MMM-YY", label: "D-MMM-YY" },
      { value: "M.D.YYYY", label: "M.D.YYYY" },
    ];

    const currentValue = formatSelect.value;
    formatSelect.innerHTML = "";

    formats.forEach((format) => {
      const option = document.createElement("option");
      option.value = format.value;
      option.textContent = formatDate(selectedDate, format.value);
      formatSelect.appendChild(option);
    });

    // Restore the previously selected format
    formatSelect.value = currentValue;
  }

  // Function to reset to defaults
  function resetToDefaults() {
    const today = new Date();
    dp.setDate(today);
    input.value = formatDate(today, "M/D/YYYY");
    formatSelect.selectedIndex = 0; // Reset to first format
    updateFormatOptions(today);
  }

  // Initialize format options with today's date
  updateFormatOptions(today);

  // When calendar is opened, apply grey style
  input.addEventListener("show", () => {
    icon.classList.add("active");
  });

  // When calendar is closed, remove grey style
  input.addEventListener("hide", () => {
    icon.classList.remove("active");
  });

  // Allow clicking the icon to open calendar
  icon.addEventListener("click", () => {
    input.focus();
  });

  // Update date format when format selection changes
  formatSelect.addEventListener("change", () => {
    const selectedDate = dp.getDate();
    if (selectedDate) {
      input.value = formatDate(selectedDate, formatSelect.value);
    }
  });

  // Update displayed date and format options when date is selected
  input.addEventListener("changeDate", () => {
    const selectedDate = dp.getDate();
    if (selectedDate) {
      input.value = formatDate(selectedDate, formatSelect.value);
      updateFormatOptions(selectedDate);
    }
  });

  // Insert button: insert formatted date into ALL selected cells
  insertBtn.addEventListener("click", () => {
    const selectedDate = dp.getDate();
    const format = formatSelect.value;
    if (!selectedDate) {
      console.log("No date selected.");
      return;
    }

    // Show loading screen during insertion
    showLoadingScreen("Inserting date...");

    const formattedDate = formatDate(selectedDate, format);
    console.log("Formatted date:", formattedDate);

    // Check if we have the plugin API
    if (window.pluginAPI) {
      console.log("Using plugin API to insert date into all selected cells...");

      // Method 1: Use Asc.scope to pass data to callCommand (recommended approach)
      if (window.Asc && window.Asc.scope) {
        window.Asc.scope.dateValue = formattedDate;
        console.log("Set Asc.scope.dateValue:", formattedDate);

        try {
          window.pluginAPI.callCommand(function () {
            var oWorksheet = Api.GetActiveSheet();
            var oSelection = oWorksheet.GetSelection();

            // Check if we have a valid selection
            if (oSelection) {
              console.log("Setting formatted text for selected range");
              // Force the value to be treated as text, not as a date
              // Method 1: Try SetText if available
              if (typeof oSelection.SetText === "function") {
                oSelection.SetText(Asc.scope.dateValue);
              } else {
                // Method 2: Prefix with apostrophe to force text format
                oSelection.SetValue("'" + Asc.scope.dateValue);
              }
            } else {
              console.log("No selection found, falling back to active cell");
              // Fallback to active cell if no selection
              var oRange = oWorksheet.GetActiveCell();
              if (oRange) {
                if (typeof oRange.SetText === "function") {
                  oRange.SetText(Asc.scope.dateValue);
                } else {
                  oRange.SetValue("'" + Asc.scope.dateValue);
                }
              }
            }
          });
          console.log("callCommand with formatted text support executed");

          // Reset to defaults after successful insertion
          setTimeout(() => {
            resetToDefaults();
            hideLoadingScreen();
            console.log("Reset to defaults after insertion");
          }, 300);

          return;
        } catch (e) {
          console.log("callCommand with Asc.scope failed:", e);
        }
      }

      // Method 2: Alternative approach with explicit text formatting
      try {
        window.pluginAPI.callCommand(function () {
          var oWorksheet = Api.GetActiveSheet();
          var oSelection = oWorksheet.GetSelection();

          if (oSelection) {
            try {
              // Try multiple approaches to force text format
              console.log("Trying to set as formatted text");

              // Approach 1: Use SetNumberFormat to set as text, then SetValue
              try {
                oSelection.SetNumberFormat("@"); // @ symbol forces text format
                oSelection.SetValue(Asc.scope.dateValue || formattedDate);
              } catch (formatError) {
                console.log("NumberFormat approach failed:", formatError);
                // Approach 2: Force as text with apostrophe prefix
                oSelection.SetValue(
                  "'" + (Asc.scope.dateValue || formattedDate)
                );
              }
            } catch (rangeError) {
              console.log(
                "Range formatting failed, trying active cell:",
                rangeError
              );

              var oActiveCell = oWorksheet.GetActiveCell();
              if (oActiveCell) {
                try {
                  oActiveCell.SetNumberFormat("@");
                  oActiveCell.SetValue(Asc.scope.dateValue || formattedDate);
                } catch (cellError) {
                  oActiveCell.SetValue(
                    "'" + (Asc.scope.dateValue || formattedDate)
                  );
                }
              }
            }
          } else {
            // Fallback to active cell
            var oActiveCell = oWorksheet.GetActiveCell();
            if (oActiveCell) {
              try {
                oActiveCell.SetNumberFormat("@");
                oActiveCell.SetValue(Asc.scope.dateValue || formattedDate);
              } catch (cellError) {
                oActiveCell.SetValue(
                  "'" + (Asc.scope.dateValue || formattedDate)
                );
              }
            }
          }
        });
        console.log("Alternative text formatting approach executed");

        // Reset to defaults after successful insertion
        setTimeout(() => {
          resetToDefaults();
          hideLoadingScreen();
          console.log("Reset to defaults after insertion");
        }, 300);

        return;
      } catch (e) {
        console.log("Alternative text formatting approach failed:", e);
        hideLoadingScreen();
      }

      // Method 3: Try executeMethod approaches (keeping original fallbacks)
      var methods = [
        ["PastePlainText", [formattedDate]],
        ["SetValue", [formattedDate]],
        ["InsertText", [formattedDate]],
        ["PasteText", [formattedDate]],
      ];

      for (let i = 0; i < methods.length; i++) {
        try {
          console.log(`Trying executeMethod: ${methods[i][0]}`);
          window.pluginAPI.executeMethod(methods[i][0], methods[i][1]);
          console.log(`executeMethod ${methods[i][0]} executed successfully`);

          // Reset to defaults after successful insertion
          setTimeout(() => {
            resetToDefaults();
            hideLoadingScreen();
            console.log("Reset to defaults after insertion");
          }, 300);

          return;
        } catch (e) {
          console.log(`executeMethod ${methods[i][0]} failed:`, e);
        }
      }

      // Method 4: Try Document Builder API for online editors
      if (window.pluginAPI.callCommand) {
        try {
          console.log("Trying Document Builder API approach...");
          window.pluginAPI.callCommand(function () {
            var oDocument = Api.GetDocument();
            var oParagraph = Api.CreateParagraph();
            var oRun = Api.CreateRun();
            oRun.AddText(Asc.scope.dateValue || "Date insertion failed");
            oParagraph.AddElement(oRun);
            oDocument.InsertContent([oParagraph]);
          });
          console.log("Document Builder API executed");
          return;
        } catch (e) {
          console.log("Document Builder API failed:", e);
        }
      }

      // Method 5: Direct cell manipulation attempt
      try {
        console.log("Trying direct cell manipulation...");
        window.pluginAPI.executeCommand("cell", {
          command: "setText",
          data: formattedDate,
        });
        console.log("Direct cell manipulation executed");
        return;
      } catch (e) {
        console.log("Direct cell manipulation failed:", e);
      }

      // If all methods fail, show alert
      hideLoadingScreen();
      alert(
        "Unable to insert date automatically. Formatted date: " +
          formattedDate +
          "\n\nPlease copy this date and paste it manually into your selected cells."
      );
    } else {
      console.error("Plugin API not available");
      hideLoadingScreen();
      alert("Plugin API not available. Formatted date: " + formattedDate);
    }
  });

  console.log("Date picker initialized successfully");
}

// Additional debug information
console.log("Plugin script loaded");
