document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username-input');
    const searchBtn = document.getElementById('search-btn');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const profileContainer = document.getElementById('profile-container');

    // Add event listeners
    searchBtn.addEventListener('click', searchProfile);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProfile();
        }
    });

    async function searchProfile() {
        const username = usernameInput.value.trim();
        if (!username) return;

        // Show loading, hide error and profile
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        profileContainer.classList.add('hidden');
        profileContainer.innerHTML = '';

        try {
            // Fetch user data
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            
            if (!userResponse.ok) {
                throw new Error(
                    userResponse.status === 404
                        ? 'User not found'
                        : 'Error fetching GitHub profile'
                );
            }
            
            const userData = await userResponse.json();
            
            // Fetch repositories
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=5&sort=updated`);
            const reposData = await reposResponse.json();
            
            // Display profile
            displayProfile(userData, reposData);
            
        } catch (error) {
            // Show error message
            errorElement.textContent = error.message;
            errorElement.classList.remove('hidden');
        } finally {
            // Hide loading
            loadingElement.classList.add('hidden');
        }
    }

    function displayProfile(user, repos) {
        // Create profile HTML
        const profileHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="avatar">
                    <div>
                        <h2 class="profile-name">${user.name || user.login}</h2>
                        <a href="${user.html_url}" target="_blank" class="profile-username">
                            @${user.login}
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
                
                ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                
                <div class="profile-stats">
                    <div>
                        <div class="stat-label">Followers</div>
                        <div class="stat-value">${user.followers}</div>
                    </div>
                    <div>
                        <div class="stat-label">Following</div>
                        <div class="stat-value">${user.following}</div>
                    </div>
                    <div>
                        <div class="stat-label">Repositories</div>
                        <div class="stat-value">${user.public_repos}</div>
                    </div>
                </div>
                
                ${repos.length > 0 ? `
                    <h3 class="repos-title">Recent Repositories</h3>
                    <div class="repo-list">
                        ${repos.map(repo => `
                            <div class="repo-item">
                                <div class="repo-header">
                                    <a href="${repo.html_url}" target="_blank" class="repo-name">
                                        ${repo.name}
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </a>
                                    <div class="repo-stats">
                                        <span>
                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                            ${repo.stargazers_count}
                                        </span>
                                        <span>
                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M7 18l3-3h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
                                            </svg>
                                            ${repo.forks_count}
                                        </span>
                                    </div>
                                </div>
                                ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
                                ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Insert profile HTML
        profileContainer.innerHTML = profileHTML;
        profileContainer.classList.remove('hidden');
    }
});