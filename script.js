"use strict";

const today = new Date();
var monthSelected = today.getMonth(); // Mês corrente
const UrlApiHoliday = `https://date.nager.at/Api/v3/PublicHolidays/`; 


let schedules = {}; // Armazena os eventos

const dateFormatOptions = {
  default: { weekday: "long" },
  short: { day: "2-digit", month: "2-digit", year: "numeric" },
};

//----------------------------------------
const countries = [
  // Paises com dados de evento
  { code: "AR", flag: "flag-icon-ar", name: "Argentina", locale: "es-AR" },
  { code: "BO", flag: "flag-icon-bo", name: "Bolivia", locale: "es-BO" },
  { code: "CL", flag: "flag-icon-cl", name: "Chile", locale: "es-CL" },
  { code: "CO", flag: "flag-icon-co", name: "Colombia", locale: "es-CO" },
  { code: "EC", flag: "flag-icon-ec", name: "Ecuador", locale: "es-EC" },
  { code: "GT", flag: "flag-icon-gt", name: "Guatemala", locale: "es-GT" },
  { code: "HN", flag: "flag-icon-hn", name: "Honduras", locale: "es-HN" },
  { code: "BR", flag: "flag-icon-br", name: "Brasil", locale: "pt-BR" },
  { code: "US", flag: "flag-icon-us", name: "USA", locale: "en-US" },
  { code: "FR", flag: "flag-icon-fr", name: "France", locale: "fr-FR" },
  { code: "DE", flag: "flag-icon-de", name: "Germany", locale: "de-DE" },
  { code: "ES", flag: "flag-icon-es", name: "Spain", locale: "es-ES" },
  { code: "IT", flag: "flag-icon-it", name: "Italy", locale: "it-IT" },
  { code: "JP", flag: "flag-icon-jp", name: "Japan", locale: "ja-JP" },
  { code: "CN", flag: "flag-icon-cn", name: "China", locale: "zh-CN" },
  { code: "IN", flag: "flag-icon-in", name: "India", locale: "hi-IN" },
  { code: "RU", flag: "flag-icon-ru", name: "Russia", locale: "ru-RU" },
  { code: "CA", flag: "flag-icon-ca", name: "Canada", locale: "en-CA" },
  { code: "AU", flag: "flag-icon-au", name: "Australia", locale: "en-AU" },
  {
    code: "GB",
    flag: "flag-icon-gb",
    name: "United Kingdom",
    locale: "en-GB",
  },
  { code: "MX", flag: "flag-icon-mx", name: "Mexico", locale: "es-MX" },
  { code: "AR", flag: "flag-icon-ar", name: "Argentina", locale: "es-AR" },
  { code: "CO", flag: "flag-icon-co", name: "Colombia", locale: "es-CO" },
  { code: "CL", flag: "flag-icon-cl", name: "Chile", locale: "es-CL" },
  { code: "PT", flag: "flag-icon-pt", name: "Portugal", locale: "pt-PT" },
  { code: "KR", flag: "flag-icon-kr", name: "South Korea", locale: "ko-KR" },
  { code: "ZA", flag: "flag-icon-za", name: "South Africa", locale: "en-ZA" },
  {
    code: "AE",
    flag: "flag-icon-ae",
    name: "United Arab Emirates",
    locale: "ar-AE",
  },
  { code: "EG", flag: "flag-icon-eg", name: "Egypt", locale: "ar-EG" },
  { code: "NG", flag: "flag-icon-ng", name: "Nigeria", locale: "en-NG" },
  { code: "SE", flag: "flag-icon-se", name: "Sweden", locale: "sv-SE" },
  { code: "NO", flag: "flag-icon-no", name: "Norway", locale: "no-NO" },
  { code: "FI", flag: "flag-icon-fi", name: "Finland", locale: "fi-FI" },
  { code: "DK", flag: "flag-icon-dk", name: "Denmark", locale: "da-DK" },
  { code: "NL", flag: "flag-icon-nl", name: "Netherlands", locale: "nl-NL" },
  { code: "BE", flag: "flag-icon-be", name: "Belgium", locale: "fr-BE" },
  { code: "CH", flag: "flag-icon-ch", name: "Switzerland", locale: "de-CH" },
  { code: "IE", flag: "flag-icon-ie", name: "Ireland", locale: "en-IE" },
  { code: "IL", flag: "flag-icon-il", name: "Israel", locale: "he-IL" },
  { code: "PL", flag: "flag-icon-pl", name: "Poland", locale: "pl-PL" },
  { code: "AT", flag: "flag-icon-at", name: "Austria", locale: "de-AT" },
  { code: "HU", flag: "flag-icon-hu", name: "Hungary", locale: "hu-HU" },
  { code: "SG", flag: "flag-icon-sg", name: "Singapore", locale: "en-SG" },
  { code: "MY", flag: "flag-icon-my", name: "Malaysia", locale: "ms-MY" },
  { code: "TH", flag: "flag-icon-th", name: "Thailand", locale: "th-TH" },
  { code: "PH", flag: "flag-icon-ph", name: "Philippines", locale: "en-PH" },
  { code: "VN", flag: "flag-icon-vn", name: "Vietnam", locale: "vi-VN" },
  { code: "PK", flag: "flag-icon-pk", name: "Pakistan", locale: "ur-PK" },
  { code: "BD", flag: "flag-icon-bd", name: "Bangladesh", locale: "bn-BD" },
  { code: "UA", flag: "flag-icon-ua", name: "Ukraine", locale: "uk-UA" },
  { code: "RO", flag: "flag-icon-ro", name: "Romania", locale: "ro-RO" },
  { code: "GR", flag: "flag-icon-gr", name: "Greece", locale: "el-GR" },
  { code: "TR", flag: "flag-icon-tr", name: "Turkey", locale: "tr-TR" },
  { code: "LT", flag: "flag-icon-lt", name: "Lithuania", locale: "lt-LT" },
  { code: "LV", flag: "flag-icon-lv", name: "Latvia", locale: "lv-LV" },
  { code: "EE", flag: "flag-icon-ee", name: "Estonia", locale: "et-EE" },
];

function getCountryCodeFromLocale(locale) {
  // Verifica se o locale está no formato "língua-PAÍS"
  if (locale.includes("-")) {
    return locale.split("-")[1].toUpperCase(); // Retorna o código do país em maiúsculas
  }

  return "BR"; // Valor padrão para Brasil se o locale não tiver um código de país
}
//----------------------------------------

