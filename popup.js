document.addEventListener('DOMContentLoaded', function() {
  const refreshButton = document.getElementById('refresh');
  const tabsContainer = document.getElementById('tabs');
  const saveProjectButton = document.getElementById('saveProject');
  const projectNameInput = document.getElementById('projectName');
  const projectsContainer = document.getElementById('projects');

  // Function to list current open tabs
  function listTabs() {
    tabsContainer.innerHTML = '';
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.textContent = tab.title;
        tabElement.style.cursor = 'pointer';
        tabElement.addEventListener('click', () => {
          chrome.tabs.update(tab.id, { active: true });
        });
        tabsContainer.appendChild(tabElement);
      });
    });
  }

  // Function to save current tabs manually
  function saveCurrentTabs() {
    const projectName = projectNameInput.value;
    if (!projectName) {
      alert('Please enter a project name.');
      return;
    }

    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      const tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ [projectName]: tabUrls }, function() {
        alert(`Project "${projectName}" saved.`);
        listProjects();
      });
    });
  }

  // Function to list saved projects
  function listProjects() {
    projectsContainer.innerHTML = '';
    chrome.storage.local.get(null, function(items) {
      for (let projectName in items) {
        const projectElement = document.createElement('div');
        projectElement.textContent = projectName;

        const openCurrentButton = document.createElement('button');
        openCurrentButton.textContent = 'Open in Current Window';
        openCurrentButton.addEventListener('click', () => {
          openProject(projectName, false);
        });

        const openNewButton = document.createElement('button');
        openNewButton.textContent = 'Open in New Window';
        openNewButton.addEventListener('click', () => {
          openProject(projectName, true);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteProject(projectName);
        });

        projectElement.appendChild(openCurrentButton);
        projectElement.appendChild(openNewButton);
        projectElement.appendChild(deleteButton);
        projectsContainer.appendChild(projectElement);
      }
    });
  }

  // Function to open saved project tabs
  function openProject(projectName, inNewWindow) {
    chrome.storage.local.get([projectName], function(result) {
      const tabUrls = result[projectName];
      if (inNewWindow) {
        chrome.windows.create({ url: tabUrls, state: 'maximized' });
      } else {
        tabUrls.forEach(url => {
          chrome.tabs.create({ url: url });
        });
      }
    });
  }

  // Function to delete a project
  function deleteProject(projectName) {
    chrome.storage.local.remove([projectName], function() {
      alert(`Project "${projectName}" deleted.`);
      listProjects();
    });
  }

  // Event listeners
  refreshButton.addEventListener('click', listTabs);
  saveProjectButton.addEventListener('click', saveCurrentTabs);

  listTabs();
  listProjects();
});
