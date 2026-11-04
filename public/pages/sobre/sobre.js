document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });
    }

    async function carregarMembros() {
        try {
            const resposta = await fetch('/api/membros');
            const resultado = await resposta.json();
            
            const membros = resultado.data || resultado; 

            const container = document.querySelector('.membros-grid');
            
            if (!container) return;
            
            container.innerHTML = ''; 

            if (!membros || membros.length === 0) {
                container.innerHTML = '<p class="empty-state">Nenhum membro cadastrado no momento.</p>';
                return;
            }

            membros.forEach(membro => {
                const divMembro = document.createElement('div');
                divMembro.classList.add('membro-card');

                const nomeMembro = membro.nome;
                const funcaoMembro = membro.funcao ? membro.funcao : 'Colaborador';
                
                let fotoMembro = (membro.foto_url === null || membro.foto_url === undefined || membro.foto_url === '') 
                    ? '/images/perfil-placeholder.png'
                    : membro.foto_url;

                divMembro.innerHTML = `
                    <div class="membro-foto">
                        <img src="/images/membros/${fotoMembro}" alt="Foto de ${nomeMembro}" onerror="this.src='/images/perfil-placeholder.png'">
                    </div>
                    <div class="membro-info">
                        <h3>${nomeMembro}</h3>
                        <div class="membro-funcao">${funcaoMembro}</div>
                    </div>
                `;

                container.appendChild(divMembro);
            });

        } catch (error) {
            console.error("Erro ao carregar os membros da equipe:", error);
            const container = document.querySelector('.membros-grid');
            if (container) {
                container.innerHTML = '<p class="empty-state">Erro ao carregar dados da equipe.</p>';
            }
        }
    }

    carregarMembros();
});