const form = document.getElementById('formRegistro');
const mensajeDiv = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const Nombre = document.getElementById('nombre').value.trim();
  const Email = document.getElementById('email').value.trim();

  if (!Nombre || !Email) {
    mensajeDiv.textContent = 'Por favor completa todos los campos.';
    mensajeDiv.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('/api/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Nombre, Email })
    });

    const data = await response.json();

    if (response.ok) {
      mensajeDiv.textContent = 'Registro guardado correctamente!';
      mensajeDiv.style.color = 'green';
      form.reset();
      cargarRegistros(); // recargar tabla
    } else {
      mensajeDiv.textContent = data.error || 'Error al guardar el registro.';
      mensajeDiv.style.color = 'red';
    }
  } catch (error) {
    mensajeDiv.textContent = 'Error de conexión con el servidor.';
    mensajeDiv.style.color = 'red';
  }
});

async function cargarRegistros() {
  try {
    const respuesta = await fetch('/api/listar-registros');
    const registros = await respuesta.json();

    const tbody = document.querySelector('#tablaRegistros tbody');
    tbody.innerHTML = '';

    registros.forEach(registro => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${registro.Nombre}</td>
        <td>${registro.Email}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar registros:", error);
  }
}

// Cargar registros al cargar la página
cargarRegistros();

const btnTema = document.getElementById('btnTema');
const temaGuardado = localStorage.getItem('tema');

if(temaGuardado === 'oscuro'){
  document.body.classList.add('tema-oscuro');
}

btnTema.addEventListener('click', ()=>{
document.body.classList.toggle('tema-oscuro');
const temaActual = document.body.classList.contains('tema-oscuro')?'oscuro':'claro';
localStorage.setItem('tema', temaActual);
});