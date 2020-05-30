window.browser = (function () {
	return window.msBrowser ||
	  window.browser ||
	  window.chrome;
  })();

browser.webRequest.onBeforeRequest.addListener(function(details) {
	return { cancel: true };
	}, { urls: [
		"*://*/*/js/epd_sw*", // EL PAIS
		"*://*/jscripts/mvd_cms_newsletters.js" // MONTEVIDEO PORTAL
		] 
	}, ["blocking"] 
);

browser.cookies.onChanged.addListener(function(changeInfo) {
	if (changeInfo.cookie.domain == 'www.elobservador.com.uy'){
		if (changeInfo.cookie.name == 'mostrar_Signwall'){
			// EL OBSERVADOR
			browser.cookies.remove({url: "https://www.elobservador.com.uy" + "/", name: "mostrar_Signwall"});
		}
	}
});

browser.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
	// EL OBSERVADOR
	browser.cookies.remove({url: "https://www.elobservador.com.uy" + "/", name: "mostrar_Signwall"});
	browser.cookies.remove({url: "https://www.elobservador.com.uy" + "/", name: "mostrar_AvisoSuscripcion"});
	browser.cookies.remove({url: "https://www.elobservador.com.uy" + "/", name: "mostrar_Paywall"});
  }
})