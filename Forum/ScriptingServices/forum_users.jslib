var systemLib = require('system');
var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createForum_users = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO FORUM_USERS (";
        sql += "USER_ID";
        sql += ",";
        sql += "USER_NICKNAME";
        sql += ",";
        sql += "USER_PASSWORD";
        sql += ",";
        sql += "USER_FIRSTNAME";
        sql += ",";
        sql += "USER_LASTNAME";
        sql += ",";
        sql += "USER_EMAIL";
        sql += ",";
        sql += "USER_JOINDATE";
        sql += ") VALUES ("; 
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = db.getNext('FORUM_USERS_USER_ID');
        statement.setInt(++i, id);
        statement.setString(++i, message.user_nickname);
        statement.setString(++i, message.user_password);
        statement.setString(++i, message.user_firstname);
        statement.setString(++i, message.user_lastname);
        statement.setString(++i, message.user_email);
        var js_date_user_joindate =  new Date(Date.parse(message.user_joindate));
        statement.setDate(++i, new java.sql.Date(js_date_user_joindate.getTime() + js_date_user_joindate.getTimezoneOffset()*60*1000));
        statement.executeUpdate();
        response.getWriter().println(id);
        return id;
    } catch(e) {
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    return -1;
};

// read single entity by id and print as JSON object to response
exports.readForum_usersEntity = function(id) {
    var connection = datasource.getConnection();
    try {
        var result = "";
        var sql = "SELECT * FROM FORUM_USERS WHERE " + pkToSQL();
        var statement = connection.prepareStatement(sql);
        statement.setString(1, id);
        
        var resultSet = statement.executeQuery();
        var value;
        while (resultSet.next()) {
            result = createEntity(resultSet);
        }
        if(result.length === 0){
            entityLib.printError(javax.servlet.http.HttpServletResponse.SC_NOT_FOUND, 1, "Record with id: " + id + " does not exist.");
        }
        var text = JSON.stringify(result, null, 2);
        response.getWriter().println(text);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// read all entities and print them as JSON array to response
exports.readForum_usersList = function(limit, offset, sort, desc) {
    var connection = datasource.getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + db.createTopAndStart(limit, offset);
        }
        sql += " * FROM FORUM_USERS";
        if (sort !== null) {
            sql += " ORDER BY " + sort;
        }
        if (sort !== null && desc !== null) {
            sql += " DESC ";
        }
        if (limit !== null && offset !== null) {
            sql += " " + db.createLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        var value;
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
        var text = JSON.stringify(result, null, 2);
        response.getWriter().println(text);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

//create entity as JSON object from ResultSet current Row
function createEntity(resultSet, data) {
    var result = {};
	result.user_id = resultSet.getInt("USER_ID");
    result.user_nickname = resultSet.getString("USER_NICKNAME");
    result.user_password = resultSet.getString("USER_PASSWORD");
    result.user_firstname = resultSet.getString("USER_FIRSTNAME");
    result.user_lastname = resultSet.getString("USER_LASTNAME");
    result.user_email = resultSet.getString("USER_EMAIL");
    result.user_joindate = new Date(resultSet.getDate("USER_JOINDATE").getTime() - resultSet.getDate("USER_JOINDATE").getTimezoneOffset()*60*1000);
    return result;
};

// update entity by id
exports.updateForum_users = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "UPDATE FORUM_USERS SET ";
        sql += "USER_NICKNAME = ?";
        sql += ",";
        sql += "USER_PASSWORD = ?";
        sql += ",";
        sql += "USER_FIRSTNAME = ?";
        sql += ",";
        sql += "USER_LASTNAME = ?";
        sql += ",";
        sql += "USER_EMAIL = ?";
        sql += ",";
        sql += "USER_JOINDATE = ?";
        sql += " WHERE USER_ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, message.user_nickname);
        statement.setString(++i, message.user_password);
        statement.setString(++i, message.user_firstname);
        statement.setString(++i, message.user_lastname);
        statement.setString(++i, message.user_email);
        var js_date =  new Date(Date.parse(message.user_joindate));
        statement.setDate(++i, new java.sql.Date(js_date_user_joindate.getTime() + js_date_user_joindate.getTimezoneOffset()*60*1000));
        var id = "";
        id = message.user_id;
        statement.setInt(++i, id);
        statement.executeUpdate();
        response.getWriter().println(id);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// delete entity
exports.deleteForum_users = function(id) {
    var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM FORUM_USERS WHERE "+pkToSQL();
        var statement = connection.prepareStatement(sql);
        statement.setString(1, id);
        var resultSet = statement.executeUpdate();
        response.getWriter().println(id);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

exports.countForum_users = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM FORUM_USERS');
        while (rs.next()) {
            count = rs.getInt(1);
        }
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    response.getWriter().println(count);
};

exports.metadataForum_users = function() {
	var entityMetadata = {};
	entityMetadata.name = 'forum_users';
	entityMetadata.type = 'object';
	entityMetadata.properties = [];
	
	var propertyuser_id = {};
	propertyuser_id.name = 'user_id';
	propertyuser_id.type = 'integer';
	propertyuser_id.key = 'true';
	propertyuser_id.required = 'true';
    entityMetadata.properties.push(propertyuser_id);

	var propertyuser_nickname = {};
	propertyuser_nickname.name = 'user_nickname';
    propertyuser_nickname.type = 'string';
    entityMetadata.properties.push(propertyuser_nickname);

	var propertyuser_password = {};
	propertyuser_password.name = 'user_password';
    propertyuser_password.type = 'string';
    entityMetadata.properties.push(propertyuser_password);

	var propertyuser_firstname = {};
	propertyuser_firstname.name = 'user_firstname';
    propertyuser_firstname.type = 'string';
    entityMetadata.properties.push(propertyuser_firstname);

	var propertyuser_lastname = {};
	propertyuser_lastname.name = 'user_lastname';
    propertyuser_lastname.type = 'string';
    entityMetadata.properties.push(propertyuser_lastname);

	var propertyuser_email = {};
	propertyuser_email.name = 'user_email';
    propertyuser_email.type = 'string';
    entityMetadata.properties.push(propertyuser_email);

	var propertyuser_joindate = {};
	propertyuser_joindate.name = 'user_joindate';
    propertyuser_joindate.type = 'date';
    entityMetadata.properties.push(propertyuser_joindate);


    response.getWriter().println(JSON.stringify(entityMetadata));
};

function getPrimaryKeys(){
    var result = [];
    var i = 0;
    result[i++] = 'USER_ID';
    if (result === 0) {
        throw new Exception("There is no primary key");
    } else if(result.length > 1) {
        throw new Exception("More than one Primary Key is not supported.");
    }
    return result;
}

function getPrimaryKey(){
	return getPrimaryKeys()[0].toLowerCase();
}

function pkToSQL(){
    var pks = getPrimaryKeys();
    return pks[0] + " = ?";
}

exports.processForum_users = function() {
	
	// get method type
	var method = request.getMethod();
	method = method.toUpperCase();
	
	//get primary keys (one primary key is supported!)
	var idParameter = getPrimaryKey();
	
	// retrieve the id as parameter if exist 
	var id = xss.escapeSql(request.getParameter(idParameter));
	var count = xss.escapeSql(request.getParameter('count'));
	var metadata = xss.escapeSql(request.getParameter('metadata'));
	var sort = xss.escapeSql(request.getParameter('sort'));
	var limit = xss.escapeSql(request.getParameter('limit'));
	var offset = xss.escapeSql(request.getParameter('offset'));
	var desc = xss.escapeSql(request.getParameter('desc'));
	
	if (limit === null) {
		limit = 100;
	}
	if (offset === null) {
		offset = 0;
	}
	
	if(!entityLib.hasConflictingParameters(id, count, metadata)) {
		// switch based on method type
		if ((method === 'POST')) {
			// create
			exports.createForum_users();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				exports.readForum_usersEntity(id);
			} else if (count !== null) {
				exports.countForum_users();
			} else if (metadata !== null) {
				exports.metadataForum_users();
			} else {
				exports.readForum_usersList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			exports.updateForum_users();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				exports.deleteForum_users(id);
			}
		} else {
			entityLib.printError(javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	response.getWriter().flush();
	response.getWriter().close();
};
