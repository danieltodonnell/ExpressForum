class common {

	static addClass(obj, className) {
		if (obj.classList)
			obj.classList.add(className);
		else
			obj.className += ' ' + className;
	}

	static removeClass(obj, className) {
		if (obj.classList)
			obj.classList.remove(className);
		else
			obj.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
	
	// returns complex data-type of object
	static getType(obj) {
		return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
	}
	
	// processed standardized json response from server
	static processXhr(res) {
	
		//clear all validation messaged
		let elements = document.querySelectorAll(".inError");
		Array.prototype.forEach.call(elements, function(item, i) {
			common.removeClass(item, "inError");
		});
		elements = document.querySelectorAll(".inError-marker");
		Array.prototype.forEach.call(elements, function(item, i) {
			item.parentNode.removeChild(item);
		});

		if (res.version && res.version === "Rxx-v1") {
			switch (res.type) {
    			case "redirect":
    				window.setTimeout(function() { document.location.href = res.data;}, res.pause * 1000);
					swal({
						title: res.message,
						type: "success",
						showConfirmButton: false,
						allowOutsideClick: false,
						allowEscapeKey: false,
						allowEnterKey: false
					});
    			break;
    			case "validation":
    				if (res.message) {
    					swal({
							title: res.message,
							type: "info"
						});
    				}
    				for (let index = 0; index < res.data.length; index++) {
    					let issue = res.data[index];
						let elements = document.querySelectorAll("#" + issue.id);
						Array.prototype.forEach.call(elements, function(item, i) {
							common.addClass(item, "inError");

							let markerHTML = "<span class='inError-marker'>" + issue.message + "</span>";
							item.insertAdjacentHTML("afterend", markerHTML);
						});
    				}
    			break;
    		}

			return;
		}
		// We reached our target server, but it returned an error
		console.log("processXhr error");
	};
}