document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	// parameters : database name , database version , database full name,
	// database size in byte
	count = 1;
	console.log(count);
	if (typeof (Storage) != "undefined") {
	    navigator.notification.alert("localstorage is supported");
		console.log("localstorage is supported");
	} else {
		alert("Sorry , some functions are NOT  supported with your device , please contact us");
	}
	// a trigger for verifying the existence of database , if data based is already here , do the queries 
	// else create database with simulated data 
	if (Number(window.localStorage.getItem("taskDB")) != 1) {
	    
	    
		var db = window.openDatabase("task", "1.0", "task database", 50000000);
		db.transaction(createDB, errorCB, successCB);
	} else {
		window.localStorage.clear();
		var db = window.openDatabase("task", "1.0", "task database", 50000000);
		db.transaction(queryDB, errorQB);
	}
	// alert('in db 1');
}

function queryDB(tx) {
	tx.executeSql("SELECT * FROM task WHERE userId IS 0 and taskStateID is 1 ",
			[], querySuccess, errorQB);
}

function querySuccess(tx, results) {
	var len = results.rows.length;
	navigator.notification.alert("User0 you have " + len + " tasks to do",
			null, "task to do for user0 ", "OK");
	for ( var i = 0, j = len; i < j; i++) {
		console.log(results.rows.item(i).TaskId);
	}

}