async function loadHolidays(locale = "pt-BR", month, year) {
  // Extrai o código do país a partir do locale
  const countryCode = getCountryCodeFromLocale(locale);

  // Obtém o ano e mês correntes se não forem fornecidos
  const today = new Date();
  const selectedYear = year !== undefined ? year : today.getFullYear();
  const selectedMonth = month !== undefined ? month : today.getMonth();

  // Função auxiliar para formatar datas
  const formatDate = (day, month, year) => {
    const date = new Date(year, month, day);
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const holidays = await fetchHolidays(selectedYear, countryCode);

  // Filtra os feriados do mês atual

  // Filtra os feriados do mês atual e marcar os qua ja passaram
  const filteredHolidays = Object.keys(holidays)
    .filter((date) => {
      const [holidayYear, holidayMonth] = date.split("-").map(Number);
      return holidayMonth - 1 === selectedMonth && holidayYear === selectedYear;
    })
    .map((date) => {
      const [holidayYear, holidayMonth, holidayDay] = date
        .split("-")
        .map(Number);
      const formattedDate = formatDate(
        holidayDay,
        holidayMonth - 1,
        holidayYear
      );
      const holidayText = `${formattedDate}: ${holidays[date]}`;

      // Verifica se a data está no passado
      const holidayDate = new Date(holidayYear, holidayMonth - 1, holidayDay);
      const isPastEvent = holidayDate < new Date();

      // Retorna o item com uma classe de estilo se for passado
      return `<li class="${
        isPastEvent ? "past-event" : ""
      }">${holidayText}</li>`;
    })
    .join("");

  const holidaysContainer = document.querySelector(".current-events ul");
  holidaysContainer.innerHTML = filteredHolidays;
}

async function getHolidays(locale = "pt-BR", month, year) {
  // Extrai o código do país a partir do locale
  const countryCode = getCountryCodeFromLocale(locale);

  // Obtém o ano e mês correntes se não forem fornecidos
  const today = new Date();
  const selectedYear = year !== undefined ? year : today.getFullYear();
  const selectedMonth = month !== undefined ? month : today.getMonth();

  // Função auxiliar para formatar datas
  const formatDay = (day, month, year) => {
    const date = new Date(year, month, day);
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
    }).format(date);
  };

  try {
    const holidays = await fetchHolidays(selectedYear, countryCode);

    // Filtra os feriados do mês atual
    const filteredHolidays = Object.keys(holidays)
      .filter((date) => {
        const [holidayYear, holidayMonth] = date.split("-").map(Number);
        return (
          holidayMonth - 1 === selectedMonth && holidayYear === selectedYear
        );
      })
      .map((date) => {
        const [holidayYear, holidayMonth, holidayDay] = date
          .split("-")
          .map(Number);
        const formattedDay = formatDay(
          holidayDay,
          holidayMonth - 1,
          holidayYear
        );
        return formattedDay;
      });

    //  console.log("Filtered Holidays:", filteredHolidays);

    return filteredHolidays; // Retorna os dias formatados
  } catch (error) {
    console.error("Erro ao carregar feriados:", error);
    return [];
  }
}

