const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");

const createUserCard = (user) => {
  const cardHTML = `
    <div class="card">
        <div>
          <img
            src="${user.avatar_url}"
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>
          ${user.bio}
          </p>
          <ul>
            <li>${user.followers}<strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
          </ul>
          <div id="repos">
          </div>
        </div>
      </div>
    `;
  main.innerHTML = cardHTML;
};

const createErrorCard = (message) => {
  const cardHTML = `
    <div class="card">
      <h1>${message}</h1>
      <p>Please check the username and try again.</p>
    </div>
  `;
  main.innerHTML = cardHTML;
};

const addReposToCard = (repos) => {
  const reposElement = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoElement = document.createElement("a");
    repoElement.classList.add("repo");
    repoElement.href = repo.html_url;
    repoElement.target = "_blank";
    repoElement.innerText = repo.name;
    reposElement.appendChild(repoElement);
  });
};

const getUser = async (username) => {
  try {
    showLoading();
    const { data } = await axios(APIURL + username);
    hideLoading();
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    hideLoading();
    if (error.response.status == 404)
      createErrorCard("No profile with this username");
  }
};

const getRepos = async (username) => {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (error) {
    createErrorCard("Problem fetching repos");
  }
};

const showLoading = () => {
  const loadingHTML = `<div class="loading">Loading...</div>`;
  main.innerHTML = loadingHTML;
};

const hideLoading = () => {
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.remove();
  }
};


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = "";
  } else {
    createErrorCard("Please enter a username");
  }
});
