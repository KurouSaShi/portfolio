        function toggleIndex(element) {
            const ul = element.nextElementSibling;
            const toggle = element.querySelector('.index-toggle');
            
            if (ul.classList.contains('open')) {
                ul.classList.remove('open');
                toggle.textContent = '▶';
            } else {
                ul.classList.add('open');
                toggle.textContent = '▼';
            }
        }
