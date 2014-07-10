var systemLib = require('system');
var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createForum_posts = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO FORUM_POSTS (";
        sql += "POST_ID";
        sql += ",";
        sql += "POST_TITLE";
        sql += ",";
        sql += "POST_DESCRIPTION";
        sql += ",";
        sql += "POST_THREAD";
        sql += ",";
        sql += "POST_CATEGORY";
        sql += ",";
        sql += "POST_DATE_CREATED";
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
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = db.getNext('FORUM_POSTS_POST_ID');
        statement.setInt(++i, id);
        statement.setString(++i, message.post_title);
        statement.setString(++i, message.post_description);
        statement.setInt(++i, message.post_thread);
        statement.setInt(++i, message.post_category);
        var js_date_post_date_created =  new Date(Date.parse(message.post_date_created));
        statement.setDate(++i, new java.sql.Date(js_date_post_date_created.getTime() + js_date_post_date_created.getTimezoneOffset()*60*1000));
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
exports.readForum_postsEntity = function(id) {
    var connection = datasource.getConnection();
    try {
        var result = "";
        var sql = "SELECT * FROM FORUM_POSTS WHERE " + pkToSQL();
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
exports.readForum_postsList = function(limit, offset, sort, desc) {
    var connection = datasource.getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + db.createTopAndStart(limit, offset);
        }
        sql += " * FROM FORUM_POSTS";
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
	result.post_id = resultSet.getInt("POST_ID");
    result.post_title = resultSet.getString("POST_TITLE");
    result.post_description = resultSet.getString("POST_DESCRIPTION");
	result.post_thread = resultSet.getInt("POST_THREAD");
	result.post_category = resultSet.getInt("POST_CATEGORY");
    result.post_date_created = new Date(resultSet.getDate("POST_DATE_CREATED").getTime() - resultSet.getDate("POST_DATE_CREATED").getTimezoneOffset()*60*1000);
    return result;
};

// update entity by id
exports.updateForum_posts = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "UPDATE FORUM_POSTS SET ";
        sql += "POST_TITLE = ?";
        sql += ",";
        sql += "POST_DESCRIPTION = ?";
        sql += ",";
        sql += "POST_THREAD = ?";
        sql += ",";
        sql += "POST_CATEGORY = ?";
        sql += ",";
        sql += "POST_DATE_CREATED = ?";
        sql += " WHERE POST_ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, message.post_title);
        statement.setString(++i, message.post_description);
        statement.setInt(++i, message.post_thread);
        statement.setInt(++i, message.post_category);
        var js_date =  new Date(Date.parse(message.post_date_created));
        statement.setDate(++i, new java.sql.Date(js_date_post_date_created.getTime() + js_date_post_date_created.getTimezoneOffset()*60*1000));
        var id = "";
        id = message.post_id;
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
exports.deleteForum_posts = function(id) {
    var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM FORUM_POSTS WHERE "+pkToSQL();
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

exports.countForum_posts = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM FORUM_POSTS');
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

exports.metadataForum_posts = function() {
	var entityMetadata = {};
	entityMetadata.name = 'forum_posts';
	entityMetadata.type = 'object';
	entityMetadata.properties = [];
	
	var propertypost_id = {};
	propertypost_id.name = 'post_id';
	propertypost_id.type = 'integer';
	propertypost_id.key = 'true';
	propertypost_id.required = 'true';
    entityMetadata.properties.push(propertypost_id);

	var propertypost_title = {};
	propertypost_title.name = 'post_title';
    propertypost_title.type = 'string';
    entityMetadata.properties.push(propertypost_title);

	var propertypost_description = {};
	propertypost_description.name = 'post_description';
	propertypost_description.type = 'string';
    entityMetadata.properties.push(propertypost_description);

	var propertypost_thread = {};
	propertypost_thread.name = 'post_thread';
	propertypost_thread.type = 'integer';
    entityMetadata.properties.push(propertypost_thread);

	var propertypost_category = {};
	propertypost_category.name = 'post_category';
	propertypost_category.type = 'integer';
    entityMetadata.properties.push(propertypost_category);

	var propertypost_date_created = {};
	propertypost_date_created.name = 'post_date_created';
    propertypost_date_created.type = 'date';
    entityMetadata.properties.push(propertypost_date_created);


    response.getWriter().println(JSON.stringify(entityMetadata));
};

function getPrimaryKeys(){
    var result = [];
    var i = 0;
    result[i++] = 'POST_ID';
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

exports.processForum_posts = function() {
	
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
			exports.createForum_posts();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				exports.readForum_postsEntity(id);
			} else if (count !== null) {
				exports.countForum_posts();
			} else if (metadata !== null) {
				exports.metadataForum_posts();
			} else {
				exports.readForum_postsList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			exports.updateForum_posts();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				exports.deleteForum_posts(id);
			}
		} else {
			entityLib.printError(javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	response.getWriter().flush();
	response.getWriter().close();
};
