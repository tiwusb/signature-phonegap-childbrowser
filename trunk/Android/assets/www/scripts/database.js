/**
 * main functionalities for conserving the data captured from signature
 *
 *
 *
 *
 */

/**
 *
 *
 */
function onDeviceReadyDatabase() {
	var db = window.openDatabase("signatureDatabase", "1.0", "signature", 50000000);
	db.transaction( createTable, errorCB, successCB );
}

function createTable(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS sigData (id unique , data )");
}

function errorCB(err) {
	console.log("Something wrong when creating database the error number is" + err.code);
	/**
	 *
	 * const unsigned short UNKNOWN_ERR = 0;
	 const unsigned short DATABASE_ERR = 1;
	 const unsigned short VERSION_ERR = 2;
	 const unsigned short TOO_LARGE_ERR = 3;
	 const unsigned short QUOTA_ERR = 4;
	 const unsigned short SYNTAX_ERR = 5;
	 const unsigned short CONSTRAINT_ERR = 6;
	 const unsigned short TIMEOUT_ERR = 7;
	 *
	 *message IDL attribute will return an error message , but it depends on the localized user's language
	 *
	 *
	 *
	 *
	 *
	 */

}

function successCB(){
	console.log("everything is fine");
}
