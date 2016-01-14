$(function () {
	chrome.browserAction.onClicked.addListener( function ( tab ) {
		chrome.tabs.insertCSS({
			file: "base.css"
		});
		chrome.tabs.executeScript( {
			file: "clipper.js"
		} );
	} );

	chrome.runtime.onConnect.addListener(function (port) {
		if(port.name === 'download') {
			port.onMessage.addListener(function (msg) {
				$.ajax({
					type:'POST',
					url:'http://pdfcrowd.com/api/pdf/convert/html/',
					data:{
						username:'xfloops',
						key:'d7402eb9370f3d42bfce8cc435836151',
						src: msg.message
					},
					success: function(data){
						var reader = new FileReader();
						reader.readAsDataURL(data);
						reader.onload = function () {
							console.log('response dataurl: ',reader.result);
							port.postMessage({data:reader.result});
						}
					},
					error: function () {
						console.log('mission failed!');
					}
				});

			});

		}
		if(port.name === 'keywords') {
			port.onMessage.addListener(function (msg) {
				$.ajax({
					type:'POST',
					url: 'http://api.bosonnlp.com/keywords/analysis',
					contentType:'application/json',
					dataType:'json',
					data:{
						text: msg.text,
						topK: 50
					},
					beforeSend: function (xhr) {
						xhr.setRequestHeader('X-Token','VqaMfm8K.4564.MkciuRXUxauq');
					},
					success: function (data) {
						port.postMessage({data:data});
					},
					error: function () {
						port.postMessage({data:'mission failed!'});
					}
				})
			});
		}
	});

});