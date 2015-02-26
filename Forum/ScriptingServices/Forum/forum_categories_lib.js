var systemLib = require('system');
var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createForum_categories = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO FORUM_CATEGORIES (";
        sql += "CATEGORY_ID";
        sql += ",";
        sql += "CATEGORY_TITLE";
        sql += ",";
        sql += "CATEGORY_DESCRIPTION";
        sql += ",";
        sql += "CATEGORY_DATE_ADDED";
        sql += ") VALUES ("; 
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
        var id = db.getNext('FORUM_CATEGORIES_CATEGORY_ID');
        statement.setInt(++i, id);
        statement.setString(++i, message.category_title);
        statement.setString(++i, message.category_description);
        var js_date_category_date_added =  new Date(Date.parse(Date()));
        statement.setTimestamp(++i, new java.sql.Timestamp(js_date_category_date_added.getTime() + js_date_category_date_added.getTimezoneOffset()*60*1000));
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
exports.readForum_categoriesEntity = function(id) {
    var connection = datasource.getConnection();
    try {
        var result = "";
        var sql = "SELECT * FROM FORUM_CATEGORIES WHERE " + pkToSQL();
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
exports.readForum_categoriesList = function(limit, offset, sort, desc) {
    var connection = datasource.getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + db.createTopAndStart(limit, offset);
        }
        sql += " * FROM FORUM_CATEGORIES";
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
	result.category_id = resultSet.getInt("CATEGORY_ID");
    result.category_title = resultSet.getString("CATEGORY_TITLE");
    result.category_description = resultSet.getString("CATEGORY_DESCRIPTION");
    result.category_date_added = new Date(resultSet.getTimestamp("CATEGORY_DATE_ADDED").getTime() - resultSet.getDate("CATEGORY_DATE_ADDED").getTimezoneOffset()*60*1000);
    return result;
};

// update entity by id
exports.updateForum_categories = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "UPDATE FORUM_CATEGORIES SET ";
        sql += "CATEGORY_TITLE = ?";
        sql += ",";
        sql += "CATEGORY_DESCRIPTION = ?";
        sql += ",";
        sql += "CATEGORY_DATE_ADDED = ?";
        sql += " WHERE CATEGORY_ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, message.category_title);
        statement.setString(++i, message.category_description);
        var js_date_category_date_added =  new Date(Date.parse(Date()));
        statement.setTimestamp(++i, new java.sql.Timestamp(js_date_category_date_added.getTime() + js_date_category_date_added.getTimezoneOffset()*60*1000));
        var id = "";
        id = message.category_id;
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
exports.deleteForum_categories = function(id) {
    var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM FORUM_CATEGORIES WHERE "+pkToSQL();
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

exports.countForum_categories = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM FORUM_CATEGORIES');
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

exports.metadataForum_categories = function() {
	var entityMetadata = {};
	entityMetadata.name = 'forum_categories';
	entityMetadata.type = 'object';
	entityMetadata.properties = [];
	
	var propertycategory_id = {};
	propertycategory_id.name = 'category_id';
	propertycategory_id.type = 'integer';
	propertycategory_id.key = 'true';
	propertycategory_id.required = 'true';
    entityMetadata.properties.push(propertycategory_id);

	var propertycategory_title = {};
	propertycategory_title.name = 'category_title';
    propertycategory_title.type = 'string';
    entityMetadata.properties.push(propertycategory_title);

	var propertycategory_description = {};
	propertycategory_description.name = 'category_description';
    propertycategory_description.type = 'string';
    entityMetadata.properties.push(propertycategory_description);

	var propertycategory_date_added = {};
	propertycategory_date_added.name = 'category_date_added';
    propertycategory_date_added.type = 'timestamp';
    entityMetadata.properties.push(propertycategory_date_added);


    response.getWriter().println(JSON.stringify(entityMetadata));
};

function getPrimaryKeys(){
    var result = [];
    var i = 0;
    result[i++] = 'CATEGORY_ID';
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

exports.processForum_categories = function() {
	
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
			exports.createForum_categories();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				exports.readForum_categoriesEntity(id);
			} else if (count !== null) {
				exports.countForum_categories();
			} else if (metadata !== null) {
				exports.metadataForum_categories();
			} else {
				exports.readForum_categoriesList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			exports.updateForum_categories();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				exports.deleteForum_categories(id);
			}
		} else {
			entityLib.printError(javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	response.getWriter().flush();
	response.getWriter().close();
};