async function fetchHolidays(year, countryCode) {
  const url = `${UrlApiHoliday}${year}/${countryCode}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // console.log("API Response:", data);

    const holidays = {};
    data.forEach((holiday) => {
      const date = holiday.date;
      holidays[date] = holiday.localName;
    });
    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return {};
  }
}

function generateMonthAbbreviations(
  locale = "pt-BR",
  selectedMonth,
  selectedYear,
  countryCode
) {
  const today = new Date();
  const currentMonth = today.getMonth(); // Mês corrente
  const currentYear = today.getFullYear(); // Ano corrente

  // Usa o mês e ano selecionados, ou o corrente caso não sejam fornecidos
  const monthToUse = selectedMonth !== undefined ? selectedMonth : currentMonth;
  const yearToUse = selectedYear !== undefined ? selectedYear : currentYear;

  // Gera as abreviações dos meses
  const months = Array.from(
    { length: 12 },
    (_, i) =>
      new Date(yearToUse, i, 1)
        .toLocaleString(locale, { month: "short" })
        .replace(/^\w/, (c) => c.toUpperCase()) // Capitaliza a primeira letra
        .replace(/\.$/, "") // Remove o ponto final, se existir
  );

  // Seleciona o container dos meses
  const monthsContainer = document.querySelector("#calendar-months");

  // Cria o conteúdo para os meses abreviados, destacando o mês atual ou o selecionado
  const monthsHTML = months
    .map((month, index) => {
      const isCurrentOrSelectedMonth = index === monthToUse;
      const className = isCurrentOrSelectedMonth
        ? "month-cell month-color month-hover"
        : "month-cell month-hover";
      // Define o ID como 'monthSelected' para o mês selecionado e 'month' para os demais
      const id = isCurrentOrSelectedMonth ? "monthSelected" : "month";
      return `<th class="${className}" data-month="${index}" id="${id}">${month}</th>`;
    })
    .join("");

  // Adiciona a linha com as células dos meses no container
  monthsContainer.innerHTML = `<tr class="months month-row">${monthsHTML}</tr>`;

  // Adiciona o evento de clique para cada célula de mês
  document.querySelectorAll(".month-cell").forEach((cell) => {
    cell.addEventListener("click", function () {
      // Remove a cor de destaque do mês atual
      document
        .querySelectorAll(".month-cell")
        .forEach((c) => c.classList.remove("month-color"));

      // Adiciona a cor de destaque ao mês clicado
      this.classList.add("month-color");

      // Recupera o mês e o ano selecionados
      const selectedMonth = parseInt(this.getAttribute("data-month"), 10);
      const selectedYear =
        parseInt(document.getElementById("year").value, 10) || yearToUse;

      // Gera o calendário com o mês, ano e locale selecionados
      if (!isNaN(selectedMonth) && !isNaN(selectedYear)) {
        generateCalendar(locale, selectedMonth, selectedYear);
      }
    });
  });
}

function setupCalendar() {
  // Obtém o locale selecionado ou usa o padrão
  const locale = setupCountrySelector();
  const countryCode = getCountryCodeFromLocale(locale);

  // Obtém a data atual
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Obtém o elemento do ano selecionado e o mês selecionado
  const yearInput = document.getElementById("year");
  const monthInput = document.getElementById("month");

  // Define o ano e o mês selecionados
  let selectedYear = yearInput ? parseInt(yearInput.value, 10) : currentYear;
  let selectedMonth = monthInput
    ? parseInt(monthInput.value, 10) - 1
    : currentMonth;

  // Verifica se o mês selecionado é válido
  if (isNaN(selectedMonth) || selectedMonth < 0 || selectedMonth > 11) {
    selectedMonth = currentMonth;
    console.error(
      "Mês inválido selecionado. Usando mês corrente:",
      currentMonth + 1
    );
  }
}

function generateDaysOfWeek(locale = "pt-BR", year) {
  // Cria uma nova data para obter os dias da semana
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(year, 0, i + 1); // Ajusta a data para começar corretamente no primeiro dia do ano
    const dayName = day
      .toLocaleDateString(locale, { weekday: "short" })
      .replace(/\.$/, ""); // Remove ponto final, se existir
    return { name: dayName, index: day.getDay() }; // Retorna o nome do dia e o índice (0 = domingo)
  });

  // Ordena os dias da semana pelo índice (0 = domingo, 1 = segunda, etc.)
  const orderedDaysOfWeek = daysOfWeek.sort((a, b) => a.index - b.index);

  // Selecione o elemento de cabeçalho do calendário
  const calendarHeader = document.querySelector("#calendar-header");

  if (calendarHeader) {
    // Cria o cabeçalho da tabela para os dias da semana ordenados
    calendarHeader.innerHTML = orderedDaysOfWeek
      .map((day) => `<th class="days">${day.name.toUpperCase()}</th>`)
      .join("");
  } else {
    console.warn("Elemento #calendar-header não encontrado.");
  }
}

async function generateCalendar(locale = "pt-BR", month, year) {
  const today = new Date();

  const currentMonth = month !== undefined ? month : today.getMonth();
  const currentYear = year !== undefined ? year : today.getFullYear();

  const holidays = await getHolidays(locale, currentMonth, currentYear);

  function isHoliday(day) {
    const formattedDay = day.toString().padStart(2, "0");
    return holidays.includes(formattedDay);
  }

  loadSchedulesFromLocalStorage();

  function isDayEvent(date, schedules = loadSchedulesFromLocalStorage()) {
    // Verifica se schedules é um objeto válido
    if (typeof schedules !== "object" || schedules === null) {
      console.error(
        "O objeto 'schedules' não está definido ou não é um objeto válido."
      );
      return 0;
    }

    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error("O formato da data está incorreto. Deve ser yyyy-mm-dd.");
      return 0;
    }

    // Checa se a data (chave) existe no objeto schedules
    if (schedules.hasOwnProperty(date)) {
      const events = schedules[date];

      // Retorna a quantidade de eventos
      return events.length;
    } else {
      // Log caso a data não exista como chave
      return 0;
    }
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDayOfPreviousMonth = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate();

  generateMonthAbbreviations(locale, currentMonth, currentYear);
  generateDaysOfWeek(locale, currentYear);

  let calendarHTML = "";
  let date = 1;

  for (let i = 0; i < 6; i++) {
    calendarHTML += `<tr class="week-row week-${i + 1}">`;

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        calendarHTML += `<td class="td-clear"><td class="grey">${String(
          lastDayOfPreviousMonth - firstDayOfMonth + j + 1
        ).padStart(2, "0")}</td> </td>`;
      } else if (date > daysInMonth) {
        const nextMonthDate = date - daysInMonth;
        calendarHTML += `<td class="td-clear"><td class="grey">${String(
          nextMonthDate
        ).padStart(2, "0")}</td></td>`;
        date++;
      } else {
        const isToday =
          date === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear();

        const formatDateDefault = (day, month, year) => {
          // Formatar dia e mês para ter dois dígitos
          const formattedDay = day.toString().padStart(2, "0");
          const formattedMonth = (month + 1).toString().padStart(2, "0"); // mês é 0-11

          // Retornar a data no formato yyyy-mm-dd
          return `${year}-${formattedMonth}-${formattedDay}`;
        };

        const dateToCheck = formatDateDefault(date, currentMonth, currentYear);

        const dayClass = isToday ? "circle active-day" : "";
        const numberOfEvents = isDayEvent(`${dateToCheck}`);
        const eventClass = isHoliday(date)
          ? "circle blue-light"
          : numberOfEvents > 0
          ? "circle orange"
          : "";
        calendarHTML += `<td class="td-clear"><td class="${dayClass} ${eventClass}" data-date="${currentYear}-${String(
          currentMonth + 1
        ).padStart(2, "0")}-${String(date).padStart(2, "0")}">${String(
          date
        ).padStart(2, "0")} ${
          numberOfEvents > 0
            ? `<span class="event-count">${numberOfEvents}</span>`
            : ""
        }</td> </td>`;
        date++;
      }
    }

    calendarHTML += "</tr>";
  }

  const calendarBody = document.querySelector("#calendar-body");
  if (calendarBody) {
    calendarBody.innerHTML = calendarHTML;
  }

  const numDateElement = document.querySelector(".num-date");
  const dayElement = document.querySelector(".day");

  if (numDateElement && dayElement) {
    numDateElement.textContent = today.toLocaleDateString(locale, {
      day: "2-digit",
    });
    dayElement.textContent = today
      .toLocaleDateString(locale, { weekday: "long" })
      .toUpperCase();
  }

  const yearElement = document.querySelector(".year");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  if (typeof loadHolidays === "function") {
    loadHolidays(locale, currentMonth, currentYear);
  } else {
    console.warn("Função loadHolidays não está definida.");
  }

  // console.log("loadEvents parametros : " + currentMonth + " " + currentYear)
  loadEvents(currentMonth, currentYear);
}

function displayCurrentDate(locale = "pt-BR") {
  // Extrai o código do país a partir do locale, se necessário
  const countryCode = getCountryCodeFromLocale(locale);

  const today = new Date();

  // Atualiza o dia (mantendo a lógica existente)
  const numDateElement = document.querySelector(".num-date");
  if (numDateElement) {
    numDateElement.textContent = today.toLocaleDateString(locale, {
      day: "2-digit",
    });
  }

  // Atualiza o ano (padrão ou selecionado)
  const yearElement = document.querySelector(".year");
  if (yearElement) {
    yearElement.textContent = today.getFullYear();
  }

  console.log(
    `Data exibida: ${today.toLocaleDateString(locale)} (${countryCode})`
  );
}

function displayCurrentMonthAndYear(locale = "pt-BR") {
  const today = new Date();

  // Extrai o código do país a partir do locale, se necessário
  const countryCode = getCountryCodeFromLocale(locale);

  // Configura as opções para formatação do mês e ano
  const options = { month: "long", year: "numeric" };
  const monthYearText = today.toLocaleDateString(locale, options).toUpperCase();

  // Atualiza o elemento com o texto do mês e ano
  const monthYearElement = document.querySelector("#calendar-months");
  if (monthYearElement) {
    monthYearElement.textContent = monthYearText;
  }

  console.log(`Mês e ano exibidos: ${monthYearText} (${countryCode})`);
}

function setupEventListeners() {
  const prevYearBtn = document.getElementById("prev-year");
  const nextYearBtn = document.getElementById("next-year");

  // Meses e ano atuais ou selecionados
  const yearElement = document.querySelector("#year");
  const monthElement = monthSelected;

  // Obtem o locale baseado na bandeira usando a função setupCountrySelector
  const locale = setupCountrySelector();

  // Mensagens de erro para elementos não encontrados
  if (!prevYearBtn) {
    console.error("Elemento 'prev-year' não encontrado no DOM.");
  }
  if (!nextYearBtn) {
    console.error("Elemento 'next-year' não encontrado no DOM.");
  }
  if (!yearElement) {
    console.error("Elemento '#year' não encontrado no DOM.");
  }
  if (!monthElement) {
    console.error("Elemento 'monthElement' não encontrado no DOM.");
  }

  // Verifica se todos os elementos necessários foram encontrados
  if (!prevYearBtn || !nextYearBtn || !yearElement || !monthElement) {
    console.error(
      "Um ou mais elementos necessários não foram encontrados no DOM. A execução será interrompida."
    );
    return; // Sai da função se não houver todos os elementos
  }

  // Função para manipular a mudança de ano
  const handleYearChange = (increment) => {
    const currentYear =
      parseInt(yearElement.textContent, 10) || new Date().getFullYear();
    const currentMonth = monthElement + 1; // Ajusta o mês para o formato 1-12

    const newYear = currentYear + increment;

    // Gera o calendário com os novos valores
    generateCalendar(locale, currentMonth - 1, newYear);

    // Atualiza o texto do elemento do ano
    yearElement.textContent = newYear;
  };

  // Adiciona eventos de clique nos botões de ano anterior e próximo
  prevYearBtn.addEventListener("click", () => handleYearChange(-1));
  nextYearBtn.addEventListener("click", () => handleYearChange(1));
}

function getLocaleFromFlag(flagIconClass) {
  // Extrai o código da bandeira da classe
  const flagCode = flagIconClass.replace("flag-icon-", "");

  // Busca o país correspondente no array
  const country = countries.find((c) => c.flag === `flag-icon-${flagCode}`);

  // Retorna o locale do país ou um valor padrão se não encontrado
  return country ? country.locale : "pt-BR";
}

function setupCountrySelector() {
  // Seleciona o elemento de seleção do país
  const selectSelectedElement = document.querySelector(".select-selected");

  if (!selectSelectedElement) {
    console.error("Elemento de seleção do país não encontrado.");
    return "pt-BR"; // Valor padrão se o elemento não for encontrado
  }

  // Seleciona o ícone da bandeira dentro do elemento
  const flagIconElement = selectSelectedElement.querySelector(".flag-icon");

  if (!flagIconElement) {
    console.error("Ícone da bandeira não encontrado.");
    return "pt-BR"; // Valor padrão se o ícone não for encontrado
  }

  // Obtém a classe do ícone da bandeira
  const flagIconClass = flagIconElement.className;
  // console.log("Classe do ícone da bandeira:", flagIconClass);

  // Obtém o locale com base na classe do ícone da bandeira
  const locale = getLocaleFromFlag(flagIconClass);
  // console.log("Locale correspondente:", locale);

  // Retorna o locale
  return locale;
}

function getSelectedMonth() {
  // Tenta encontrar o elemento que tem o ID 'monthSelected'
  const monthSelectedElement = document.getElementById("monthSelected");

  // Verifica se o elemento foi encontrado
  if (monthSelectedElement) {
    // Exibe o valor de "data-month"
    const selectedMonth = parseInt(
      monthSelectedElement.getAttribute("data-month"),
      10
    );
    console.log("Elemento com ID 'monthSelected' encontrado:", selectedMonth);
    return selectedMonth;
  }

  // Se não houver ID 'monthSelected', procura o elemento com a classe 'month-color'
  const monthColorElement = document.querySelector(".month-cell.month-color");

  // Verifica se o elemento foi encontrado
  if (monthColorElement) {
    // Exibe o valor de "data-month"
    const selectedMonth = parseInt(
      monthColorElement.getAttribute("data-month"),
      10
    );
    console.log(
      "Elemento com a classe 'month-color' encontrado:",
      selectedMonth
    );
    return selectedMonth;
  }

  // Se nenhum dos elementos for encontrado, exibe erro
  console.error(
    "Nenhum elemento com o ID 'monthSelected' ou classe 'month-color' foi encontrado."
  );
  return null;
}

// Função auxiliar para obter o locale a partir do countryCode
function getLocaleFromCountryCode(countryCode) {
  // Assumindo que 'countries' seja um array de objetos contendo 'code' e 'locale'
  return (
    countries.find((country) => country.code === countryCode)?.locale || "pt-BR"
  );
}

document.addEventListener(
  "DOMContentLoaded",
  (locale = "pt-BR", month, year) => {
    const today = new Date();

    // Meses e ano atuais ou selecionados
    const currentMonth = month !== undefined ? month : today.getMonth();
    const currentYear = year !== undefined ? year : today.getFullYear();

    const customSelect = document.getElementById("custom-select");
    const selectSelected = customSelect.querySelector(".select-selected");
    const selectItems = customSelect.querySelector(".select-items");

    // Set default selected item to Brasil
    const defaultCountry = countries.find((country) => country.code === "BR");
    const defaultLocale = defaultCountry ? defaultCountry.locale : "pt-BR";

    // Add options to the custom select
    countries.forEach((country) => {
      const option = document.createElement("div");
      option.className = "select-item";
      option.innerHTML = `<span class="flag-icon ${country.flag}"></span> ${country.name}`;
      option.addEventListener("click", () => {
        selectSelected.innerHTML = `<span class="flag-icon ${country.flag}"></span> ${country.name}`;
        selectItems.style.display = "none";
        // Atualiza o locale e countryCode ao selecionar um país
        const countryCode = country.code;
        const locale = country.locale;
        generateCalendar(locale, currentMonth, currentYear);
      });
      selectItems.appendChild(option);
    });

    // Set default selection
    if (defaultCountry) {
      selectSelected.innerHTML = `<span class="flag-icon ${defaultCountry.flag}"></span> ${defaultCountry.name}`;
    }

    // Toggle dropdown on click
    selectSelected.addEventListener("click", () => {
      selectItems.style.display =
        selectItems.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!customSelect.contains(event.target)) {
        selectItems.style.display = "none";
      }
    });

    //  clearSchedules();
    // Inicializa o calendário com o defaultLocale e defaultCountry
    setupCalendar();
    generateCalendar(defaultLocale);
    loadHolidays(defaultLocale);

    setupEventListeners();
  }
);

function loadSchedulesFromLocalStorage() {
  // Verifica se o localStorage está disponível
  if (typeof localStorage === "undefined" || localStorage === null) {
    console.error("Local Storage não é suportado!");
    return {};
  }

  // Obtém os eventos salvos no localStorage
  const storedEvents = localStorage.getItem("events");

  // Converte o JSON recuperado do localStorage para um objeto, ou inicializa vazio se não houver dados
  const schedules = storedEvents ? JSON.parse(storedEvents) : {};
  // Log para verificar se schedules existe e tem dados
  // console.log("Schedules:", schedules);

  // console.log("Eventos carregados com sucesso!");
  return schedules;
}

function saveSchedulesToLocalStorage() {
  // Verifica se o localStorage está disponível
  if (typeof localStorage === "undefined" || localStorage === null) {
    console.error("Local Storage não é suportado!");
    return;
  }

  // Salva os eventos no localStorage
  localStorage.setItem("events", JSON.stringify(schedules));
  console.log("Eventos salvos com sucesso!");

  // Recarrega a página
  location.reload();
}
function clearSchedules() {
  // Pergunta ao usuário se ele realmente deseja limpar todos os eventos
  const confirmation = confirm(
    "Tem certeza de que deseja limpar todos os eventos? Esta ação não pode ser desfeita."
  );

  if (confirmation) {
    // Remove todos os eventos salvos no localStorage
    localStorage.removeItem("events");

    // Limpa o objeto schedules
    let schedules = {}; // Declarar localmente, se necessário
    console.log("Todos os eventos foram limpos com sucesso!");

    // Recarrega a página
    location.reload();
  } else {
    console.log("Limpeza de eventos cancelada pelo usuário.");
  }
}

function saveSchedule(dateString, scheduleIndex = null, isEdit = false) {
  const dateEvent = document.getElementById("dateEvent").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const startTimeString = document.getElementById("startTime").value;
  const endTimeString = document.getElementById("endTime").value;
  const alarm = document.getElementById("alarm").checked;

  const address = {
    cep: document.getElementById("cep").value.replace("-", ""), // Remove o hífen
    street: document.getElementById("street").value,
    number: document.getElementById("number").value,
    complement: document.getElementById("complement").value,
    neighborhood: document.getElementById("neighborhood").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    reference: document.getElementById("reference").value,
  };

  // Load all events from localStorage or initialize an empty object
  const allSchedules = JSON.parse(localStorage.getItem("events")) || {};
  const schedulesForDate = allSchedules[dateEvent] || [];

  // Convert start and end times to Date objects
  const startTime = new Date(`${dateEvent}T${startTimeString}`);
  const endTime = new Date(`${dateEvent}T${endTimeString}`);

  // Check for overlapping times when creating or updating
  let overlapFound = false;

  if (isEdit) {
    const filteredSchedules = schedulesForDate.filter(
      (_, index) => index !== scheduleIndex
    );

    // Check overlap with remaining events
    overlapFound = hasOverlap(filteredSchedules, dateEvent, startTime, endTime);
  } else {
    // If not editing, check if an event already exists for the time
    overlapFound = hasOverlap(schedulesForDate, dateEvent, startTime, endTime);
  }

  if (overlapFound) {
    alert(
      "Já existe um evento para este horário. Sugerindo um novo horário..."
    );

    // Suggest a new start and end time
    const suggestedTimes = suggestNewTime(schedulesForDate, startTime, endTime);
    if (suggestedTimes) {
      const { newStartTime, newEndTime } = suggestedTimes;
      document.getElementById("startTime").value = newStartTime
        .toTimeString()
        .split(" ")[0]; // Format time as HH:MM:SS
      document.getElementById("endTime").value = newEndTime
        .toTimeString()
        .split(" ")[0]; // Format time as HH:MM:SS
      return; // Exit function after suggesting new times
    } else {
      alert("Não foi possível sugerir um novo horário.");
      return; // Exit function if no new time can be suggested
    }
  }

  // Define the ID for the new event or retain the existing ID when updating
  let newId;
  if (isEdit) {
    if (scheduleIndex !== null && schedulesForDate[scheduleIndex]) {
      newId = schedulesForDate[scheduleIndex].id; // Retain ID if editing
    } else {
      alert("Erro ao editar: evento não encontrado.");
      return; // Exit function if event is not found
    }
  } else {
    // New ID for a new event
    newId =
      schedulesForDate.length > 0
        ? Math.max(...schedulesForDate.map((s) => s.id)) + 1
        : 1;
  }

  // Create or update the event object
  const schedule = {
    id: newId,
    dateEvent,
    title,
    description,
    startTime: startTimeString,
    endTime: endTimeString,
    alarm,
    address,
  };

  // Update or add the event in the list for the date
  if (isEdit) {
    schedulesForDate[scheduleIndex] = schedule; // Update existing event
  } else {
    schedulesForDate.push(schedule); // Add new event
  }

  // Save the updated event list in the overall structure
  allSchedules[dateEvent] = schedulesForDate;

  // Store the complete structure in localStorage
  localStorage.setItem("events", JSON.stringify(allSchedules));

  // Success messages
  if (isEdit) {
    alert("Evento editado com sucesso!");
  } else {
    alert("Evento salvo com sucesso!");
  }

  closeModal();
  location.reload();
}

// Function to suggest new start and end times
function suggestNewTime(schedules, startTime, endTime) {
  // Sort schedules by start time
  const sortedSchedules = schedules.sort(
    (a, b) =>
      new Date(`${a.dateEvent}T${a.startTime}`) -
      new Date(`${b.dateEvent}T${b.startTime}`)
  );

  // Check the gaps between events
  for (let i = 0; i < sortedSchedules.length; i++) {
    const eventStartTime = new Date(
      `${sortedSchedules[i].dateEvent}T${sortedSchedules[i].startTime}`
    );
    const eventEndTime = new Date(
      `${sortedSchedules[i].dateEvent}T${sortedSchedules[i].endTime}`
    );

    // Check if there's a gap before the next event
    if (i < sortedSchedules.length - 1) {
      const nextEventStartTime = new Date(
        `${sortedSchedules[i + 1].dateEvent}T${
          sortedSchedules[i + 1].startTime
        }`
      );
      if (eventEndTime <= nextEventStartTime) {
        // There is a gap between events
        return {
          newStartTime: new Date(eventEndTime),
          newEndTime: new Date(eventEndTime.getTime() + (endTime - startTime)), // Maintain original duration
        };
      }
    } else {
      // If it's the last event, suggest a time after it
      return {
        newStartTime: new Date(eventEndTime),
        newEndTime: new Date(eventEndTime.getTime() + (endTime - startTime)), // Maintain original duration
      };
    }
  }

  return null; // No new time can be suggested
}

// Helper function to check for overlapping time intervals
function hasOverlap(events, dateEvent, newStart, newEnd) {
  return events.some((event) => {
    // Check if the event is on the same date
    if (event.dateEvent !== dateEvent) return false;

    // Convert stored times to full Date objects for comparison
    const eventStart = new Date(`${event.dateEvent}T${event.startTime}`);
    const eventEnd = new Date(`${event.dateEvent}T${event.endTime}`);

    // Check for overlap
    return isOverlapping(eventStart, eventEnd, newStart, newEnd);
  });
}

// Function to determine if two time intervals overlap
function isOverlapping(start1, end1, start2, end2) {
  // Check if the intervals overlap
  return start1 < end2 && start2 < end1;
}

function deleteSchedule(dateString, scheduleIndex) {
  // Carrega todos os eventos do localStorage ou inicializa um objeto vazio
  const allSchedules = JSON.parse(localStorage.getItem("events")) || {};

  // Obtém a lista de eventos para a data específica
  const schedulesForDate = allSchedules[dateString] || [];

  // Verifica se o índice do evento a ser deletado é válido
  if (scheduleIndex >= 0 && scheduleIndex < schedulesForDate.length) {
    // Pergunta ao usuário se deseja realmente excluir o evento
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir este evento?"
    );

    if (confirmDelete) {
      // Remove o evento do array
      schedulesForDate.splice(scheduleIndex, 1); // Remove o evento na posição scheduleIndex

      // Se não houver mais eventos para essa data, remove a data do objeto allSchedules
      if (schedulesForDate.length === 0) {
        delete allSchedules[dateString];
      } else {
        // Atualiza a lista de eventos para a data
        allSchedules[dateString] = schedulesForDate;
      }

      // Atualiza o localStorage
      localStorage.setItem("events", JSON.stringify(allSchedules));
      console.log(`Evento deletado para a data ${dateString}.`, allSchedules);

      // Recarrega a página
      location.reload();
    } else {
      console.log("Exclusão do evento cancelada pelo usuário.");
    }
  } else {
    alert("Erro: evento não encontrado.");
  }
}

function openModal(dateString, scheduleIndex = null, isEdit = false) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  modal.scrollTop = 0;

  const dateEventInput = document.getElementById("dateEvent");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const alarmCheckbox = document.getElementById("alarm");
  const cepInput = document.getElementById("cep");
  const streetInput = document.getElementById("street");
  const numberInput = document.getElementById("number");
  const complementInput = document.getElementById("complement");

  const neighborhoodInput = document.getElementById("neighborhood");
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const referenceInput = document.getElementById("reference");

  // Carrega os dados do localStorage
  const schedules = loadSchedulesFromLocalStorage();

  // Update the modal status based on the mode
  const modalStatus = document.querySelector(".modal-status"); // Select the title element
  const saveButton = document.getElementById("save-btn");

  // Carrega os dados do evento se scheduleIndex estiver definido
  if (
    isEdit &&
    scheduleIndex !== null &&
    schedules[dateString] &&
    schedules[dateString][scheduleIndex]
  ) {
    modalStatus.textContent = "Editando o Evento"; // Change title for edit mode
    saveButton.textContent = "Atualizar"; // Change button text for edit mode

    if (modalStatus.textContent === "Editando o Evento") {
      modalStatus.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 19c3.333 -2 5 -4 5 -6c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 2.877 2.5 4c1.5 2 2.5 2.5 3.5 1c.667 -1 1.167 -1.833 1.5 -2.5c1 2.333 2.333 3.5 4 3.5h2.5"></path>
        <path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z"></path>
        <path d="M16 7h4"></path>
      </svg>
    Editando o Evento
    `;
    }

    saveButton.textContent = "Atualizar"; // Change button text for edit mode

    if (saveButton.textContent === "Atualizar") {
      saveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5"></path>
          <path d="M16 3v4"></path>
          <path d="M8 3v4"></path>
          <path d="M4 11h16"></path>
          <path d="M19 22v-6"></path>
          <path d="M22 19l-3 -3l-3 3"></path>
        </svg>
        Atualizar
      `;
    }
    console.log("Carregando evento existente para edição." + scheduleIndex);
    const schedule = schedules[dateString][scheduleIndex];

    // Preenche os dados do evento no modal
    dateEventInput.value = schedule.dateEvent || dateString;
    titleInput.value = schedule.title || "";
    descriptionInput.value = schedule.description || "";
    startTimeInput.value = schedule.startTime || "";
    endTimeInput.value = schedule.endTime || "";
    alarmCheckbox.checked = schedule.alarm || false;
    // Supondo que `cepInput` seja a referência ao elemento de entrada do CEP
    const cep = schedule.address?.cep || "";

    // Aplica a máscara se o CEP tiver 8 dígitos
    const formattedCep =
      cep.length === 8 ? cep.slice(0, 5) + "-" + cep.slice(5) : cep;

    // Define o valor do campo de entrada com o CEP formatado
    cepInput.value = formattedCep;
    streetInput.value = schedule.address?.street || "";
    complementInput.value = schedule.address?.complement || "";
    numberInput.value = schedule.address?.number || "";
    neighborhoodInput.value = schedule.address?.neighborhood || "";
    cityInput.value = schedule.address?.city || "";
    stateInput.value = schedule.address?.state || "";
    referenceInput.value = schedule.address?.reference || "";
  } else {
    // console.log("Criando novo evento para a data:", dateString);

    modalStatus.textContent = "Adicionar Novo Evento"; // Change title for insert mode
    if (modalStatus.textContent === "Adicionar Novo Evento") {
      modalStatus.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M10 20h-6"></path>
          <path d="M14 20h6"></path>
          <path d="M12 15l-2 -2h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-3l-2 2z"></path>
          <path d="M10 8h4"></path>
          <path d="M12 6v4"></path>
        </svg>
        Adicionar Novo Evento
      `;
    }

    saveButton.textContent = "Salvar"; // Reseta o texto do botão para o modo de inserção

    if (saveButton.textContent === "Salvar") {
      saveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5"></path>
          <path d="M16 3v4"></path>
          <path d="M8 3v4"></path>
          <path d="M4 11h16"></path>
          <path d="M16 19h6"></path>
          <path d="M19 16v6"></path>
        </svg>
        Salvar
      `;
    }

    // Limpa os campos do modal para um novo evento
    dateEventInput.value = dateString; // Preenche o campo de data com a data passada como parâmetro

    // Hora atual formatada para o campo de início e término
    const now = new Date();
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    startTimeInput.value = now.toLocaleTimeString("pt-BR", options);
    now.setMinutes(now.getMinutes() + 30);
    endTimeInput.value = now.toLocaleTimeString("pt-BR", options);

    titleInput.value = "";
    descriptionInput.value = "";
    alarmCheckbox.checked = false;
    cepInput.value = "";
    streetInput.value = "";
    numberInput.value = "";
    neighborhoodInput.value = "";
    cityInput.value = "";
    stateInput.value = "";
    referenceInput.value = "";
  }

  // Configura o botão de salvar
  document.getElementById("save-btn").addEventListener("click", function () {
    const now = new Date();
    const dateEvent = document.getElementById("dateEvent");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");

    // Validações dos campos
    if (!dateEvent.value) {
      alert("Por favor, preencha a data do evento.");
      dateEvent.focus();
      return;
    }

    if (!title.value) {
      alert("Por favor, preencha o título do evento.");
      title.focus();
      return;
    }

    if (!description.value) {
      alert("Por favor, preencha a descrição do evento.");
      description.focus();
      return;
    }

    if (!startTime.value) {
      alert("Por favor, preencha a hora de início do evento.");
      startTime.focus();
      return;
    }

    if (!endTime.value) {
      alert("Por favor, preencha a hora de término do evento.");
      endTime.focus();
      return;
    }

    // Validação da data e horários
    const eventDate = new Date(dateEvent.value);
    const currentDate = new Date(now.toISOString().split("T")[0]); // Data sem horário

    if (eventDate < currentDate) {
      alert("A data do evento não pode ser anterior à data atual.");
      dateEvent.focus();
      return;
    }

    let start = new Date(`${dateEvent.value}T${startTime.value}`);
    let end = new Date(`${dateEvent.value}T${endTime.value}`);

    // Validação: Hora de término não pode ser anterior à hora de início
    if (end <= start) {
      alert("A hora de término deve ser posterior à hora de início.");
      endTime.focus();
      return;
    }

    // Certifique-se de que a função `saveSchedule` está definida ou remova esta linha caso não seja necessária;
    saveSchedule(dateEvent.value, scheduleIndex, isEdit);
  });

  document.getElementById("cancel-btn").onclick = () => closeModal();
}

// Evento para abrir o modal em branco quando o botão de adicionar evento for clicado
document.getElementById("add-event-button").onclick = () => {
  console.log("Modal - add-event-button");
  openModal("", null, false); // Passa `null` para indicar que é um novo evento
};

// Função para verificar se duas horas são iguais
function isSameTime(time1, time2) {
  const [hour1, minute1] = time1.split(":").map(Number);
  const [hour2, minute2] = time2.split(":").map(Number);
  return hour1 === hour2 && minute1 === minute2;
}

// Adiciona o evento de tecla "Esc"
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("cep").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5); // Insere o hífen após os primeiros 5 dígitos
  }
  e.target.value = value; // Atualiza o valor do campo de entrada com a máscara
});

document.getElementById("search-btn").addEventListener("click", function () {
  const cep = document.getElementById("cep").value;

  // Remove o hífen e verifica se há exatamente 8 dígitos
  const cleanedCep = cep.replace(/\D/g, ""); // Remove qualquer caractere que não seja número

  if (cleanedCep.length === 8) {
    fetchAddress(cleanedCep);
  } else {
    alert("CEP inválido. Verifique e tente novamente.");
  }
});

function fetchAddress(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.erro) {
        document.getElementById("street").value = data.logradouro || "";
        document.getElementById("neighborhood").value = data.bairro || "";
        document.getElementById("city").value = data.localidade || "";
        document.getElementById("state").value = data.uf || "";
      } else {
        alert("Endereço não encontrado para o CEP fornecido.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar o endereço:", error);
      alert("Erro ao buscar o endereço.");
    });
}

document.getElementById("open-maps").onclick = () => {
  const street = document.getElementById("street").value.trim();
  const number = document.getElementById("number").value.trim();
  const neighborhood = document.getElementById("neighborhood").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();

  if (street && number && neighborhood && city && state) {
    const address = `${street}, ${number} - ${neighborhood}, ${city} - ${state}, Brasil`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  } else {
    alert("Endereço não cadastrado no evento.");
  }
};

document.getElementById("open-waze").onclick = () => {
  const street = document.getElementById("street").value.trim();
  const number = document.getElementById("number").value.trim();
  const neighborhood = document.getElementById("neighborhood").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();

  if (street && number && neighborhood && city && state) {
    const address = `${street}, ${number} - ${neighborhood}, ${city} - ${state}, Brasil`;
    const url = `https://waze.com/ul?q=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  } else {
    alert("Endereço não cadastrado no evento.");
  }
};

