const searchInput = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete-list");
const repoList = document.getElementById("repo-list");

// Функция debounce для уменьшения лишних запросов
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Запрос к API для поиска
async function fetchRepositories(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    const data = await response.json();
    return data.items || [];
}

// Список подсказок
function showAutocomplete(repos) {
    autocompleteList.innerHTML = "";
    repos.forEach(repo => {
        const li = document.createElement("li");
        li.textContent = repo.name;
        li.onclick = () => addRepository(repo);
        autocompleteList.appendChild(li);
    });
}

// Добавить репозиторий в список сохраненных.
function addRepository(repo) {
    const li = document.createElement("li");
    li.classList.add("repo-item");

    // Информация о репозитории
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("repo-info");
    infoDiv.innerHTML = `
        <p>Name: ${repo.name}</p>
        <p>Owner: ${repo.owner.login}</p>
        <p>Stars: ${repo.stargazers_count}</p>
    `;

    // Кнопка удаления списка сохраненных
    const removeBtn = document.createElement("div");
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => li.remove();

    li.appendChild(infoDiv);
    li.appendChild(removeBtn);
    repoList.appendChild(li);

    searchInput.value = "";
    autocompleteList.innerHTML = "";
}

// Обработчик ввода текста
searchInput.addEventListener("input", debounce(async () => {
    const query = searchInput.value.trim();
    if (query === "") {
        autocompleteList.innerHTML = "";
        return;
    }
    const repos = await fetchRepositories(query);
    showAutocomplete(repos);
}, 500));