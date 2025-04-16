// Carrossel

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
      const productWidth = getProductWidth();
      const visibleProducts = 5;
      return -(products.length - visibleProducts) * productWidth;
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
      const totalIndicators = indicators.length;
      const progress = Math.abs(position / maxPosition);
      const currentIndicatorIndex = Math.round(progress * (totalIndicators - 1));

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndicatorIndex);
      });
    };

    prevButton.addEventListener('click', () => {
      position = Math.min(position + getProductWidth(), 0);
      updateTransform();
      updateButtons();
      updateIndicators();
    });

    nextButton.addEventListener('click', () => {
      const maxPosition = getMaxPosition();
      position = Math.max(position - getProductWidth(), maxPosition);
      updateTransform();
      updateButtons();
      updateIndicators();
    });

    updateButtons();
    updateIndicators();
  };

  carrosseis.forEach(initCarrossel);
});



// Busca

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const containerResult = document.getElementById('search-result');

  const toggleContentClass = () => {
    searchInput.classList.toggle('has-content', searchInput.value.trim() !== '');
  };

  const showSearchContent = () => {
    const searchContent = searchInput.value.trim();
    if (searchContent) {
      console.log(searchContent);
      containerResult.innerHTML = `Você pesquisou por:<br><b>${searchContent}</b>`;
    }
  };

  const removeSearchContent = () => {
    containerResult.innerHTML = '';
  };

  searchInput.addEventListener('input', toggleContentClass);

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

  fetch(dataPath)
    .then(response => response.json())
    .then(data => {
      // Clique em "Todas as categorias"
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

      // Hover nos departamentos laterais (continua funcionando)
      departments.forEach(department => {
        department.addEventListener('mouseover', () => {
          const departmentName = department.getAttribute('data-department');
          departments.forEach(dep => dep.classList.remove('active'));
          department.classList.add('active');
          renderCategories(departmentName, data);
        });
      });

      // Clique nos departamentos do header
      headerNavDepartments.forEach(headerItem => {
        headerItem.addEventListener('click', (e) => {
          e.stopPropagation(); // Impede conflito com clique fora

          const departmentName = headerItem.getAttribute('data-department');

          // Se clicou em algo sem data-department (ex: "Todas as categorias"), não faz nada
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

      // Fechar ao clicar fora
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
