document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS DEL DASHBOARD ---
    // Colores basados en el logo (rojo, teal oscuro, azul, dorado)
    const colores = ['theme-red', 'theme-teal', 'theme-blue', 'theme-gold', 'theme-navy'];
    
    const sesiones = [
        { id: 1, title: "¿QUÉ ES EL ANÁLISIS DE DATOS?", cuestionarios: [{ id: "s1_intro", title: "Introducción al Análisis de Datos" }], practice_title: "Primeros pasos con datos reales", practice_desc: "Explora un dataset introductorio e identifica qué tipo de preguntas se podrían responder con él." },
        { id: 2, title: "FUNDAMENTOS DE ALGORITMOS", cuestionarios: [{ id: "s2_algoritmos", title: "Algoritmos Simples" }], practice_title: "Diseño de un algoritmo simple", practice_desc: "Traduce un problema cotidiano en pseudocódigo y diagrama de flujo." },
        { id: 3, title: "FUNDAMENTOS DE PYTHON", cuestionarios: [{ id: "variables_y_tipos_de_datos", title: "Variables y Tipos de Datos" }], practice_title: "Tus primeras líneas de código", practice_desc: "Escribe tu primer script en Python utilizando variables y tipos de datos básicos." },
        { id: 4, title: "ESTRUCTURA DE CONTROL", cuestionarios: [{ id: "s4_control", title: "Sentencias y Ciclos" }], practice_title: "Lógica condicional", practice_desc: "Utiliza sentencias if/else y ciclos for/while para controlar el flujo de tu programa." },
        { id: 5, title: "FUNCIONES Y ESTRUCTURAS DE DATOS", cuestionarios: [{ id: "s5_funciones", title: "Funciones, Listas y Diccionarios" }], practice_title: "Optimizando con funciones", practice_desc: "Crea funciones reutilizables y maneja listas y diccionarios." },
        { id: 6, title: "NUMPY Y PANDAS", cuestionarios: [{ id: "s6_numpy", title: "Manipulación de DataFrames" }], practice_title: "Manipulación de DataFrames", practice_desc: "Carga un archivo CSV y realiza operaciones matemáticas y de filtrado usando Pandas." },
        { id: 7, title: "LIMPIEZA DE DATOS", cuestionarios: [{ id: "s7_limpieza", title: "Técnicas de Limpieza" }], practice_title: "Tratamiento de nulos y duplicados", practice_desc: "Aplica técnicas de limpieza a un dataset sucio para dejarlo listo para análisis." },
        { id: 8, title: "ESTADÍSTICA DESCRIPTIVA E INFERENCIAL", cuestionarios: [{ id: "s8_estadistica", title: "Métricas Estadísticas" }], practice_title: "Calculando métricas clave", practice_desc: "Obtén medias, medianas, desviaciones estándar y correlaciones de tu dataset." },
        { id: 9, title: "ANÁLISIS EXPLORATORIO DE DATOS (EDA)", cuestionarios: [{ id: "s9_eda", title: "Análisis Exploratorio" }], practice_title: "Descubriendo patrones", practice_desc: "Realiza un análisis profundo para encontrar insights ocultos en la información." },
        { id: 10, title: "VISUALIZACIÓN DE DATOS", cuestionarios: [{ id: "s10_visualizacion", title: "Gráficos con Matplotlib" }], practice_title: "Creando gráficos impactantes", practice_desc: "Usa Matplotlib y Seaborn para graficar tus hallazgos de forma profesional." }
    ];

    // Paleta de colores extraídos del logo Quetzalcóatl alternando fondo y botones
    const themeColors = [
        { bg: '#C0271A', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#C0271A' }, // S1: Rojo
        { bg: '#E8651A', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#E8651A' }, // S2: Naranja
        { bg: '#F5C842', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#F5C842' }, // S3: Amarillo
        { bg: '#8BC34A', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#8BC34A' }, // S4: Lima
        { bg: '#2E7D32', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#2E7D32' }, // S5: Verde
        { bg: '#009688', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#009688' }, // S6: Teal
        { bg: '#00BCD4', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#00BCD4' }, // S7: Cyan
        { bg: '#2196F3', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#2196F3' }, // S8: Azul
        { bg: '#1A237E', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#1A237E' }, // S9: Navy
        { bg: '#D81B60', btn: '#FFFFFF', text: '#FFFFFF', accent: '#FFFFFF', btnText: '#D81B60' }  // S10: Magenta
    ];

    const sessionsContainer = document.getElementById('sessions-container');

    function renderDashboard() {
        if (!sessionsContainer) return;
        
        // Verifica si la variable global de sesiones deshabilitadas existe (inyectada por PHP)
        const disabledSessions = typeof sesionesDeshabilitadas !== 'undefined' ? sesionesDeshabilitadas : [];
        
        sesiones.forEach((sesion, index) => {
            const theme = themeColors[index % themeColors.length];
            const isDisabled = disabledSessions.includes(sesion.id);
            
            const block = document.createElement('div');
            block.className = `session-block ${isDisabled ? 'disabled-session' : ''}`;
            block.style.setProperty('--theme-bg', theme.bg);
            block.style.setProperty('--theme-btn', theme.btn);
            block.style.setProperty('--theme-text', theme.text);
            block.style.setProperty('--theme-accent', theme.accent);
            block.style.setProperty('--theme-btn-text', theme.btnText);
            
            if (isDisabled) {
                block.style.opacity = '0.5';
                block.style.pointerEvents = 'none'; // Previene clicks
                block.style.filter = 'grayscale(0.8)';
            }
            
            block.innerHTML = `
                <div class="session-header">
                    <span class="session-title">// SESIÓN ${sesion.id} — ${sesion.title} ${isDisabled ? ' <i class="fa-solid fa-lock" style="margin-left:10px;"></i>' : ''}</span>
                </div>
                <div class="session-video-placeholder">
                    <button class="play-btn" ${isDisabled ? 'disabled' : ''}><i class="fa-solid fa-play"></i></button>
                    <span class="video-label">VIDEO DE LA SESIÓN</span>
                </div>
                
                <div class="session-actions" style="margin-top: 25px;">
                    <h4 class="practice-label">CUESTIONARIOS</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${sesion.cuestionarios.map(c => `
                            <li style="margin-bottom: 12px;">
                                <a href="#" class="btn-cuestionario-link" data-tema="${c.id}" data-session-title="${sesion.title}" data-cuestionario-title="${c.title}" style="color: var(--theme-text); text-decoration: none; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; ${isDisabled ? 'pointer-events: none;' : ''}">
                                    <span style="background: rgba(255,255,255,0.1); width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: 50%;"><i class="fa-solid fa-file-pen"></i></span>
                                    <span style="border-bottom: 1px dashed rgba(255,255,255,0.4);">${c.title}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="session-practice">
                    <h4 class="practice-label">PRÁCTICA</h4>
                    <h3 class="practice-title">${sesion.practice_title}</h3>
                    <p class="practice-desc">${sesion.practice_desc}</p>
                    <button class="lab-btn outlined-btn" ${isDisabled ? 'disabled' : ''}>DESCARGAR DATASET (.CSV) <i class="fa-solid fa-download"></i></button>
                </div>
            `;
            sessionsContainer.appendChild(block);
        });

        // Event listener para los enlaces de cuestionario
        document.querySelectorAll('.btn-cuestionario-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const temaId = e.currentTarget.getAttribute('data-tema');
                const sesionTitle = e.currentTarget.getAttribute('data-session-title');
                const cuestionarioTitle = e.currentTarget.getAttribute('data-cuestionario-title');
                abrirCuestionario(temaId, sesionTitle, cuestionarioTitle);
            });
        });
    }

    renderDashboard();

    // --- LÓGICA DEL CUESTIONARIO EN MODAL ---
    const modal = document.getElementById('quiz-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    
    // Variables de estado del cuestionario
    let estudiante = {};
    let preguntas = [];
    let respuestasUsuario = [];
    let resumenTeoria = null;
    let preguntaActual = 0;
    let tiempoInicio = null;
    let timerInterval = null;

    const stepCuestionario = document.getElementById('step-cuestionario');
    const stepResultados = document.getElementById('step-resultados');
    const displayEstudiante = document.getElementById('display-estudiante');
    const timerDisplay = document.getElementById('tiempo');
    const progressFill = document.getElementById('progress-fill');
    const contenedorPreguntas = document.getElementById('contenedor-preguntas');
    const currentQDisplay = document.getElementById('pregunta-counter');
    const tituloTema = document.getElementById('titulo-tema');
    const subtituloTema = document.getElementById('subtitulo-tema');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const btnReiniciar = document.getElementById('btn-reiniciar');

    if(closeBtn) closeBtn.addEventListener('click', cerrarModal);
    if(btnSiguiente) btnSiguiente.addEventListener('click', siguientePregunta);
    if(btnFinalizar) btnFinalizar.addEventListener('click', finalizarLaboratorio);
    if(btnReiniciar) btnReiniciar.addEventListener('click', cerrarModal);

    function cerrarModal() {
        modal.classList.remove('active');
        clearInterval(timerInterval);
    }

    function startTimer() {
        tiempoInicio = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - tiempoInicio) / 1000);
            const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const s = String(elapsed % 60).padStart(2, '0');
            timerDisplay.textContent = `${m}:${s}`;
        }, 1000);
    }

    async function abrirCuestionario(temaId, sesionTitle, cuestionarioTitle) {
        // Reiniciar estados
        preguntas = [];
        respuestasUsuario = [];
        preguntaActual = 0;
        
        // Simular datos del usuario logueado
        const nombreLogueado = document.getElementById('logged-user-name').innerText;
        
        estudiante = {
            nombre: nombreLogueado,
            correo: "alumno@teocalli.edu", // Dato simulado, en produccion vendria del backend
            curso: "Análisis de Datos, Edición 1",
            tema: sesionTitle,
            tema_id: temaId
        };
        
        // Asignar títulos en la UI
        if (tituloTema) tituloTema.innerText = sesionTitle;
        if (subtituloTema) subtituloTema.innerText = cuestionarioTitle;

        // Mostrar loading o resetear UI
        stepCuestionario.classList.add('active');
        stepResultados.classList.remove('active');
        contenedorPreguntas.innerHTML = '<div class="loading-state"><i class="fa-solid fa-circle-notch fa-spin"></i><p>Cargando cuestionario...</p></div>';
        btnSiguiente.style.display = 'none';
        btnFinalizar.style.display = 'none';
        
        modal.classList.add('active'); // Abrir Modal

        try {
            // Intentar cargar el JSON del tema. Si no existe, usar un fallback (variables_y_tipos_de_datos)
            let urlJSON = `data/${estudiante.tema_id}.json`;
            let response = await fetch(urlJSON);
            
            if (!response.ok) {
                console.warn(`JSON ${urlJSON} no encontrado. Usando fallback.`);
                urlJSON = 'data/variables_y_tipos_de_datos.json'; // Fallback temporal para la demo
                response = await fetch(urlJSON);
                if(!response.ok) throw new Error("Error cargando el cuestionario fallback.");
            }
            
            const data = await response.json();
            preguntas = data.preguntas;
            resumenTeoria = data.resumen_teoria || null;
            
            prepararCuestionario();

        } catch (error) {
            contenedorPreguntas.innerHTML = '<div class="loading-state"><i class="fa-solid fa-triangle-exclamation" style="color:#C0271A;"></i><p>Error al cargar las preguntas. Intenta de nuevo.</p></div>';
            console.error(error);
        }
    }

    function prepararCuestionario() {
        displayEstudiante.textContent = `Cuestionario: ${estudiante.tema}`;
        tituloTema.textContent = estudiante.curso;
        
        tiempoInicio = new Date();
        iniciarTemporizador();
        mostrarPregunta(0);
    }

    function iniciarTemporizador() {
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const ahora = new Date();
            const diff = Math.floor((ahora - tiempoInicio) / 1000);
            const m = String(Math.floor(diff / 60)).padStart(2, '0');
            const s = String(diff % 60).padStart(2, '0');
            timerDisplay.textContent = `${m}:${s}`;
        }, 1000);
    }

    function mostrarPregunta(index) {
        contenedorPreguntas.innerHTML = '';
        const preg = preguntas[index];
        currentQDisplay.textContent = `Pregunta ${index + 1} de ${preguntas.length}`;

        const progreso = ((index) / preguntas.length) * 100;
        progressFill.style.width = `${progreso}%`;

        const divPregunta = document.createElement('div');
        divPregunta.className = 'pregunta-item active';

        const titulo = document.createElement('h3');
        titulo.className = 'pregunta-texto';
        titulo.textContent = `${index + 1}. ${preg.pregunta}`;
        divPregunta.appendChild(titulo);

        if (preg.codigo) {
            const codeBlock = document.createElement('div');
            codeBlock.className = 'codigo-bloque';
            codeBlock.textContent = preg.codigo;
            divPregunta.appendChild(codeBlock);
        }

        if (preg.tipo === 'opcion_multiple') {
            const containerOpts = document.createElement('div');
            containerOpts.className = 'opciones-container';

            preg.opciones.forEach(opt => {
                const label = document.createElement('label');
                label.className = 'opcion-label';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `q${index}`;
                radio.value = opt.id;
                
                radio.addEventListener('change', () => {
                    document.querySelectorAll('.opcion-label').forEach(l => l.classList.remove('selected'));
                    label.classList.add('selected');
                    btnSiguiente.disabled = false;
                    if(index === preguntas.length - 1) btnFinalizar.disabled = false;
                });

                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${opt.id}) ${opt.texto}`));
                containerOpts.appendChild(label);
            });
            divPregunta.appendChild(containerOpts);
            
        } else if (preg.tipo === 'completar') {
            const inputTxt = document.createElement('input');
            inputTxt.type = 'text';
            inputTxt.className = 'input-completar';
            inputTxt.placeholder = 'Escribe tu respuesta aquí...';
            
            inputTxt.addEventListener('input', () => {
                const val = inputTxt.value.trim();
                btnSiguiente.disabled = val.length === 0;
                if(index === preguntas.length - 1) btnFinalizar.disabled = val.length === 0;
            });
            divPregunta.appendChild(inputTxt);
        }

        contenedorPreguntas.appendChild(divPregunta);

        btnSiguiente.disabled = true;
        btnFinalizar.disabled = true;

        if (index === preguntas.length - 1) {
            btnSiguiente.style.display = 'none';
            btnFinalizar.style.display = 'flex';
        } else {
            btnSiguiente.style.display = 'flex';
            btnFinalizar.style.display = 'none';
        }
    }

    function guardarRespuestaActual() {
        const preg = preguntas[preguntaActual];
        let respuesta = null;
        let respuestaDadaTexto = null;
        let correctaTexto = null;

        if (preg.tipo === 'opcion_multiple') {
            const seleccionado = document.querySelector(`input[name="q${preguntaActual}"]:checked`);
            if (seleccionado) {
                respuesta = seleccionado.value;
                const optObj = preg.opciones.find(o => String(o.id) === String(respuesta));
                if (optObj) respuestaDadaTexto = optObj.texto;
            }
            const correctOptObj = preg.opciones.find(o => String(o.id) === String(preg.correcta));
            if (correctOptObj) correctaTexto = correctOptObj.texto;
        } else if (preg.tipo === 'completar') {
            const input = document.querySelector('.input-completar');
            if (input) {
                respuesta = input.value.trim();
                respuestaDadaTexto = respuesta;
            }
            correctaTexto = preg.correcta;
        }

        respuestasUsuario[preguntaActual] = {
            pregunta: preg.pregunta,
            respuesta_dada: respuesta,
            respuesta_dada_texto: respuestaDadaTexto || respuesta || 'Sin respuesta',
            correcta: preg.correcta,
            correcta_texto: correctaTexto || preg.correcta,
            retroalimentacion: preg.retroalimentacion || null,
            es_correcta: (respuesta && respuesta.toLowerCase() === preg.correcta.toLowerCase())
        };
    }

    function siguientePregunta() {
        guardarRespuestaActual();
        preguntaActual++;
        if (preguntaActual < preguntas.length) {
            mostrarPregunta(preguntaActual);
        }
    }

    async function finalizarLaboratorio() {
        guardarRespuestaActual();
        clearInterval(timerInterval);
        
        progressFill.style.width = '100%';
        stepCuestionario.classList.remove('active');
        stepResultados.classList.add('active');

        const fin = new Date();
        const diffSegundos = Math.floor((fin - tiempoInicio) / 1000);
        const m = String(Math.floor(diffSegundos / 60)).padStart(2, '0');
        const s = String(diffSegundos % 60).padStart(2, '0');
        const tiempoString = `${m} min ${s} seg`;

        let aciertos = 0;
        respuestasUsuario.forEach(r => {
            if (r.es_correcta) aciertos++;
        });

        const calificacion = Math.round((aciertos / preguntas.length) * 100);
        let escalaTexto = '';
        let escalaClase = '';
        if (calificacion >= 90) { escalaTexto = 'Excelente'; escalaClase = 'escala-excelente'; }
        else if (calificacion >= 70) { escalaTexto = 'Buen Trabajo'; escalaClase = 'escala-bueno'; }
        else if (calificacion >= 50) { escalaTexto = 'Necesitas Reforzar'; escalaClase = 'escala-reforzar'; }
        else { escalaTexto = 'Vuelve a intentarlo'; escalaClase = 'escala-repetir'; }

        document.getElementById('resultado-calificacion').textContent = `${calificacion} / 100`;
        const escalaEl = document.getElementById('resultado-escala');
        escalaEl.textContent = escalaTexto;
        escalaEl.className = `score-escala ${escalaClase}`;
        document.getElementById('resultado-tiempo').textContent = tiempoString;

        const payload = {
            estudiante: {
                nombre: estudiante.nombre,
                correo: estudiante.correo,
                curso: estudiante.curso,
                tema: estudiante.tema
            },
            respuestas: respuestasUsuario,
            resumen_teoria: resumenTeoria,
            resultados: {
                aciertos: aciertos,
                total: preguntas.length,
                calificacion: calificacion,
                tiempo: tiempoString
            }
        };

        try {
            document.getElementById('loading-pdf').style.display = 'flex';
            document.getElementById('final-state').style.display = 'none';

            const response = await fetch('backend/generar_informe.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok || data.status === 'error') {
                throw new Error('El servidor respondió con error: ' + (data.message || response.status));
            }

            document.getElementById('loading-pdf').style.display = 'none';
            document.getElementById('final-state').style.display = 'block';

        } catch (error) {
            console.error('Error enviando los datos:', error);
            document.getElementById('loading-pdf').innerHTML = `
                <i class="fa-solid fa-triangle-exclamation" style="color:#C0271A;"></i>
                <h3>Ocurrió un error al enviar tu reporte</h3>
                <p>Verifica tu conexión y que el servidor backend esté corriendo.</p>
                <button onclick="document.getElementById('quiz-modal').classList.remove('active')" class="lab-btn secondary-btn" style="margin-top:20px;">Cerrar</button>
            `;
        }
    }
});