// ------------
function loadEvents(
  currentMonth,
  currentYear,
  schedules = loadSchedulesFromLocalStorage()
) {
  if (
    !schedules ||
    typeof schedules !== "object" ||
    Object.keys(schedules).length === 0
  ) {
    console.error("O objeto 'schedules' não está definido ou está vazio.");
    return;
  }

  const eventosDoMes = [];

  // Obtém a data atual
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Define a hora para o início do dia

  // Itera pelos eventos e filtra os do mês e ano passados no parâmetro
  for (const date in schedules) {
    if (schedules.hasOwnProperty(date)) {
      const eventos = schedules[date];
      const eventoData = new Date(date);
      const eventoMes = eventoData.getMonth();
      const eventoAno = eventoData.getFullYear();

      // Filtra eventos que correspondem ao mês e ano do parâmetro
      if (eventoMes === currentMonth && eventoAno === currentYear) {
        eventos.forEach((evento) => {
          eventosDoMes.push({ ...evento, date }); // Adiciona a data ao evento
        });
      }
    }
  }

  // Ordena os eventos por data e hora de início
  eventosDoMes.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA - dateB;
  });

  const eventListDiv = document.getElementById("event-list");
  eventListDiv.innerHTML = ""; // Limpa a lista de eventos

  if (eventosDoMes.length > 0) {
    eventosDoMes.forEach((evento) => {
      const [year, month, day] = evento.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      // Cria o elemento de lista para exibir o evento
      const eventoLi = document.createElement("li");
      eventoLi.className = "event-card";

      // Verifica se o evento é do passado
      const eventDateTime = new Date(`${evento.date}T${evento.startTime}`);
      if (eventDateTime < currentDate) {
        eventoLi.classList.add("past-event"); // Adiciona a classe para eventos passados

        // Se for passado, não adiciona o botão de editar
        eventoLi.innerHTML = `
          <div class="event-content">${formattedDate} - ${evento.startTime} - ${evento.title}</div>
          <div class="event-actions">
            <button class="delete-event delete-event-button" title="Deletar">❌</button>
          </div>`;
      } else {
        eventoLi.innerHTML = `
          <div class="event-content">${formattedDate} - ${evento.startTime} - ${evento.title}</div>
          <div class="event-actions">
            <button class="edit-event edit-event-button" title="Editar">✎</button> 
            <button class="delete-event delete-event-button" title="Deletar">❌</button>
          </div>`;
      }

      eventListDiv.appendChild(eventoLi);

      // Configura os botões de edição e exclusão usando data e horário para identificar o evento
      if (eventDateTime >= currentDate) {
        eventoLi.querySelector(".edit-event").addEventListener("click", () => {
          openModal(
            evento.date,
            schedules[evento.date].findIndex(
              (e) => e.startTime === evento.startTime && e.title === evento.title
            ),
            true
          );
        });
      }

      // Botão de deletar
      eventoLi.querySelector(".delete-event").addEventListener("click", () => {
        deleteSchedule(
          evento.date,
          schedules[evento.date].findIndex(
            (e) => e.startTime === evento.startTime && e.title === evento.title
          )
        );
      });
    });
  } else {
    eventListDiv.innerHTML = "<p>Não há eventos para este mês.</p>";
  }
}


