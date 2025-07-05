document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) {
    alert('Selecione um arquivo para enviar!');
    return;
  }

  // Lê o arquivo como base64
  const reader = new FileReader();
  reader.onload = async function(e) {
    // Remove o prefixo "data:...;base64,"
    const base64Content = e.target.result.split(',')[1];
    const response = await fetch('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: file.name,
        content: base64Content
      })
    });

    const result = await response.json();
    if (result.success) {
      alert('Arquivo enviado com sucesso!\nURL: ' + result.url);
      // Opcional: pode adicionar o arquivo à lista de arquivos publicados
      carregarArquivos();
    } else {
      alert('Erro no upload: ' + result.message);
    }
  };
  reader.readAsDataURL(file);
});

async function carregarArquivos() {
  // Exemplo: busca arquivos do repositório via API pública do GitHub
  const ul = document.getElementById('repoFiles');
  ul.innerHTML = '<li>Carregando arquivos...</li>';
  try {
    const res = await fetch('https://api.github.com/repos/ThomasDevSite/ThomasDevSite.github.io/contents/TomDownload');
    const files = await res.json();
    ul.innerHTML = '';
    if (Array.isArray(files) && files.length > 0) {
      files.forEach(file => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = file.download_url;
        a.target = '_blank';
        a.textContent = file.name;
        li.appendChild(a);
        ul.appendChild(li);
      });
    } else {
      ul.innerHTML = '<li>Nenhum arquivo encontrado.</li>';
    }
  } catch (err) {
    ul.innerHTML = '<li>Erro ao carregar arquivos.</li>';
  }
}

// Chama ao carregar a página
carregarArquivos();
