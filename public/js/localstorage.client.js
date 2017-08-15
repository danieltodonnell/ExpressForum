var ls = {
        setConfigInfo: function (storeName, configObj, session) {
            try {
                if (session === true) {
                    sessionStorage[storeName] = JSON.stringify(configObj);
                } else {
                    localStorage[storeName] = JSON.stringify(configObj);
                }
                return true;
            } catch (e) {
                return false;
            }
        },
        getConfigInfo: function (storeName, session) {
            try {
                if (session === true) {
                    return JSON.parse(sessionStorage[storeName]);
                } else {
                    return JSON.parse(localStorage[storeName]);
                }
            } catch (e) {
                return false;
            }
        },
        deleteConfigInfo: function (storeName, session) {
            try {
                if (session === true) {
                    sessionStorage.removeItem(storeName);
                } else {
                    localStorage.removeItem(storeName);
                }
                return true;
            } catch (e) {
                return false;
            }
        }
    };