// SubMenu// Alterna a exibição do submenu ao clicar no menu-toggle
document.querySelector(".menu-toggle").addEventListener("click", function () {
  const submenu = document.getElementById("submenu");
  submenu.style.display =
    submenu.style.display === "none" || submenu.style.display === ""
      ? "block"
      : "none";
});

// Função de limpar eventos
document.getElementById("clear-events").addEventListener("click", function () {
  clearSchedules();
  // Oculta o submenu após limpar os eventos
  document.getElementById("submenu").style.display = "none";
});

// Função para verificar eventos
function checkEvents() {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // Formato HH:MM

  const events = loadSchedulesFromLocalStorage();
  // console.log("Eventos carregados:", events); // Verifique o que está sendo retornado

  // Verifica se existem eventos para a data atual
  const todaysEvents = events[currentDate] || [];

  if (!Array.isArray(todaysEvents)) {
    console.error("Os eventos para hoje não são um array:", todaysEvents);
    return; // Saia da função se eventos para hoje não forem um array
  }

  // console.log("Data atual:", currentDate);
  // console.log("Hora atual:", currentTime);

  todaysEvents.forEach((event) => {
    // Verifica se a hora atual é a hora de início do evento e se o alarme não foi ativado
    if (event.startTime === currentTime && event.alarm) {
      event.alarm = false; // Marcar o alarme como ativado
      triggerAlarm(event); // Chama a função para tocar o alarme
    }
  });
}