function createDB(tx) {

	window.localStorage.setItem("taskDB", "1");
	// tx.executeSql('PRAGMA foreign_keys = ON');
	tx.executeSql("DROP TABLE IF EXISTS [Company];");
	tx.executeSql("DROP TABLE IF EXISTS [Task];");

	tx
			.executeSql("CREATE TABLE [Company] ( CompanyId       integer NOT NULL,   CompanyName     varchar(50) COLLATE NOCASE,    PRIMARY KEY ([CompanyId]));");
	tx.executeSql("DROP TABLE IF EXISTS [Contact];");
	tx
			.executeSql("CREATE TABLE [Contact] ( ContactID       integer NOT NULL,   ContactName     varchar(50) NOT NULL COLLATE NOCASE,    ContactFunction     varchar(50) NOT NULL COLLATE NOCASE,    ContactPhoneNumber      integer,    ContactMobileNumber     integer,    CustomerId      integer,    SiteId      integer,    PRIMARY KEY ([ContactID]),    FOREIGN KEY ([CustomerId])        REFERENCES [Customer]([CustomerID]),    FOREIGN KEY ([SiteId])        REFERENCES [Site]([SiteId]));");
	tx.executeSql("DROP TABLE IF EXISTS [Customer];");
	tx
			.executeSql("CREATE TABLE [Customer] (    CustomerID      integer NOT NULL,   CustomerName        varchar(50) NOT NULL COLLATE NOCASE,    CustomerBillingAddress      char(10) NOT NULL COLLATE NOCASE,    PRIMARY KEY ([CustomerID]));");
	tx.executeSql("DROP TABLE IF EXISTS [Site];");
	tx
			.executeSql("CREATE TABLE [Site] (    SiteId      integer NOT NULL,   SiteName        varchar(50) COLLATE NOCASE, SiteAddress     varchar(256) COLLATE NOCASE,    SiteTelephoneNumber     varchar(20) COLLATE NOCASE, SiteComments        varchar(500) COLLATE NOCASE,    CustomerId      integer,    PRIMARY KEY ([SiteId]),    FOREIGN KEY ([CustomerId])        REFERENCES [Customer]([CustomerID]));");
	tx
			.executeSql("CREATE TABLE [Task] (    TaskId      guid NOT NULL,  UserId      integer NOT NULL,   SiteId      integer NOT NULL,   TaskStateId     integer NOT NULL,   TaskTypeId      integer NOT NULL,   TaskStartDate       datetime,   TaskEndDate     datetime,   TaskBudget      varchar(50) COLLATE NOCASE, TaskShowBudget      bit,    TaskComment     varchar(256) COLLATE NOCASE,    TaskCustomerContact     varchar(128) COLLATE NOCASE,    TaskCustomerComment     varchar(256) COLLATE NOCASE,    TaskSign        blob,   TaskProcessedDate       datetime,    PRIMARY KEY ([TaskId]),    FOREIGN KEY ([SiteId])        REFERENCES [Site]([SiteId]),    FOREIGN KEY ([TaskStateId])        REFERENCES [TaskState]([TaskStateID]),    FOREIGN KEY ([TaskTypeId])        REFERENCES [TaskType]([TaskTypeID]),    FOREIGN KEY ([UserId])        REFERENCES [User]([UserID]));");
	tx.executeSql("DROP TABLE IF EXISTS [TaskDetail];");
	tx
			.executeSql("CREATE TABLE [TaskDetail] (  TaskDetailID        integer NOT NULL,   TaskId      guid NOT NULL,  TaskDetailValue     varchar(128) COLLATE NOCASE,    TaskDetailTypeId        integer,    PRIMARY KEY ([TaskDetailID]),    FOREIGN KEY ([TaskId])        REFERENCES [Task]([TaskId]),    FOREIGN KEY ([TaskDetailTypeId])        REFERENCES [TaskDetailType]([TaskDetailTypeId]));");
	tx.executeSql("DROP TABLE IF EXISTS [TaskDetailType];");
	tx
			.executeSql("CREATE TABLE [TaskDetailType] (  TaskDetailTypeId        integer NOT NULL,   TaskDetailTypeName      varchar(20) COLLATE NOCASE,    PRIMARY KEY ([TaskDetailTypeId]));");
	tx.executeSql("DROP TABLE IF EXISTS [TaskState];");
	tx
			.executeSql("CREATE TABLE [TaskState] (   TaskStateID     integer NOT NULL,   TaskStateName       char(20) COLLATE NOCASE,    PRIMARY KEY ([TaskStateID]));");
	tx.executeSql("DROP TABLE IF EXISTS [TaskType];");
	tx
			.executeSql("CREATE TABLE [TaskType] (    TaskTypeID      integer NOT NULL,   TaskTypeName        char(20) COLLATE NOCASE,    PRIMARY KEY ([TaskTypeID]));");
	tx.executeSql("DROP TABLE IF EXISTS [User];");
	tx
			.executeSql("CREATE TABLE [User] (    UserID      integer NOT NULL,   UserFirstName       char(10) COLLATE NOCASE,    UserLastName        char(10) COLLATE NOCASE,    UserLogin       char(10) COLLATE NOCASE,    UserPassword        char(10) COLLATE NOCASE,    UserAreadyLogin     bit,    UserLoginDate       datetime,   CompanyID       integer,    PRIMARY KEY ([UserID]),    FOREIGN KEY ([CompanyID])        REFERENCES [Company]([CompanyId]));");

	// This is a HACK for foreign key
	// so far no support PRAGMA foreign_keys available for webkit based database
	tx
			.executeSql("CREATE TRIGGER [fki_Contact_CustomerId_Customer_CustomerID] Before Insert ON [Contact] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Contact violates foreign key constraint fki_Contact_CustomerId_Customer_CustomerID') WHERE NEW.CustomerId IS NOT NULL AND (SELECT CustomerID FROM Customer WHERE CustomerID = NEW.CustomerId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Contact_CustomerId_Customer_CustomerID] Before Update ON [Contact] BEGIN SELECT RAISE(ROLLBACK, 'update on table Contact violates foreign key constraint fku_Contact_CustomerId_Customer_CustomerID') WHERE NEW.CustomerId IS NOT NULL AND (SELECT CustomerID FROM Customer WHERE CustomerID = NEW.CustomerId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Contact_CustomerId_Customer_CustomerID] Before Delete ON [Customer] BEGIN SELECT RAISE(ROLLBACK, 'delete on table Customer violates foreign key constraint fkd_Contact_CustomerId_Customer_CustomerID') WHERE (SELECT CustomerId FROM Contact WHERE CustomerId = OLD.CustomerID) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_Contact_SiteId_Site_SiteId] Before Insert ON [Contact] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Contact violates foreign key constraint fki_Contact_SiteId_Site_SiteId') WHERE NEW.SiteId IS NOT NULL AND (SELECT SiteId FROM Site WHERE SiteId = NEW.SiteId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Contact_SiteId_Site_SiteId] Before Update ON [Contact] BEGIN SELECT RAISE(ROLLBACK, 'update on table Contact violates foreign key constraint fku_Contact_SiteId_Site_SiteId') WHERE NEW.SiteId IS NOT NULL AND (SELECT SiteId FROM Site WHERE SiteId = NEW.SiteId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Contact_SiteId_Site_SiteId] Before Delete ON [Site] BEGIN SELECT RAISE(ROLLBACK, 'delete on table Site violates foreign key constraint fkd_Contact_SiteId_Site_SiteId') WHERE (SELECT SiteId FROM Contact WHERE SiteId = OLD.SiteId) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_Site_CustomerId_Customer_CustomerID] Before Insert ON [Site] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Site violates foreign key constraint fki_Site_CustomerId_Customer_CustomerID') WHERE NEW.CustomerId IS NOT NULL AND (SELECT CustomerID FROM Customer WHERE CustomerID = NEW.CustomerId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Site_CustomerId_Customer_CustomerID] Before Update ON [Site] BEGIN SELECT RAISE(ROLLBACK, 'update on table Site violates foreign key constraint fku_Site_CustomerId_Customer_CustomerID') WHERE NEW.CustomerId IS NOT NULL AND (SELECT CustomerID FROM Customer WHERE CustomerID = NEW.CustomerId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Site_CustomerId_Customer_CustomerID] Before Delete ON [Customer] BEGIN SELECT RAISE(ROLLBACK, 'delete on table Customer violates foreign key constraint fkd_Site_CustomerId_Customer_CustomerID') WHERE (SELECT CustomerId FROM Site WHERE CustomerId = OLD.CustomerID) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_Task_SiteId_Site_SiteId] Before Insert ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Task violates foreign key constraint fki_Task_SiteId_Site_SiteId') WHERE (SELECT SiteId FROM Site WHERE SiteId = NEW.SiteId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Task_SiteId_Site_SiteId] Before Update ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'update on table Task violates foreign key constraint fku_Task_SiteId_Site_SiteId') WHERE (SELECT SiteId FROM Site WHERE SiteId = NEW.SiteId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Task_SiteId_Site_SiteId] Before Delete ON [Site] BEGIN SELECT RAISE(ROLLBACK, 'delete on table Site violates foreign key constraint fkd_Task_SiteId_Site_SiteId') WHERE (SELECT SiteId FROM Task WHERE SiteId = OLD.SiteId) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_Task_TaskStateId_TaskState_TaskStateID] Before Insert ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Task violates foreign key constraint fki_Task_TaskStateId_TaskState_TaskStateID') WHERE (SELECT TaskStateID FROM TaskState WHERE TaskStateID = NEW.TaskStateId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Task_TaskStateId_TaskState_TaskStateID] Before Update ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'update on table Task violates foreign key constraint fku_Task_TaskStateId_TaskState_TaskStateID') WHERE (SELECT TaskStateID FROM TaskState WHERE TaskStateID = NEW.TaskStateId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Task_TaskStateId_TaskState_TaskStateID] Before Delete ON [TaskState] BEGIN SELECT RAISE(ROLLBACK, 'delete on table TaskState violates foreign key constraint fkd_Task_TaskStateId_TaskState_TaskStateID') WHERE (SELECT TaskStateId FROM Task WHERE TaskStateId = OLD.TaskStateID) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_Task_TaskTypeId_TaskType_TaskTypeID] Before Insert ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Task violates foreign key constraint fki_Task_TaskTypeId_TaskType_TaskTypeID') WHERE (SELECT TaskTypeID FROM TaskType WHERE TaskTypeID = NEW.TaskTypeId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Task_TaskTypeId_TaskType_TaskTypeID] Before Update ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'update on table Task violates foreign key constraint fku_Task_TaskTypeId_TaskType_TaskTypeID') WHERE (SELECT TaskTypeID FROM TaskType WHERE TaskTypeID = NEW.TaskTypeId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Task_TaskTypeId_TaskType_TaskTypeID] Before Delete ON [TaskType] BEGIN SELECT RAISE(ROLLBACK, 'delete on table TaskType violates foreign key constraint fkd_Task_TaskTypeId_TaskType_TaskTypeID') WHERE (SELECT TaskTypeId FROM Task WHERE TaskTypeId = OLD.TaskTypeID) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_Task_UserId_User_UserID] Before Insert ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'insert on table Task violates foreign key constraint fki_Task_UserId_User_UserID') WHERE (SELECT UserID FROM User WHERE UserID = NEW.UserId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_Task_UserId_User_UserID] Before Update ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'update on table Task violates foreign key constraint fku_Task_UserId_User_UserID') WHERE (SELECT UserID FROM User WHERE UserID = NEW.UserId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_Task_UserId_User_UserID] Before Delete ON [User] BEGIN SELECT RAISE(ROLLBACK, 'delete on table User violates foreign key constraint fkd_Task_UserId_User_UserID') WHERE (SELECT UserId FROM Task WHERE UserId = OLD.UserID) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_TaskDetail_TaskId_Task_TaskId] Before Insert ON [TaskDetail] BEGIN SELECT RAISE(ROLLBACK, 'insert on table TaskDetail violates foreign key constraint fki_TaskDetail_TaskId_Task_TaskId') WHERE (SELECT TaskId FROM Task WHERE TaskId = NEW.TaskId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_TaskDetail_TaskId_Task_TaskId] Before Update ON [TaskDetail] BEGIN SELECT RAISE(ROLLBACK, 'update on table TaskDetail violates foreign key constraint fku_TaskDetail_TaskId_Task_TaskId') WHERE (SELECT TaskId FROM Task WHERE TaskId = NEW.TaskId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_TaskDetail_TaskId_Task_TaskId] Before Delete ON [Task] BEGIN SELECT RAISE(ROLLBACK, 'delete on table Task violates foreign key constraint fkd_TaskDetail_TaskId_Task_TaskId') WHERE (SELECT TaskId FROM TaskDetail WHERE TaskId = OLD.TaskId) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_TaskDetail_TaskDetailTypeId_TaskDetailType_TaskDetailTypeId] Before Insert ON [TaskDetail] BEGIN SELECT RAISE(ROLLBACK, 'insert on table TaskDetail violates foreign key constraint fki_TaskDetail_TaskDetailTypeId_TaskDetailType_TaskDetailTypeId') WHERE NEW.TaskDetailTypeId IS NOT NULL AND (SELECT TaskDetailTypeId FROM TaskDetailType WHERE TaskDetailTypeId = NEW.TaskDetailTypeId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_TaskDetail_TaskDetailTypeId_TaskDetailType_TaskDetailTypeId] Before Update ON [TaskDetail] BEGIN SELECT RAISE(ROLLBACK, 'update on table TaskDetail violates foreign key constraint fku_TaskDetail_TaskDetailTypeId_TaskDetailType_TaskDetailTypeId') WHERE NEW.TaskDetailTypeId IS NOT NULL AND (SELECT TaskDetailTypeId FROM TaskDetailType WHERE TaskDetailTypeId = NEW.TaskDetailTypeId) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_TaskDetail_TaskDetailTypeId_TaskDetailType_TaskDetailTypeId] Before Delete ON [TaskDetailType] BEGIN SELECT RAISE(ROLLBACK, 'delete on table TaskDetailType violates foreign key constraint fkd_TaskDetail_TaskDetailTypeId_TaskDetailType_TaskDetailTypeId') WHERE (SELECT TaskDetailTypeId FROM TaskDetail WHERE TaskDetailTypeId = OLD.TaskDetailTypeId) IS NOT NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fki_User_CompanyID_Company_CompanyId] Before Insert ON [User] BEGIN SELECT RAISE(ROLLBACK, 'insert on table User violates foreign key constraint fki_User_CompanyID_Company_CompanyId') WHERE NEW.CompanyID IS NOT NULL AND (SELECT CompanyId FROM Company WHERE CompanyId = NEW.CompanyID) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fku_User_CompanyID_Company_CompanyId] Before Update ON [User] BEGIN SELECT RAISE(ROLLBACK, 'update on table User violates foreign key constraint fku_User_CompanyID_Company_CompanyId') WHERE NEW.CompanyID IS NOT NULL AND (SELECT CompanyId FROM Company WHERE CompanyId = NEW.CompanyID) IS NULL;  END;");
	tx
			.executeSql("CREATE TRIGGER [fkd_User_CompanyID_Company_CompanyId] Before Delete ON [Company] BEGIN SELECT RAISE(ROLLBACK, 'delete on table Company violates foreign key constraint fkd_User_CompanyID_Company_CompanyId') WHERE (SELECT CompanyID FROM User WHERE CompanyID = OLD.CompanyId) IS NOT NULL;  END;");

	// simple table we call do it handy
	tx
			.executeSql("INSERT INTO TaskDetailType  (TaskDetailTypeId,TaskDetailTypeName) VALUES(1,'General')");
	tx
			.executeSql("INSERT INTO TaskDetailType  (TaskDetailTypeId,TaskDetailTypeName) VALUES(2,'Technique');");
	tx
			.executeSql("INSERT INTO TaskState  (TaskStateID,TaskStateName) VALUES(1,'ToDo');");
	tx
			.executeSql("INSERT INTO TaskState  (TaskStateID,TaskStateName) VALUES(2,'Finished');");
	tx
			.executeSql("INSERT INTO TaskState  (TaskStateID,TaskStateName) VALUES(3,'Synchronized');");
	tx
			.executeSql("INSERT INTO TaskState  (TaskStateID,TaskStateName) VALUES(4,'ToDelete');");
	tx
			.executeSql("INSERT INTO TaskType  (TaskTypeID,TaskTypeName) VALUES(1,'intervention')");

	// Auto fill tables , also , that's an interface for receiving the real data
	// from server side then injecting into local database
	// considering our special requirement for an enterprise level database ,
	// added an asynchronous mechanism to insure all the data
	// was injected correctly , !! if not , lots of NULL silent injection due to
	// Phonegap wont remind us the operation was done goodly or badly
	doInserts(tx);

}

