const grupos = [
  { nombre: "The Beatles", estilos: [1, 0, 0] },   
  { nombre: "Miles Davis", estilos: [0, 1, 0] },  
  { nombre: "BTS", estilos: [0, 0, 1] },           
  { nombre: "Pink Floyd", estilos: [1, 0.5, 0] }, 
  { nombre: "Ariana Grande", estilos: [0, 0, 1] }, 
  { nombre: "Nirvana", estilos: [1, 0, 0] },       
];

const ratings = {}; 

const form = document.getElementById('ratingForm');
grupos.forEach((grupo, i) => {
  const label = document.createElement('label');
  label.textContent = `${grupo.nombre}: `;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 1;
  input.max = 10;
  input.value = 5;
  input.oninput = () => ratings[grupo.nombre] = Number(input.value);
  label.appendChild(input);
  form.appendChild(label);
  form.appendChild(document.createElement('br'));

  ratings[grupo.nombre] = 5; o
});

async function procesar() {
  
  const xs = [];
  const ys = [];

  grupos.forEach(grupo => {
    xs.push(grupo.estilos);           
    ys.push([ratings[grupo.nombre] / 10]);
  });

  const inputTensor = tf.tensor2d(xs);
  const outputTensor = tf.tensor2d(ys);


  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 5, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  
  await model.fit(inputTensor, outputTensor, {
    epochs: 100,
    verbose: 0,
  });

  const predicciones = model.predict(inputTensor);
  const resultados = await predicciones.array();


  const ranking = grupos
    .map((g, i) => ({ nombre: g.nombre, score: resultados[i][0] }))
    .sort((a, b) => b.score - a.score);

  const resultadoEl = document.getElementById('resultado');
  resultadoEl.innerHTML = '';
  ranking.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.nombre} (afinidad: ${(r.score * 10).toFixed(1)}/10)`;
    resultadoEl.appendChild(li);
  });
}
