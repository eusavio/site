document.addEventListener("DOMContentLoaded", () => {
    const idEvento = window.location.pathname.split('/').pop();

    if (!idEvento || idEvento === 'evento') {
        window.location.href = '/'; 
        return;
    }

    function mudaCor(corAlternativa) {
        const root = document.documentElement;
        root.style.setProperty('--orange', corAlternativa);
        root.style.setProperty('--orange-hover', corAlternativa);
        root.style.setProperty('--orange-light', corAlternativa);
        root.style.setProperty('--gold', corAlternativa);

        const insta = document.querySelector('.insta');
        if (insta) {
            insta.href = "https://www.instagram.com/labsoci/";
        }

        const logo = document.querySelector('.logo');
        logo.innerHTML = `
            <div class="logo-circle">
            <img src="/images/simbolo-lab.jpg" alt="LabSoci">
            </div>
            <span>LabSoci</span>
        `;
    }

    async function carregarEventos() {
        try {
            const respostaEvento = await fetch(`/api/evento/${idEvento}`);
            const resultadoEvento = await respostaEvento.json();
            const evento = resultadoEvento.data || resultadoEvento;

            const respostaMembros = await fetch(`/api/evento/${idEvento}/membros`);
            const resultadoMembros = await respostaMembros.json();
            const membros = resultadoMembros.data || resultadoMembros;

            const header = document.querySelector('.detail-header-card');
            const info = document.querySelector('.detail-content');
            const membrosContainer = document.querySelector('.members-grid'); 
            const capaImagem = document.querySelector('.event-detail-hero');
            const sidebar = document.querySelector('#org-sidebar-card'); 
            if (header) header.innerHTML = '';
            if (info) info.innerHTML = '';
            if (membrosContainer) membrosContainer.innerHTML = '';
            if (capaImagem) capaImagem.innerHTML = '<img src="/images/tela.jpg" alt="Imagem de capa do evento" class="hero-bg-image">';

            if (evento) {
                const nomeEvento = evento.nome || 'Oficina de Improviso'; 
                const categoriaEvento = evento.categoria ? evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1) : 'Oficina';
                const capa_url = evento.capa_url || '/images/tela.jpg';
                const proj = evento.proj || 'neutro';
                
                let dia = "18", mes = "JUN", ano = "2026";
                if (evento.data) {
                    const dataEvento = new Date(evento.data + "T00:00:00");
                    dia = dataEvento.getDate();
                    mes = dataEvento.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
                    ano = dataEvento.getFullYear();
                }

                const horarioFormatado = evento.hora || '18:00';
                const localEvento = evento.local || evento.local_evento || 'Sala de Artes - Bloco B, UFC Russas';
                const descricaoEvento = evento.descr_g || evento.descricao || 'Use o corpo e a voz para criar cenas improvisadas na hora!';
                const classificacaoEvento = evento.classificacao || 'Livre para todos os públicos';

                if (header) {
                    header.innerHTML = `
                        <h1>${nomeEvento}</h1>
                        <div class="detail-badges">
                            <span class="detail-badge badge-primary">🎪 ${categoriaEvento}</span>
                        </div>
                    `;
                }

                if (capaImagem) {
                    capaImagem.innerHTML = `<img src="${capa_url}" alt="Imagem de capa do evento ${nomeEvento}" class="hero-bg-image">`;
                }

                if (info) {
                    info.innerHTML = `
                        <div class="info-section">
                            <p class="full-description">${descricaoEvento}</p>
                        </div>
                        <div class="info-section">
                            <h3 class="section-title">📍 Informações Práticas</h3>
                            <div class="info-row">
                                <span class="info-icon">📅</span>
                                <span><strong>Data:</strong> ${dia} de ${mes} de ${ano}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon">⏰</span>
                                <span><strong>Horário:</strong> ${horarioFormatado}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon">📍</span>
                                <span><strong>Local:</strong> ${localEvento}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon">👥</span>
                                <span><strong>Classificação:</strong> ${classificacaoEvento}</span>
                            </div>
                        </div>
                        <div class="info-section">
                            <h3 class="section-title">🎭 Equipe de Coordenação</h3>
                            <p class="team-description">Este evento será conduzido pelos seguintes membros do Clube do Improviso:</p>
                            <div class="members-grid"></div>
                        </div>
                    `;
                }

                if (sidebar) {
                    if (proj === 'cdi') {
                        sidebar.innerHTML = `
                            <h3 class="sidebar-title">📌 Organização</h3>
                            <div class="org-info">
                                <img src="/images/simbolo-clube.jpg" alt="Clube do Improviso" class="org-logo">
                                <div>
                                    <strong>Clube do Improviso</strong>
                                    <p>Projeto de Cultura · UFC Russas</p>
                                </div>
                            </div>
                        `;
                    } else if (proj === 'lab') {
                        sidebar.innerHTML = `
                            <h3 class="sidebar-title">📌 Organização</h3>
                            <div class="org-info">
                                <img src="/images/simbolo-lab.jpg" alt="LabSoci" class="org-logo">
                                <div>
                                    <strong>LabSoci</strong>
                                    <p>Laboratório de Sociodrama e Desenvolvimento do Pensamento Crítico Social · UFC Russas</p>
                                </div>
                            </div>
                        `;
                        mudaCor('#055173');
                    } else {
                        sidebar.innerHTML = `
                            <h3 class="sidebar-title">📌 Organização</h3>
                            <div class="org-info">
                                <img src="/images/simbolo-clube.jpg" alt="Clube do Improviso" class="org-logo">
                                <div>
                                    <strong>Clube do Improviso</strong>
                                    <p>Diretoria de Cultura · UFC Russas</p>
                                </div>
                            </div>
                            <div class="org-info">
                                <img src="/images/simbolo-lab.jpg" alt="LabSoci" class="org-logo">
                                <div>
                                    <strong>LabSoci</strong>
                                    <p>Diretoria de Cultura · UFC Russas</p>
                                </div>
                            </div>
                        `;
                    }
                }
            }

            const novoMembrosContainer = document.querySelector('.members-grid');

            if (membros && novoMembrosContainer) {
                membros.forEach(membro => {
                    const divMembro = document.createElement('div');
                    divMembro.classList.add('member-card');
                    
                    const nomeMembro = membro.nome;
                    const funcaoMembro = membro.funcao ? membro.funcao : 'Participante';
                    
                    let fotoMembro = (membro.foto_url === null || membro.foto_url === undefined || membro.foto_url === '') 
                        ? '/images/perfil-placeholder.png'
                        : membro.foto_url;
                    
                    divMembro.innerHTML = `
                        <div class="member-avatar">
                            <img src="${fotoMembro}" alt="Foto de ${nomeMembro}">
                        </div>
                        <div class="member-info">
                            <h4>${nomeMembro}</h4>
                            <div class="member-role">${funcaoMembro}</div>
                        </div>
                    `;
                    
                    novoMembrosContainer.appendChild(divMembro);
                });
            }

        } catch (error) {
            console.error("Erro ao carregar dados da página do evento:", error);
        }
    }

    carregarEventos();
});