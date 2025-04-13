// Javascript Carrossel

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



// Javascript Busca

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

