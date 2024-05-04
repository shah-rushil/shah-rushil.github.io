const darkModeToggle = document.getElementById('dark-mode-toggle');
const stylesheet = document.getElementById('stylesheet');
const links = document.querySelectorAll('a[href^="#"]');

darkModeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  
  if(darkModeToggle.textContent == "\u263D"){
    darkModeToggle.textContent = '\u2600';
  }
  else{
    darkModeToggle.textContent = "\u263D";
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