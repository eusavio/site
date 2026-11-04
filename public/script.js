const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-links a");
const imagens = ['tela.jpg', 'tela2.jpg','tela3.jpg','tela4.jpg'];
const imagemSorteada = imagens[Math.floor(Math.random() * imagens.length)];
const heroSection = document.querySelector('.hero');



async function carregarEventos() {
    try {
        const resposta = await fetch('/api/eventos');
        const resultado = await resposta.json();
        const eventos = resultado.data || resultado; 

        const container = document.querySelector('.events');
        if (container) container.innerHTML = ''; 

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const eventosFuturosProximos = eventos
            .filter(evento => {
                const dataEvento = new Date(evento.data + "T00:00:00");
                return dataEvento >= hoje; 
            })
            .sort((a, b) => {
                return new Date(a.data + "T00:00:00") - new Date(b.data + "T00:00:00");
            })
            .slice(0, 4);

        eventosFuturosProximos.forEach(evento => {
            const dataObj = new Date(evento.data + "T00:00:00");
            const da = dataObj.getDate();
            const mes = dataObj.toLocaleDateString('pt-BR', { month: 'short' })
                .toUpperCase()
                .replace('.', '');

            let horarioFormatado = "";
            if (evento.hora) {
                const [horas, minutos] = evento.hora.split(':');
                
                if (minutos === "00") {
                    horarioFormatado = `${parseInt(horas)}h`;
                } else {
                    horarioFormatado = `${horas}:${minutos}`;
                }
            }
            adicionarEvento(evento.id, da, mes, evento.nome, `${evento.local} • ${horarioFormatado}`);
        });
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
}

function sortearCorAlternativa(corAlternativa) {
    const sortear = Math.random() < 0.5;
    if (!sortear) return;

    const root = document.documentElement;
    root.style.setProperty('--orange', corAlternativa);
    root.style.setProperty('--orange-hover', corAlternativa);
    root.style.setProperty('--orange-light', corAlternativa);
    root.style.setProperty('--gold', corAlternativa);

    const membros = document.querySelector('.membros-subtitle');
    if (membros) {
        console.log("Alterando texto dos subtítulos dos membros");
        membros.textContent = 'Conheça os membros que fazem o LabSoci acontecer';
    }

    const insta = document.querySelector('.insta');
    if (insta) {
        insta.href = "https://www.instagram.com/labsoci/";
    }

    const logo = document.querySelector('.logo');
    if (logo) {
    logo.innerHTML = `
        <div class="logo-circle">
          <img src="/images/simbolo-lab.jpg" alt="LabSoci">
        </div>
        <span>LabSoci</span>
    `;
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroSubtitle) {
        heroSubtitle.textContent = 'Projeto de extensão da UFC Campus Russas';
    }

    const paragrafoExtra = document.createElement('p');
    paragrafoExtra.classList.add('hero-subtitle-extra');
    paragrafoExtra.textContent = 'Laboratório de Sociodrama e de Desenvolvimento do Pensamento Crítico Social';
    heroSubtitle.insertAdjacentElement('afterend', paragrafoExtra);
}

function adicionarEvento(id, dia, mes, titulo, localHora) {
    const container = document.querySelector('.events');
    if (!container) return;
    
    const divEvento = document.createElement('div');
    divEvento.classList.add('event');
    divEvento.innerHTML = `
    <a href="/evento/${id}" class="event-link">
        <div class="event-date">
            <strong>${dia}</strong>
            <span>${mes}</span>
        </div>
        <div>
            <h3>${titulo}</h3>
            <p>${localHora}</p>
        </div>
    </a>
    `;
    container.appendChild(divEvento);
}

const pathname = window.location.pathname;

const noIndex = pathname === "/";
const isEventos = pathname.startsWith("/eventos");
const isSobre = pathname.startsWith("/sobre");
const isEventoDetalhe = pathname.startsWith("/evento/") && pathname.split("/").length === 3;

if (noIndex) {
    carregarEventos();
}

if (heroSection) heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url("images/${imagemSorteada}")`;

if (!isEventoDetalhe) {
    sortearCorAlternativa('#055173');
}