// Função para tocar o alarme
function triggerAlarm(event) {
  audio
    .play()
    .then(() => {
      console.log("Som reproduzido com sucesso");
    })
    .catch((error) => {
      console.error("Erro ao tocar o som:", error);
    });

  // Chame essa função para exibir o alerta personalizado
  showCustomAlert(event);
}

// Verifica eventos a cada 1 minuto (60000 milissegundos)
setInterval(checkEvents, 45000);

let audio; // Definindo a variável de áudio fora da função

function initAudio() {
  audio = new Audio("https://www.soundjay.com/buttons/sounds/button-35.mp3");
}

// Chame initAudio quando a página carregar ou quando o usuário interagir pela primeira vez
window.addEventListener("load", initAudio);

// Alert --------------------

// Função para abrir o alerta personalizado
function showCustomAlert(event) {
  document.getElementById("alertTitle").textContent = `Título: ${event.title}`;
  document.getElementById("alertDescription").textContent = `Descrição: ${event.description}`;
  document.getElementById("alertstartTime").textContent = `Horário: ${event.startTime} à ${event.endTime}`;
  document.getElementById("customAlert").style.display = "block";
  document.getElementById("alertOverlay").style.display = "block";
}

// Função para fechar o alerta personalizado
function closeCustomAlert() {
  document.getElementById("customAlert").style.display = "none";
  document.getElementById("alertOverlay").style.display = "none";
}

