// Counter Component implementation
export function Counter({ initialCount = 0 } = {}) {
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
