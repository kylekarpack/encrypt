  var toEnc = ""
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
		var reader = new FileReader();

		  // Closure to capture the file information.
		  reader.onload = (function(theFile) {
			return function(e) {
			
			  // Render thumbnail.
/*
			  var span = document.createElement('span');
			  span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
			  document.getElementById('list').insertBefore(span, null);
			  */
			  
			  toEnc = (e.target.result);
			  
			  doEncryption(toEnc);
			};
		  })(f);

		  // Read in the image file as a data URL.
		  var txt = reader.readAsDataURL(f);
	
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }
	 document.getElementById('decrypt').addEventListener('click', decryptFunc, false);
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  
  function decryptFunc() {
	var enc = document.querySelector("textarea").value;
	var pass = document.querySelector("#p").value;
	if (!pass) {
		alert("Enter the password!")
		return;
	}
	try {
		var dec = CryptoJS.AES.decrypt(enc, pass);
		var done = dec.toString(CryptoJS.enc.Utf8)
		document.querySelector("textarea").innerText = done;
		
		 var span = document.createElement('span');
				span.innerHTML = ['<img class="thumb" src="', done,
								'" title="', '', '"/>'].join('');
				document.getElementById('list').insertBefore(span, null);
		
	} catch(e) {
		alert("Wrong password!")
	}
  }
  
  var Download = {
    click : function(node) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return node.dispatchEvent(ev);
    },
    encode : function(data) {
            return 'data:text/plain;base64,' + btoa( data );
    },
    link : function(data){
		var name = +new Date() + ".txt";
        var a = document.createElement('a');
        a.download = name;
        a.href = data || self.location.href;
        return a;
    }
};
	Download.save = function(data){
		this.click(
			this.link(
				this.encode( data )
			)
		);
	};
	
	
	document.getElementById('download').addEventListener('click', down, false);
	
	function down() {
		Download.save(document.querySelector("textarea").value)
	}
	
	function doEncryption(toEnc) {
		  var pass = document.querySelector("#p").value;
		  if (!pass) {
			pass = window.prompt("Provide a passphrase")
		  }
		  
		  window.hash = CryptoJS.AES.encrypt(toEnc, pass);
		  
		  var dec = CryptoJS.AES.decrypt(hash, pass);
		  				
		  document.querySelector("textarea").innerText = hash.toString();
	}
	
	window.addEventListener("keydown", function(e) {
	 console.log(e);
	 if (e.keyCode == 32) {
	 
	 }
	}, false);
	
	 window.addEventListener("DOMContentLoaded", function() {
        // Grab elements, create settings, etc.
        var canvas = document.getElementById("canvas"),         
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
        console.log("Video capture error: ", error.code); 
        };

        // Put video listeners into place
        if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function(stream) {
                video.src = stream;
                video.play();
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function(stream){
                video.src = window.webkitURL.createObjectURL(stream);
                video.play();
            }, errBack);
        }
		
		window.addEventListener("keydown", function(e) {
		 if (e.keyCode == 32) {
			context.drawImage(video, 0, 0, 640, 480);
		 }
		}, false);
		

        // Trigger photo take
        document.getElementById("snap").addEventListener("click", function() {
            context.drawImage(video, 0, 0, 640, 480);
            doEncryption(canvas.toDataURL())
			
        });
	}, false);