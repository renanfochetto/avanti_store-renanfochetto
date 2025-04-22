// ======================
// CARROSSEL
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const carrosseis = document.querySelectorAll('.container-carrossel');

  const initCarrossel = (container) => {
    const prevButton = container.querySelector('.carrossel-button_prev');
    const nextButton = container.querySelector('.carrossel-button_next');
    const wrapper = container.querySelector('.carrossel-wrapper');
    const products = container.querySelectorAll('.carrossel-product');
    const indicators = container.querySelectorAll('.indicator');

    if (!products.length) return;

    let position = 0;

    const getProductWidth = () => products[0].getBoundingClientRect().width + 17;

    const getMaxPosition = () => {
      const visibleProducts = 5;
      return -(products.length - visibleProducts) * getProductWidth();
    };

    const updateTransform = () => {
      wrapper.style.transform = `translateX(${position}px)`;
    };

    const updateButtons = () => {
      const maxPosition = getMaxPosition();
      prevButton.disabled = position >= 0;
      nextButton.disabled = position <= maxPosition;
    };

    const updateIndicators = () => {
      const maxPosition = getMaxPosition();
      const progress = Math.abs(position / maxPosition);
      const current = Math.round(progress * (indicators.length - 1));

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === current);
      });
    };

    // Evento: botão anterior do carrossel
    prevButton.addEventListener('click', () => {
      position = Math.min(position + getProductWidth(), 0);
      updateTransform();
      updateButtons();
      updateIndicators();
    });

    // Evento: botão próximo do carrossel
    nextButton.addEventListener('click', () => {
      position = Math.max(position - getProductWidth(), getMaxPosition());
      updateTransform();
      updateButtons();
      updateIndicators();
    });

    updateButtons();
    updateIndicators();
  };

  carrosseis.forEach(initCarrossel);
});


// ======================
// BUSCA
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const containerResult = document.getElementById('search-result');

  // Alterna classe se há conteúdo
  const toggleContentClass = () => {
    searchInput.classList.toggle('has-content', searchInput.value.trim() !== '');
  };

  //Mostra resultado da busca no container
  const showSearchContent = () => {
    const searchContent = searchInput.value.trim();
    if (searchContent) {
      containerResult.innerHTML = `Você pesquisou por:<br><b>${searchContent}</b>`;
    }
  };

  //Remove o conteúdo da busca
  const removeSearchContent = () => {
    containerResult.innerHTML = '';
  };

  //Evento: digitação no campo de busca
  searchInput.addEventListener('input', toggleContentClass);

  //Evento: tecla "Enter" no campo de busca
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      showSearchContent();
      searchInput.value = '';
      toggleContentClass();
      setTimeout(removeSearchContent, 5000); // Remove após 5 segundos
    }
  });
});


// ======================
// MENU
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const menuNav = document.querySelector('.header-nav_menu');
  const menuList = document.querySelector('.nav-menu_list');
  const departmentWrapper = document.querySelector('.nav-department_wrapper');
  const departments = document.querySelectorAll('.nav-department_wrapper li');
  const categoriesContainer = document.querySelector('.nav-menu_categories .nav-categories_list');
  const headerNavDepartments = document.querySelectorAll('.header-nav_list li');
  const navMenuTitle = document.querySelector('.nav-menu_title');
  const dataPath = './data/menuData.json';

  let menuOpenedByHover = false;
  let activeDepartment = null;

  const clearCategories = () => {
    categoriesContainer.innerHTML = '';
  };

  const clearAllActiveStates = () => {
    departments.forEach(dep => dep.classList.remove('active'));
    headerNavDepartments.forEach(item => item.classList.remove('active'));
    navMenuTitle.classList.remove('active');
  }

  // Renderiza as categorias do menu lateral
  const renderCategories = (departmentName, data) => {
    const departmentData = data.find(dep => dep.department === departmentName);

    if (departmentData) {
      clearCategories();

      const fragment = document.createDocumentFragment();
      const numColumns = 3;
      const itemsPerColumn = Math.ceil(departmentData.categories.length / numColumns);

      for (let i = 0; i < numColumns; i++) {
        const ul = document.createElement('ul');
        ul.classList.add('categories_column');

        departmentData.categories
          .slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
          .forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            ul.appendChild(li);
          });

        fragment.appendChild(ul);
      }

      categoriesContainer.appendChild(fragment);
      categoriesContainer.style.visibility = 'visible';
      categoriesContainer.style.opacity = '1';
    } else {
      console.warn(`Departamento ${departmentName} não encontrado no JSON`);
    }
  };

  //Carrega o JSON e define os eventos de interaação do menu
  fetch(dataPath)
    .then(response => response.json())
    .then(data => {

      //Evento: clique no menu hamburguer lateral
      menuNav.addEventListener('click', () => {
        const isHidden = menuList.classList.contains('hidden');

        if (isHidden) {
          menuOpenedByHover = false;
          menuList.classList.remove('hidden');
          departmentWrapper.style.display = 'block';
          clearCategories();
          navMenuTitle.classList.add('active');
          headerNavDepartments.forEach(item => item.classList.remove('active'));
        } else {
          menuList.classList.add('hidden');
          clearAllActiveStates();
        }
      });

      //Evento: Hover nos departamentos
      departments.forEach(department => {
        department.addEventListener('mouseover', () => {
          const departmentName = department.getAttribute('data-department');
          departments.forEach(dep => dep.classList.remove('active'));
          department.classList.add('active');
          renderCategories(departmentName, data);
        });
      });

      //Evento: Clique nos departamentos
      headerNavDepartments.forEach(headerItem => {
        headerItem.addEventListener('click', (e) => {
          e.stopPropagation(); // Impede conflito com clique fora

          const departmentName = headerItem.getAttribute('data-department');

          if (!departmentName) return;

          const isHidden = menuList.classList.contains('hidden');
          const isSameDepartment = departmentName === activeDepartment;

          if (isHidden || !isSameDepartment) {
            // Atualiza menu
            menuOpenedByHover = false;
            menuList.classList.remove('hidden');
            departmentWrapper.style.display = 'none';
            renderCategories(departmentName, data);
            activeDepartment = departmentName;

            // Atualiza classes ativas
            headerNavDepartments.forEach(item => item.classList.remove('active'));
            headerItem.classList.add('active');
            navMenuTitle.classList.remove('active');
          } else {
            menuList.classList.add('hidden');
            activeDepartment = null;
            clearAllActiveStates();
          }
        });
      });

      //Evento: Fechar ao clicar fora
      document.addEventListener('click', (e) => {
        const isClickInsideMenu =
          menuList.contains(e.target) ||
          menuNav.contains(e.target) ||
          e.target.closest('.header-nav_list');

        if (!isClickInsideMenu) {
          menuList.classList.add('hidden');
          menuOpenedByHover = false;
          activeDepartment = null;
          clearAllActiveStates();
        }
      });
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));
});
