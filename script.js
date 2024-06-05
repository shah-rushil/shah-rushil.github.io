const darkModeToggle = document.getElementById('dark-mode-toggle');
const stylesheet = document.getElementById('stylesheet');
const links = document.querySelectorAll('a[href^="#"]');
const addElement = document.getElementsByClassName('add-element');

// Dark Mode swap

darkModeToggle.addEventListener('click', function() {
  applyDarkMode();
});

function applyDarkMode(){
  document.body.classList.toggle('dark-mode');
  if(darkModeToggle.textContent == "\u263D"){
    darkModeToggle.textContent = '\u2600';
    sessionStorage.setItem("isDark", "true");
  }
  else{
    darkModeToggle.textContent = "\u263D";
    sessionStorage.setItem("isDark", "false");
  }
}

window.onload = function() { // Applies darkmode upon loading
  if(sessionStorage.getItem("isDark") == "true"){
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