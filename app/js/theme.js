(() => {
 let preference='system';try{preference=localStorage.getItem('theme')||'system';}catch{}
 const dark=preference==='dark'||(preference==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
 document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';
})();
