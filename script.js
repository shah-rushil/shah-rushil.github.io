const darkModeToggle = document.getElementById('dark-mode-toggle');
const stylesheet = document.getElementById('stylesheet');
const links = document.querySelectorAll('a[href^="#"]');

// Dark Mode swap

darkModeToggle.addEventListener('click', function() {
  applyDarkMode();
});

function applyDarkMode(){
  document.body.classList.toggle('dark-mode');
  if(darkModeToggle.textContent == "\u263D"){
    darkModeToggle.textContent = '\u2600';
    localStorage.setItem("isDark", false);
  }
  else{
    darkModeToggle.textContent = "\u263D";
    localStorage.setItem("isDark", true);
  }
}

window.onload = function() { // Applies darkmode upon loading
  if(localStorage.getItem("isDark")){
    applyDarkMode();
  }
};

// Smooth Transition upon clicking hyperlink

links.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    const target = this.getAttribute('href');
    document.querySelector(target).scrollIntoView({
      behavior: 'smooth' // Smooth scroll to target element
    });
  });
});