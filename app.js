// ===== CONFIGURACIÓN DE SUPABASE =====
const SUPABASE_URL = 'https://awzbmvnstgpabgpjdnzw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3emJtdm5zdGdwYWJncGpkbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTYzMzMsImV4cCI6MjA5NjY3MjMzM30.gE2z8E9-S89-9E5zDom5B84SftGTPmzYreHAIxOuHR0';


// ===== BOTONES DE ESTADO DE ÁNIMO =====
const botones = document.querySelectorAll('.estado');

botones.forEach(function(boton) {
  boton.addEventListener('click', function() {
    if (boton.classList.contains('activo')) {
      boton.classList.remove('activo');
    } else {
      botones.forEach(function(b) { b.classList.remove('activo'); });
      boton.classList.add('activo');
    }
  });
});


// ===== BOTÓN ENVIAR =====
const btnEnviar = document.getElementById('btn-enviar');
const textarea = document.getElementById('mensaje');
const checkAnonimo = document.getElementById('anonimo');

btnEnviar.addEventListener('click', async function() {

  const texto = textarea.value.trim();
  const estadoActivo = document.querySelector('.estado.activo');

  if (texto === '') {
    alert('Por favor escribe algo antes de enviar.');
    textarea.focus();
    return;
  }

  // Guardamos el mensaje en Supabase
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/mensajes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      texto: texto,
      estado: estadoActivo ? estadoActivo.textContent : 'Sin estado',
      anonimo: checkAnonimo.checked
    })
  });

  if (respuesta.ok) {
    textarea.value = '';
    botones.forEach(function(b) { b.classList.remove('activo'); });
    mostrarConfirmacion();
    cargarMensajes();
  } else {
    alert('Hubo un error al enviar. Intenta de nuevo.');
  }

});


// ===== CARGAR Y MOSTRAR MENSAJES =====
async function cargarMensajes() {
  const lista = document.getElementById('lista-mensajes');
  lista.innerHTML = '';

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/mensajes?order=created_at.desc`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const mensajes = await respuesta.json();

  mensajes.forEach(function(m) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-mensaje';
    tarjeta.innerHTML = `
      <span class="tag-estado">${m.estado}</span>
      <p>${m.texto}</p>
      <small>${m.anonimo ? 'Anónimo' : 'Usuario'}</small>
    `;
    lista.appendChild(tarjeta);
  });
}

cargarMensajes();


// ===== MENSAJE DE CONFIRMACIÓN =====
function mostrarConfirmacion() {
  const msg = document.createElement('div');
  msg.textContent = '💙 Tu mensaje fue recibido. No estás solo/a.';
  msg.style.cssText = `
    background: #eaf3de; color: #3b6d11; border-radius: 10px;
    padding: 14px; text-align: center; font-size: 14px; margin-top: 16px;
  `;
  document.querySelector('.formulario').appendChild(msg);
  setTimeout(function() { msg.remove(); }, 4000);
}