// Função para exibir alertas na página
function showAlert(msg) {
  const alertDiv = document.querySelector('#alert');
  alertDiv.innerHTML = msg;
  alertDiv.style.display = msg ? "block" : "none";
}

// Função para buscar o clima automaticamente pela localização do usuário
async function loadWeatherByLocation() {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Log das coordenadas
      // console.log(`Latitude: ${lat}, Longitude: ${lon}`);

      // Obtém a cidade e estado
      await getCityAndState(lat, lon);
      
      // Obtém o clima com base nas coordenadas
      await getWeatherByCoordinates(lat, lon);
    }, (error) => {
      console.error("Erro ao obter localização:", error);
      showAlert("Não foi possível acessar sua localização. Use a busca manual.");
    }, options);
  } else {
    showAlert("Geolocalização não é suportada pelo seu navegador. Use a busca manual.");
  }
}

// Função para obter o nome da cidade e estado a partir da latitude e longitude
async function getCityAndState(lat, lon) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR`;

  try {
    const response = await fetch(nominatimUrl);
    const data = await response.json();

    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.road;
      const state = data.address.state;
      // console.log(`Cidade: ${city}, Estado: ${state}`);

      // Preenche o campo city_name com o nome da cidade
      document.querySelector('#city_name').value = city;

      // showAlert(`Localização: ${city}, ${state}`); // Exibir na interface também
    } else {
      console.error("Dados de endereço não encontrados.");
      showAlert("Não foi possível obter a cidade e estado.");
    }
  } catch (error) {
    console.error("Erro ao obter cidade e estado", error);
    showAlert("Erro ao buscar cidade e estado. Tente novamente mais tarde.");
  }
}

// Evento para buscar clima manualmente pelo nome da cidade
document.querySelector('#search').addEventListener('submit', async (event) => {
  event.preventDefault();
  const cityName = document.querySelector('#city_name').value.trim();

  if (!cityName) {
    showAlert('Você precisa digitar uma cidade...');
    return;
  }

  await getWeatherByCity(cityName);
});

// Função para buscar clima pelo nome da cidade
async function getWeatherByCity(cityName) {
  const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (json.cod === 200) {
      showInfo(json);
    } else {
      showAlert("Cidade não encontrada. Verifique o nome e tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao buscar dados da API", error);
    showAlert("Erro ao buscar dados da API. Tente novamente mais tarde.");
  }
}

// Função para buscar clima com base nas coordenadas
async function getWeatherByCoordinates(lat, lon) {
  const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (json.cod === 200) {
      showInfo(json);
    } else {
      showAlert("Não foi possível obter o clima para sua localização.");
    }
  } catch (error) {
    console.error("Erro ao buscar dados da API", error);
    showAlert("Erro ao buscar dados da API. Tente novamente mais tarde.");
  }
}

// Função para exibir as informações climáticas
function showInfo(data) {
  showAlert(''); // Limpa qualquer alerta anterior

  document.querySelector("#weather").classList.add("show");

  document.querySelector('#title').innerHTML = `${data.name}, ${data.sys.country}`;
  document.querySelector('#temp_img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.querySelector('#temp_value').innerHTML = `${Math.round(data.main.temp)} <sup>C°</sup>`;
  document.querySelector('#temp_description').innerHTML = data.weather[0].description;
  document.querySelector('#temp_max').innerHTML = `${Math.round(data.main.temp_max)} <sup>C°</sup>`;
  document.querySelector('#temp_min').innerHTML = `${Math.round(data.main.temp_min)} <sup>C°</sup>`;
  document.querySelector('#humidity').innerHTML = `${data.main.humidity}%`;
  document.querySelector('#wind').innerHTML = `${Math.round(data.wind.speed * 3.6)} km/h`; // Converte m/s para km/h
}

// Carrega o clima automaticamente ao abrir a página
document.addEventListener("DOMContentLoaded", loadWeatherByLocation);


// Função para atualizar a localização ao clicar no ícone de localização
document.getElementById('location-icon').addEventListener('click', async () => {
  const loadingElement = document.getElementById('loading');

  console.log("Ícone de localização clicado."); // Debug
  loadingElement.style.display = 'block';

  try {
    console.log("Tentando atualizar a localização..."); // Debug
    await loadWeatherByLocation();
    console.log("Localização atualizada com sucesso."); // Debug
  } catch (error) {
    console.error("Erro ao atualizar a localização:", error);
  } finally {
    loadingElement.style.display = 'none';
    console.log("Elemento de carregamento escondido."); // Debug
  }
});