function doInserts(tx) {

	var today = getToday();
	for ( var i = 0, j = 50; i < j; i++) {
		// attention INSERT INTO Company (CompanyId , CompanyName) VALUES ( 1,
		// 'test1' ) rather than
		// INSERT INTO Company (CompanyId , CompanyName) VALUES ( 1, "test1" )
		tx.executeSql(
				"INSERT INTO Company (CompanyId , CompanyName) VALUES ( " + i
						+ ", " + "\'Company" + i + "\' )", [], successInsert,
				failureInsert);
		tx
				.executeSql(
						"INSERT INTO Customer (CustomerID , CustomerName , CustomerBillingAddress ) VALUES ("
								+ i
								+ " , "
								+ "\' CustomerName"
								+ i
								+ "'\  , \'CustomerBillingAddress" + i + "\' )",
						[], successInsert, failureInsert);
	}
	for ( var i = 0, j = 50; i < j; i++) {
		var fakeCustomerId = Math.floor(Math.random() * 11);
		var fakeTelephoneNumber = Math.floor(Math.random() * 10000000);
		var fakeCompanyId = Math.floor(Math.random() * 6);
		// a simulation for foreign key customerID and telephonenumber , say ,
		// the id would be inserted into table randomly from 0 to 10 ;
		tx
				.executeSql(
						"INSERT INTO Site ( SiteId , SiteName , SiteAddress , SiteTelephoneNumber , SiteComments ,  CustomerId) VALUES ( "
								+ i
								+ ", \'SiteName"
								+ i
								+ "\' ,  \'SiteAddress"
								+ i
								+ "\' ,"
								+ fakeTelephoneNumber
								+ " , "
								+ "\'SiteComments"
								+ i
								+ "\' , "
								+ fakeCustomerId + " )", [], successInsert,
						failureInsert);
		tx
				.executeSql(
						"INSERT INTO User ( UserID , UserFirstName , UserLastName , UserLogin , UserPassword , UserAreadyLogin , UserLoginDate , CompanyID ) VALUES ( "
								+ i
								+ " , \'UserFirstName"
								+ i
								+ "\' , \'userLastName"
								+ i
								+ "\' , 'UserLogin"
								+ i
								+ "\' ,  \'UserPassword"
								+ i
								+ "\' , \'0\', NULL ," + fakeCompanyId + ")",
						[], successInsert, failureInsert);

	}

	console.log("---------> Start  Injection Main task ");
	for ( var i = 0, j = 1000; i < j; i++) {
		var userId = Math.floor(Math.random() * 10);
		var siteId = Math.floor(Math.random() * 50);
		var taskStateId = Math.floor(1 + Math.random() * 4);

		var taskGUID = guid();
		var customerComment = "customercomment" + i;
		var taskComment = "taskcomment" + i ;
		var command = "INSERT INTO Task ( TaskId , UserId , SiteId , TaskStateId , TaskTypeId , TaskStartDate , TaskEndDate , TaskBudget , TaskComment, TaskCustomerContact , TaskCustomerComment , TaskSign , TaskProcessedDate) VALUES ( "
				+ "\'"
				+ taskGUID
				+ "\' "
				+ " , "
				+ "\'"
				+ userId
				+ "\' "
				+ " , "
				+ "\'"
				+ siteId
				+ "\' "
				+ " , "
				+ "\' "
				+ taskStateId
				+ "\' "
				+ " ,"
				+ 1
				+ " ,"
				+ "\' "
				+ today
				+ "\' "
				+ " , "
				+ "\' "
				+ today
				+ "\' "
				+ " , "
				+ 100.0
				+ " , "
				+ "\'"
				+ taskComment
				+ "\'"
				+ " , "
				+ " \'"
				+ "contact "
				+ "\'"
				+ " , "
				+ "\'"
				+ customerComment + "\'" + " ," + "null" + " , " + today + " )";
		tx
				.executeSql(
						"INSERT INTO Task ( TaskId , UserId , SiteId , TaskStateId , TaskTypeId , TaskStartDate , TaskEndDate , TaskBudget , TaskComment, TaskCustomerContact , TaskCustomerComment , TaskSign , TaskProcessedDate) VALUES ( "
								+ "\'"
								+ taskGUID
								+ "\' "
								+ " , "
								+ "\'"
								+ userId
								+ "\' "
								+ " , "
								+ "\'"
								+ siteId
								+ "\' "
								+ " , "
								+ "\' "
								+ taskStateId
								+ "\' "
								+ " ,"
								+ 1
								+ " ,"
								+ "\' "
								+ today
								+ "\' "
								+ " , "
								+ "\' "
								+ today
								+ "\' "
								+ " , "
								+ 100.0
								+ " , "
								+ "\'"
								+ taskComment
								+ "\'"
								+ " , "
								+ " \'"
								+ "contact "
								+ "\'"
								+ " , "
								+ "\'"
								+ customerComment
								+ "\'"
								+ " ,"
								+ "null"
								+ " , " + today + " )", [], successInsert,
						failureInsert);
	}
	console.log("---------> End  injection main taks ");

}

