function getFormattedDateParts(isoString) {
  const d = new Date(isoString + "T00:00:00");
  const dia = d.getDate();
  const mes = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  const ano = d.getFullYear();
  return { dia, mes, ano };
}

const buscar = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

function filtrarPorNome(termoBusca, Eventos) {
    if (!termoBusca || termoBusca.trim() === "") {
        return Eventos;
    }

    const termoMinusculo = termoBusca.toLowerCase().trim();

    return Eventos.filter(Evento =>
        Evento.nome?.toLowerCase().includes(termoMinusculo)
    );
}

function formatarHorario(hora) {
  if (!hora) return "";
  const [horas, minutos] = hora.split(':');
  return minutos === "00" ? `${parseInt(horas)}h` : `${horas}:${minutos}`;
}

const EVENTS_PER_PAGE_UPCOMING = 4;
const EVENTS_PER_PAGE_PAST = 8;
let eventsPerPage = EVENTS_PER_PAGE_UPCOMING;
let currentPage = 1;
let currentList = [];
let isPastView = false;

function buildPastCard(ev) {
  const { dia, mes, ano } = getFormattedDateParts(ev.data);
  const horarioFormatado = formatarHorario(ev.hora);

  let badgeClass = "badge especial";
  let tipoExibicao = ev.categoria || "Evento";

  if (ev.categoria === "apresentacao") {
    badgeClass = "badge teatro";
    tipoExibicao = "Apresentação";
  } else if (ev.categoria === "oficina") {
    badgeClass = "badge oficina";
    tipoExibicao = "Oficina";
  } else if (ev.categoria === "terca") {
    tipoExibicao = "Terça Cultural";
  }

  return `
    <a href="/evento/${ev.id}" class="event-card-past">
      <div class="past-date">
        <span class="past-day">${dia}</span>
        <span class="past-month">${mes}/${ano}</span>
      </div>
      <h3 class="past-title">${ev.nome}</h3>
      <span class="${badgeClass} past-badge">${tipoExibicao}</span>
    </a>
  `;
}

function buildCard(ev) {
  if (isPastView) return buildPastCard(ev);

  const { dia, mes, ano } = getFormattedDateParts(ev.data);
  const horarioFormatado = formatarHorario(ev.hora);

  let badgeClass = "badge especial";
  let tipoExibicao = ev.categoria || "Evento";

  if (ev.categoria === "apresentacao") {
    badgeClass = "badge teatro";
    tipoExibicao = "Apresentação";
  } else if (ev.categoria === "oficina") {
    badgeClass = "badge oficina";
    tipoExibicao = "Oficina";
  } else if (ev.categoria === "terca") {
    tipoExibicao = "Terça Cultural";
  }
  const proj = ev.proj && ev.proj !== "-" ? ev.proj : "neutro";

  const cardClass = isPastView ? "event-card-modern event-card-past" : "event-card-modern";

  return `
    <a href="/evento/${ev.id}" class="${cardClass}">
        <div class="event-date-box-${proj}">
        <div class="day-number">${dia}</div>
        <div class="month-year">${mes} ${ano}</div>
        <div class="hour">${horarioFormatado}</div>
      </div>
      <div class="event-info">
        <h3>${ev.nome}</h3>
        <div class="event-meta">
          <span>${ev.local}</span>
          <span>${horarioFormatado}</span>
        </div>
        <div class="event-tags">
          <span class="${badgeClass}">${tipoExibicao}</span>
        </div>
        ${isPastView ? '' : `<p class="event-description">${ev.descr ?? ''}</p>`}
        ${isPastView ? '' : `<div class="event-location-link">Ver local no mapa • Aberto ao público</div>`}
      </div>
    </a>
  `;
}

function renderPagination(total) {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(total / eventsPerPage);
  if (totalPages <= 1) { pagination.innerHTML = ''; return; }

  let html = '';

  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">&#8249;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span style="color:var(--text-light);align-self:center;padding:0 2px;">…</span>`;
    }
  }

  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">&#8250;</button>`;

  pagination.innerHTML = html;
}

function renderEventCards(eventList) {
  currentList = eventList;
  currentPage = 1;
  renderPage();
}

function renderPage() {
  const container = document.getElementById('eventsContainer');

  container.classList.toggle('events-list-past', isPastView);
  container.classList.toggle('events-grid', !isPastView);

  if (!currentList.length) {
    container.innerHTML = `<div class="empty-state">✨ Nenhum evento encontrado nesta categoria. Em breve novidades!</div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  const start = (currentPage - 1) * eventsPerPage;
  const slice = currentList.slice(start, start + eventsPerPage);
  container.innerHTML = slice.map(buildCard).join('');
  renderPagination(currentList.length);
}

function goToPage(page) {
  const totalPages = Math.ceil(currentList.length / eventsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderPage();
  document.getElementById('eventsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hoje() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function getUpcomingEvents(eventos) {
  return eventos
    .filter(ev => new Date(ev.data + "T00:00:00") >= hoje())
    .sort((a, b) => new Date(a.data) - new Date(b.data));
}

function getPastEvents(eventos) {
  return eventos
    .filter(ev => new Date(ev.data + "T00:00:00") < hoje())
    .sort((a, b) => new Date(b.data) - new Date(a.data));
}

async function init() {
  let todosEventos = [];
  let listaOriginal = [];

  try {
    const resposta = await fetch('/api/Eventos');
    const resultado = await resposta.json();
    listaOriginal = resultado.data;
    todosEventos = filtrarPorNome(searchInput.value, listaOriginal);
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
  }

  const upcomingBtn = document.getElementById('showUpcomingBtn');
  const pastBtn = document.getElementById('showPastBtn');

  function showUpcoming() {
    upcomingBtn.classList.add('active');
    pastBtn.classList.remove('active');
    isPastView = false;
    eventsPerPage = EVENTS_PER_PAGE_UPCOMING;
    renderEventCards(getUpcomingEvents(todosEventos));
  }

  function showPast() {
    pastBtn.classList.add('active');
    upcomingBtn.classList.remove('active');
    isPastView = true;
    eventsPerPage = EVENTS_PER_PAGE_PAST;
    renderEventCards(getPastEvents(todosEventos));
  }

  upcomingBtn.addEventListener('click', showUpcoming);
  pastBtn.addEventListener('click', showPast);

  buscar.addEventListener('click', () => {
    todosEventos = filtrarPorNome(searchInput.value, listaOriginal);
    isPastView ? showPast() : showUpcoming();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscar.click();
  });

  showUpcoming();
}

init();
