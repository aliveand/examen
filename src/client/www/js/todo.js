(function() {

	var root = this;
	var todos = {};
	var numTodos = 0;
	var id = 0;
	var filter = "all";

	function reset() {
		todos = {};
		numTodos = 0;
		id = 0;
		filter = "all";
	}

	function addTodo(text) {
		var checked = false;
		var creationDate = new Date();
		var todo = {
			getId: (function(myId) {
				return function() {
					return myId;
				};
			}(id)),
			getCreationDate: function() {
				return creationDate;
			},
			getText: function() {
				return text;
			},
			setText: function(myText) {
				text = myText;
			},
			getChecked: function() {
				return checked;
			},
			setChecked: function(myState) {
				var date = new Date();
				if (myState !== true && myState !== false) {
					throw "Bad state (only true or false are valid values)";
				} else {
					if (myState) {
						this.checkedDate = function() {
							return date;
						};
					} else {
						delete this.checkedDate;
					}
					checked = myState;
				}
			},
			isVisible: isVisible,
			isDeleted: function() {
				return false;
			},
		};
		todos[id] = todo;
		numTodos++;
		id++;

		return todo;

	}

	function getTodo(id) {
		return todos[id];
	}

	function delTodo(id) {
		var deleted = todos[id];
		deleted.isDeleted = function() {
			return true;
		};
		delete todos[id];
		numTodos--;
		return deleted;
	}

	function modTodo(id, text) {
		todos[id].setText(text);
		return todos[id];
	}

	function checkTodo(id, state) {
		todos[id].setChecked(state);
		return todos[id];
	}

	function countTodos() {
		return numTodos;
	}

	function toString() {
		var s = "";
		var prop;
		for (prop in todos) {
			if (!s) {
				s += "[";
			} else {
				s += ", ";
			}
			s += "{checked: " + todos[prop].getChecked();
			s += ", text: " + todos[prop].getText() + "}";
		}
		s += "]";
		return s;
	}

	function checkAll(state) {
		var keys = Object.keys(todos);
		for (var i = 0; i < keys.length; i++) {
			checkTodo(keys[i], state);
		}
	}

	function delChecked() {
		var keys = Object.keys(todos);
		for (var i = 0; i < keys.length; i++) {
			if (todos[keys[i]].getChecked()) {
				delTodo(keys[i]);
			}
		}
	}

	function itemsLeft() {
		var left = 0;
		var keys = Object.keys(todos);
		for (var i = 0; i < keys.length; i++) {
			if (!todos[keys[i]].getChecked()) {
				left++;
			}
		}
		return left;
	}

	function isVisible() {
		switch (filter) {
			case "all":
				return true;
			case "active":
				return !this.getChecked();
			case "completed":
				return this.getChecked();
			default:
				return true;
		}
	}

	function filterTodos(newFilter) {
		filter = newFilter;
	}

	function compareTo(todo1, todo2) {
		if (todo1.checkedDate && todo2.checkedDate) {
			return todo1.checkedDate().getTime() - todo2.checkedDate().getTime();
		} else if (todo1.checkedDate) {
			return todo1.checkedDate().getTime();
		} else if (todo2.checkedDate) {
			return -todo2.checkedDate().getTime();
		} else {
			return todo2.getCreationDate().getTime() - todo1.getCreationDate().getTime();
		}
	}


	root.TODO_APP = {
		addTodo: addTodo,
		getTodo: getTodo,
		delTodo: delTodo,
		modTodo: modTodo,
		checkTodo: checkTodo,
		countTodos: countTodos,
		checkAll: checkAll,
		delChecked: delChecked,
		itemsLeft: itemsLeft,
		filterTodos: filterTodos,
		toString: toString,
		reset: reset,
		compareTo: compareTo
	};

}).call(this);