/*
 * 
 * for asynchronous performance
 */
var expectedCallback = 0;
var dbCheckIntervalId = 0;

function errorQB(err) {
	alert("Error query SQL: " + err.code);
}

function errorCB(err) {
	alert("Error create SQL: " + err.code);
}

// Transaction success callback
function successCB() {
	// everything is fine
	console.log("everything is fine in create database");
	console.log("database created !");
}

function successInsert() {
	// expectedCallback--;
	console.log(" Insert SQL: OK ");
}

function failureInsert(e) {
	// expectedCallback--;
	console.log(" Insert SQL failure " + e.code);
}

// for high asynchronous task , so far no real functional meaning
function dbCheck() {
	if (expectedCallback == 0) {
		clearInterval(dbCheckIntervalId);
		console.log("alldone");
	}

}

function generateUUID() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
	return (generateUUID() + generateUUID() + "-" + generateUUID() + "-"
			+ generateUUID() + "-" + generateUUID() + "-" + generateUUID()
			+ generateUUID() + generateUUID());
}

function randomString(stringLength) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomString = '';
	for ( var i = 0; i < stringLength; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomString += chars.substring(rnum, rnum + 1);
	}
	return randomString;
}

function getToday() {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	// January is 0!

	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;

	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	var today = yyyy + '/' + mm + '/' + dd;

	return today;

}