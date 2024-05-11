const darkModeToggle = document.getElementById('dark-mode-toggle');
const stylesheet = document.getElementById('stylesheet');
const links = document.querySelectorAll('a[href^="#"]');
const is_dark_mode = localStorage.getItem('dark-mode');

if(is_dark_mode == 'on'){
  darkModeToggle.textContent = "\u263D";
  document.body.classList.toggle('dark-mode');
}

darkModeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  if(darkModeToggle.textContent == "\u263D"){
    darkModeToggle.textContent = '\u2600';
    localStorage.setItem('dark-mode', 'off');
  }
  else{
    darkModeToggle.textContent = "\u263D";
    localStorage.setItem('dark-mode', 'on');
  }
});

links.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    const target = this.getAttribute('href');
    document.querySelector(target).scrollIntoView({
      behavior: 'smooth' // Smooth scroll to target element
    });
  });
});