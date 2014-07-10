var systemLib = require('system');
var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createForum_threads = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO FORUM_THREADS (";
        sql += "THREAD_ID";
        sql += ",";
        sql += "THREAD_TITLE";
        sql += ",";
        sql += "THREAD_DESCRIPTION";
        sql += ",";
        sql += "THREAD_CATEGORY";
        sql += ",";
        sql += "THREAD_DATE_CREATED";
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
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = db.getNext('FORUM_THREADS_THREAD_ID');
        statement.setInt(++i, id);
        statement.setString(++i, message.thread_title);
        statement.setString(++i, message.thread_description);
        statement.setInt(++i, message.thread_category);
        var js_date_thread_date_created =  new Date(Date.parse(message.thread_date_created));
        statement.setDate(++i, new java.sql.Date(js_date_thread_date_created.getTime() + js_date_thread_date_created.getTimezoneOffset()*60*1000));
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
exports.readForum_threadsEntity = function(id) {
    var connection = datasource.getConnection();
    try {
        var result = "";
        var sql = "SELECT * FROM FORUM_THREADS WHERE " + pkToSQL();
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
exports.readForum_threadsList = function(limit, offset, sort, desc) {
    var connection = datasource.getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + db.createTopAndStart(limit, offset);
        }
        sql += " * FROM FORUM_THREADS";
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
	result.thread_id = resultSet.getInt("THREAD_ID");
    result.thread_title = resultSet.getString("THREAD_TITLE");
    result.thread_description = resultSet.getString("THREAD_DESCRIPTION");
	result.thread_category = resultSet.getInt("THREAD_CATEGORY");
    result.thread_date_created = new Date(resultSet.getDate("THREAD_DATE_CREATED").getTime() - resultSet.getDate("THREAD_DATE_CREATED").getTimezoneOffset()*60*1000);
    return result;
};

// update entity by id
exports.updateForum_threads = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "UPDATE FORUM_THREADS SET ";
        sql += "THREAD_TITLE = ?";
        sql += ",";
        sql += "THREAD_DESCRIPTION = ?";
        sql += ",";
        sql += "THREAD_CATEGORY = ?";
        sql += ",";
        sql += "THREAD_DATE_CREATED = ?";
        sql += " WHERE THREAD_ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, message.thread_title);
        statement.setString(++i, message.thread_description);
        statement.setInt(++i, message.thread_category);
        var js_date =  new Date(Date.parse(message.thread_date_created));
        statement.setDate(++i, new java.sql.Date(js_date_thread_date_created.getTime() + js_date_thread_date_created.getTimezoneOffset()*60*1000));
        var id = "";
        id = message.thread_id;
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
exports.deleteForum_threads = function(id) {
    var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM FORUM_THREADS WHERE "+pkToSQL();
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

exports.countForum_threads = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM FORUM_THREADS');
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

exports.metadataForum_threads = function() {
	var entityMetadata = {};
	entityMetadata.name = 'forum_threads';
	entityMetadata.type = 'object';
	entityMetadata.properties = [];
	
	var propertythread_id = {};
	propertythread_id.name = 'thread_id';
	propertythread_id.type = 'integer';
	propertythread_id.key = 'true';
	propertythread_id.required = 'true';
    entityMetadata.properties.push(propertythread_id);

	var propertythread_title = {};
	propertythread_title.name = 'thread_title';
    propertythread_title.type = 'string';
    entityMetadata.properties.push(propertythread_title);

	var propertythread_description = {};
	propertythread_description.name = 'thread_description';
    propertythread_description.type = 'string';
    entityMetadata.properties.push(propertythread_description);

	var propertythread_category = {};
	propertythread_category.name = 'thread_category';
	propertythread_category.type = 'integer';
    entityMetadata.properties.push(propertythread_category);

	var propertythread_date_created = {};
	propertythread_date_created.name = 'thread_date_created';
    propertythread_date_created.type = 'date';
    entityMetadata.properties.push(propertythread_date_created);


    response.getWriter().println(JSON.stringify(entityMetadata));
};

function getPrimaryKeys(){
    var result = [];
    var i = 0;
    result[i++] = 'THREAD_ID';
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

exports.processForum_threads = function() {
	
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
			exports.createForum_threads();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				exports.readForum_threadsEntity(id);
			} else if (count !== null) {
				exports.countForum_threads();
			} else if (metadata !== null) {
				exports.metadataForum_threads();
			} else {
				exports.readForum_threadsList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			exports.updateForum_threads();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				exports.deleteForum_threads(id);
			}
		} else {
			entityLib.printError(javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	response.getWriter().flush();
	response.getWriter().close();
};
