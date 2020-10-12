if ('serviceWorker' in navigator) {
    window.addEventListener("load",function () {
        navigator.serviceWorker.register('/serviceWorker').then(function() { 
        console.log('Service Worker Registered');
        });
    }); 
    }
