/** Playwright-owned Responsibilities */

// Mount your components here for testing in browser
// This would have to be cleaned up in a before hook in Playwright
// Probably using `page.evaluate` or a full page reload if there's no HMR
const testContainer = document.getElementById('test-container');

// Create a global mounting function that can be called from Playwright
window.mountComponent = (componentName, props = {}) => {
  const components = {
    Counter: createCounter(props)
  };

  const component = components[componentName];
  if (!component) {
    throw new Error(`Component ${componentName} not found`);
  }

  testContainer.innerHTML = '';
  testContainer.appendChild(component);
  
  // Optional, I would not recommend doing this because
  // the point of this is to use real browser automation
  // to test the component
  // Return an API for interacting with the component
  return {
    getText: () => testContainer.textContent,

    // The result of the mounting function is an API for interacting with the component
    getCount: () => testContainer.querySelector('.count').textContent,
    increment: () => testContainer.querySelector('.increment').click(),
    decrement: () => testContainer.querySelector('.decrement').click()
  };
};

/** User-space Responsibilities */

// Counter Component
function createCounter({ initialCount = 0 } = {}) {
  const container = document.createElement('div');
  container.className = 'counter';
  
  let count = initialCount;
  
  const countDisplay = document.createElement('span');
  countDisplay.className = 'count';
  countDisplay.textContent = count;
  
  const incrementBtn = document.createElement('button');
  incrementBtn.className = 'increment';
  incrementBtn.textContent = '+';
  incrementBtn.onclick = () => {
    count++;
    countDisplay.textContent = count;
  };
  
  const decrementBtn = document.createElement('button');
  decrementBtn.className = 'decrement';
  decrementBtn.textContent = '-';
  decrementBtn.onclick = () => {
    count--;
    countDisplay.textContent = count;
  };
  
  container.appendChild(decrementBtn);
  container.appendChild(countDisplay);
  container.appendChild(incrementBtn);
  
  return container;
}

// Mount initial demo component
// (unnecessary because page.evaluate can be used)
window.mountComponent('Counter', { initialCount: 0 }); 
